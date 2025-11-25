import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DoctorReport() {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: { result: any; answerPath: any[] };
  };
  const result = state?.result;
  const answerPath = state?.answerPath ?? [];

  const handlePrint = () => {
    window.print();
  };

  const nextStepSummary = (() => {
    if (!result) return "";
    switch (result.urgency_level) {
      case "low":
        return "Based on this pattern, symptoms sound suitable for self-care and monitoring, as long as they do not worsen or new red-flag symptoms appear.";
      case "monitor":
        return "Based on this pattern, it would be reasonable to book a non-urgent appointment or call a clinic/telehealth service, especially if symptoms persist or worsen.";
      case "seek_care":
        return "Based on this pattern and the red-flag features mentioned, seeking medical care soon (same-day clinic, urgent care, or emergency services depending on severity) is recommended.";
      default:
        return "";
    }
  })();

  return (
    <div className="page-container report-print-area">
      <div className="page-card">
        <h1>Doctor Summary Report (Premium demo)</h1>
        <p>
          This is an example of the report Medinator Plus could generate for you
          to bring to an appointment.
        </p>

        {!result && (
          <p style={{ marginTop: 12 }}>
            No recent result found. Go back to the home page, complete a
            session, and then click &quot;View doctor summary&quot;.
          </p>
        )}

        {result && (
          <>
            <div className="doctor-report-section">
              <h2>1. Summary of Concern</h2>
              <p>
                <strong>Category:</strong> {result.category}
              </p>
              <p>
                <strong>Urgency level:</strong> {result.urgency_level}
              </p>
            </div>

            <div className="doctor-report-section">
              <h2>2. Symptom Pattern (from your answers)</h2>
              <ul>
                {answerPath.map((step: any, idx: number) => (
                  <li key={idx}>
                    <strong>{step.questionPrompt}</strong> →{" "}
                    {step.optionLabel}
                  </li>
                ))}
              </ul>
            </div>

            <div className="doctor-report-section">
              <h2>3. AI-generated Overview</h2>
              <p>{result.reasoning}</p>
              {result.red_flags_detected &&
                result.red_flags_detected.length > 0 && (
                  <p className="medinator-result-redflags">
                    Red flags mentioned:{" "}
                    {result.red_flags_detected.join(", ")}
                  </p>
                )}
            </div>

            <div className="doctor-report-section">
              <h2>4. Suggested Questions to Ask Your Doctor</h2>
              <ul>
                <li>What do you think is the most likely cause of my symptoms?</li>
                <li>Are there warning signs that mean I should seek urgent care?</li>
                <li>Do I need any tests or follow-up?</li>
                <li>What self-care steps are safe and recommended?</li>
              </ul>
            </div>

            <div className="doctor-report-section">
              <h2>5. Next Step Summary</h2>
              <p>{nextStepSummary}</p>
            </div>

            <div className="doctor-report-section">
              <h2>6. Important Disclaimer</h2>
              <p className="medinator-result-disclaimer">
                This summary is generated automatically from your answers and an
                AI model for educational purposes only. It is not a diagnosis,
                does not cover all possibilities, and does not replace a full
                assessment by a licensed healthcare professional.
              </p>
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button
            className="medinator-button no-print"
            onClick={() => navigate("/")}
          >
            Back to Medinator
          </button>

          {result && (
            <button
              className="medinator-button no-print"
              onClick={handlePrint}
            >
              Download as PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
