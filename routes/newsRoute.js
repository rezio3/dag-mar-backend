import express from "express";
import { getDb } from "../db/db.js";

const router = express.Router();

router.get("/get-news", async (req, res) => {
  try {
    const db = await getDb();
    const collection = db.collection("dag-mar-news-window");
    const news = await collection.findOne({});

    if (!news) {
      return res.status(404).json({ error: "Nie znaleziono news." });
    }

    res.json(news);
  } catch (error) {
    console.error("Błąd przy pobieraniu news:", error);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu news." });
  }
});

export default router;
