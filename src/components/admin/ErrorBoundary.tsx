import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  isCopied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
    errorInfo: undefined,
    isCopied: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isCopied: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
      isCopied: false
    });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      isCopied: false
    });
  };

  private copyErrorDetails = () => {
    if (this.state.error) {
      const errorDetails = `${this.state.error.toString()}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || ''}`;
      navigator.clipboard.writeText(errorDetails)
        .then(() => {
          this.setState({ isCopied: true });
          // Reset the copied status after 2 seconds
          setTimeout(() => {
            this.setState({ isCopied: false });
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy error details: ', err);
        });
    }
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full border border-red-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">Something went wrong</h3>
              <p className="mt-2 text-gray-600">
                We're sorry, but an unexpected error occurred. Our team has been notified.
              </p>
              
              {this.state.error && (
                <div className="mt-4 text-left bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">
                      Error details
                    </span>
                    <button
                      onClick={this.copyErrorDetails}
                      className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b08b2e]"
                    >
                      {this.state.isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <details className="max-h-40 overflow-y-auto">
                    <summary className="cursor-pointer text-sm text-gray-600">
                      Click to view error
                    </summary>
                    <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
                      {this.state.error.toString()}
                    </pre>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </details>
                </div>
              )}
              
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#b08b2e] hover:bg-[#9a7724] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b08b2e]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b08b2e]"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;