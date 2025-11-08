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
      <div className="text-center p-8 bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 border border-orange-200 rounded-2xl shadow-lg">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mb-6"></div>
        <p className="text-lg font-medium bg-gradient-to-r from-orange-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">{message}</p>
      </div>
    </div>
  );
};