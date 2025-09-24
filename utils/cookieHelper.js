// Cookie helper functions for JWT token management

export const getCookie = (name) => {
  if (typeof document === 'undefined') return null; // SSR safety
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

export const setCookie = (name, value, days = 7) => {
  if (typeof document === 'undefined') return; // SSR safety
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

export const removeCookie = (name) => {
  if (typeof document === 'undefined') return; // SSR safety
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Get JWT token from cookies
export const getAuthToken = () => {
  // Try different possible cookie names for JWT token
  const possibleNames = ['authToken', 'jwt', 'token', 'access_token', 'auth_token'];
  
  for (const name of possibleNames) {
    const token = getCookie(name);
    if (token) {
      console.log(`Found JWT token in cookie: ${name}`);
      return token;
    }
  }
  
  console.log('No JWT token found in cookies');
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    // Basic JWT validation (check if it's a valid JWT format)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      console.log('JWT token has expired');
      removeCookie('authToken'); // Remove expired token
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating JWT token:', error);
    return false;
  }
};

// Get user info from JWT token
export const getUserFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return {
      userId: payload.sub || payload.userId || payload.id,
      email: payload.email,
      role: payload.role,
      companyId: payload.companyId || payload.company_id,
      exp: payload.exp
    };
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};
