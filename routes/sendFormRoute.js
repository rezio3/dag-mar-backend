import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import fs from "fs";
import SibApiV3Sdk from "@sendinblue/client";

const router = express.Router();

// 🔸 Multer — do obsługi uploadu plików
const upload = multer({
  storage: multer.memoryStorage(), // ⬅️ zapis w pamięci, nie na dysku
  limits: { fileSize: 10 * 1024 * 1024 }, // limit 10 MB
});

// 🔸 Brevo (Sendinblue)
const brevoApi = new SibApiV3Sdk.TransactionalEmailsApi();
brevoApi.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

router.post("/send-form", upload.single("file"), async (req, res) => {
  try {
    const { name, surname, email, subject, message } = req.body || {};

    if (!name || !surname || !email || !subject || !message) {
      return res.status(400).json({ error: "Wszystkie pola są wymagane." });
    }

    let attachments = [];
    if (req.file) {
      attachments.push({
        content: req.file.buffer.toString("base64"), // ⬅️ teraz z pamięci
        name: req.file.originalname,
      });
    }

    const sendSmtpEmail = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: "Dag-mar website",
      },
      to: [{ email: "biuro@dag-mar.pl", name: "Dag-mar" }],
      // to: [{ email: "jakub.rezler96@gmail.com", name: "Dag-mar" }],
      subject,
      htmlContent: `
        <html>
          <body>
            <p><strong>Imię i nazwisko:</strong> ${name} ${surname}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Wiadomość:</strong> ${message}</p>
          </body>
        </html>
      `,
      ...(attachments.length > 0 ? { attachment: attachments } : {}),
    };

    await brevoApi.sendTransacEmail(sendSmtpEmail);
    console.log("Mail wysłany!");
    res.json({ success: true, message: "Mail wysłany!" });
  } catch (error) {
    console.error("Błąd przy wysyłce:", error);

    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ success: false, error: "Plik jest za duży (max 10 MB)." });
    }

    res
      .status(500)
      .json({ success: false, error: "Nie udało się wysłać maila." });
  }
});

export default router;
