import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Helper to create a JWT token with custom expiry
const createTestToken = (expiresInSeconds) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    sub: 'test-user',
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    iat: Math.floor(Date.now() / 1000)
  };

  // Note: This is a mock token for testing only
  const mockToken = btoa(JSON.stringify(header)) + '.' + 
                   btoa(JSON.stringify(payload)) + '.' +
                   'mock-signature';
  
  return mockToken;
};

// Test scenarios
export const testJWTExpiry = {
  // Test normal state (30 minutes)
  testNormalState: () => {
    const token = createTestToken(1800);
    Cookies.set('authToken', token);
    console.log('Set token with 30 minutes expiry');
  },

  // Test expiring state (4 minutes)
  testExpiringState: () => {
    const token = createTestToken(240);
    Cookies.set('authToken', token);
    console.log('Set token with 4 minutes expiry');
  },

  // Test expired state (expired 1 minute ago)
  testExpiredState: () => {
    const token = createTestToken(-60);
    Cookies.set('authToken', token);
    console.log('Set expired token');
  },

  // Clear test token
  clearToken: () => {
    Cookies.remove('authToken');
    console.log('Cleared auth token');
  },

  // Get current token info
  getTokenInfo: () => {
    const token = Cookies.get('authToken');
    if (!token) {
      console.log('No token found');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - now;

      console.log({
        expiresAt: new Date(decoded.exp * 1000).toLocaleString(),
        timeLeft: `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`,
        isExpiring: timeLeft <= 300 && timeLeft > 0,
        isExpired: timeLeft <= 0
      });
    } catch (e) {
      console.error('Invalid token:', e);
    }
  }
}; 