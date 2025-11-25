export type Option = {
  id: string;
  label: string;
  nextQuestionId?: string; // if omitted, this is a leaf
  aiSnippet: string; // short description to send to AI
};

export type Question = {
  id: string;
  prompt: string;
  subtitle?: string;
  options: Option[];
};

export const questions: Question[] = [
  {
    id: "q1_main",
    prompt: "If you have more than one unrelated issue, pick the one that bothers you most first. You can always run Medinator again for another symptom.",
    subtitle: "Choose the area that best matches what’s bothering you most.",
    options: [
      {
        id: "q1_respiratory",
        label: "Head / nose / throat / chest (cough, cold, breathing)",
        nextQuestionId: "q2_respiratory_type",
        aiSnippet: "Main symptom area: respiratory / head / throat / chest.",
      },
      {
        id: "q1_gastro",
        label: "Stomach / digestion (nausea, diarrhea, heartburn)",
        nextQuestionId: "q2_gastro_type",
        aiSnippet: "Main symptom area: gastrointestinal / stomach / digestion.",
      },
      {
        id: "q1_urinary",
        label: "Urinary / pelvic (burning urination, frequency)",
        nextQuestionId: "q2_urinary_type",
        aiSnippet: "Main symptom area: urinary / pelvic.",
      },
      {
        id: "q1_headache",
        label: "Headache / head pressure / neck tension",
        nextQuestionId: "q2_headache_type",
        aiSnippet: "Main symptom area: headache / head / neck.",
      },
      {
        id: "q1_eye",
        label: "Eye symptoms (redness, discharge, gritty feeling)",
        nextQuestionId: "q2_eye_type",
        aiSnippet:
          "Main symptom area: eye irritation / conjunctivitis-type symptoms.",
      },
      {
        id: "q1_mental",
        label: "Mood / mental health (anxiety, low mood)",
        nextQuestionId: "q2_mental_type",
        aiSnippet:
          "Main concern area: mental health / mood / anxiety / depression.",
      },
    ],
  },

  // Respiratory
  {
    id: "q2_respiratory_type",
    prompt: "Which best describes your respiratory symptoms?",
    options: [
      {
        id: "resp_mild_cold",
        label:
          "Runny or stuffy nose, sore throat, mild cough, low fever",
        aiSnippet:
          "Symptoms suggest mild upper respiratory infection: runny/stuffy nose, sore throat, mild cough, low-grade fever.",
      },
      {
        id: "resp_chest_cold",
        label: "Chest congestion with cough, fatigue, mild body aches",
        aiSnippet:
          "Symptoms suggest acute bronchitis or chest cold: chest congestion, cough, fatigue, mild aches.",
      },
      {
        id: "resp_red_flags",
        label:
          "Trouble breathing, wheezing, chest pain, or high fever",
        aiSnippet:
          "Respiratory red flags present: shortness of breath, wheezing, chest pain, or high fever. This raises concern for more serious illness.",
      },
    ],
  },

  // Gastro
  {
    id: "q2_gastro_type",
    prompt: "Which best describes your stomach / digestion symptoms?",
    options: [
      {
        id: "gastro_mild",
        label:
          "Nausea, vomiting or watery diarrhea, mild cramps, low fever",
        aiSnippet:
          "Symptoms suggest mild viral gastroenteritis: watery diarrhea, nausea/vomiting, cramps, low-grade fever.",
      },
      {
        id: "gastro_severe",
        label:
          "Can’t keep fluids down, blood in stool, severe pain, or very high fever",
        aiSnippet:
          "Gastrointestinal red flags present: inability to keep fluids down, blood in stool, severe abdominal pain, or very high fever.",
      },
      {
        id: "gastro_heartburn",
        label:
          "Burning chest pain after meals, sour taste, regurgitation",
        aiSnippet:
          "Symptoms suggest reflux or GERD: burning chest discomfort after meals, regurgitation, sour taste.",
      },
    ],
  },

  // Urinary
  {
    id: "q2_urinary_type",
    prompt: "Which best describes your urinary symptoms?",
    options: [
      {
        id: "uti_simple",
        label:
          "Burning urination, frequent urge, lower belly discomfort",
        aiSnippet:
          "Symptoms suggest possible simple urinary tract infection: burning urination, frequent urge, lower abdominal discomfort.",
      },
      {
        id: "uti_kidney",
        label:
          "Back/side pain with fever, chills, nausea or vomiting",
        aiSnippet:
          "Urinary red flags: flank/back pain with fever, chills, nausea, or vomiting, suggesting possible kidney involvement.",
      },
    ],
  },

  // Headache
  {
    id: "q2_headache_type",
    prompt: "Which best describes your head / headache symptoms?",
    options: [
      {
        id: "head_tension",
        label:
          "Dull, band-like pressure around head; neck/shoulder tightness",
        aiSnippet:
          "Symptoms suggest tension-type headache: dull bilateral pressure, band-like, with neck/shoulder tightness.",
      },
      {
        id: "head_red_flags",
        label:
          "Sudden severe headache, stiff neck, confusion, or vision changes",
        aiSnippet:
          "Headache red flags: sudden severe 'worst-ever' headache, stiff neck, confusion, or vision/neurologic changes.",
      },
    ],
  },

  // Eye
  {
    id: "q2_eye_type",
    prompt: "Which best describes your eye symptoms?",
    options: [
      {
        id: "eye_mild",
        label: "Red, itchy, watery eye(s) with mild discharge",
        aiSnippet:
          "Symptoms suggest mild conjunctivitis: red, itchy, watery eyes with mild discharge.",
      },
      {
        id: "eye_red_flags",
        label:
          "Significant eye pain, blurred vision, or strong light sensitivity",
        aiSnippet:
          "Eye red flags: significant pain, blurred vision, or strong light sensitivity suggesting more serious eye condition.",
      },
    ],
  },

  // Mental health
  {
    id: "q2_mental_type",
    prompt: "Which best matches how you’ve been feeling?",
    options: [
      {
        id: "mental_anxiety",
        label:
          "Lots of worry, restlessness, chest tightness, difficulty relaxing",
        aiSnippet:
          "Symptoms suggest anxiety-type pattern: excessive worry, restlessness, physical tension.",
      },
      {
        id: "mental_depression",
        label:
          "Low mood, loss of interest, changes in sleep or appetite",
        aiSnippet:
          "Symptoms suggest depression-type pattern: persistent low mood, loss of interest, sleep/appetite changes.",
      },
      {
        id: "mental_red_flag",
        label: "Thoughts of self-harm or not wanting to be alive",
        aiSnippet:
          "Critical mental health red flag: thoughts of self-harm or wanting to die.",
      },
    ],
  },
];

export const getQuestionById = (id: string): Question | undefined =>
  questions.find((q) => q.id === id);
