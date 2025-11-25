import React, { useEffect, useRef, useState } from "react";
import mascot from "../assets/medinator-mascot.png";

/** ----------------------------------------------------------------
 *  Constants & types
 *  ---------------------------------------------------------------- */

const FEELINGS = [
  "Stressed",
  "Anxious",
  "Overwhelmed",
  "Tired",
  "Okay",
  "Hopeful",
  "Grateful",
];

type JournalMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
};

type Therapist = {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  nextAvailable: string;
  location: string;
};

const STORAGE_KEY = "medinator_journal_messages_v1";

const THERAPISTS: Therapist[] = [
  {
    id: "t1",
    name: "Dr. Ayesha Rahman",
    credentials: "Registered Psychologist",
    specialty: "Anxiety, stress, students & young adults",
    nextAvailable: "Tomorrow · 3-6 PM",
    location: "Calgary, AB (online)",
  },
  {
    id: "t2",
    name: "Daniel Kim, MSc",
    credentials: "Registered Provisional Psychologist",
    specialty: "Burnout, perfectionism, academic pressure",
    nextAvailable: "Thu · 6-8 PM",
    location: "Edmonton, AB (online)",
  },
  {
    id: "t3",
    name: "Sarah Lee, RCC",
    credentials: "Registered Clinical Counsellor",
    specialty: "Low mood, self-esteem, life transitions",
    nextAvailable: "Sat · 11 AM-2 PM",
    location: "BC (online)",
  },
];

/** ----------------------------------------------------------------
 *  Component
 *  ---------------------------------------------------------------- */

