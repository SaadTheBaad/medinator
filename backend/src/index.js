import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import medinatorRoute from "./routes/medinator.js";
import journalRoute from "./routes/journal.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/medinator", medinatorRoute);
app.use("/api/journal", journalRoute);

app.get("/", (_req, res) => {
  res.send("Medinator backend is running.");
});

app.listen(PORT, () => {
  console.log(`Medinator backend running on http://localhost:${PORT}`);
});
