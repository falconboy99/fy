import { NextRequest, NextResponse } from "next/server";
import { createUploadSignature } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.filename || !body?.mimeType || !body?.provider) {
    return NextResponse.json({ message: "filename, mimeType, and provider are required" }, { status: 400 });
  }

  if (body.provider !== "s3" && body.provider !== "cloudinary") {
    return NextResponse.json({ message: "provider must be s3 or cloudinary" }, { status: 400 });
  }

  const signed = await createUploadSignature({
    filename: body.filename,
    mimeType: body.mimeType,
    provider: body.provider,
  });

  return NextResponse.json(signed);
}
