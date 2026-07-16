import React from 'react';
import '../styles/default.css';

export const DefaultLoading: React.FC = () => {
  return (
    <div className="gps-guard-container gps-guard-loading">
      Checking Location...
    </div>
  );
};
