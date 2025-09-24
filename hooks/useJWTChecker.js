'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from 'next/navigation';

export function useJWTChecker() {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpiring, setIsExpiring] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Skip JWT checks on public pages and login pages
    const isLoginPage = pathname === '/' || pathname === '/login';
    const isPublicPage = pathname.startsWith('/client') || pathname.startsWith('/captcha');
    
    if (isLoginPage || isPublicPage) {
      console.log('🔍 JWT Checker: Skipping JWT checks on public/login page:', pathname);
      return;
    }

    const checkToken = () => {
      console.log('🔍 JWT Checker: Running token check...');
      const token = Cookies.get('authToken');
      console.log('🔍 JWT Checker: Token found?', !!token);
      
      if (!token) {
        console.log('❌ JWT Checker: No token found, setting expired');
        setIsExpired(true);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = decoded.exp - now;
        
        console.log('🔍 JWT Checker: Decoded token', { 
          exp: decoded.exp, 
          now, 
          timeLeft,
          expiresAt: new Date(decoded.exp * 1000).toLocaleString()
        });

        // If less than 2 minutes remaining
        if (timeLeft <= 120 && timeLeft > 0) {
          console.log('⚠️ JWT Checker: Token expiring soon, showing warning');
          setIsExpiring(true);
          setCountdown(timeLeft);
        }

        // If token is expired
        else if (timeLeft <= 0) {
          console.log('❌ JWT Checker: Token expired, redirecting...');
          setIsExpired(true);
          Cookies.remove('authToken');
          setTimeout(() => {
            console.log('🔄 JWT Checker: Redirecting to /');
            router.push('/');
          }, 1500);
        } 
        // Reset states if token is valid
        else {
          console.log('✅ JWT Checker: Token valid');
          setIsExpiring(false);
          setIsExpired(false);
          setCountdown(0);
        }
      } catch (e) {
        console.error('❌ JWT Checker: Invalid token:', e);
        setIsExpired(true);
        Cookies.remove('authToken');
      }
    };

    // Check immediately
    checkToken();

    // Then check every 30 seconds
    const interval = setInterval(checkToken, 5000);

    return () => clearInterval(interval);
  }, [router, pathname]);

  return { isExpiring, isExpired, countdown };
}
