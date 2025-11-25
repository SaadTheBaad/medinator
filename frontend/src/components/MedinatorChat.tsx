import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMedinatorResult } from "../api/medinatorClient";
import { getQuestionById } from "../data/symptomFlow";
import type { Question, Option } from "../data/symptomFlow";

type AnswerStep = {
  questionId: string;
  questionPrompt: string;
  optionId: string;
  optionLabel: string;
  aiSnippet: string;
};

const MedinatorChat: React.FC = () => {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>("q1_main");
  const [answerPath, setAnswerPath] = useState<AnswerStep[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const currentQuestion: Question | undefined = getQuestionById(
    currentQuestionId
  );

  const handleOptionClick = async (option: Option) => {
    if (!currentQuestion) return;

    const newStep: AnswerStep = {
      questionId: currentQuestion.id,
      questionPrompt: currentQuestion.prompt,
      optionId: option.id,
      optionLabel: option.label,
      aiSnippet: option.aiSnippet,
    };

    const newPath = [...answerPath, newStep];
    setAnswerPath(newPath);

    if (option.nextQuestionId) {
      setCurrentQuestionId(option.nextQuestionId);
      setResult(null);
      return;
    }

    // Leaf: build description and call backend
    const description = newPath
      .map(
        (step, index) =>
          `Step ${index + 1}: ${step.questionPrompt} -> User chose: ${step.optionLabel}. ${step.aiSnippet}`
      )
      .join("\n");

    setLoading(true);
    try {
      const data = await getMedinatorResult(description);
      setResult(data);

      // Save to local history (for "Premium" demo)
      const historyEntry = {
        date: new Date().toLocaleString(),
        result: data,
        answerPath: newPath,
      };
      const oldHistory = JSON.parse(
        localStorage.getItem("medinator_history") || "[]"
      );
      oldHistory.push(historyEntry);
      localStorage.setItem("medinator_history", JSON.stringify(oldHistory));
    } catch (err) {
      console.error(err);
      alert("Error contacting Medinator backend.");
    }
    setLoading(false);
  };

  const handleRestart = () => {
    setCurrentQuestionId("q1_main");
    setAnswerPath([]);
    setResult(null);
  };

  const handleViewReport = () => {
    if (!result) return;
    navigate("/doctor-report", { state: { result, answerPath } });
  };

  return (
    <div className="medinator">
      <h1 className="medinator-title">Medinator</h1>
      <p className="medinator-subtitle">
        Answer a few quick questions about how you&apos;re feeling. Medinator
        uses an AI model with a symptom reference guide to give{" "}
        <strong>general information</strong> about possible categories and
        urgency. It does not replace a clinician.
      </p>

      {currentQuestion && (
        <div className="medinator-question-block">
          <h2 className="medinator-question">{currentQuestion.prompt}</h2>
          {currentQuestion.subtitle && (
            <p className="medinator-question-subtitle">
              {currentQuestion.subtitle}
            </p>
          )}

          <div className="medinator-options">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.id}
                className="medinator-option-button"
                disabled={loading}
                onClick={() => handleOptionClick(opt)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <p className="medinator-loading">Analyzing your answers…</p>
      )}

      {result && (
        <div className="medinator-result">
          <h2 className="medinator-result-title">
            Category: {result.category}
          </h2>

          <p>
            <strong>Likely conditions (categories):</strong>{" "}
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

          <button className="medinator-button" onClick={handleViewReport}>
            View doctor summary (Premium demo)
          </button>
        </div>
      )}

      {answerPath.length > 0 && (
        <div className="medinator-history">
          <h3>Your answers this session</h3>
          <ol>
            {answerPath.map((step, idx) => (
              <li key={idx}>
                <span className="medinator-history-q">
                  Q{idx + 1}: {step.questionPrompt}
                </span>
                <span className="medinator-history-a">
                  {" "}
                  → {step.optionLabel}
                </span>
              </li>
            ))}
          </ol>
          <button className="medinator-button" onClick={handleRestart}>
            Start over
          </button>
        </div>
      )}
    </div>
  );
};

export default MedinatorChat;
