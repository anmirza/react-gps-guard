import React from 'react';
import '../styles/default.css';

export interface DefaultPrimerProps {
  onAllow: () => void;
  onDeny: () => void;
}

export const DefaultPrimer: React.FC<DefaultPrimerProps> = ({ onAllow, onDeny }) => {
  return (
    <div className="gps-guard-container gps-guard-bg">
      <div className="gps-guard-card">
        <h2 className="gps-guard-title">📍 Enable location</h2>
        <p className="gps-guard-text">
          We use your location to verify your identity. Nothing is shared until you allow it.
        </p>
        <div className="gps-guard-buttons">
          <button onClick={onDeny} className="gps-guard-btn gps-guard-btn-secondary">
            Not now
          </button>
          <button onClick={onAllow} className="gps-guard-btn gps-guard-btn-primary">
            Allow
          </button>
        </div>
      </div>
    </div>
  );
};
