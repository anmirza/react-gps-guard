import React, { ReactNode } from 'react';
import { useGPSGuard, UseGPSGuardProps } from '../hooks/useGPSGuard';
import { DefaultLoading } from './DefaultLoading';
import { DefaultPrimer } from './DefaultPrimer';
import { DefaultError } from './DefaultError';
import { STATUS_STATES } from '../utils/constants';
import { GPSLocation, GPSPermissionState, GPSStatus, GPSError } from '../types';

export type GPSGuardChildrenProps = {
  location: GPSLocation | null;
  permission: GPSPermissionState;
  status: GPSStatus;
  error: GPSError | null;
  loading: boolean;
  isSkipped: boolean;
  skip: () => void;
  retry: () => void;
  requestPermission: () => void;
};

export type GPSGuardChildren =
  | ReactNode
  | ((props: GPSGuardChildrenProps) => ReactNode);

export interface GPSGuardProps extends UseGPSGuardProps {
  children: GPSGuardChildren;
  /** Component to render while loading/checking permissions */
  loadingComponent?: ReactNode;
  /** Component to render to ask for permission before triggering browser prompt */
  permissionComponent?: ReactNode;
  /** Component to render on error (denied or gps disabled) */
  errorComponent?: ReactNode;
  /** Render prop for loading state */
  renderLoading?: () => ReactNode;
  /** Render prop for primer state. Receives (requestPermission, decline, skip) */
  renderPermission?: (
    requestPermission: () => void,
    decline: () => void,
    skip: () => void
  ) => ReactNode;
  /** Render prop for error state. Receives (error, retry, skip) */
  renderError?: (
    error: any,
    retry: () => void,
    skip: () => void
  ) => ReactNode;
  /** Custom text for the skip/continue button when optional is enabled. Defaults to "Continue without location" */
  skipButtonText?: string;
  /** Explicitly allow skipping even if optional is not set. Defaults to value of optional. */
  allowSkip?: boolean;
}

export const GPSGuard: React.FC<GPSGuardProps> = ({
  children,
  loadingComponent,
  permissionComponent,
  errorComponent,
  renderLoading,
  renderPermission,
  renderError,
  skipButtonText,
  allowSkip,
  ...hookProps
}) => {
  const isOptional = hookProps.optional ?? false;
  const canSkip = allowSkip ?? isOptional;

  const {
    status,
    permission,
    error,
    location,
    loading,
    isSkipped,
    skip,
    retry,
    decline,
    requestPermission,
  } = useGPSGuard(hookProps);

  const renderChildren = () => {
    if (typeof children === 'function') {
      return children({
        location,
        permission,
        status,
        error,
        loading,
        isSkipped,
        skip,
        retry,
        requestPermission,
      });
    }
    return children;
  };

  // If user skipped in optional mode, directly render children
  if (isSkipped || status === STATUS_STATES.SKIPPED) {
    return <>{renderChildren()}</>;
  }

  if (loading) {
    if (renderLoading) return <>{renderLoading()}</>;
    if (loadingComponent) return <>{loadingComponent}</>;
    return <DefaultLoading />;
  }

  if (status === STATUS_STATES.PRIMING) {
    if (renderPermission) return <>{renderPermission(requestPermission, decline, skip)}</>;
    if (permissionComponent) return <>{permissionComponent}</>;
    return (
      <DefaultPrimer
        onAllow={requestPermission}
        onDeny={decline}
        onSkip={canSkip ? skip : undefined}
        isOptional={canSkip}
      />
    );
  }

  if (status === STATUS_STATES.ERROR || status === STATUS_STATES.IDLE) {
    // If optional and skipOnError is true, render children directly
    if (isOptional && hookProps.skipOnError) {
      return <>{renderChildren()}</>;
    }

    if (renderError) return <>{renderError(error, retry, skip)}</>;
    if (errorComponent) return <>{errorComponent}</>;
    return (
      <DefaultError
        error={error}
        permission={permission}
        showInstructions={hookProps.showInstructions ?? true}
        onRetry={retry}
        onSkip={canSkip ? skip : undefined}
        skipText={skipButtonText}
        isOptional={canSkip}
      />
    );
  }

  return <>{renderChildren()}</>;
};
