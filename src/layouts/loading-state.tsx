import React from 'react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'कुण्डली तयार गरिँदै...',
  className = "max-w-6xl mx-auto px-6 py-12"
}) => {
  return (
    <div className={className}>
      <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-2xl">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-6"></div>
        <p className="text-lg text-blue-600 font-medium">{message}</p>
      </div>
    </div>
  );
};