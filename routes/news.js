import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getDb } from "../db/db.js";

const router = express.Router();

router.get("/admin/news", verifyToken, async (req, res) => {
  const db = await getDb();
  const collection = db.collection("dag-mar-news-window");
  const news = await collection.findOne({});
  res.json(news);
});

router.put("/admin/news", verifyToken, async (req, res) => {
  const { txt1, txt2, newsOn } = req.body;
  const db = await getDb();
  const collection = db.collection("dag-mar-news-window");

  await collection.updateOne({}, { $set: { txt1, txt2, newsOn } });

  res.json({ success: true });
});

export default router;
