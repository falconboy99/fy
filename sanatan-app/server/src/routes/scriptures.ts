import { Router } from "express";
import { allScriptures } from "../../../lib/scriptures";

export const scripturesRouter = Router();

scripturesRouter.get("/search", (req, res) => {
  const q = String(req.query.q ?? "").toLowerCase();

  const result = allScriptures.filter((scripture) => {
    if (!q) {
      return true;
    }

    return (
      scripture.name.toLowerCase().includes(q) ||
      scripture.description.toLowerCase().includes(q) ||
      scripture.chapters.some((chapter) => chapter.title.toLowerCase().includes(q))
    );
  });

  res.json({ count: result.length, result });
});

scripturesRouter.get("/resources", (_req, res) => {
  const result = allScriptures.map((scripture) => ({
    name: scripture.name,
    resources: scripture.resources,
  }));

  res.json({ count: result.length, result });
});
