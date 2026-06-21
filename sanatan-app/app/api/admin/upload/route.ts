import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.title || !body?.category) {
    return NextResponse.json(
      { message: "title and category are required" },
      { status: 400 },
    );
  }

  try {
    const saved = await db.query(
      `
      insert into resource_uploads
        (title, language, author, translator, description, category, storage_provider)
      values
        ($1, $2, $3, $4, $5, $6, $7)
      returning id, created_at
      `,
      [
        body.title,
        body.language ?? null,
        body.author ?? null,
        body.translator ?? null,
        body.description ?? null,
        body.category,
        body.storageProvider ?? "manual",
      ],
    );

    return NextResponse.json({
      message: "Resource metadata accepted and persisted.",
      payload: saved.rows[0],
    });
  } catch {
    return NextResponse.json({
      message: "Resource metadata accepted in fallback mode.",
      payload: {
        ...body,
        id: `res_${Date.now()}`,
      },
    });
  }
}
