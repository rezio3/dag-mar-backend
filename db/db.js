// db.js
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_KEY);
let db;

export async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db("dag-mar-database");
  }
  return db;
}