export default function JournalingAssistant() {
  const [entry, setEntry] = useState("");
  const [responsePending, setResponsePending] = useState(false);
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [messages, setMessages] = useState<JournalMessage[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingTherapist, setBookingTherapist] = useState<Therapist | null>(
    null
  );
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // scroll only inside the chat box, not the whole page
  const chatRef = useRef<HTMLDivElement | null>(null);

  const maxChars = 1000;
  const charCount = entry.length;

  /** --------------------------------------------------------------
   *  Local storage: load & save history
   *  -------------------------------------------------------------- */

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setMessages(parsed);
      }
    } catch (error) {
      console.error("Failed to load journal history:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save journal history:", error);
    }
  }, [messages]);

  /** --------------------------------------------------------------
   *  Auto scroll chat inside the chat box only
   *  -------------------------------------------------------------- */

  useEffect(() => {
    if (chatRef.current) {
      const el = chatRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, responsePending]);

  /** --------------------------------------------------------------
   *  Handlers
   *  -------------------------------------------------------------- */

  const toggleFeeling = (feeling: string) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling]
    );
  };

  const handleJournal = async () => {
    if (!entry.trim() || responsePending) return;

    const timestamp = new Date().toLocaleString();
    const taggedEntry =
      selectedFeelings.length > 0
        ? `${entry}\n\nMood tags: ${selectedFeelings.join(", ")}.`
        : entry;

    const userMessage: JournalMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: entry.trim(),
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setEntry("");
    setResponsePending(true);

    try {
      const res = await fetch("http://localhost:3001/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry: taggedEntry }),
      });

      if (!res.ok) {
        console.error("Journal API error:", res.status);
        alert("Error contacting journaling assistant.");
        setResponsePending(false);
        return;
      }

      const data = await res.json();
      const replyText: string =
        data.reply || "I was not able to generate a reflection this time.";

      const assistantMessage: JournalMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      alert("Error contacting journaling assistant.");
    }

    setResponsePending(false);
  };

  const handleClearHistory = () => {
    const confirmClear = window.confirm(
      "Clear all journal messages stored on this device? This cannot be undone."
    );
    if (!confirmClear) return;

    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const openBooking = (therapist: Therapist) => {
    setBookingTherapist(therapist);
    setBookingEmail("");
    setBookingNotes("");
    setBookingSubmitted(false);
    setBookingOpen(true);
  };

  const closeBooking = () => {
    setBookingOpen(false);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // demo only - in a real product this would POST to a backend
    setBookingSubmitted(true);
  };

  /** --------------------------------------------------------------
   *  Render
   *  -------------------------------------------------------------- */

  return (
    <>
      <div className="page-container journal-page">
        <div className="page-card journal-card">
          {/* Header */}
          <div className="journal-header">
            <div className="journal-header-main">
              <div className="journal-title-row">
                <h1>Mental Health Journaling Assistant</h1>
              </div>
              <p>
                A calm space to put your thoughts into words. This tool helps
                you reflect on how you are feeling - it is{" "}
                <strong>not therapy</strong> and does not replace speaking with
                a mental health professional.
              </p>
            </div>
            <div className="journal-header-side">
              <img
                src={mascot}
                alt="Medinator mascot"
                className="journal-mascot"
              />
            </div>
          </div>

          {/* Mood chips */}
          <div className="journal-feelings">
            <span className="journal-feelings-label">
              How are you feeling as you start this entry?
            </span>
            <div className="journal-feelings-chips">
              {FEELINGS.map((feeling) => {
                const active = selectedFeelings.includes(feeling);
                return (
                  <button
                    key={feeling}
                    type="button"
                    className={`journal-chip ${
                      active ? "journal-chip-active" : ""
                    }`}
                    onClick={() => toggleFeeling(feeling)}
                  >
                    {feeling}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat + right panel layout */}
          <div className="journal-layout">
            {/* Left: chat */}
            <div className="journal-left">
              <div className="journal-chat" ref={chatRef}>
                {messages.length === 0 && (
                  <div className="journal-empty-state">
                    <p>
                      This is your private space on this device. Start by
                      writing a few sentences about what is on your mind, and
                      Medinator will respond with a gentle reflection.
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`journal-bubble-row journal-bubble-row-${msg.role}`}
                  >
                    <div
                      className={`journal-bubble journal-bubble-${msg.role}`}
                    >
                      <p>{msg.text}</p>
                      <span className="journal-bubble-time">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}

                {responsePending && (
                  <div className="journal-bubble-row journal-bubble-row-assistant">
                    <div className="journal-bubble journal-bubble-assistant">
                      <p>Thinking about what you wrote...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="journal-input-area">
                <label className="journal-label" htmlFor="journal-entry">
                  New entry
                </label>
                <textarea
                  id="journal-entry"
                  className="journal-input"
                  placeholder="Write about your day, something that is worrying you, or anything you would like to get off your chest..."
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  maxLength={maxChars}
                />
                <div className="journal-actions">
                  <span className="journal-char-count">
                    {charCount}/{maxChars}
                  </span>
                  <div className="journal-actions-buttons">
                    <button
                      type="button"
                      className="journal-clear-btn"
                      onClick={handleClearHistory}
                      disabled={messages.length === 0}
                    >
                      Clear history on this device
                    </button>
                    <button
                      className="medinator-button"
                      onClick={handleJournal}
                      disabled={responsePending || !entry.trim()}
                    >
                      {responsePending ? "Thinking..." : "Reflect"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: tips + booking */}
            <aside className="journal-right">
              <div className="journal-right-section">
                <h3>Tips for getting started</h3>
                <ul>
                  <li>You do not have to write perfectly - just honestly.</li>
                  <li>
                    Try describing what happened, how it felt, and what you
                    need.
                  </li>
                  <li>
                    You can write a lot or a little. Short check-ins still count
                    as journaling.
                  </li>
                </ul>
                <div className="journal-safe-note">
                  If you are feeling very distressed or having thoughts of
                  self-harm, please reach out to a trusted person or a mental
                  health professional right away. This tool cannot respond to
                  crises.
                </div>
              </div>

              <div className="journal-right-section therapist-section">
                <h3>Connect with a therapist</h3>
                <p className="journal-right-sub">
                  Medinator+ could connect you with licensed mental health
                  professionals.
                </p>

                <div className="therapist-list">
                  {THERAPISTS.map((t) => (
                    <div key={t.id} className="therapist-card">
                      <div className="therapist-main">
                        <div className="therapist-name">{t.name}</div>
                        <div className="therapist-creds">{t.credentials}</div>
                        <div className="therapist-specialty">{t.specialty}</div>
                      </div>
                      <div className="therapist-meta">
                        <span className="therapist-availability">
                          Next: {t.nextAvailable}
                        </span>
                        <span className="therapist-location">{t.location}</span>
                      </div>
                      <button
                        type="button"
                        className="therapist-book-btn"
                        onClick={() => openBooking(t)}
                      >
                        Book 15 min intro call
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Booking modal (demo only) */}
      {bookingOpen && bookingTherapist && (
        <div className="booking-modal-backdrop" onClick={closeBooking}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Request an intro call</h2>
            <p className="booking-subtitle">
              You are requesting a short introductory session with{" "}
              <strong>{bookingTherapist.name}</strong>. In a full version of
              Medinator+, this request would be securely sent to their clinic.
            </p>

            {bookingSubmitted ? (
              <div className="booking-confirmation">
                <p>
                  ✅ Demo request submitted! In the real product you would get a
                  confirmation email with available times.
                </p>
                <button
                  className="medinator-button"
                  type="button"
                  onClick={closeBooking}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="booking-form">
                <label className="booking-label">
                  Contact email
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={bookingEmail}
                    onChange={(e) => setBookingEmail(e.target.value)}
                  />
                </label>

                <label className="booking-label">
                  What would you like help with?
                  <textarea
                    placeholder="You can briefly describe what you would like to talk about. This is just a demo."
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                  />
                </label>

                <div className="booking-actions">
                  <button
                    type="button"
                    className="booking-secondary"
                    onClick={closeBooking}
                  >
                    Cancel
                  </button>
                  <button className="medinator-button" type="submit">
                    Send demo request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
