import React from 'react';
import '../styles/default.css';

export interface DefaultPrimerProps {
  onAllow: () => void;
  onDeny: () => void;
  onSkip?: () => void;
  isOptional?: boolean;
  denyText?: string;
  allowText?: string;
  title?: string;
  description?: string;
}

export const DefaultPrimer: React.FC<DefaultPrimerProps> = ({
  onAllow,
  onDeny,
  onSkip,
  isOptional = false,
  denyText = 'Not now',
  allowText = 'Allow',
  title = '📍 Enable location',
  description,
}) => {
  const handleDeny = () => {
    if (onSkip) {
      onSkip();
    } else {
      onDeny();
    }
  };

  const defaultDescription = isOptional
    ? 'Location is optional, but helps us provide the best experience. Nothing is shared until you allow it.'
    : 'We use your location to verify your identity. Nothing is shared until you allow it.';

  return (
    <div className="gps-guard-container gps-guard-bg">
      <div className="gps-guard-card">
        <h2 className="gps-guard-title">{title}</h2>
        <p className="gps-guard-text">{description ?? defaultDescription}</p>
        <div className="gps-guard-buttons">
          <button onClick={handleDeny} className="gps-guard-btn gps-guard-btn-secondary">
            {denyText}
          </button>
          <button onClick={onAllow} className="gps-guard-btn gps-guard-btn-primary">
            {allowText}
          </button>
        </div>
      </div>
    </div>
  );
};
