'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import Cookies from 'js-cookie';
import { 
  LoginContainer,
  LoginCard,
  LogoSection,
  FormSection,
  InputGroup,
  Input,
  Button,
  ErrorMessage,
  LoadingSpinner,
  SuccessModal,
  ModalOverlay,
  ModalContent,
  SuccessIcon,
  AnimatedBackground,
  FloatingParticles,
  Particle,
  FeatureBadge,
  LoginHeader,
  LoginSubtext,
  InputWrapper,
  InputIcon,
  PasswordToggle,
  RememberMe,
  ForgotPassword,
  LoginFooter,
  DevModeToggle,
  DevModeLabel,
  DevModeSwitch,
  DevModeIndicator
} from '../../components/Login/LoginPageStyled';



export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [particles, setParticles] = useState([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [devMode, setDevMode] = useState(false);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.4 + 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y > window.innerHeight ? -20 : particle.y + particle.speed,
        x: particle.x + Math.sin(particle.y * 0.005) * 0.5,
        rotation: particle.rotation + particle.rotationSpeed
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    // Dev mode bypass
    if (devMode && username.toLowerCase() === 'test' && password.toLowerCase() === 'test') {
      console.log('Dev mode login successful with test credentials');
      
      // Create a mock token for dev mode
      const mockToken = 'dev-mode-token-' + Date.now();
      const expirationDays = rememberMe ? 30 : 7;
      Cookies.set('authToken', mockToken, { expires: expirationDays });
      
      // Show success modal
      setShowSuccess(true);
      setIsRedirecting(true);
      
      // Redirect after success animation
      setTimeout(() => {
        router.push('/kyc');
      }, 2000);
      
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
          username,
          password,
        });

      console.log('Login successful:', response.data);
      
      // Set cookie with appropriate expiration
      const expirationDays = rememberMe ? 30 : 7;
      Cookies.set('authToken', response.data.token, { expires: expirationDays });
      
      // Show success modal
        setShowSuccess(true);
      setIsRedirecting(true);
      
      // Redirect after success animation
        setTimeout(() => {
        router.push('/kyc');
        }, 2000);
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else if (error.response?.status === 404) {
        setError('User not found');
      } else if (error.response?.status === 403) {
        setError('Account is locked. Please contact administrator');
      } else if (error.response?.status === 429) {
        setError('Too many login attempts. Please try again later');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <AnimatedBackground />
      <FloatingParticles>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              transform: `rotate(${particle.rotation}deg)`,
              animationDelay: `${particle.id * 0.1}s`
            }}
          />
        ))}
      </FloatingParticles>

      <LoginCard>
        <LogoSection>
          <div className="logo">
            <h1>NXT KYC</h1>
            <p>Know Your Customer System</p>
            {/* <FeatureBadge>
              <span>🔒</span>
              <span>Secure Authentication</span>
            </FeatureBadge> */}
              </div>
        </LogoSection>

        <FormSection>
          <form onSubmit={handleLogin}>
            <LoginHeader>
              <h2>Welcome Back</h2>
              <LoginSubtext>Sign in to access your KYC dashboard</LoginSubtext>
            </LoginHeader>

            <InputGroup delay="0.9s">
              <InputWrapper>
                <InputIcon>👤</InputIcon>
                    <Input
                  type="text"
                  placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup delay="1.1s">
              <InputWrapper>
                <InputIcon>🔐</InputIcon>
                    <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </PasswordToggle>
              </InputWrapper>
            </InputGroup>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1.5rem',
              animation: 'fadeIn 0.6s ease-out 1.3s both'
            }}>
              <RememberMe>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="remember">Remember me</label>
              </RememberMe>
              <ForgotPassword href="#">Forgot password?</ForgotPassword>
                  </div>
                  
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button 
              type="submit"
              disabled={loading || isRedirecting}
              style={{ animation: 'fadeIn 0.6s ease-out 1.5s both' }}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Signing In...
                </>
              ) : isRedirecting ? (
                <>
                  <LoadingSpinner />
                  Redirecting...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <LoginFooter style={{ animation: 'fadeIn 0.6s ease-out 1.7s both' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  <span>💼</span>
                  <span>Developed by NextApp Solutions Corporation</span>
          </div>
        </div>
            </LoginFooter>
          </form>
        </FormSection>
      </LoginCard>

      {/* Dev Mode Toggle */}
      <DevModeToggle>
        <DevModeLabel htmlFor="devModeSwitch">
          Dev Mode
        </DevModeLabel>
        <DevModeSwitch
          id="devModeSwitch"
          type="checkbox"
          checked={devMode}
          onChange={(e) => setDevMode(e.target.checked)}
        />
        <DevModeIndicator isActive={devMode}>
          {devMode ? 'ON' : 'OFF'}
        </DevModeIndicator>
        {devMode && (
          <div style={{
            fontSize: '0.625rem',
            color: '#6b7280',
            textAlign: 'center',
            marginTop: '0.5rem',
            lineHeight: '1.2',
            maxWidth: '60px'
          }}>
            Use: test/test
          </div>
        )}
      </DevModeToggle>

      {/* Success Modal */}
      {showSuccess && (
        <ModalOverlay>
          <SuccessModal>
            <SuccessIcon>✅</SuccessIcon>
            <h3>Login Successful!</h3>
            <p>{devMode ? 'Welcome to NXT KYC System (Dev Mode)' : 'Welcome to NXT KYC System'}</p>
            <div style={{ marginTop: '1rem' }}>
              <LoadingSpinner />
              <span style={{ marginLeft: '0.5rem' }}>Redirecting to dashboard...</span>
    </div>
          </SuccessModal>
        </ModalOverlay>
      )}
    </LoginContainer>
  );
}