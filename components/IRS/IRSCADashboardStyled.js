import styled from 'styled-components';

export const TabContainer = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
`;

export const TabList = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.isActive 
    ? (props.isDarkMode ? '#ff840b' : '#ff840b')
    : (props.isDarkMode ? '#9ca3af' : '#64748b')};
  background: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.isActive 
    ? '#ff840b' 
    : 'transparent'};
  transition: all 0.2s ease;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: ${props => props.isDarkMode ? '#ff840b' : '#ff840b'};
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export const AssignmentModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  padding: 2rem;
  opacity: 1;
  transition: opacity 0.3s ease;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const AssignmentModalContent = styled.div`
  background: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
  position: relative;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
    background: ${props => props.isDarkMode 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(255, 255, 255, 0.8)'};

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
      display: flex;
      align-items: center;
      gap: 0.75rem;

      &::before {
        content: '';
        width: 4px;
        height: 20px;
        background: linear-gradient(135deg, #ff840b, #ff9f3f);
        border-radius: 2px;
      }
    }

    .close-button {
      background: none;
      border: none;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#64748b'};
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;

      &:hover {
        background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6'};
        color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
        transform: rotate(90deg);
      }
    }
  }

  .modal-body {
    flex: 1;
    overflow: auto;
    padding: 2rem;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: ${props => props.isDarkMode ? '#262626' : '#f3f4f6'};
    }

    &::-webkit-scrollbar-thumb {
      background: ${props => props.isDarkMode ? '#4b5563' : '#9ca3af'};
      border-radius: 4px;

      &:hover {
        background: ${props => props.isDarkMode ? '#6b7280' : '#6b7280'};
      }
    }
  }
`;

export const AssignmentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &::after {
        content: '*';
        color: #ef4444;
        font-size: 0.875rem;
        opacity: 0.8;
      }
    }

    input, select {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid ${props => props.isDarkMode ? '#4b5563' : '#e2e8f0'};
      background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white'};
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
      transition: all 0.2s;
      font-size: 0.875rem;

      &:hover {
        border-color: ${props => props.isDarkMode ? '#6b7280' : '#cbd5e0'};
      }

      &:focus {
        outline: none;
        border-color: #ff840b;
        box-shadow: 0 0 0 3px rgba(255, 132, 11, 0.2);
      }

      &::placeholder {
        color: ${props => props.isDarkMode ? '#9ca3af' : '#a0aec0'};
      }

      &:read-only {
        background: ${props => props.isDarkMode ? '#1f2937' : '#f9fafb'};
        color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
        cursor: not-allowed;
      }
    }

    select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.5rem;
      background-color: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};

      option {
        background-color: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
        color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
        padding: 0.5rem;
      }

      &:hover option {
        background-color: ${props => props.isDarkMode ? '#262626' : '#f3f4f6'};
      }
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .form-hint {
    font-size: 0.75rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    margin-top: 0.25rem;
  }
`;

export const AssignmentModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)'};
  border-top: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
  border-radius: 0 0 20px 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent,
      ${props => props.isDarkMode ? 'rgba(255, 132, 11, 0.2)' : 'rgba(255, 132, 11, 0.1)'},
      transparent
    );
  }

  button {
    min-width: 120px;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;

    &.cancel-btn {
      background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6'};
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#374151'};

      &:hover {
        background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#e5e7eb'};
      }
    }

    &.save-btn {
      background: linear-gradient(135deg, #ff840b, #ff9f3f);
      color: white;
      box-shadow: 0 4px 12px rgba(255, 132, 11, 0.2);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(255, 132, 11, 0.3);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: 0 4px 12px rgba(255, 132, 11, 0.2);
      }
    }
  }
`;

// Re-export all styled components from IRSTelecollectorStyled.js
export * from './IRSTelecollectorStyled'; 