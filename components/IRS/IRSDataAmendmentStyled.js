import styled from 'styled-components';

export const StepIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 132, 11, 0.1)'
    : 'rgba(255, 132, 11, 0.05)'};
  color: #ff840b;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    transform: scale(1.05);
    background: ${props => props.isDarkMode 
      ? 'rgba(255, 132, 11, 0.15)'
      : 'rgba(255, 132, 11, 0.1)'};
  }
`;

export const StepTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 500;
    color: ${props => props.isDarkMode ? '#e2e8f0' : '#e2e8f0'};
  }
`;


export const ContentCard = styled.div`
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 255, 255, 0.03)' 
    : 'white'};
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.2)' 
      : 'rgba(0, 0, 0, 0.1)'};
  }
`;
export const Sidebar = styled.aside`
  width: 250px;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(to bottom, #1a1a1a, #262626)' 
    : 'linear-gradient(to bottom, #ffffff, #fff9f5)'};
  border-right: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 50;
  transition: all 0.3s ease-in-out;
  overflow-y: auto;

  @media (max-width: 1024px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.isOpen ? '4px 0 8px rgba(0, 0, 0, 0.2)' : 'none'};
    width: 100%;
    max-width: 300px;
  }

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  display: flex;
  position: relative;
  color: #ffffff;
  overflow-x: hidden;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  margin-left: 240px;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#e3d1bf'};

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 1rem;
  }

  .grid {
    grid-template-columns: 1fr 300px;
  }

  input, select {
    color: ${props => props.isDarkMode ? '#fff' : '#333'};
    background: transparent;
    border: 1px solid ${props => props.isDarkMode ? '#4a5568' : '#e2e8f0'};
    transition: all 0.2s;

    &:hover {
      border-color: ${props => props.isDarkMode ? '#718096' : '#cbd5e0'};
    }

    &:focus {
      outline: none;
      border-color: #3182ce;
      box-shadow: 0 0 0 1px #3182ce;
    }
  }

  label {
    color: ${props => props.isDarkMode ? '#cbd5e0' : '#4a5568'};
    font-size: 0.875rem;
  }
`;

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-left: 2px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
  padding-left: 1.5rem;
  width: 300px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -2px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      to bottom,
      #ff840b 0%,
      #ff840b var(--progress, 25%),
      ${props => props.isDarkMode ? '#333' : '#e2e8f0'} var(--progress, 25%),
      ${props => props.isDarkMode ? '#333' : '#e2e8f0'} 100%
    );
  }
