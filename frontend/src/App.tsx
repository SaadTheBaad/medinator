import { Routes, Route, NavLink } from "react-router-dom";
import MedinatorChat from "./components/MedinatorChat";
import DoctorReport from "./premium/DoctorReport";
import JournalingAssistant from "./premium/JournalingAssistant";
import HistoryPage from "./premium/HistoryPage";
import "./App.css";

function Header() {
  return (
    <header className="app-nav">
      <div className="app-nav-left">
        <span className="app-logo">Medinator</span>
        <span className="app-badge">Beta</span>
      </div>
      <nav className="app-nav-links">
        <NavLink to="/" className="app-link">
          Home
        </NavLink>
        <NavLink to="/journal" className="app-link">
          Journaling (Premium demo)
        </NavLink>
        <NavLink to="/history" className="app-link">
          History (Premium demo)
        </NavLink>
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <>
      <main className="app-main">
        <section className="app-hero">
          <h1>Your guided symptom helper.</h1>
          <p>
            Medinator asks you a few simple questions about how you&apos;re
            feeling and uses an AI model, grounded in medical references, to
            provide <strong>general information</strong> about possible symptom
            categories and how urgent things might be.
          </p>
          <ul className="app-hero-list">
            <li>🔍 Structured questions instead of endless Googling</li>
            <li>⏱ Helps you think about urgency, not just labels</li>
            <li>
              👨‍⚕️ Always recommends talking to real healthcare professionals
            </li>
          </ul>
        </section>

        <section className="app-panel" aria-label="Medinator questionnaire">
          <div className="card">
            <MedinatorChat />
          </div>
        </section>
      </main>

      <section id="how-it-works" className="app-info">
        <h2>How it works</h2>
        <div className="info-grid">
          <div className="info-item">
            <h3>1. Answer a few guided questions</h3>
            <p>
              Instead of typing long descriptions, just choose the options that
              best match your main symptom and how it feels.
            </p>
          </div>
          <div className="info-item">
            <h3>2. Medinator summarizes your pattern</h3>
            <p>
              Your choices are turned into a short, structured description that
              our AI model uses together with a symptom reference guide.
            </p>
          </div>
          <div className="info-item">
            <h3>3. You get a triage-style overview</h3>
            <p>
              Medinator suggests broad categories, a rough urgency level, and
              plain-language next steps. It doesn&apos;t replace a doctor, but
              it helps you prepare.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Footer() {
  return (
    <footer id="disclaimer" className="app-footer">
      <p className="app-footer-title">Important safety notice</p>
      <p>
        Medinator is a student project and an educational tool only. It does not
        provide medical diagnoses or treatment and must not be used in an
        emergency. If you feel very unwell, have severe symptoms, or are worried
        about your health, please contact a licensed healthcare professional or
        emergency services immediately.
      </p>
      <p className="app-footer-small">
        © {new Date().getFullYear()} Medinator – Built for ENGG 525.
      </p>
    </footer>
  );
}

function App() {
  return (
    <div className="app-root">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctor-report" element={<DoctorReport />} />
        <Route path="/journal" element={<JournalingAssistant />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
