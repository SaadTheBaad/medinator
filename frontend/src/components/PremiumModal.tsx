import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PremiumModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal">
        <h2>Premium Feature</h2>
        <p>
          This feature is part of <strong>Medinator Plus</strong>, our
          subscription tier offering enhanced tools.
        </p>

        <ul>
          <li>✔ Auto-generated doctor summaries</li>
          <li>✔ Symptom history tracking</li>
          <li>✔ Mental health journaling assistant</li>
        </ul>

        <p className="premium-demo-note">
          For this demo, you can explore a read-only preview.
        </p>

        <button className="premium-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
