import styled from 'styled-components';

export const TableModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  padding: 2rem;
`;

export const TableModalContent = styled.div`
  background: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
  border-radius: 16px;
  width: 95%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
`;

export const ModalForm = styled.form`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  background: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  font-size: 0.875rem;

  ${props => props.variant === 'primary' && `
    background: linear-gradient(145deg, #ff840b, #ff9f3f);
    color: white;
    border: none;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 132, 11, 0.2);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: ${props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6'};
    color: ${props.isDarkMode ? '#e2e8f0' : '#1a202c'};
    border: 1px solid ${props.isDarkMode ? '#333' : '#e2e8f0'};

    &:hover {
      background: ${props.isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#e5e7eb'};
    }
  `}
`;

export const AddRecordContainer = styled.div`
  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

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

      &.required::after {
        content: '*';
        color: #ef4444;
        font-size: 0.875rem;
      }
    }

    input {
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
        color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
      }
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
    background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)'};

    h3 {
      font-size: 1.25rem;
      font-weight: 500;
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
      display: flex;
      align-items: center;
      gap: 0.75rem;

      &::before {
        content: '';
        width: 4px;
        height: 24px;
        background: linear-gradient(to bottom, #ff840b, #ff9f3f);
        border-radius: 4px;
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

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)'};
    border-top: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
  }
`; 