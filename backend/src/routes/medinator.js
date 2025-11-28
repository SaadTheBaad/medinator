import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/medinator
router.post("/", async (req, res) => {
  try {
    const { symptomDescription } = req.body;

    if (!symptomDescription || typeof symptomDescription !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid symptomDescription" });
    }

    const systemPrompt = `
You are Medinator, an educational symptom triage assistant.
You DO NOT diagnose or treat. You:
- map symptoms to broad categories (e.g., respiratory infection, digestive upset, urinary issue, mental health),
- classify urgency as "low", "monitor", or "seek_care",
- highlight any red-flag features,
- ALWAYS include a clear disclaimer that this is not medical advice.

Use this research-based summary:

1) Upper respiratory tract infection (URTI)
   - Symptoms: runny/stuffy nose, sore throat, mild cough, sneezing, mild fever
   - Red flags: symptoms >10 days, fever >38.5°C for >3 days, shortness of breath,
     wheezing, severe sinus pain.

2) Acute bronchitis
   - Symptoms: chest congestion, productive cough, mild headache/body aches
   - Red flags: fever ≥38°C, bloody mucus, shortness of breath, symptoms >3 weeks.

3) Gastroenteritis
   - Symptoms: watery diarrhea, nausea/vomiting, stomach cramps, low fever
   - Red flags: vomiting >24h, unable to keep fluids down, blood in stool,
     severe stomach pain, fever >40°C.

4) GERD
   - Symptoms: burning chest pain after meals, regurgitation, sour taste
   - Red flags: chest pain radiating to arm/jaw, trouble swallowing, persistent vomiting.

5) UTI
   - Symptoms: burning urination, frequent urge, pelvic discomfort
   - Red flags: fever + flank/back pain + vomiting (possible kidney involvement).

6) Tension-type headache
   - Symptoms: dull "band-like" head pressure, neck/shoulder tightness
   - Red flags: sudden "worst-ever" headache, stiff neck, confusion, vision change,
     high fever, neurological deficits.

7) Conjunctivitis
   - Symptoms: red, itchy, watery eyes, mild discharge
   - Red flags: significant eye pain, blurred vision, strong light sensitivity.

8) Depression
   - Symptoms: persistent low mood, loss of interest, sleep/appetite changes, fatigue
   - Red flag: any thoughts of self-harm or wanting to die.

9) Anxiety
   - Symptoms: excessive worry, restlessness, chest tightness, palpitations.

When in doubt or multiple red flags appear, lean toward "seek_care".

Return ONLY JSON with this shape:
{
  "category": string,
  "likely_conditions": string[],
  "urgency_level": "low" | "monitor" | "seek_care",
  "red_flags_detected": string[],
  "reasoning": string,
  "advice": string,
  "disclaimer": string
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: symptomDescription },
      ],
    });

    const content = completion.choices[0].message.content;
    const result = JSON.parse(content);

    return res.json(result);
  } catch (error) {
    console.error("Medinator API error:", error);
    return res
      .status(500)
      .json({ error: "Server error calling AI for Medinator" });
  }
});

export default router;
