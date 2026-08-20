import type { User } from "@prisma/client";
import { randomUUID } from "crypto";
import prisma from "@/lib/prisma";
import { env, isMuxConfigured, isPublicMediaConfigured } from "@/lib/env";
import { ForbiddenError, NotFoundError, ValidationError } from "@/server/errors";
import { createPublicPresignedPutUrl, objectExists } from "@/server/integrations/r2/client";
import {
  createMuxDirectUpload,
  deleteMuxAssetForMedia,
  muxStorageKey,
  parseMuxUploadId,
  resolveMuxPlaybackId,
} from "@/server/integrations/mux/client";
import { propertyRepository } from "@/server/repositories/property.repository";
import { requireDatabase } from "@/server/lib/require-config";

const PHOTO_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const VIDEO_MIME = new Set(["video/mp4", "video/quicktime"]);
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

function publicUrlForKey(key: string): string {
  if (env.R2_PUBLIC_BASE_URL) {
    return `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
  }
  return key;
}

export async function startPropertyMediaUpload(input: {
  admin: User;
  propertyId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  kind: "PHOTO" | "VIDEO";
}) {
  requireDatabase();
  if (input.admin.role !== "ADMIN_HOST") throw new ForbiddenError();

  const property = await propertyRepository.findById(input.propertyId);
  if (!property) throw new NotFoundError("Property not found");

  const allowed = input.kind === "PHOTO" ? PHOTO_MIME : VIDEO_MIME;
  if (!allowed.has(input.mimeType)) {
    throw new ValidationError("Unsupported file type");
  }
  const max = input.kind === "PHOTO" ? MAX_PHOTO_BYTES : MAX_VIDEO_BYTES;
  if (input.sizeBytes > max) {
    throw new ValidationError("File is too large");
  }

  if (input.kind === "VIDEO") {
    if (!isMuxConfigured) {
      throw new ValidationError("Video upload requires Mux to be configured");
    }

    const upload = await createMuxDirectUpload();
    const media = await prisma.propertyMedia.create({
      data: {
        propertyId: input.propertyId,
        kind: "VIDEO",
        url: `mux://pending/${upload.id}`,
        storageKey: muxStorageKey(upload.id),
        alt: property.name,
        sortOrder: property.media.length,
      },
    });

    return { mediaId: media.id, uploadUrl: upload.url, storageKey: media.storageKey! };
  }

  if (!isPublicMediaConfigured) {
    throw new ValidationError("Media storage is not configured");
  }

  const safeName = input.fileName.replace(/[^\w.\-]+/g, "_");
  const key = `properties/${input.propertyId}/${randomUUID()}-${safeName}`;
  const uploadUrl = await createPublicPresignedPutUrl({
    key,
    contentType: input.mimeType,
  });

  const media = await prisma.propertyMedia.create({
    data: {
      propertyId: input.propertyId,
      kind: input.kind,
      url: publicUrlForKey(key),
      storageKey: key,
      alt: property.name,
      sortOrder: property.media.length,
    },
  });

  return { mediaId: media.id, uploadUrl, storageKey: key };
}

export async function completePropertyMediaUpload(input: {
  admin: User;
  mediaId: string;
}) {
  requireDatabase();
  if (input.admin.role !== "ADMIN_HOST") throw new ForbiddenError();

  const media = await prisma.propertyMedia.findUnique({ where: { id: input.mediaId } });
  if (!media?.storageKey) throw new NotFoundError("Media not found");

  const muxUploadId = parseMuxUploadId(media.storageKey);
  if (muxUploadId) {
    const playbackId = await resolveMuxPlaybackId(muxUploadId);
    if (!playbackId) {
      throw new ValidationError("Video is still processing. Wait a moment and try again.");
    }

    await prisma.propertyMedia.update({
      where: { id: media.id },
      data: {
        playbackId,
        url: `https://stream.mux.com/${playbackId}.m3u8`,
      },
    });

    await prisma.property.update({
      where: { id: media.propertyId },
      data: { galleryCount: { increment: 1 } },
    });


    return prisma.propertyMedia.findUniqueOrThrow({ where: { id: media.id } });
  }

  const bucket = env.R2_BUCKET_PUBLIC ?? env.R2_BUCKET_PRIVATE;
  const exists = await objectExists(media.storageKey, bucket);
  if (!exists) {
    await prisma.propertyMedia.delete({ where: { id: media.id } });
    throw new ValidationError("Upload was not completed. Try again.");
  }

  await prisma.property.update({
    where: { id: media.propertyId },
    data: { galleryCount: { increment: 1 } },
  });


  return media;
}

export async function finalizeMuxVideoByUploadId(uploadId: string) {
  requireDatabase();
  const media = await prisma.propertyMedia.findFirst({
    where: { storageKey: muxStorageKey(uploadId) },
  });
  if (!media || media.playbackId) return null;

  const playbackId = await resolveMuxPlaybackId(uploadId);
  if (!playbackId) return null;

  await prisma.propertyMedia.update({
    where: { id: media.id },
    data: {
      playbackId,
      url: `https://stream.mux.com/${playbackId}.m3u8`,
    },
  });

  return media.id;
}

export async function deletePropertyMedia(input: {
  admin: User;
  mediaId: string;
}) {
  requireDatabase();
  if (input.admin.role !== "ADMIN_HOST") throw new ForbiddenError();

  const media = await prisma.propertyMedia.findUnique({ where: { id: input.mediaId } });
  if (!media) throw new NotFoundError("Media not found");

  if (media.kind === "VIDEO") {
    await deleteMuxAssetForMedia({
      storageKey: media.storageKey,
      playbackId: media.playbackId,
    });
  }

  await prisma.propertyMedia.delete({ where: { id: media.id } });
  await prisma.property.update({
    where: { id: media.propertyId },
    data: { galleryCount: { decrement: 1 } },
  });

}

export async function reorderPropertyMedia(input: {
  admin: User;
  propertyId: string;
  orderedIds: string[];
}) {
  requireDatabase();
  if (input.admin.role !== "ADMIN_HOST") throw new ForbiddenError();

  await prisma.$transaction(
    input.orderedIds.map((id, index) =>
      prisma.propertyMedia.update({
        where: { id, propertyId: input.propertyId },
        data: { sortOrder: index },
      }),
    ),
  );

}

export async function setFeaturedMedia(input: {
  admin: User;
  propertyId: string;
  mediaId: string;
}) {
  requireDatabase();
  if (input.admin.role !== "ADMIN_HOST") throw new ForbiddenError();

  await prisma.propertyMedia.updateMany({
    where: { propertyId: input.propertyId },
    data: { isFeatured: false },
  });
  await prisma.propertyMedia.update({
    where: { id: input.mediaId, propertyId: input.propertyId },
    data: { isFeatured: true },
  });

}
