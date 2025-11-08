import React from 'react';

interface ErrorStateProps {
  message?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'कुण्डली लोड गर्न सकिएन',
  className = "max-w-6xl mx-auto px-6 py-12"
}) => {
  return (
    <div className={className}>
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-2xl">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg text-red-600 font-medium">{message}</p>
      </div>
    </div>
  );
};