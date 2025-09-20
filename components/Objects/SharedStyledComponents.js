import styled from 'styled-components';

// Universal form control styles
const getFormControlStyles = (isDarkMode) => `
  background-color: ${isDarkMode ? '#374151' : 'white'};
  color: ${isDarkMode ? 'white' : '#111827'};
  border: 1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'};
  
  &:focus {
    outline: none;
    border-color: #ff840b;
    box-shadow: 0 0 0 3px rgba(255, 132, 11, 0.2);
  }
  
  &:hover {
    border-color: ${isDarkMode ? '#6b7280' : '#9ca3af'};
  }
`;

// Universal Select/Dropdown Component
export const UniversalSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
  
  ${props => getFormControlStyles(props.isDarkMode)}
  
  /* Custom dropdown arrow */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  
  /* Option styling for dark mode */
  option {
    background-color: ${props => props.isDarkMode ? '#374151' : 'white'};
    color: ${props => props.isDarkMode ? 'white' : '#111827'};
    padding: 0.5rem;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Universal Input Component
export const UniversalInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  ${props => getFormControlStyles(props.isDarkMode)}
  
  &::placeholder {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Universal Textarea Component
export const UniversalTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 80px;
  
  ${props => getFormControlStyles(props.isDarkMode)}
  
  &::placeholder {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Universal Search Input Component
export const UniversalSearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  ${props => getFormControlStyles(props.isDarkMode)}
  
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: 0.75rem center;
  background-size: 1.25rem;
  
  &::placeholder {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Universal Button Components
export const UniversalButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 132, 11, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Primary Button */
  ${props => props.variant === 'primary' && `
    background-color: #ff840b;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #ea580c;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  /* Secondary Button */
  ${props => props.variant === 'secondary' && `
    background-color: ${props.isDarkMode ? '#374151' : '#f3f4f6'};
    color: ${props.isDarkMode ? '#e5e7eb' : '#374151'};
    border: 1px solid ${props.isDarkMode ? '#4b5563' : '#d1d5db'};
    
    &:hover:not(:disabled) {
      background-color: ${props.isDarkMode ? '#4b5563' : '#e5e7eb'};
    }
  `}
  
  /* Danger Button */
  ${props => props.variant === 'danger' && `
    background-color: #dc2626;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #b91c1c;
    }
  `}
  
  /* Success Button */
  ${props => props.variant === 'success' && `
    background-color: #059669;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #047857;
    }
  `}
  
  /* Warning Button */
  ${props => props.variant === 'warning' && `
    background-color: #d97706;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #b45309;
    }
  `}
`;

// Universal Card Component
export const UniversalCard = styled.div`
  background-color: ${props => props.isDarkMode ? '#1f2937' : 'white'};
  border: 1px solid ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: ${props => props.isDarkMode 
    ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' 
    : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'};
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${props => props.isDarkMode 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.4)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
  }
`;

// Universal Modal Components
export const UniversalModalOverlay = styled.div`
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

export const UniversalModalContent = styled.div`
  background-color: ${props => props.isDarkMode ? '#1f2937' : 'white'};
  border: 1px solid ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};
  border-radius: 1rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${props => props.isDarkMode 
    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
    : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'};
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from { 
      opacity: 0; 
      transform: translateY(-10px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
`;

// Universal Status Badge Component
export const UniversalStatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  /* Success Status */
  ${props => props.variant === 'success' && `
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
  `}
  
  /* Warning Status */
  ${props => props.variant === 'warning' && `
    background-color: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.2);
  `}
  
  /* Danger Status */
  ${props => props.variant === 'danger' && `
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
  `}
  
  /* Info Status */
  ${props => props.variant === 'info' && `
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.2);
  `}
  
  /* Assigned Status */
  ${props => props.variant === 'assigned' && `
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
  `}
  
  /* Unassigned Status */
  ${props => props.variant === 'unassigned' && `
    background-color: rgba(156, 163, 175, 0.1);
    color: #6b7280;
    border: 1px solid rgba(156, 163, 175, 0.2);
  `}
`;

// Universal Form Group Component
export const UniversalFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: ${props => props.spacing || '1rem'};
`;

// Universal Label Component
export const UniversalLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
  margin-bottom: 0.5rem;
  
  /* Required indicator */
  ${props => props.required && `
    &::after {
      content: ' *';
      color: #ef4444;
    }
  `}
`;

// Universal Error Message Component
export const UniversalErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  animation: fadeIn 0.3s ease;
  
  svg {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
  }
`;

// Universal Table Components
export const UniversalTable = styled.div`
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th {
      background-color: ${props => props.isDarkMode ? '#374151' : '#f9fafb'};
      color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
    }
    
    td {
      padding: 1rem;
      border-bottom: 1px solid ${props => props.isDarkMode ? '#374151' : '#f3f4f6'};
      color: ${props => props.isDarkMode ? '#d1d5db' : '#6b7280'};
      font-size: 0.875rem;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    tr {
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: ${props => props.isDarkMode ? '#374151' : '#f9fafb'};
      }
      
      &:last-child td {
        border-bottom: none;
      }
    }
  }
`;

// Universal Pagination Component
export const UniversalPagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 0.75rem;
  border: 1px solid ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};

  .pagination-info {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  .pagination-buttons {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      background-color: #ff840b;
      color: white;

      &:hover:not(:disabled) {
        background-color: #ea580c;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: ${props => props.isDarkMode ? '#374151' : '#f3f4f6'};
        color: ${props => props.isDarkMode ? '#6b7280' : '#9ca3af'};
        transform: none;
      }

      svg {
        width: 1rem;
        height: 1rem;
      }
    }

    .page-info {
      padding: 0.5rem 1rem;
      background-color: ${props => props.isDarkMode ? '#374151' : '#f3f4f6'};
      color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }
`; 