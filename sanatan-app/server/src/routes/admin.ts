import { Router } from "express";
import { upload } from "../middleware/upload";

export const adminRouter = Router();

adminRouter.post("/upload", upload.single("file"), (req, res) => {
  const { title, language, author, translator, description, category } = req.body;

  if (!title || !category) {
    return res.status(400).json({ message: "title and category are required" });
  }

  return res.json({
    message: "Resource uploaded to memory. Connect S3/Cloudinary persistence for production.",
    metadata: {
      title,
      language,
      author,
      translator,
      description,
      category,
      fileName: req.file?.originalname ?? null,
    },
  });
});
