import { NextResponse } from "next/server";
import { allScriptures } from "@/lib/scriptures";

export async function GET() {
  const resources = allScriptures.map((scripture) => ({
    scripture: scripture.name,
    downloads: scripture.resources,
  }));

  return NextResponse.json({
    totalScriptures: resources.length,
    resources,
  });
}
