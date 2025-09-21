import styled from 'styled-components';

export const ReportCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;  

export const ReportCard = styled.div`
  height: 240px;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, rgba(38, 38, 38, 0.9), rgba(26, 26, 26, 0.8))' 
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 250, 0.8))'};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${props => props.isDarkMode 
    ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
    : '0 4px 20px rgba(0, 0, 0, 0.1)'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
  backdrop-filter: blur(10px);
  animation: fadeIn 0.6s ease-out forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: ${props => props.isDarkMode 
      ? '0 8px 25px rgba(252, 211, 77, 0.2)' 
      : '0 8px 25px rgba(245, 158, 11, 0.2)'};
    border-color: ${props => props.isDarkMode ? '#fcd34d' : '#f59e0b'};

    &:before {
      opacity: 1;
    }

    .card-title {
      background: ${props => props.isDarkMode 
        ? 'linear-gradient(to right, #fdba74, #f97316)' 
        : 'linear-gradient(to right, #f97316, #ea580c)'};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, #f97316, #fdba74);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
  }

  .card-title {
    font-size: 1.5rem;
    color: ${props => props.isDarkMode ? '#fdba74' : '#374151'};
    font-weight: 500;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }

  .card-menu {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }

  .card-date {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }

  .background-icon {
    position: absolute;
    bottom: -20px;
    right: -20px;
    font-size: 8rem;
    color: ${props => props.isDarkMode 
      ? 'rgba(253, 186, 116, 0.05)' 
      : 'rgba(55, 65, 81, 0.05)'};
    transform: rotate(-15deg);
    z-index: 1;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover .background-icon {
    transform: rotate(0deg) scale(1.2);
    color: ${props => props.isDarkMode 
      ? 'rgba(253, 186, 116, 0.12)' 
      : 'rgba(55, 65, 81, 0.12)'};
  }

  .content {
    position: relative;
    z-index: 1;
  }

  .card-description {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    margin-top: 1rem;
    opacity: 0.8;
  }

  .status-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
  }
`;

export const ReportCardIcon = styled.div`
  font-size: 2rem; // Adjust size as needed
  margin-bottom: 0.5rem;
  color: ${props => props.isDarkMode ? '#fdba74' : '#374151'};
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

export const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.isDarkMode ? '#f3f4f6' : '#4b5563'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
    background: ${props => props.isDarkMode ? '#333333' : '#f3f4f6'};
  }

  svg {
    color: ${props => props.isDarkMode ? '#f3f4f6' : 'currentColor'};
  }
`;
export const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;

  ${props => props.variant === 'primary' && `
    background-color: #f97316;
    color: white;
    &:hover {
      background-color: #ea580c;
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
    background-color: ${props => props.isDarkMode ? 'rgba(17, 24, 39, 0.2)' : '#f9fafb'};
  }
`;

export const NewReportButton = styled.div`
  border: 2px dashed ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDarkMode 
    ? 'rgba(31, 41, 55, 0.4)' 
    : 'rgba(255, 255, 255, 0.8)'};
  height: 240px;

  &:hover {
    border-color: #f97316;
    background: ${props => props.isDarkMode 
      ? 'rgba(75, 85, 99, 0.4)' 
      : 'rgba(249, 115, 22, 0.05)'};
    transform: translateY(-5px);
  }

  .plus-icon {
    color: #f97316;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    transition: transform 0.3s ease;
  }

  &:hover .plus-icon {
    transform: rotate(90deg);
  }

  .text {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    font-size: 1rem;
    font-weight: 500;
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

export const SectionTitle = styled.h2`
  font-size: 1.75rem;
  color: ${props => props.isDarkMode ? '#e5e7eb' : '#111827'};
  font-weight: 600;
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: #f97316;
    border-radius: 2px;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  min-height: 100vh;
  padding: 2rem 2.5rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(to bottom right, #1a1a1a, #262626)' 
    : 'linear-gradient(to bottom right, #FFFAF6, #FFF7F0)'};
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, 
      transparent, 
      ${props => props.isDarkMode ? 'rgba(253, 186, 116, 0.1)' : 'rgba(249, 115, 22, 0.1)'}, 
      transparent
    );
  }

  @media (max-width: 1280px) {
    margin-left: ${props => props.isSidebarOpen ? '250px' : '0'};
    padding: 2rem;
  }

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 1.5rem;
  }

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #f8f9fa)'};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: slideIn 0.6s ease-out forwards;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.isDarkMode 
      ? '0 8px 25px rgba(253, 186, 116, 0.1)' 
      : '0 8px 25px rgba(249, 115, 22, 0.1)'};
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(249, 115, 22, 0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  &:hover:before {
    transform: translateX(100%);
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .stat-value {
    font-size: 1.75rem;
    font-weight: 600;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(to right, #fdba74, #f97316)' 
      : 'linear-gradient(to right, #f97316, #ea580c)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease;
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    margin-top: 0.75rem;
    font-weight: 500;
    
    &.positive {
      color: #22c55e;
      svg {
        animation: bounce 1s infinite;
      }
    }
    
    &.negative {
      color: #ef4444;
      svg {
        animation: bounce 1s infinite;
      }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }
  }
`;

export const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;
