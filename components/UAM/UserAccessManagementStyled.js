import styled from 'styled-components';

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

export const Card = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #f8fafc)'};
  border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#e2e8f0'};
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  h3 {
    color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  span {
    color: ${props => props.isDarkMode ? '#fed7aa' : '#111827'};
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    padding: 1rem;

    h3 {
      font-size: 1.1rem;
    }

    .table-responsive {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 0 -1rem;
      padding: 0 1rem;

      table {
        width: 100%;
        min-width: 600px;
      }

      td, th {
        white-space: nowrap;
        padding: 0.75rem 0.5rem;
        font-size: 0.875rem;
      }

      .badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
      }
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      button {
        width: 100%;
        padding: 0.5rem;
        font-size: 0.875rem;
        white-space: nowrap;
      }
    }
  }
`;
export const ReportCard = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
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
  gap: 1rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;

  .left-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
  }

  button {
    position: relative;
    z-index: 3;
    pointer-events: auto;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    
    .left-section,
    .right-section {
      width: 100%;
      justify-content: flex-start;
    }
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
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props => props.variant === 'primary' && `
    background: linear-gradient(145deg, #f97316, #ea580c);
    color: white;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: ${props.isDarkMode ? '#333333' : '#f1f5f9'};
    color: ${props.isDarkMode ? '#e2e8f0' : '#475569'};
    &:hover {
      transform: translateY(-1px);
      background: ${props.isDarkMode ? '#404040' : '#e2e8f0'};
    }
  `}

  ${props => props.variant === 'danger' && `
    background: linear-gradient(145deg, #ef4444, #dc2626);
    color: white;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
    }
  `}
`;

export const ReportsTableContainer = styled.div`
  position: relative;
  z-index: 1;
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

export const ReportsTable = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'white'};
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  th {
    background: ${props => props.isDarkMode ? '#333333' : '#f8fafc'};
    padding: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${props => props.isDarkMode ? '#f97316' : '#475569'};
    border-bottom: 2px solid ${props => props.isDarkMode ? '#404040' : '#e2e8f0'};
    text-align: left;
    white-space: nowrap;

    &:first-child {
      padding-left: 1.5rem;
    }

    &:last-child {
      padding-right: 1.5rem;
      text-align: right;
    }
  }

  td {
    padding: 1rem;
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#e2e8f0' : '#475569'};
    border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#e2e8f0'};
    vertical-align: middle;

    &:first-child {
      padding-left: 1.5rem;
    }

    &:last-child {
      padding-right: 1.5rem;
      text-align: right;
    }

    /* Specific column alignments */
    &:nth-child(1) { /* User ID */
      width: 120px;
    }
    
    &:nth-child(2) { /* Name */
      min-width: 200px;
    }
    
    &:nth-child(3) { /* Position */
      min-width: 150px;
    }
    
    &:nth-child(4) { /* Branch */
      min-width: 100px;
    }
    
    &:nth-child(5) { /* Access Level */
      text-align: center;
      width: 120px;
    }
    
    &:nth-child(6), /* Is Collector */
    &:nth-child(7) { /* Status */
      text-align: center;
      width: 100px;
    }
    
    &:last-child { /* Actions */
      width: 150px;
    }
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background: ${props => props.isDarkMode 
      ? 'rgba(249, 115, 22, 0.05)' 
      : 'rgba(249, 115, 22, 0.02)'};
  }

  .badge {
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: inline-block;

    &.superadmin {
      background: linear-gradient(145deg, #ef4444, #dc2626);
      color: white;
    }

    &.admin {
      background: linear-gradient(145deg, #f97316, #ea580c);
      color: white;
    }

    &.user {
      background: linear-gradient(145deg, #3b82f6, #2563eb);
      color: white;
    }
  }

  .yes, .no, .active, .inactive {
    display: inline-block;
    width: 100%;
    text-align: center;
  }

  .yes {
    color: #22c55e;
    font-weight: 500;
  }

  .no {
    color: #94a3b8;
  }

  .active {
    color: #22c55e;
    font-weight: 500;
  }

  .inactive {
    color: #ef4444;
    font-weight: 500;
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
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
  background: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px ${props => props.isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.1)'};

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h2 {
      font-size: 1.25rem;
      font-weight: 500;
      color: ${props => props.isDarkMode ? '#fdba74' : '#111827'};
    }

    button {
      padding: 0.25rem;
      color: ${props => props.isDarkMode ? '#fed7aa' : '#6B7280'};
      &:hover {
        color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
      }
    }
  }

  .upload-area {
    border: 2px dashed ${props => props.isDarkMode ? '#444444' : '#E5E7EB'};
    border-radius: 6px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: ${props => props.isDarkMode ? '#666666' : '#D1D5DB'};
      background: ${props => props.isDarkMode ? '#2a2a2a' : '#F9FAFB'};
    }

    .upload-icon {
      width: 40px;
      height: 40px;
      margin: 0 auto 1rem;
      color: ${props => props.isDarkMode ? '#9CA3AF' : '#9CA3AF'};
    }

    .upload-text {
      margin-bottom: 0.5rem;
      color: ${props => props.isDarkMode ? '#e5e7eb' : '#111827'};
    }

    .upload-hint {
      color: ${props => props.isDarkMode ? '#9CA3AF' : '#6B7280'};
      font-size: 0.875rem;
    }

    .click-upload {
      color: ${props => props.isDarkMode ? '#2563EB' : '#2563EB'};
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
    border-top: 1px solid ${props => props.isDarkMode ? '#444444' : '#E5E7EB'};

    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;

      &.cancel {
        color: ${props => props.isDarkMode ? '#e5e7eb' : '#6B7280'};
        background: ${props => props.isDarkMode ? '#333333' : 'white'};
        border: 1px solid ${props => props.isDarkMode ? '#444444' : '#E5E7EB'};
        &:hover {
          background: ${props => props.isDarkMode ? '#444444' : '#F9FAFB'};
        }
      }

      &.upload {
        color: white;
        background: ${props => props.isDarkMode ? '#2563EB' : '#2563EB'};
        &:hover {
          background: ${props => props.isDarkMode ? '#1D4ED8' : '#1D4ED8'};
        }
      }
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
    }

    input {
      padding: 0.5rem;
      border: 1px solid ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
      border-radius: 0.375rem;
      background-color: ${props => props.isDarkMode ? '#1F2937' : 'white'};
      color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
      font-size: 0.875rem;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #f97316;
      }
    }

    select.select-input {
      padding: 0.5rem;
      border: 1px solid ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
      border-radius: 0.375rem;
      background-color: ${props => props.isDarkMode ? '#1F2937' : 'white'};
      color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
      font-size: 0.875rem;
      width: 100%;
      transition: border-color 0.2s;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: #f97316;
      }

      option {
        background-color: ${props => props.isDarkMode ? '#1F2937' : 'white'};
        color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
      }
    }
  }

  @media (max-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr;
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
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;

  button {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(145deg, #333333, #262626)' 
      : 'linear-gradient(145deg, #ffffff, #f8fafc)'};
    color: ${props => props.isDarkMode ? '#e2e8f0' : '#475569'};
    border: 1px solid ${props => props.isDarkMode ? '#404040' : '#e2e8f0'};
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#e2e8f0' : '#475569'};
    font-weight: 500;
  }
`;

export const SearchInput = styled.input`
  padding: 0.625rem 1rem;
  border-radius: 9999px;
  border: 2px solid ${props => props.isDarkMode ? '#333333' : '#e2e8f0'};
  background: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
  color: ${props => props.isDarkMode ? '#e2e8f0' : '#475569'};
  font-size: 0.875rem;
  width: 250px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
  }

  &::placeholder {
    color: ${props => props.isDarkMode ? '#4b5563' : '#94a3b8'};
  }
`;

export const AreaInfoBox = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #f8fafc, #ffffff)'};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#e2e8f0'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(0, 0, 0, 0.1)'};
  }
`;

export const AreaLabel = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const AreaValue = styled.div`
  font-size: ${props => props.large ? '2rem' : '1.5rem'};
  font-weight: 600;
  color: ${props => props.isDarkMode ? '#f97316' : '#f97316'};
  line-height: 1.2;
`;

export const AreaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

export const UserProfileContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const UserProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

export const UserProfileDetails = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 1.25rem;
    font-weight: 500;
    color: ${props => props.isDarkMode ? '#fdba74' : '#111827'};
    margin: 0;
  }

  p {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9CA3AF' : '#6B7280'};
    margin: 0;
  }
`;
