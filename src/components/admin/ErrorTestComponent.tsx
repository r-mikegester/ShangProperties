import React, { useState } from 'react';

const ErrorTestComponent: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a test error to demonstrate the ErrorBoundary');
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Error Boundary Test</h2>
      <p className="mb-4">This component can throw an error to demonstrate the ErrorBoundary functionality.</p>
      <button
        onClick={() => setShouldThrow(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Throw Error
      </button>
    </div>
  );
};

export default ErrorTestComponent;