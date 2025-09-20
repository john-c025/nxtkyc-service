import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${props => props.isDarkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.5)'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  animation: ${fadeIn} 0.3s ease-out;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#e5e7eb' : '#1f2937'};
  border-radius: 16px;
  padding: 1.5rem 2rem;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  animation: ${slideInUp} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: ${props => props.isDarkMode ? '#ff840b' : '#111827'};
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  cursor: pointer;
  color: ${props => props.isDarkMode ? '#94a3b8' : '#6b7280'};
  transition: color 0.2s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;

  &:hover {
    color: ${props => props.isDarkMode ? '#ff840b' : '#000000'};
    transform: rotate(90deg);
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

export const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

export const ProfilePicContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
`;

export const ProfilePic = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background-color: ${props => props.isDarkMode ? '#333333' : '#f3f4f6'};
  margin-bottom: 0.5rem;
  transition: transform 0.3s ease, border-color 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    transform: scale(1.02);
    border-color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  }
`;

export const UploadButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  color: white;
  border: 3px solid ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isDarkMode ? '#ea580c' : '#ea580c'};
    transform: scale(1.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
`;

export const SaveButton = styled.button`
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  border: none;
  background-color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background-color: ${props => props.isDarkMode ? '#ea580c' : '#ea580c'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  padding: 0.6rem 1.25rem;
  border-radius: 10px;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#d1d5db'};
  background-color: transparent;
  color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.isDarkMode ? 'rgba(255, 132, 11, 0.1)' : '#f3f4f6'};
    border-color: ${props => props.isDarkMode ? '#ff840b' : '#9ca3af'};
    transform: translateY(-2px);
  }
`; 