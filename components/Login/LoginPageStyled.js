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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

// Login Card
export const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.6s ease-out;
`;

// Logo Section
export const LogoSection = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  padding: 40px 30px;
  text-align: center;
  color: white;

  .logo {
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: -0.025em;
    }

    p {
      font-size: 1rem;
      margin: 0;
      opacity: 0.9;
      font-weight: 400;
    }
  }
`;

// Form Section
export const FormSection = styled.div`
  padding: 40px 30px;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }

  p {
    color: #6b7280;
    margin: 0 0 32px 0;
    font-size: 0.875rem;
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
`;

// Input Field
export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fafafa;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    background: white;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

// Button
export const Button = styled.button`
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
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

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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
