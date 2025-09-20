import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.isDarkMode 
    ? 'rgba(0, 0, 0, 0.7)' 
    : 'rgba(0, 0, 0, 0.5)'};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px ${props => props.isDarkMode 
    ? 'rgba(249, 115, 22, 0.15)' 
    : 'rgba(249, 115, 22, 0.08)'};
  max-width: 500px;
  width: 90%;
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2, h3 {
    color: ${props => props.isDarkMode ? '#fdba74' : '#111827'};
  }

  label {
    color: ${props => props.isDarkMode ? '#fed7aa' : '#374151'};
  }

  select {
    background: ${props => props.isDarkMode ? '#333333' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#fdba74' : '#111827'};
    border: 1px solid ${props => props.isDarkMode ? '#444444' : '#cccccc'};
    border-radius: 4px;
    padding: 0.5rem;
    margin-top: 0.5rem;
  }
`;

export const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  div {
    flex: 1 1 45%; // Adjusts the width of each column
  }
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  margin-top: 1rem;

  &.primary {
    background: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
    color: white;
    &:hover {
      background: ${props => props.isDarkMode ? '#ea580c' : '#ea580c'};
    }
  }

  &.secondary {
    background: ${props => props.isDarkMode 
      ? 'rgba(51, 51, 51, 0.8)' 
      : 'rgba(243, 244, 246, 0.8)'};
    color: ${props => props.isDarkMode ? '#fed7aa' : '#4b5563'};
    &:hover {
      background: ${props => props.isDarkMode 
        ? 'rgba(51, 51, 51, 1)' 
        : 'rgba(243, 244, 246, 1)'};
    }
  }
`;