`;

export const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const Card = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  
  h3 {
    color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  span {
    color: ${props => props.isDarkMode ? '#fed7aa' : '#111827'};
  }
  
  &:hover {
    box-shadow: 0 4px 12px ${props => props.isDarkMode 
      ? 'rgba(249, 115, 22, 0.15)' 
      : 'rgba(249, 115, 22, 0.08)'};
    transform: translateY(-2px);
    border-color: rgba(249, 115, 22, 0.15);
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  margin-bottom: 2rem;

  h1 {
    color: ${props => props.isDarkMode ? '#fdba74' : '#111827'};
  }

  p {
    color: ${props => props.isDarkMode ? '#fed7aa' : '#6b7280'};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
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

export const NewReportButton = styled.div`
  width: 100%;
  max-width: 1050px;
  border: 2px dashed ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
  border-radius: 1rem;
  padding: 5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDarkMode 
    ? 'rgba(31, 41, 55, 0.4)' 
    : 'rgba(255, 255, 255, 0.8)'
  };
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #ff840b;
    background: ${props => props.isDarkMode 
      ? 'rgba(75, 85, 99, 0.4)' 
      : 'rgba(255, 132, 11, 0.05)'
    };
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 132, 11, 0.1);

    .plus-icon {
      transform: scale(1.1);
    }
  }

  .plus-icon {
    color: #ff840b;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    transition: transform 0.3s ease;
    background: ${props => props.isDarkMode 
      ? 'rgba(255, 132, 11, 0.1)' 
      : 'rgba(255, 132, 11, 0.1)'
    };
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    font-size: 1.125rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 132, 11, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

export const UploadModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
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

export const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  position: relative;
  background-color: ${props => 
    props.className === 'completed' ? '#22c55e' : 
    props.className === 'current' ? '#ff840b' : 
    'transparent'
  };
  color: ${props => 
    props.className === 'completed' || props.className === 'current' 
      ? '#ffffff' 
      : '#6b7280'
  };
  border: ${props => 
    props.className === 'completed' || props.className === 'current' 
      ? 'none' 
      : '2px solid #6b7280'
  };
  box-shadow: ${props =>
    props.className === 'current'
      ? '0 0 0 4px rgba(255, 132, 11, 0.2)'
      : 'none'
  };
  transition: all 0.3s ease;
`;

export const StepLabel = styled.div`
  font-size: 1rem;
  color: ${props => 
    props.isDarkMode 
      ? (props.className === 'completed' ? '#fdba74' : props.className === 'current' ? '#d1d5db' : '#9ca3af')
      : (props.className === 'completed' ? '#22c55e' : props.className === 'current' ? '#ff840b' : '#6b7280')
  };
`;

export const StepStatus = styled.div`
  font-size: 0.875rem;
  color: ${props => 
    props.isDarkMode 
      ? (props.className === 'completed' ? '#fdba74' : '#9ca3af')
      : (props.className === 'completed' ? '#22c55e' : '#6b7280')
  };
`;

export const ContentSection = styled.div`
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: ${props => props.isDarkMode ? '#fff' : '#1a202c'};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: ${props => props.isDarkMode ? '#cbd5e0' : '#4a5568'};
  }

  input, select {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid ${props => props.isDarkMode ? '#4a5568' : '#e2e8f0'};
    background: transparent;
    color: ${props => props.isDarkMode ? '#fff' : '#1a202c'};

    &:focus {
      outline: none;
      border-color: #3182ce;
      box-shadow: 0 0 0 1px #3182ce;
    }
  }
`;

export const ScheduleInfo = styled.div`
  text-align: right;
  color: ${props => props.isDarkMode ? '#cbd5e0' : '#4a5568'};
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.variant === 'primary' && `
    background: linear-gradient(145deg, #ff840b, #ff9f3f);
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 132, 11, 0.2);
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      padding: 1px;
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.2), transparent);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  `}

  ${props => props.variant === 'secondary' && `
    background: ${props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white'};
    color: ${props.isDarkMode ? '#e2e8f0' : '#4a5568'};
    border: 1px solid ${props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'};
    
    &:hover:not(:disabled) {
      background: ${props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f7fafc'};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${props.isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    }

    &:active:not(:disabled) {
      transform: translateY(1px);
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(2px);
  }
`;

export const SaveButton = styled(Button)`
  background-color: white;
  color: #1a202c;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

export const Overlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  transition: opacity 0.3s ease-in-out;

  @media (max-width: 1024px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    opacity: ${props => props.isOpen ? 1 : 0};
  }
`;

export const ReportCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  opacity: 1;
  transition: opacity 0.3s ease;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const TableModalContent = styled.div`
  background: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
  border-radius: 20px;
  width: 95%;
  max-width: 1400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
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

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(145deg, rgba(255, 132, 11, 0.2), rgba(99, 102, 241, 0.2))'
      : 'linear-gradient(145deg, rgba(255, 132, 11, 0.1), rgba(99, 102, 241, 0.1))'};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
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
      font-size: 1.5rem;
      font-weight: 500;
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
      display: flex;
      align-items: center;
      gap: 0.75rem;

      svg {
        width: 24px;
        height: 24px;
        color: #ff840b;
      }
    }

    .close-button {
      background: none;
      border: none;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#64748b'};
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 10px;
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
    padding: 0;
    position: relative;

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    &::-webkit-scrollbar-track {
      background: ${props => props.isDarkMode ? '#262626' : '#f3f4f6'};
    }

    &::-webkit-scrollbar-thumb {
      background: ${props => props.isDarkMode ? '#4b5563' : '#9ca3af'};
      border-radius: 5px;
      border: 2px solid ${props => props.isDarkMode ? '#262626' : '#f3f4f6'};

      &:hover {
        background: ${props => props.isDarkMode ? '#6b7280' : '#6b7280'};
      }
    }
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-top: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
    background: ${props => props.isDarkMode 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(255, 255, 255, 0.8)'};
  }
`;
export const ReportsTableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 0.5rem;
  background: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
  margin: 1rem 0;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.isDarkMode ? '#262626' : '#f1f1f1'};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.isDarkMode ? '#4b5563' : '#888'};
    border-radius: 4px;

    &:hover {
      background: ${props => props.isDarkMode ? '#6b7280' : '#555'};
    }
  }
