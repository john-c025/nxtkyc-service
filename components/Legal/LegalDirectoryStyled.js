import styled, { keyframes, css } from 'styled-components';

// New animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const glowPulse = keyframes`
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

export const ReportCard = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${props => props.isDarkMode 
    ? '0 4px 15px rgba(0, 0, 0, 0.3)' 
    : '0 4px 15px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(45deg, transparent 0%, rgba(255, 132, 11, 0.05) 100%)' 
      : 'linear-gradient(45deg, transparent 0%, rgba(249, 115, 22, 0.05) 100%)'};
    z-index: 0;
  }

  &:hover {
    transform: translateY(-5px);
    animation: ${glowPulse} 2s infinite;
    border-color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
  }

  .card-header {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .card-title {
    font-size: 1.25rem;
    color: ${props => props.isDarkMode ? '#fdba74' : '#374151'};
    font-weight: 600;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      transition: width 0.3s ease;
    }
  }

  &:hover .card-title::after {
    width: 100%;
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
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.variant === 'primary' && `
    background: linear-gradient(145deg, #f97316, #ea580c);
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: white;
    color: #374151;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.2), transparent 70%);
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

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
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

// export const keyframes = `
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(10px); }
//     to { opacity: 1; transform: translateY(0); }
//   }

//   @keyframes pulse {
//     0% { transform: scale(1); }
//     50% { transform: scale(1.05); }
//     100% { transform: scale(1); }
//   }
// `;

