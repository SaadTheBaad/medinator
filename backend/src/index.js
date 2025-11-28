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

app.use(
  cors({
    origin(origin, callback) {
      // allow non browser tools (no origin) and our known frontends
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Make sure OPTIONS preflight gets the CORS headers
app.options("*", cors());

app.use(express.json());

app.use("/api/medinator", medinatorRoute);
app.use("/api/journal", journalRoute);

app.get("/", (_req, res) => {
  res.send("Medinator backend is running.");
});

app.listen(PORT, () => {
  console.log(`Medinator backend running on http://localhost:${PORT}`);
});
