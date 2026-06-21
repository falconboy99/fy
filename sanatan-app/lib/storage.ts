import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";

type SignRequest = {
  filename: string;
  mimeType: string;
  provider: "s3" | "cloudinary";
};

export async function createUploadSignature(input: SignRequest) {
  const safeName = input.filename.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
  const objectKey = `scriptures/${Date.now()}-${randomUUID()}-${safeName}`;

  if (input.provider === "cloudinary") {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return {
        provider: "cloudinary" as const,
        objectKey,
        mock: true,
        uploadUrl: "https://api.cloudinary.com/v1_1/demo/auto/upload",
        fields: {
          api_key: "demo",
          timestamp: `${Math.floor(Date.now() / 1000)}`,
          signature: "demo-signature",
          folder: "sanatan-archive",
          public_id: objectKey,
        },
      };
    }

    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "sanatan-archive";
    const public_id = objectKey;
    const signature = cloudinary.utils.api_sign_request({ timestamp, folder, public_id }, apiSecret);

    return {
      provider: "cloudinary" as const,
      objectKey,
      mock: false,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      fields: {
        api_key: apiKey,
        timestamp: `${timestamp}`,
        signature,
        folder,
        public_id,
      },
    };
  }

  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_S3_BUCKET;

  if (!region || !bucket || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return {
      provider: "s3" as const,
      objectKey,
      mock: true,
      uploadUrl: `https://example-bucket.s3.amazonaws.com/${objectKey}`,
      headers: {
        "Content-Type": input.mimeType,
      },
    };
  }

  const s3 = new S3Client({ region });
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: input.mimeType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

  return {
    provider: "s3" as const,
    objectKey,
    mock: false,
    uploadUrl,
    headers: {
      "Content-Type": input.mimeType,
    },
  };
}
