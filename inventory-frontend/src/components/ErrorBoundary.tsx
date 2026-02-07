import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorDisplay from './ErrorDisplay';
import type { ApiError } from '../types';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const apiError: ApiError = {
        message: this.state.error?.message || 'An unexpected error occurred',
      };
      return (
        <div style={{ padding: '2rem' }}>
          <ErrorDisplay
            error={apiError}
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
