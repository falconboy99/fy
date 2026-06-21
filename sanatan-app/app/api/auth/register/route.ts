import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  if (!body?.email || !body?.password || !body?.name) {
    return NextResponse.json({ message: "name, email, and password are required" }, { status: 400 });
  }

  const existing = await db.query("select id from users where email = $1 limit 1", [body.email]);
  if (existing.rowCount) {
    return NextResponse.json({ message: "Email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(body.password, 12);

  const created = await db.query(
    "insert into users (email, name, password_hash, auth_provider) values ($1, $2, $3, 'credentials') returning id, email, name",
    [body.email, body.name, passwordHash],
  );

  return NextResponse.json({
    message: "Account created",
    user: created.rows[0],
  });
}
