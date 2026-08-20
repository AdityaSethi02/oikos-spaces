import { S3Client, GetObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env, isR2Configured } from "@/lib/env";
import { ValidationError } from "@/server/errors";

function getR2Client(): S3Client {
  if (!isR2Configured) {
    throw new ValidationError("Document storage is not configured");
  }
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export async function createPresignedPutUrl(input: {
  key: string;
  contentType: string;
  expiresIn?: number;
}) {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_PRIVATE,
    Key: input.key,
    ContentType: input.contentType,
  });
  const url = await getSignedUrl(client, command, {
    expiresIn: input.expiresIn ?? 60 * 5,
  });
  return url;
}

export async function createPresignedGetUrl(input: {
  key: string;
  expiresIn?: number;
  fileName?: string;
}) {
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: env.R2_BUCKET_PRIVATE,
    Key: input.key,
    ResponseContentDisposition: input.fileName
      ? `inline; filename="${input.fileName}"`
      : undefined,
  });
  return getSignedUrl(client, command, { expiresIn: input.expiresIn ?? 60 });
}

export async function objectExists(key: string, bucket?: string): Promise<boolean> {
  const client = getR2Client();
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket ?? env.R2_BUCKET_PRIVATE,
        Key: key,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export async function createPublicPresignedPutUrl(input: {
  key: string;
  contentType: string;
  expiresIn?: number;
}) {
  const client = getR2Client();
  const bucket = env.R2_BUCKET_PUBLIC ?? env.R2_BUCKET_PRIVATE;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: input.key,
    ContentType: input.contentType,
  });
  return getSignedUrl(client, command, { expiresIn: input.expiresIn ?? 60 * 5 });
}
