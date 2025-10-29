import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const router = express.Router();

// 🔸 Łączenie z MongoDB
const client = new MongoClient(process.env.MONGO_KEY);
const dbName = "dag-mar-database";
const collectionName = "dag-mar-news-window";

// 🔸 Pobieranie news z bazy
router.get("/get-news", async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Zakładamy, że w kolekcji jest tylko jeden dokument
    const news = await collection.findOne({});

    if (!news) {
      return res.status(404).json({ error: "Nie znaleziono news." });
    }

    res.json(news);
  } catch (error) {
    console.error("Błąd przy pobieraniu news:", error);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu news." });
  } finally {
    // możesz zamknąć połączenie jeśli nie planujesz używać dalej
    await client.close();
  }
});

export default router;
