import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import SibApiV3Sdk from "@sendinblue/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const brevoApi = new SibApiV3Sdk.TransactionalEmailsApi();

brevoApi.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ""
);

app.post("/send-form", async (req, res) => {
  const { name, surname, email, subject, message } = req.body;

  if (!name || !surname || !email || !subject || !message) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane." });
  }

  const sendSmtpEmail = {
    sender: {
      email: process.env.BREVO_SENDER_EMAIL,
      name: "Dag-mar website",
    },
    // to: [{ email: process.env.BREVO_SENDER_EMAIL, name: "dag-mar" }],
    to: [{ email: "jakub.rezler96@gmail.com", name: "dag-mar" }],
    subject: `${subject}`,
    htmlContent: `
      <html>
        <body>
          <p><strong>Imię i nazwisko:</strong> ${name} ${surname}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Wiadomość:</strong> ${message}</p>
        </body>
      </html>
    `,
  };

  try {
    const response = await brevoApi.sendTransacEmail(sendSmtpEmail);
    console.log("Mail wysłany:");
    res.json({ success: true, message: "Mail wysłany!" });
  } catch (error) {
    console.error("Błąd przy wysyłce:", error);
    res
      .status(500)
      .json({ success: false, error: "Nie udało się wysłać maila." });
  }
});

app.listen(PORT, () => {
  console.log(`Server działa na porcie ${PORT}`);
});
