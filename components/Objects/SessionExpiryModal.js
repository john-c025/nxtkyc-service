import React from 'react';

const SessionExpiryModal = ({ countdown }) => {
  // Convert seconds to minutes and seconds
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 animate-bounce">
      <div className="flex items-center gap-2">
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <div>
          <p className="font-semibold">Session Expiring Soon</p>
          <p className="text-sm">
            Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')} minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiryModal; 