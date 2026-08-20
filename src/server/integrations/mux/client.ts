import { env, isMuxConfigured } from "@/lib/env";
import { ValidationError } from "@/server/errors";

const MUX_API = "https://api.mux.com/video/v1";

function authHeader(): string {
  if (!env.MUX_TOKEN_ID || !env.MUX_TOKEN_SECRET) {
    throw new ValidationError("Mux is not configured");
  }
  const token = Buffer.from(`${env.MUX_TOKEN_ID}:${env.MUX_TOKEN_SECRET}`).toString("base64");
  return `Basic ${token}`;
}

async function muxFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${MUX_API}${path}`, {
    ...init,
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await response.json()) as { data?: T; error?: { message?: string } };
  if (!response.ok) {
    throw new ValidationError(body.error?.message ?? "Mux API request failed");
  }
  if (!body.data) {
    throw new ValidationError("Unexpected Mux API response");
  }
  return body.data;
}

export type MuxDirectUpload = {
  id: string;
  url: string;
  status: string;
  asset_id?: string;
};

export type MuxAsset = {
  id: string;
  status: string;
  playback_ids?: { id: string; policy: string }[];
};

export async function createMuxDirectUpload(): Promise<MuxDirectUpload> {
  if (!isMuxConfigured) throw new ValidationError("Mux is not configured");
  return muxFetch<MuxDirectUpload>("/uploads", {
    method: "POST",
    body: JSON.stringify({
      cors_origin: env.APP_URL,
      new_asset_settings: {
        playback_policies: ["public"],
      },
    }),
  });
}

export async function getMuxDirectUpload(uploadId: string): Promise<MuxDirectUpload> {
  return muxFetch<MuxDirectUpload>(`/uploads/${uploadId}`);
}

export async function getMuxAsset(assetId: string): Promise<MuxAsset> {
  return muxFetch<MuxAsset>(`/assets/${assetId}`);
}

export function muxStorageKey(uploadId: string): string {
  return `mux:upload:${uploadId}`;
}

export function parseMuxUploadId(storageKey: string | null | undefined): string | null {
  if (!storageKey?.startsWith("mux:upload:")) return null;
  return storageKey.replace("mux:upload:", "");
}

export async function resolveMuxPlaybackId(uploadId: string): Promise<string | null> {
  const upload = await getMuxDirectUpload(uploadId);
  if (upload.status !== "asset_created" || !upload.asset_id) {
    return null;
  }
  const asset = await getMuxAsset(upload.asset_id);
  if (asset.status !== "ready") return null;
  return asset.playback_ids?.[0]?.id ?? null;
}

export async function deleteMuxAssetForMedia(input: {
  storageKey?: string | null;
  playbackId?: string | null;
}) {
  if (!isMuxConfigured) return;
  const uploadId = parseMuxUploadId(input.storageKey);
  if (!uploadId) return;

  try {
    const upload = await getMuxDirectUpload(uploadId);
    if (upload.asset_id) {
      await fetch(`${MUX_API}/assets/${upload.asset_id}`, {
        method: "DELETE",
        headers: { Authorization: authHeader() },
      });
    }
  } catch {
    // Best-effort cleanup
  }
}
