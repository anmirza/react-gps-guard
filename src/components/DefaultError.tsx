import React from 'react';
import { GPSError, GPSPermissionState } from '../types';
import { PlatformService } from '../services/PlatformService';
import '../styles/default.css';

export interface DefaultErrorProps {
  error: GPSError | null;
  permission: GPSPermissionState;
  showInstructions: boolean;
  onRetry: () => void;
  onSkip?: () => void;
  skipText?: string;
  isOptional?: boolean;
}

export const DefaultError: React.FC<DefaultErrorProps> = ({
  error,
  permission,
  showInstructions,
  onRetry,
  onSkip,
  skipText = 'Continue without location',
  isOptional = false,
}) => {
  const isAndroid = PlatformService.isAndroid();
  const isIOS = PlatformService.isIOS();

  return (
    <div className="gps-guard-container gps-guard-bg">
      <div className="gps-guard-card">
        <h2 className="gps-guard-title">
          {isOptional ? '📍 Location Unavailable' : '📍 Location Required'}
        </h2>
        <p className="gps-guard-text">
          {isOptional
            ? 'We could not access your location. You can retry or continue without location.'
            : 'Your location is required before continuing.'}
        </p>

        {error && (
          <div className="gps-guard-error-box">
            {error.message}
          </div>
        )}

        {showInstructions && permission === 'denied' && (
          <div className="gps-guard-instructions">
            <h4>Permission has been blocked.</h4>
            <p>Browsers cannot ask for the permission again after it has been denied.</p>
            {isAndroid && (
              <>
                <strong>Android</strong>
                <ol>
                  <li>Tap the 🔒 icon beside the address bar / URL.</li>
                  <li>Select <strong>Site Settings</strong> / <strong>Permissions</strong>.</li>
                  <li>Reset the permissions.</li>
                  <li>Return to this page and refresh.</li>
                </ol>
              </>
            )}
            {isIOS && (
              <>
                <strong>iPhone / iPad</strong>
                <ol>
                  <li>Open Settings app.</li>
                  <li>Go to Safari -{'>'} Location.</li>
                  <li>Select Ask or Allow.</li>
                  <li>Refresh the page.</li>
                </ol>
              </>
            )}
            {!isAndroid && !isIOS && (
              <>
                <strong>Desktop Browser</strong>
                <ol>
                  <li>Click the 🔒 icon beside the URL.</li>
                  <li>Go to permissions and reset Location.</li>
                  <li>Refresh this page.</li>
                </ol>
              </>
            )}
          </div>
        )}

        {showInstructions && permission !== 'denied' && (
          <div className="gps-guard-instructions">
            <h4>Turn on GPS</h4>
            <p>Please make sure Location Services (GPS) are enabled on your device.</p>
            <ul>
              <li>Turn on GPS / Location Services.</li>
              <li>Return to this page.</li>
              <li>Press Retry.</li>
            </ul>
          </div>
        )}

        <button onClick={onRetry} className="gps-guard-btn gps-guard-btn-secondary" style={{ marginTop: 15, width: '100%' }}>
          Retry
        </button>

        {onSkip && (
          <button
            onClick={onSkip}
            className="gps-guard-btn gps-guard-btn-skip"
            style={{ marginTop: 10, width: '100%' }}
          >
            {skipText}
          </button>
        )}
      </div>
    </div>
  );
};
