import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import medinatorRoute from "./routes/medinator.js";
import journalRoute from "./routes/journal.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Allow local dev and Vercel frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://medinator.vercel.app",
];

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools (no Origin header) and our known frontends
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

// --- API routes ---
app.use("/api/medinator", medinatorRoute);
app.use("/api/journal", journalRoute);

// Simple health check
app.get("/", (_req, res) => {
  res.send("Medinator backend is running.");
});

app.listen(PORT, () => {
  console.log(`Medinator backend running on http://localhost:${PORT}`);
});
