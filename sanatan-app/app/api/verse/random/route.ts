import { NextResponse } from "next/server";
import { randomVerses } from "@/lib/scriptures";

export async function GET() {
  const verse = randomVerses[Math.floor(Math.random() * randomVerses.length)];

  return NextResponse.json({
    verse,
    source: "Archive Meditation Stream",
    generatedAt: new Date().toISOString(),
  });
}