`;

export const ReportsTable = styled.div`
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  th {
    position: sticky;
    top: 0;
    background: ${props => props.isDarkMode ? '#262626' : '#f8fafc'};
    padding: 1rem;
    text-align: left;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${props => props.isDarkMode ? '#ff840b' : '#4a5568'};
    border-bottom: 2px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
    white-space: nowrap;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
    color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
    font-size: 0.875rem;
  }

  tbody tr:hover {
    background: ${props => props.isDarkMode 
      ? 'rgba(255, 132, 11, 0.05)' 
      : 'rgba(255, 132, 11, 0.02)'};
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
`;

export const SpinnerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

export const AnimatedProgress = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 255, 255, 0.03)' 
    : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 12px;
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.isDarkMode
      ? 'linear-gradient(145deg, rgba(255, 132, 11, 0.1), rgba(99, 102, 241, 0.1))'
      : 'linear-gradient(145deg, rgba(255, 132, 11, 0.05), rgba(99, 102, 241, 0.05))'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;

    .progress-title {
      font-size: 0.95rem;
      font-weight: 500;
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
    }

    .progress-percentage {
      font-size: 0.9rem;
      font-weight: 600;
      color: #ff840b;
      background: ${props => props.isDarkMode
        ? 'rgba(255, 132, 11, 0.1)'
        : 'rgba(255, 132, 11, 0.05)'};
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      transition: all 0.3s ease;
    }
  }

  .progress-bar {
    height: 8px;
    background: ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff840b, #ff9f3f);
    border-radius: 4px;
    transition: width 0.3s ease;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: shimmer 2s infinite;
    }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
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

export const SearchInput = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.isDarkMode ? '#4b5563' : '#e5e7eb'};
  border-radius: 8px;
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
  transition: all 0.2s;
  font-size: 0.875rem;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: 0.75rem center;
  background-size: 1.25rem;

  &:focus {
    outline: none;
    border-color: #ff840b;
    box-shadow: 0 0 0 3px rgba(255, 132, 11, 0.2);
    background-color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'white'};
  }

  &::placeholder {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }

  &:hover {
    border-color: ${props => props.isDarkMode ? '#6b7280' : '#cbd5e0'};
  }
`;

export const PaginationControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 12px;
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};

  .pagination-info {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .pagination-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
    background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white'};
    color: ${props => props.isDarkMode ? '#e2e8f0' : '#4a5568'};
    border: 1px solid ${props => props.isDarkMode ? '#4b5563' : '#e2e8f0'};

    svg {
      width: 16px;
      height: 16px;
      transition: transform 0.2s;
    }

    &:hover:not(:disabled) {
      background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f7fafc'};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${props => props.isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};

      &:first-child svg {
        transform: translateX(-2px);
      }

      &:last-child svg {
        transform: translateX(2px);
      }
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }
  }

  .page-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6'};
    border-radius: 6px;
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#e2e8f0' : '#4a5568'};
    font-weight: 500;
  }
