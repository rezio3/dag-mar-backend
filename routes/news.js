import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { MongoClient } from "mongodb";

const router = express.Router();

router.get("/admin/news", verifyToken, async (req, res) => {
  const client = new MongoClient(process.env.MONGO_KEY);
  await client.connect();
  const db = client.db("dag-mar-database");
  const collection = db.collection("dag-mar-news-window");

  const news = await collection.findOne({});
  await client.close();

  res.json(news);
});

router.put("/admin/news", verifyToken, async (req, res) => {
  const { txt1, txt2, newsOn } = req.body;

  const client = new MongoClient(process.env.MONGO_KEY);
  await client.connect();
  const db = client.db("dag-mar-database");
  const collection = db.collection("dag-mar-news-window");

  await collection.updateOne({}, { $set: { txt1, txt2, newsOn } });
  await client.close();

  res.json({ success: true });
});

export default router;