export const ReportsTable = styled.div`
  width: 100%;
  background: ${props => props.isDarkMode ? 'linear-gradient(to bottom, #1a1a1a, #262626)' : 'white'};

  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  th, td {
    white-space: normal;
    word-wrap: break-word;
    background: ${props => props.isDarkMode ? 'linear-gradient(to bottom, #1a1a1a, #262626)' : 'white'};
    color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
    padding: 1rem;
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
    font-size: 0.875rem;
    border-bottom: 1px solid ${props => props.isDarkMode ? 'rgba(75, 85, 99, 0.4)' : '#e5e7eb'};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background-color: ${props => props.isDarkMode ? 'rgba(17, 24, 39, 0.2)' : '#f9fafb'};
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
    display: inline-block;
  }

  .status-badge.pending-review {
    background-color: #FEF3C7;
    color: #92400E;
  }

  .status-badge.under-investigation {
    background-color: #DBEAFE;
    color: #1E40AF;
  }

  .status-badge.court-filing {
    background-color: #F3E8FF;
    color: #6B21A8;
  }

  .status-badge.hearing {
    background-color: #D1FAE5;
    color: #065F46;
  }

  .status-badge.resolved {
    background-color: #ECFDF5;
    color: #047857;
  }

  .priority-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
    display: inline-block;
  }

  .priority-badge.high {
    background-color: #FEE2E2;
    color: #991B1B;
  }

  .priority-badge.medium {
    background-color: #FEF3C7;
    color: #92400E;
  }

  .priority-badge.low {
    background-color: #D1FAE5;
    color: #065F46;
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
  background: ${props => props.isDarkMode ? '#1f2937' : 'white'};
  border-radius: 1rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.isDarkMode ? '#374151' : '#f1f1f1'};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.isDarkMode ? '#4b5563' : '#888'};
    border-radius: 10px;
    &:hover {
      background: ${props => props.isDarkMode ? '#6b7280' : '#555'};
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${props => props.isDarkMode ? '#f3f4f6' : '#111827'};
    }

    button {
      padding: 0.5rem;
      border-radius: 0.375rem;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
      transition: all 0.2s;

      &:hover {
        color: ${props => props.isDarkMode ? '#f3f4f6' : '#111827'};
        background: ${props => props.isDarkMode ? '#374151' : '#f3f4f6'};
      }
    }
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: ${props => props.isDarkMode ? '#d1d5db' : '#374151'};
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid ${props => props.isDarkMode ? '#374151' : '#d1d5db'};
      border-radius: 0.5rem;
      font-size: 0.875rem;
      color: ${props => props.isDarkMode ? '#f3f4f6' : '#111827'};
      background-color: ${props => props.isDarkMode ? '#1f2937' : 'white'};
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: #f97316;
        box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
      }

      &::placeholder {
        color: ${props => props.isDarkMode ? '#6b7280' : '#9ca3af'};
      }
    }

    textarea {
      min-height: 100px;
      resize: vertical;
    }
  }

  .file-upload-area {
    border: 2px dashed ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};
    border-radius: 0.5rem;
    padding: 2rem;
    text-align: center;
    transition: all 0.2s;

    &:hover {
      border-color: #f97316;
      background: ${props => props.isDarkMode ? '#374151' : '#fff7ed'};
    }

    input[type="file"] {
      display: none;
    }

    .file-hint {
      color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};
  }

  /* Case Details Specific Styles */
  .case-details {
    .detail-section {
      margin-bottom: 2rem;

      h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: ${props => props.isDarkMode ? '#f3f4f6' : '#111827'};
        margin-bottom: 1rem;
      }
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .detail-item {
      label {
        display: block;
        font-size: 0.75rem;
        font-weight: 500;
        color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 0.875rem;
        color: ${props => props.isDarkMode ? '#f3f4f6' : '#111827'};
        font-weight: 500;
      }
    }

    .timeline {
      border-left: 2px solid ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};
      padding-left: 1.5rem;
      margin-left: 0.5rem;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 1.5rem;

      &::before {
        content: '';
        position: absolute;
        left: -1.75rem;
        top: 0.25rem;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: #f97316;
        border: 2px solid ${props => props.isDarkMode ? '#1f2937' : 'white'};
      }
    }

    .timeline-date {
      font-size: 0.75rem;
      font-weight: 500;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
      margin-bottom: 0.25rem;
    }

    .timeline-content {
      background: ${props => props.isDarkMode ? '#374151' : '#f9fafb'};
      border-radius: 0.5rem;
      padding: 1rem;

      h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: ${props => props.isDarkMode ? '#f3f4f6' : '#111827'};
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 0.875rem;
        color: ${props => props.isDarkMode ? '#d1d5db' : '#4b5563'};
      }
    }

    .attachments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }

    .attachment-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: ${props => props.isDarkMode ? '#374151' : '#f9fafb'};
      border-radius: 0.5rem;
      border: 1px solid ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
      transition: all 0.2s;

      &:hover {
        border-color: #f97316;
        background: ${props => props.isDarkMode ? '#4b5563' : '#fff7ed'};
      }

      .attachment-icon {
        width: 1.5rem;
        height: 1.5rem;
        color: #f97316;
      }

      span {
        font-size: 0.875rem;
        color: ${props => props.isDarkMode ? '#f3f4f6' : '#374151'};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
  border: 3px solid ${props => props.isDarkMode ? '#374151' : 'rgba(249, 115, 22, 0.1)'};
  border-top: 3px solid ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 15px ${props => props.isDarkMode 
    ? 'rgba(253, 186, 116, 0.2)' 
    : 'rgba(249, 115, 22, 0.2)'};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1.5rem;

  button {
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(145deg, #374151, #1F2937)' 
      : 'linear-gradient(145deg, #f97316, #ea580c)'};
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;

    &:not(:disabled):hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${props => props.isDarkMode 
        ? 'rgba(55, 65, 81, 0.3)' 
        : 'rgba(249, 115, 22, 0.25)'};
    }

    &:disabled {
      background: ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
      cursor: not-allowed;
      opacity: 0.7;
    }

    svg {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }

    &:hover svg {
      transform: translateX(-3px);
    }

    &:last-child:hover svg {
      transform: translateX(3px);
    }
  }

  span {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
    font-weight: 500;
  }
`;

export const SearchInput = styled.input`
  width: 250px;
  padding: 0.625rem 1rem;
  border: 2px solid ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
  border-radius: 0.5rem;
  background-color: ${props => props.isDarkMode ? '#1F2937' : 'white'};
  color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    box-shadow: 0 0 0 3px ${props => props.isDarkMode 
      ? 'rgba(253, 186, 116, 0.1)' 
      : 'rgba(249, 115, 22, 0.1)'};
    width: 300px;
  }

  &::placeholder {
    color: ${props => props.isDarkMode ? '#6b7280' : '#9ca3af'};
  }
`;