`;

export const StepperLayout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const StepperSidebar = styled.div`
  position: sticky;
  top: 2rem;
  height: fit-content;
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 255, 255, 0.03)' 
    : 'rgba(255, 255, 255, 0.5)'};
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};

  .steps-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const StepperStep = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isActive 
    ? props.isDarkMode 
      ? 'rgba(255, 132, 11, 0.1)' 
      : 'rgba(255, 132, 11, 0.05)'
    : 'transparent'
  };
  border: 1px solid ${props => props.isActive
    ? '#ff840b'
    : 'transparent'
  };

  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    width: 2px;
    height: ${props => props.isCompleted ? '100%' : '0%'};
    background: ${props => props.isDarkMode ? '#ff840b' : '#ff840b'};
    transform: translateY(-50%);
    transition: height 0.3s ease-in-out;
    opacity: 0.5;
  }

  &:hover {
    transform: translateX(4px);
    background: ${props => props.isDarkMode 
      ? 'rgba(255, 132, 11, 0.1)'
      : 'rgba(255, 132, 11, 0.05)'};
  }

  .step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    background: ${props => props.isCompleted 
      ? '#22c55e' 
      : props.isActive 
        ? '#ff840b' 
        : props.isDarkMode ? '#333' : '#e2e8f0'};
    color: ${props => props.isCompleted || props.isActive ? '#fff' : props.isDarkMode ? '#999' : '#666'};
    transition: all 0.3s ease;
    
    &::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }
  }

  &:hover .step-number::after {
    border-color: ${props => props.isDarkMode ? '#ff840b' : '#ff840b'};
    transform: scale(1.1);
  }

  .step-content {
    flex: 1;

    .step-title {
      font-weight: 500;
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
      margin-bottom: 0.25rem;
    }

    .step-description {
      font-size: 0.875rem;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#64748b'};
    }
  }
`;

export const StepperContent = styled.div`
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 255, 255, 0.02)' 
    : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
  min-height: 500px;

  .step-header {
    margin-bottom: 2rem;
    
    .step-title {
      font-size: 1.5rem;
      font-weight: 300;
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
      margin-bottom: 0.5rem;
    }

    .step-description {
      color: ${props => props.isDarkMode ? '#9ca3af' : '#64748b'};
    }
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 2px;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(145deg, rgba(255, 132, 11, 0.2), rgba(99, 102, 241, 0.2))'
      : 'linear-gradient(145deg, rgba(255, 132, 11, 0.1), rgba(99, 102, 241, 0.1))'};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

export const StepperNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -2rem;
    right: -2rem;
    height: 1px;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(90deg, transparent, rgba(255, 132, 11, 0.2), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255, 132, 11, 0.1), transparent)'};
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.variant === 'edit' && `
    color: ${props.isDarkMode ? '#60a5fa' : '#2563eb'};
    background: ${props.isDarkMode ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.05)'};
    border: 1px solid ${props.isDarkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.1)'};
    
    &:hover {
      background: ${props.isDarkMode ? 'rgba(96, 165, 250, 0.15)' : 'rgba(37, 99, 235, 0.1)'};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
    }

    &:active {
      transform: translateY(1px);
    }
  `}

  ${props => props.variant === 'delete' && `
    color: ${props.isDarkMode ? '#f87171' : '#dc2626'};
    background: ${props.isDarkMode ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.05)'};
    border: 1px solid ${props.isDarkMode ? 'rgba(248, 113, 113, 0.2)' : 'rgba(220, 38, 38, 0.1)'};
    
    &:hover {
      background: ${props.isDarkMode ? 'rgba(248, 113, 113, 0.15)' : 'rgba(220, 38, 38, 0.1)'};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
    }

    &:active {
      transform: translateY(1px);
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent 50%);
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  &:hover::before {
    transform: translate(-50%, -50%) scale(2);
    opacity: 1;
  }
`;

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)'};
  border-radius: 12px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.isDarkMode ? '#262626' : '#f3f4f6'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.isDarkMode ? '#4b5563' : '#9ca3af'};
    border-radius: 4px;

    &:hover {
      background: ${props => props.isDarkMode ? '#6b7280' : '#6b7280'};
    }
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;

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
    }

    select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.5rem;
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

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.8)'};
  border-top: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
  border-radius: 0 0 16px 16px;
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
    min-width: 100px;
  }
`;

export const ErrorMessage = styled.div`
  background: ${props => props.isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2'};
  border: 1px solid ${props => props.isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2'};
  color: ${props => props.isDarkMode ? '#fca5a5' : '#dc2626'};
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  animation: fadeIn 0.3s ease;

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
