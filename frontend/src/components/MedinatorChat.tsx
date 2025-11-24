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
    <div className="max-w-xl mx-auto mt-20 p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Medinator</h1>

      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        placeholder="Describe your symptoms..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Analyzing..." : "Submit"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-bold text-lg mb-2">
            Category: {result.category}
          </h2>

          <p><strong>Likely conditions:</strong> {result.likely_conditions.join(", ")}</p>
          <p><strong>Urgency:</strong> {result.urgency_level}</p>

          {result.red_flags_detected.length > 0 && (
            <p className="text-red-600">
              <strong>Red flags:</strong> {result.red_flags_detected.join(", ")}
            </p>
          )}

          <p className="mt-2"><strong>Reasoning:</strong> {result.reasoning}</p>
          <p className="mt-2"><strong>Advice:</strong> {result.advice}</p>

          <p className="text-xs text-gray-500 mt-4">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
};

export default MedinatorChat;
