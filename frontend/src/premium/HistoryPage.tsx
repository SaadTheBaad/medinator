import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type HistoryEntry = {
  date: string;
  result: any;
  answerPath: any[];
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("medinator_history") || "[]"
    );
    setHistory(stored);
  }, []);

  const handleOpenReport = (entry: HistoryEntry) => {
    navigate("/doctor-report", {
      state: { result: entry.result, answerPath: entry.answerPath },
    });
  };

  return (
    <div className="page-container">
      <div className="page-card">
        <h1>Your Symptom History (Premium demo)</h1>
        <p>
          This shows past Medinator sessions saved on your device. In a real
          subscription, this could sync across devices and accounts.
        </p>

        {history.length === 0 && (
          <p style={{ marginTop: 12 }}>No history yet.</p>
        )}

        {history.length > 0 && (
          <ul className="history-list">
            {history
              .slice()
              .reverse()
              .map((entry, idx) => {
                const redFlagCount =
                  entry.result?.red_flags_detected?.length || 0;
                return (
                  <li
                    key={idx}
                    className="history-item history-clickable"
                    onClick={() => handleOpenReport(entry)}
                  >
                    <div className="history-row-main">
                      <span className="history-date">{entry.date}</span>
                      <span className="history-tag">
                        {entry.result?.category}
                      </span>
                      <span className={`history-urgency history-urgency-${entry.result?.urgency_level}`}>
                        {entry.result?.urgency_level}
                      </span>
                    </div>
                    <div className="history-row-sub">
                      {redFlagCount > 0 ? (
                        <span className="history-redflags">
                          ⚠ {redFlagCount} red flag
                          {redFlagCount > 1 ? "s" : ""} mentioned
                        </span>
                      ) : (
                        <span className="history-no-redflags">
                          No red flags detected in this summary.
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}
