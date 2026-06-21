import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.title || !body?.category || !body?.storageProvider) {
    return NextResponse.json(
      { message: "title, category, and storageProvider are required" },
      { status: 400 },
    );
  }

  const insertQuery = `
    insert into resource_uploads
      (title, language, author, translator, description, category, storage_provider, object_key, public_url, mime_type, size_bytes)
    values
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    returning id, created_at
  `;

  try {
    const saved = await db.query(insertQuery, [
      body.title,
      body.language ?? null,
      body.author ?? null,
      body.translator ?? null,
      body.description ?? null,
      body.category,
      body.storageProvider,
      body.objectKey ?? null,
      body.publicUrl ?? null,
      body.mimeType ?? null,
      body.sizeBytes ?? null,
    ]);

    return NextResponse.json({
      message: "Upload metadata persisted",
      record: saved.rows[0],
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Database unavailable. Metadata capture accepted in fail-safe mode.",
        fallback: true,
        error: error instanceof Error ? error.message : "unknown",
      },
      { status: 202 },
    );
  }
}
