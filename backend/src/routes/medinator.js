import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { symptomDescription } = req.body;

    if (!symptomDescription) {
      return res.status(400).json({ error: "Missing symptomDescription" });
    }

    // ---- SYSTEM PROMPT (Uses Your Research Summary) ----
    const systemPrompt = `
You are Medinator, an educational symptom triage assistant. 
You do NOT diagnose. You only map symptoms into broad categories
and urgency levels.

Use ONLY this research-based guide:

1) Upper respiratory tract infection (URTI)
   - Symptoms: runny/stuffy nose, sore throat, mild cough, sneezing, mild fever
   - Red flags: symptoms >10 days, fever >38.5°C for >3 days, shortness of breath, wheezing, severe sinus pain

2) Acute bronchitis
   - Symptoms: chest congestion, productive cough, mild headache/body aches
   - Red flags: fever ≥38°C, bloody mucus, shortness of breath, duration >3 weeks

3) Gastroenteritis
   - Symptoms: watery diarrhea, nausea/vomiting, stomach cramps, low fever
   - Red flags: vomiting >24h, inability to keep fluids, blood in stool, severe stomach pain, fever >40°C

4) GERD
   - Symptoms: burning chest pain after meals, regurgitation
   - Red flags: chest pain that radiates, trouble swallowing, persistent vomiting

5) UTI
   - Symptoms: burning urination, frequent urge, pelvic discomfort
   - Red flags: fever + back pain + vomiting (kidney involvement)

6) Headache (tension)
   - Symptoms: pressure, band-like pain, neck tension
   - Red flags: sudden worst-ever headache, stiff neck, confusion, vision changes, fever >39.4°C

7) Conjunctivitis
   - Symptoms: redness, discharge, itchy/watery eyes
   - Red flags: eye pain, blurred vision, light sensitivity

8) Depression
   - Symptoms: persistent low mood, loss of interest, sleep/appetite changes
   - Red flags: self-harm thoughts

9) Anxiety
   - Symptoms: excessive worry, chest tightness, restlessness

Determine:
- category (respiratory, gastro, urinary, mental, etc.)
- likely_conditions (LIST)
- urgency_level ("low", "monitor", "seek_care")
- red_flags_detected (LIST)
- reasoning (2–3 sentences)
- advice (plain language)
- disclaimer (always include)

Return ONLY JSON:
{
  "category": "...",
  "likely_conditions": ["..."],
  "urgency_level": "low" | "monitor" | "seek_care",
  "red_flags_detected": [],
  "reasoning": "...",
  "advice": "...",
  "disclaimer": "..."
}
`;

    // ---- OPENAI CALL ----
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: symptomDescription },
      ],
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return res.json(result);
  } catch (error) {
    console.error("Medinator API error:", error);
    res.status(500).json({ error: "Server error calling AI" });
  }
});

export default router;
