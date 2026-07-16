import React, { ReactNode } from 'react';
import { useGPSGuard, UseGPSGuardProps } from '../hooks/useGPSGuard';
import { DefaultLoading } from './DefaultLoading';
import { DefaultPrimer } from './DefaultPrimer';
import { DefaultError } from './DefaultError';
import { STATUS_STATES } from '../utils/constants';

export interface GPSGuardProps extends UseGPSGuardProps {
  children: ReactNode;
  /** Component to render while loading/checking permissions */
  loadingComponent?: ReactNode;
  /** Component to render to ask for permission before triggering browser prompt */
  permissionComponent?: ReactNode;
  /** Component to render on error (denied or gps disabled) */
  errorComponent?: ReactNode;
  /** Render prop for loading state */
  renderLoading?: () => ReactNode;
  /** Render prop for primer state */
  renderPermission?: (requestPermission: () => void, decline: () => void) => ReactNode;
  /** Render prop for error state */
  renderError?: (error: any, retry: () => void) => ReactNode;
}

export const GPSGuard: React.FC<GPSGuardProps> = ({
  children,
  loadingComponent,
  permissionComponent,
  errorComponent,
  renderLoading,
  renderPermission,
  renderError,
  ...hookProps
}) => {
  const { status, permission, error, loading, retry, decline, requestPermission, stopWatching } = useGPSGuard(hookProps);

  if (loading) {
    if (renderLoading) return <>{renderLoading()}</>;
    if (loadingComponent) return <>{loadingComponent}</>;
    return <DefaultLoading />;
  }

  if (status === STATUS_STATES.PRIMING) {
    if (renderPermission) return <>{renderPermission(requestPermission, decline)}</>;
    if (permissionComponent) return <>{permissionComponent}</>;
    return <DefaultPrimer onAllow={requestPermission} onDeny={decline} />;
  }

  if (status === STATUS_STATES.ERROR || status === STATUS_STATES.IDLE) {
    // If we're idle but not priming or loading, it usually means we declined or stopped.
    // For simplicity, we treat it as an error state visually if we are expected to guard children.
    if (renderError) return <>{renderError(error, retry)}</>;
    if (errorComponent) return <>{errorComponent}</>;
    return (
      <DefaultError
        error={error}
        permission={permission}
        showInstructions={hookProps.showInstructions ?? true}
        onRetry={retry}
      />
    );
  }

  return <>{children}</>;
};
