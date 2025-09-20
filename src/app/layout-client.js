'use client';

import { ThemeProvider } from '../../context/ThemeContext';
import { useJWTChecker } from '../../hooks/useJWTChecker';
import SessionExpiryModal from '../../components/Objects/SessionExpiryModal';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const { isExpiring, isExpired, countdown } = useJWTChecker();

  // Don't show JWT-related UI on login pages
  const isLoginPage = pathname === '/' || pathname === '/login';

  return (
    <ThemeProvider>
      {isExpired && !isLoginPage ? (
        <div className="fixed inset-0 bg-gray-900 flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-red-500">
              <svg 
                className="w-12 h-12 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Session Expired
            </h2>
            <p className="text-gray-400">
              Redirecting to login page...
            </p>
          </div>
        </div>
      ) : (
        <>
          {isExpiring && !isLoginPage && <SessionExpiryModal countdown={countdown} />}
          {children}
        </>
      )}
    </ThemeProvider>
  );
}
