import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/journal
router.post("/", async (req, res) => {
  try {
    const { entry } = req.body;
    if (!entry) {
      return res.status(400).json({ error: "Missing entry" });
    }

    const systemPrompt = `
You are a mental health journaling assistant.
You are NOT a therapist and do NOT provide diagnosis or treatment.
Your job is to:
- validate the user's feelings,
- gently help them reflect,
- suggest simple, healthy coping ideas,
- encourage seeking help from a mental health professional when appropriate.

You MUST:
- avoid clinical labels and diagnoses,
- avoid any language that sounds like formal therapy,
- include a sentence that clearly states you are not a replacement for a professional.

Return a short, warm, plain-language paragraph (6–10 sentences).
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `The user wrote this journal entry: "${entry}". Please respond.`,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    return res.json({ reply });
  } catch (error) {
    console.error("Journal API error:", error);
    res.status(500).json({ error: "Server error calling journaling AI" });
  }
});

export default router;
