import express from "express";
import path from "path";
import dotenv from "dotenv";
import { generateIshantReply } from "./server/gemini";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, tone, language, memories, model } = req.body;
    const result = await generateIshantReply(
      messages || [],
      tone,
      language,
      memories,
      model || "gemini-3.1-flash-lite"
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Internal error" });
  }
});

app.use(express.static(path.resolve(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Only us server running on port ${PORT}`);
});
