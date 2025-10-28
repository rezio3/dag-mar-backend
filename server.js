import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sendFormRoute from "./routes/sendFormRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// 🔸 Użycie trasy z routes/sendFormRoute.js
app.use("/", sendFormRoute);

app.listen(PORT, () => {
  console.log(`✅ Server działa na porcie ${PORT}`);
});
