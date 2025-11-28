import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

export default function DoctorReport() {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: { result: any; answerPath: any[] };
  };

  const result = state?.result;
  const answerPath = state?.answerPath ?? [];

  // Nicer browser tab title (what you already had)
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Medinator Doctor Summary Report";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const nextStepSummary = (() => {
    if (!result) return "";
    switch (result.urgency_level) {
      case "low":
        return "Based on this pattern, symptoms sound suitable for self care and monitoring, as long as they do not get worse or new red flag symptoms appear.";
      case "monitor":
        return "Based on this pattern, it would be reasonable to book a non urgent appointment or call a clinic or telehealth service, especially if symptoms last or get worse.";
      case "seek_care":
        return "Based on this pattern and the red flag features mentioned, seeking medical care soon, such as a same day clinic, urgent care, or emergency services depending on how severe things feel, is recommended.";
      default:
        return "";
    }
  })();

  const handleDownloadPdf = () => {
    if (!result) return;

    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 20;
    const maxWidth = pageWidth - marginX * 2;
    const lineHeight = 6;
    let y = 22;

    doc.setLineHeightFactor(1.4);

    const ensureSpace = (linesNeeded: number) => {
      if (y + linesNeeded * lineHeight > pageHeight - 20) {
        doc.addPage();
        y = 22;
      }
    };

    const addSectionTitle = (text: string) => {
      ensureSpace(2);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(0, 0, 0);
      doc.text(text, marginX, y);
      y += 8;
    };

    const addBody = (
      text: string,
      opts?: { color?: [number, number, number] }
    ) => {
      if (!text) return;
      const lines = doc.splitTextToSize(text.trim(), maxWidth);
      ensureSpace(lines.length + 1);
      const [r, g, b] = opts?.color ?? [40, 40, 40];
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(r, g, b);
      doc.text(lines, marginX, y);
      y += lines.length * lineHeight;
      doc.setTextColor(0, 0, 0);
    };

    const addBullet = (text: string) => {
      if (!text) return;
      const lines = doc.splitTextToSize(`• ${text.trim()}`, maxWidth);
      ensureSpace(lines.length + 1);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text(lines, marginX, y);
      y += lines.length * lineHeight;
    };

    // TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Doctor Summary Report", marginX, y);
    y += 10;

    // Subtitle
    addBody(
      "This is an example of the report Medinator Plus could generate for you to bring to an appointment."
    );
    y += 2;

    // SECTION 1
    addSectionTitle("1. Summary of Concern");
    addBody(`Category: ${result.category}`);
    addBody(`Urgency level: ${result.urgency_level}`);
    y += 4;

    // SECTION 2
    addSectionTitle("2. Symptom Pattern (from your answers)");

    answerPath.forEach((step) => {
      const question = String(step.questionPrompt ?? "")
        .replace(/\s+/g, " ")
        .trim();
      const option = String(step.optionLabel ?? "").trim();
      addBullet(`${question} -> ${option}`);
    });
    y += 2;

    // SECTION 3
    addSectionTitle("3. AI generated Overview");
    addBody(result.reasoning || "");

    if (result.red_flags_detected?.length) {
      addBody(
        `Red flags mentioned: ${result.red_flags_detected.join(", ")}`,
        { color: [180, 0, 0] }
      );
      y += 2;
    }

    // SECTION 4
    addSectionTitle("4. Suggested Questions to Ask Your Doctor");
    const questions = [
      "What do you think is the most likely cause of my symptoms?",
      "Are there warning signs that mean I should seek urgent care?",
      "Do I need any tests or follow up?",
      "What self care steps are safe and recommended?",
    ];
    questions.forEach((q) => addBullet(q));
    y += 2;

    // SECTION 5
    addSectionTitle("5. Next Step Summary");
    addBody(nextStepSummary);
    y += 2;

    // SECTION 6
    addSectionTitle("6. Important Disclaimer");
    addBody(
      "This summary is generated automatically from your answers and an AI model for educational purposes only. It is not a diagnosis, does not cover every possibility, and does not replace a full assessment by a licensed healthcare professional."
    );

    doc.save("Medinator-Doctor-Summary.pdf");
  };

  return (
    <div className="page-container report-print-area">
      <div className="page-card">
        <h1>Doctor Summary Report</h1>
        <p>
          This is an example of the report Medinator Plus could generate for you
          to bring to an appointment.
        </p>

        {!result && (
          <p style={{ marginTop: 12 }}>
            No recent result found. Go back to the home page, complete a
            session, and then click "View doctor summary".
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
                <li>
                  What do you think is the most likely cause of my symptoms?
                </li>
                <li>
                  Are there warning signs that mean I should seek urgent care?
                </li>
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
              onClick={handleDownloadPdf}
            >
              Download as PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
