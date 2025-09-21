import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


// Additional animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;


const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;


const slideInLeft = keyframes`
  from { transform: translateX(-100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(245, 158, 11, 0.3); }
  50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.6), 0 0 30px rgba(245, 158, 11, 0.4); }
`;

const wiggle = keyframes`
  0%, 7%, 14%, 21%, 28%, 35%, 42%, 50% { transform: rotate(0deg); }
  3.5%, 10.5%, 17.5%, 24.5%, 31.5%, 38.5%, 45.5% { transform: rotate(1deg); }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  0%, 50% { border-color: transparent; }
  51%, 100% { border-color: #f59e0b; }
`;


const heartbeat = keyframes`
  0% { transform: scale(1); }
  14% { transform: scale(1.1); }
  28% { transform: scale(1); }
  42% { transform: scale(1.1); }
  70% { transform: scale(1); }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Main Container
export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 8s ease infinite;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;



// Login Card
export const LoginCard = styled.div`
  background: linear-gradient(145deg, #fefdf8, #fef3c7);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(245, 158, 11, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(252, 211, 77, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 25px 50px rgba(245, 158, 11, 0.15);
  }
`;

// Logo Section
export const LogoSection = styled.div`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  padding: 40px 30px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;

  .logo {
    position: relative;
    z-index: 1;
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: -0.025em;
      animation: ${slideInLeft} 0.8s ease-out;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    p {
      font-size: 1rem;
      margin: 0;
      opacity: 0.9;
      font-weight: 400;
      animation: ${slideInRight} 0.8s ease-out 0.2s both;
    }
  }
`;

// Form Section
export const FormSection = styled.div`
  padding: 40px 30px;
  animation: ${fadeIn} 0.6s ease-out 0.3s both;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
    animation: ${slideInLeft} 0.6s ease-out 0.5s both;
  }

  p {
    color: #6b7280;
    margin: 0 0 32px 0;
    font-size: 0.875rem;
    animation: ${slideInRight} 0.6s ease-out 0.7s both;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
`;

// Input Group
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: ${fadeIn} 1s ease-out ${props => props.delay || '1s'} both;
`;

// Input Field
export const Input = styled.input`
  width: 100%;
  padding: 12px 16px 12px 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fafafa;
  position: relative;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    background: white;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    transform: scale(1.01);
  }

  &:hover:not(:focus) {
    border-color: #9ca3af;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &::placeholder {
    color: #9ca3af;
    transition: opacity 0.2s ease;
  }

  &:focus::placeholder {
    opacity: 0.5;
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    transform: none;
  }
`;

// Button
export const Button = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
    background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
    
    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    
    &::before {
      display: none;
    }
  }
`;

// Error Message
export const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
  
  &::before {
    content: '⚠️';
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
  }
`;

// Loading Spinner
export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Success Modal Components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const SuccessModal = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${pulse} 0.6s ease-out;
  max-width: 400px;
  width: 90%;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: #6b7280;
    margin: 0 0 1rem 0;
  }
`;

export const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: ${pulse} 1s ease-in-out infinite;
`;

// Animated Background
export const AnimatedBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%);
  z-index: -2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    animation: ${rotate} 20s linear infinite;
  }
`;

// Floating Particles
export const FloatingParticles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
`;

export const Particle = styled.div`
  position: absolute;
  background: rgba(252, 211, 77, 0.6);
  border-radius: 50%;
  animation: ${float} 6s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(252, 211, 77, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, transparent, rgba(252, 211, 77, 0.2), transparent);
    border-radius: 50%;
    animation: ${rotate} 4s linear infinite;
  }
`;

// Enhanced UI Components
export const FeatureBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
`;

export const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }
`;

export const LoginSubtext = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  font-size: 1.125rem;
  color: #9ca3af;
  z-index: 1;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  color: #9ca3af;
  z-index: 1;
  transition: all 0.3s ease;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
    transform: scale(1.2);
  }
  
  &:active {
    transform: scale(0.9);
  }
`;

export const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #f59e0b;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
    }
    
    &:checked {
      animation: ${bounce} 0.6s ease;
    }
  }
  
  label {
    font-size: 0.875rem;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.3s ease;
    
    &:hover {
      color: #f59e0b;
    }
  }
`;

export const ForgotPassword = styled.a`
  color: #f59e0b;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: #d97706;
    text-decoration: underline;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const LoginFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  width: 100%;
`;

// Dev Mode Toggle Components
export const DevModeToggle = styled.div`
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(245, 158, 11, 0.1);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(245, 158, 11, 0.2);
  box-shadow: 0 8px 32px rgba(245, 158, 11, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(245, 158, 11, 0.15);
    box-shadow: 0 12px 40px rgba(245, 158, 11, 0.2);
  }
`;

export const DevModeLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: #f59e0b;
  text-align: center;
  cursor: pointer;
  user-select: none;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

export const DevModeSwitch = styled.input`
  appearance: none;
  width: 50px;
  height: 24px;
  background: ${props => props.checked ? '#f59e0b' : '#d1d5db'};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${props => props.checked ? '28px' : '2px'};
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &:hover {
    background: ${props => props.checked ? '#d97706' : '#9ca3af'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
  }
`;

export const DevModeIndicator = styled.div`
  font-size: 0.625rem;
  color: ${props => props.isActive ? '#15803d' : '#6b7280'};
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
`;

