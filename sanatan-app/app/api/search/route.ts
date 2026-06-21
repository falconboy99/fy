import { NextRequest, NextResponse } from "next/server";
import { allScriptures } from "@/lib/scriptures";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";
  const category = request.nextUrl.searchParams.get("category");

  const filtered = allScriptures.filter((item) => {
    const inCategory = category ? item.category === category : true;

    if (!q) {
      return inCategory;
    }

    const inName = item.name.toLowerCase().includes(q);
    const inDescription = item.description.toLowerCase().includes(q);
    const inChapter = item.chapters.some((chapter) => chapter.title.toLowerCase().includes(q));

    return inCategory && (inName || inDescription || inChapter);
  });

  return NextResponse.json({
    total: filtered.length,
    results: filtered,
  });
}
