import React, { useState } from "react";
import { getMedinatorResult } from "../api/medinatorClient";

const MedinatorChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await getMedinatorResult(input);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error contacting Medinator backend.");
    }
    setLoading(false);
  };

  return (
    <div className="medinator">
      <h1 className="medinator-title">Medinator</h1>

      <textarea
        className="medinator-input"
        placeholder="Describe your symptoms..."
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="medinator-button"
      >
        {loading ? "Analyzing..." : "Submit"}
      </button>

      {result && (
        <div className="medinator-result">
          <h2 className="medinator-result-title">
            Category: {result.category}
          </h2>

          <p>
            <strong>Likely conditions:</strong>{" "}
            {result.likely_conditions?.join(", ")}
          </p>
          <p>
            <strong>Urgency:</strong> {result.urgency_level}
          </p>

          {result.red_flags_detected &&
            result.red_flags_detected.length > 0 && (
              <p className="medinator-result-redflags">
                <strong>Red flags:</strong>{" "}
                {result.red_flags_detected.join(", ")}
              </p>
            )}

          <p className="medinator-result-text">
            <strong>Reasoning:</strong> {result.reasoning}
          </p>
          <p className="medinator-result-text">
            <strong>Advice:</strong> {result.advice}
          </p>

          <p className="medinator-result-disclaimer">
            {result.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedinatorChat;
