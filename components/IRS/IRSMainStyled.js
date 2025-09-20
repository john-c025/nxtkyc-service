import styled, { keyframes } from 'styled-components';

// Add a keyframe for hover animations
const hoverGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(249, 115, 22, 0.2); }
  50% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.4); }
  100% { box-shadow: 0 0 5px rgba(249, 115, 22, 0.2); }
`;

export const ReportCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;


export const SearchInput = styled.input`
  width: 200px;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
  border-radius: 0.375rem;
  background-color: ${props => props.isDarkMode ? '#1F2937' : 'white'};
  color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
  font-size: 0.875rem;
  margin-right: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.isDarkMode ? '#9ca3af' : '#f97316'};
    box-shadow: 0 0 5px ${props => props.isDarkMode ? '#9ca3af' : '#f97316'};
  }
`;


export const ReportCard = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    animation: ${hoverGlow} 1.5s infinite;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .card-title {
    font-size: 1.1rem;
    color: ${props => props.isDarkMode ? '#fdba74' : '#374151'};
    font-weight: 500;
  }

  .card-menu {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }

  .card-date {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }
`;

export const ReportsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;

  .left-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .right-section {
    display: flex;
    gap: 0.75rem;
  }
`;

export const ReportTypeSelect = styled.select`
  padding: 0.5rem 2rem 0.5rem 1rem;
  border: 1px solid ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
  border-radius: 0.375rem;
  background-color: ${props => props.isDarkMode ? 'rgba(31, 41, 55, 0.4)' : 'white'};
  color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
  font-size: 0.875rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1000;

  ${props => props.variant === 'primary' && `
    background-color: #f97316;
    color: white;
    &:hover {
      background-color: #ea580c;
      transform: translateY(-2px);
    }
  `}

  ${props => props.variant === 'secondary' && `
    background-color: ${props.isDarkMode ? 'rgba(31, 41, 55, 0.4)' : 'white'};
    color: #6b7280;
    border: 1px solid #e5e7eb;
    &:hover {
      background-color: ${props.isDarkMode ? 'rgba(31, 41, 55, 0.6)' : '#f3f4f6'};
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(249, 115, 22, 0.2), transparent 70%);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s ease;
  }

  &:hover::before {
    transform: translate(-50%, -50%) scale(2);
  }
`;

export const ReportsTableContainer = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background: ${props => props.isDarkMode ? '#1F2937' : 'white'};
  margin: 0;
  padding: 0;

  /* Scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
  }

  .pagination-controls button {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background-color: #f97316;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .pagination-controls button:disabled {
    background-color: #e5e7eb;
    cursor: not-allowed;
  }

  .pagination-controls span {
    font-size: 0.875rem;
    color: #374151;
  }
`;

export const ReportsTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background: ${props => props.isDarkMode ? 'linear-gradient(to bottom, #1a1a1a, #262626)' : 'white'};
  transition: background-color 0.3s ease;

  th, td {
    min-width: 150px;
    white-space: normal;
    word-wrap: break-word;
    background: ${props => props.isDarkMode ? 'linear-gradient(to bottom, #1a1a1a, #262626)' : 'white'};
    color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
  }

  th {
    background: ${props => props.isDarkMode ? '#333333' : '#374151'};
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    color: ${props => props.isDarkMode ? '#fdba74' : '#ffffff'};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  td {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    border-bottom: 1px solid ${props => props.isDarkMode ? 'rgba(75, 85, 99, 0.4)' : '#e5e7eb'};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background-color: ${props => props.isDarkMode ? 'rgba(17, 24, 39, 0.3)' : '#f3f4f6'};
  }
`;

export const NewReportButton = styled.div`
  border: 2px dashed ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isDarkMode ? 'rgba(31, 41, 55, 0.4)' : 'white'};

  &:hover {
    border-color: #f97316;
    background: ${props => props.isDarkMode ? 'rgba(75, 85, 99, 0.4)' : '#fff8f3'};
  }

  .plus-icon {
    color: #f97316;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .text {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    font-size: 0.875rem;
  }
`;

export const UploadModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const UploadModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.25rem;
      font-weight: 500;
      color: #111827;
    }

    button {
      padding: 0.25rem;
      color: #6B7280;
      &:hover {
        color: #111827;
      }
    }
  }

  .upload-area {
    border: 2px dashed #E5E7EB;
    border-radius: 6px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #D1D5DB;
      background: #F9FAFB;
    }

    .upload-icon {
      width: 40px;
      height: 40px;
      margin: 0 auto 1rem;
      color: #9CA3AF;
    }

    .upload-text {
      margin-bottom: 0.5rem;
      color: #111827;
    }

    .upload-hint {
      color: #6B7280;
      font-size: 0.875rem;
    }

    .click-upload {
      color: #2563EB;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .import-options {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #E5E7EB;
    color: #6B7280;
    font-size: 0.875rem;

    .import-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #F9FAFB;
      }

      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #E5E7EB;

    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;

      &.cancel {
        color: #6B7280;
        background: white;
        border: 1px solid #E5E7EB;
        &:hover {
          background: #F9FAFB;
        }
      }

      &.upload {
        color: white;
        background: #2563EB;
        &:hover {
          background: #1D4ED8;
        }
      }
    }
  }
`;

export const SpinnerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Spinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ff840b;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;

  button {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background-color: ${props => props.isDarkMode ? '#374151' : '#f97316'};
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:disabled {
    background-color: ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
    cursor: not-allowed;
  }

  span {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
  }
`;
