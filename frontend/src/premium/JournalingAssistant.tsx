import React, { useState } from "react";

export default function JournalingAssistant() {
  const [entry, setEntry] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJournal = async () => {
    if (!entry.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entry }),
      });
      const data = await res.json();
      setResponse(data.reply || "No response received.");
    } catch (e) {
      console.error(e);
      alert("Error contacting journaling assistant.");
    }
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h1>Mental Health Journaling Assistant (Premium demo)</h1>
        <p>
          This tool is meant to help you reflect on your feelings. It is{" "}
          <strong>not therapy</strong> and does not replace speaking with a
          mental health professional.
        </p>

        <textarea
          className="journal-input"
          placeholder="Write about your mood, stress, or anything on your mind..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />

        <button
          className="medinator-button"
          style={{ marginTop: 10 }}
          onClick={handleJournal}
          disabled={loading}
        >
          {loading ? "Thinking..." : "Reflect"}
        </button>

        {response && (
          <div className="journal-response">
            <h2>Reflection</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
