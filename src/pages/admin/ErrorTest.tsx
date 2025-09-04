import React from 'react';
import ErrorTestComponent from '../../components/admin/ErrorTestComponent';
import ErrorBoundary from '../../components/admin/ErrorBoundary';

const ErrorTestPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Error Boundary Test</h1>
        <p className="text-gray-600 mt-2">
          This page demonstrates the ErrorBoundary component in action. 
          Click the button below to trigger an error.
        </p>
      </div>
      
      <ErrorBoundary>
        <ErrorTestComponent />
      </ErrorBoundary>
    </div>
  );
};

export default ErrorTestPage;