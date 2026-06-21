import "dotenv/config";
import cors from "cors";
import express from "express";
import { adminRouter } from "./routes/admin";
import { scripturesRouter } from "./routes/scriptures";

const app = express();
const port = Number(process.env.PORT ?? 8080);

app.use(cors());
app.use(express.json());
app.use("/api/scriptures", scripturesRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "sanatan-archive-api" });
});

app.listen(port, () => {
  console.log(`Sanatan API running on http://localhost:${port}`);
});
