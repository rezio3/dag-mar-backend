import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sendFormRoute from "./routes/sendFormRoute.js";
import newsRoute from "./routes/newsRoute.js";
import news from "./routes/news.js";
import auth from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/", sendFormRoute);
app.use("/", newsRoute);
app.use("/", news);
app.use("/", auth);

app.listen(PORT, () => {
  console.log(`✅ Server działa na porcie ${PORT}`);
});
