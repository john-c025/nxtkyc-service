'use client';

import styled from '@emotion/styled';

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffeacf'};
  display: flex;
  position: relative;
  color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
  transition: background-color 0.3s ease, color 0.3s ease;
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
export const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  position: relative;
  display: flex;
  height: 100vh;
  overflow: hidden;
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    flex-direction: column;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  margin-bottom: 2rem;

  .top-content {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .welcome-section {
    h1 {
      color: ${props => props.isDarkMode ? '#fdba74' : '#111827'};
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: ${props => props.isDarkMode ? '#fed7aa' : '#6b7280'};
      font-size: 1rem;
    }
  }

  .datetime-section {
    padding: 0.875rem 1.25rem;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(145deg, #262626, #1a1a1a)'
      : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
    border-radius: 10px;
    border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    box-shadow: 0 4px 12px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.2)'
      : 'rgba(249, 115, 22, 0.1)'};
    
    .time {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
      margin-bottom: 0.25rem;
    }

    .date {
      font-size: 0.875rem;
      color: ${props => props.isDarkMode ? '#fed7aa' : '#6b7280'};
      display: flex;
      align-items: center;
      gap: 0.5rem;

      svg {
        width: 0.875rem;
        height: 0.875rem;
        color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;

    .top-content {
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    .datetime-section {
      width: 100%;
      padding: 0.75rem 1rem;

      .time {
        font-size: 1.25rem;
      }
    }
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
// ... existing code ...

export const ConfigButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  background: ${props => props.primary 
    ? (props.isDarkMode ? '#ff840b' : '#f97316')
    : (props.isDarkMode ? '#333333' : '#f3f4f6')};
  color: ${props => props.primary 
    ? '#ffffff'
    : (props.isDarkMode ? '#fdba74' : '#f97316')};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
    background: ${props => props.primary 
      ? (props.isDarkMode ? '#ea580c' : '#ea580c')
      : (props.isDarkMode ? '#404040' : '#e5e7eb')};
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const CardIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 132, 11, 0.1)' 
    : 'rgba(249, 115, 22, 0.1)'};
  color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    transition: transform 0.3s ease;
  }

  ${props => props.variant === 'success' && `
    background: ${props.isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
    color: #22c55e;
  `}

  ${props => props.variant === 'warning' && `
    background: ${props.isDarkMode ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.1)'};
    color: #eab308;
  `}

  &:hover {
    transform: scale(1.1);
    
    svg {
      transform: rotate(10deg);
    }
  }
`;

// ... rest of the existing code ...
export const Card = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, rgba(38, 38, 38, 0.95), rgba(26, 26, 26, 0.95))' 
    : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(255, 250, 247, 0.95))'};
  border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px ${props => props.isDarkMode 
    ? 'rgba(0, 0, 0, 0.3)' 
    : 'rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    box-shadow: 0 8px 24px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.4)' 
      : 'rgba(0, 0, 0, 0.15)'};
    transform: translateY(-2px);
  }

  h3 {
    color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  span {
    color: ${props => props.isDarkMode ? '#fed7aa' : '#111827'};
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

export const ChartContainer = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  
  h3 {
    color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
  }

  p, div {
    color: ${props => props.isDarkMode ? '#fed7aa' : '#6b7280'};
  }

  span {
    color: ${props => props.isDarkMode ? '#fee2e2' : '#9ca3af'};
  }
  
  &:hover {
    box-shadow: 0 4px 12px ${props => props.isDarkMode 
      ? 'rgba(249, 115, 22, 0.15)' 
      : 'rgba(249, 115, 22, 0.05)'};
  }

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

export const NavList = styled.nav`
  margin-top: 2rem;
  
  a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: ${props => props.isDarkMode ? '#ffffff' : '#4b5563'};
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s ease;
    margin-bottom: 0.5rem;
    
    &:hover {
      background: ${props => props.isDarkMode 
        ? 'linear-gradient(145deg, #333333, #262626)' 
        : 'linear-gradient(145deg, #fff9f5, #fff5ed)'};
      color: ${props => props.isDarkMode ? '#fdba74' : '#ea580c'};
    }
    
    &.active {
      background: ${props => props.isDarkMode 
        ? 'linear-gradient(145deg, #333333, #262626)' 
        : 'linear-gradient(145deg, #fff5ed, #ffede3)'};
      color: ${props => props.isDarkMode ? '#fdba74' : '#ea580c'};
      font-weight: 500;
    }

    svg {
      color: ${props => props.isDarkMode ? '#ffffff' : 'currentColor'};
    }
  }

  /* Override any Tailwind classes */
  a.text-gray-500,
  a.text-gray-600,
  a.text-gray-700,
  a.text-gray-800,
  a.text-gray-900 {
    color: ${props => props.isDarkMode ? '#ffffff' : '#4b5563'};
    
    &:hover {
      color: ${props => props.isDarkMode ? '#fdba74' : '#ea580c'};
    }
  }
`;

export const UserSection = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.isDarkMode ? '#333333' : '#ffe4d3'};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #333333, #262626)' 
    : 'linear-gradient(145deg, #fff5ed, #ffede3)'};
  border: 2px solid ${props => props.isDarkMode ? '#333333' : '#fff'};
  box-shadow: 0 2px 4px ${props => props.isDarkMode 
    ? 'rgba(249, 115, 22, 0.2)' 
    : 'rgba(249, 115, 22, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: ${props => props.isDarkMode ? '#f3f4f6' : '#6b7280'};
  }
`;

export const UserInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
    margin: 0;
  }
  
  p {
    font-size: 0.75rem;
    color: ${props => props.isDarkMode ? '#fed7aa' : '#ea580c'};
    margin: 0;
    opacity: ${props => props.isDarkMode ? '1' : '0.8'};
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

export const MapContainer = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
`;

export const FloatingContent = styled.div`
  position: relative;
  width: 400px;
  height: 100vh;
  overflow-y: auto;
  background: ${props => props.isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(8px);
  padding: 1.5rem;
  border-left: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.isDarkMode ? '#404040' : '#d1d5db'};
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    max-height: 60vh;
    border-left: none;
    border-top: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: none;
  border: none;
  color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const MapStyleSelect = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: ${props => props.isDarkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(8px);
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px ${props => props.isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};

  select {
    border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    transition: all 0.2s ease;
    outline: none;
    background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    cursor: pointer;
    min-width: 120px;
    
    &:focus {
      border-color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
      box-shadow: 0 0 0 2px ${props => props.isDarkMode ? 'rgba(253, 186, 116, 0.2)' : 'rgba(255, 132, 11, 0.2)'};
    }
    
    option {
      background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
      color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
    }
  }

  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    
    select {
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
    }
  }
`;

export const Overlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
    transition: opacity 0.3s ease-in-out;
  }
`;

export const StyledTable = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: ${props => props.isDarkMode ? '#262626' : '#ffffff'};
  border-radius: 8px;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};

  table {
    width: 100%;
    min-width: 800px;
    border-collapse: separate;
    border-spacing: 0;
    
    th {
      background: ${props => props.isDarkMode ? '#1a1a1a' : '#f9fafb'};
      color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
      font-weight: 600;
      text-align: left;
      padding: 1rem;
      font-size: 0.875rem;
      border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
    }

    td {
      padding: 1rem;
      color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
      border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
      font-size: 0.875rem;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: ${props => props.isDarkMode ? '#333333' : '#f9fafb'};
    }
  }

  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
    
    &.success {
      background: ${props => props.isDarkMode ? '#065f46' : '#dcfce7'};
      color: ${props => props.isDarkMode ? '#6ee7b7' : '#059669'};
    }
    
    &.warning {
      background: ${props => props.isDarkMode ? '#783c00' : '#fff7ed'};
      color: ${props => props.isDarkMode ? '#fdba74' : '#c2410c'};
    }
    
    &.danger {
      background: ${props => props.isDarkMode ? '#7f1d1d' : '#fef2f2'};
      color: ${props => props.isDarkMode ? '#fca5a5' : '#dc2626'};
    }
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
    
    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &.success {
        background: ${props => props.isDarkMode ? '#065f46' : '#dcfce7'};
        color: ${props => props.isDarkMode ? '#6ee7b7' : '#059669'};
        
        &:hover {
          background: ${props => props.isDarkMode ? '#047857' : '#bbf7d0'};
        }
      }
      
      &.warning {
        background: ${props => props.isDarkMode ? '#783c00' : '#fff7ed'};
        color: ${props => props.isDarkMode ? '#fdba74' : '#c2410c'};
        
        &:hover {
          background: ${props => props.isDarkMode ? '#9a3412' : '#fed7aa'};
        }
      }
      
      &.primary {
        background: ${props => props.isDarkMode ? '#1e40af' : '#dbeafe'};
        color: ${props => props.isDarkMode ? '#93c5fd' : '#2563eb'};
        
        &:hover {
          background: ${props => props.isDarkMode ? '#1d4ed8' : '#bfdbfe'};
        }
      }
    }
  }

  @media (max-width: 768px) {
    border-radius: 0;
    border-left: none;
    border-right: none;
    
    table {
      min-width: 650px;
    }

    td, th {
      padding: 0.75rem;
    }

    .action-buttons {
      flex-direction: column;
      
      button {
        width: 100%;
        padding: 0.375rem 0.75rem;
      }
    }
  }
`;

export const AreaInfoBox = styled.div`
  padding: 1.25rem;
  border-radius: 0.75rem;
  background: ${({ isDarkMode }) => isDarkMode ? '#1E1E1E' : '#f8f9fa'};
  border: 1px solid ${({ isDarkMode }) => isDarkMode ? '#2d2d2d' : '#e9ecef'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const AreaLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const AreaValue = styled.p`
  font-size: ${({ large }) => large ? '1.5rem' : '1rem'};
  font-weight: ${({ large }) => large ? '400' : '300'};
  color: ${({ isDarkMode }) => isDarkMode ? '#fed7aa' : '#1f2937'};
  margin: 0;
`;

export const AreaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const LocationDetailsContainer = styled.div`
  margin-bottom: 1.5rem;
`;

export const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const LocationInfoBox = styled.div`
  padding: 1.25rem;
  border-radius: 0.75rem;
  background: ${({ isDarkMode }) => isDarkMode ? '#1E1E1E' : '#f8f9fa'};
  border: 1px solid ${({ isDarkMode }) => isDarkMode ? '#2d2d2d' : '#e9ecef'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const LocationLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #ff840b;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const LocationValue = styled.p`
  font-size: ${({ small }) => small ? '0.875rem' : '1rem'};
  font-weight: ${({ small }) => small ? '400' : '500'};
  color: ${({ isDarkMode }) => isDarkMode ? '#fed7aa' : '#1f2937'};
  margin: 0;
  word-break: break-word;
`;

export const LocationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 600;
`;

export const MetricBox = styled.div`
  background: ${props => props.isDarkMode ? '#2d2d2d' : '#ffffff'};
  border: 1px solid ${props => props.isDarkMode ? '#404040' : '#e5e7eb'};
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const MetricLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #fdba74;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const MetricValue = styled.p`
  font-size: 1rem;
  font-weight: 300;
  color: ${props => props.isDarkMode ? '#1f2937' : '#fdba74'};
  margin: 0;
`;

export const MetricChange = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.positive ? '#065f46' : '#7f1d1d'};
  margin: 0;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid ${props => props.isDarkMode ? '#1f2937' : '#f3f4f6'};
    border-top: 4px solid #ff840b;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .text {
    color: ${props => props.isDarkMode ? '#e5e7eb' : '#4b5563'};
    font-size: 0.875rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// New styled components for collector command center

export const CollectorPin = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.isDarkMode ? '#1f2937' : '#ffffff'};
  border: 2px solid ${props => props.status === 'Actively working' ? '#10b981' : 
    props.status === 'On traffic' ? '#f59e0b' : 
    props.status === 'On Lunch Break' ? '#f97316' : 
    props.status === 'Inactive for 30 minutes' ? '#9ca3af' : 
    props.status === 'Lost Signal' ? '#ef4444' : '#9ca3af'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CollectorStatus = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.status === 'Actively working' ? '#10b981' : 
    props.status === 'On traffic' ? '#f59e0b' : 
    props.status === 'On Lunch Break' ? '#f97316' : 
    props.status === 'Inactive for 30 minutes' ? '#9ca3af' : 
    props.status === 'Lost Signal' ? '#ef4444' : '#9ca3af'};
  border: 2px solid ${props => props.isDarkMode ? '#1f2937' : '#ffffff'};
`;

export const CollectorInfo = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  background: ${props => props.isDarkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(249, 250, 251, 0.95)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
`;

export const CollectorLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

export const CollectorValue = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
`;

export const CollectorName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
`;

export const CollectorDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LegendContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
  background: ${props => props.isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    top: 0.5rem;
    left: 0.5rem;
  }
`;

export const LegendToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${props => props.isDarkMode ? '#f3f4f6' : '#111827'};
  font-weight: 500;
  font-size: 0.875rem;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.3s ease;
  }
`;

export const LegendContent = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${props => props.isDarkMode ? '#f3f4f6' : '#111827'};
  font-size: 0.875rem;
  background: ${props => props.isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
  margin-bottom: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isDarkMode ? 'rgba(38, 38, 38, 0.95)' : 'rgba(249, 250, 251, 0.95)'};
  }
`;

export const LegendIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

export const LegendText = styled.div`
  font-weight: 500;
`;

export const CollectorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const CollectorListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: ${props => props.isSelected 
    ? (props.isDarkMode ? 'rgba(255, 132, 11, 0.2)' : 'rgba(255, 132, 11, 0.1)') 
    : (props.isDarkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(249, 250, 251, 0.95)')};
  border: 1px solid ${props => props.isSelected 
    ? (props.isDarkMode ? '#ff840b' : '#ff840b') 
    : (props.isDarkMode ? '#333333' : '#e5e7eb')};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isDarkMode ? 'rgba(55, 55, 55, 0.95)' : 'rgba(243, 244, 246, 0.95)'};
  }
`;

export const CollectorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};
`;

export const CollectorStatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.25rem;
  background: ${props => props.status === 'Actively working' ? 'rgba(16, 185, 129, 0.2)' : 
    props.status === 'On traffic' ? 'rgba(245, 158, 11, 0.2)' : 
    props.status === 'On Lunch Break' ? 'rgba(249, 115, 22, 0.2)' : 
    props.status === 'Inactive for 30 minutes' ? 'rgba(156, 163, 175, 0.2)' : 
    props.status === 'Lost Signal' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(156, 163, 175, 0.2)'};
  color: ${props => props.status === 'Actively working' ? '#10b981' : 
    props.status === 'On traffic' ? '#f59e0b' : 
    props.status === 'On Lunch Break' ? '#f97316' : 
    props.status === 'Inactive for 30 minutes' ? '#9ca3af' : 
    props.status === 'Lost Signal' ? '#ef4444' : '#9ca3af'};
`;

export const CollectorTaskInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
`;

export const CommandCenterOverlay = styled.div`
  position: fixed;
  bottom: ${props => props.isExpanded ? '0' : '-400px'};
  left: 250px;
  right: 400px;
  height: 400px;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(180deg, rgba(26, 26, 26, 0.98), rgba(38, 38, 38, 0.98))' 
    : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 250, 247, 0.98))'};
  backdrop-filter: blur(10px);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 40;
  padding: 1.5rem;
  
  @media (max-width: 1024px) {
    left: 0;
    right: 0;
  }
`;

export const CommandCenterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
`;

export const CommandCenterTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
    margin: 0;
  }
  
  .version {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: ${props => props.isDarkMode ? '#374151' : '#fff5ed'};
    color: ${props => props.isDarkMode ? '#9ca3af' : '#f97316'};
    border-radius: 999px;
    font-weight: 500;
  }
`;

export const CommandCenterControls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${props => props.isDarkMode ? '#262626' : '#ffffff'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 12px;
  color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(249, 115, 22, 0.15)'};
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const ToggleOverlayButton = styled.button`
  position: fixed;
  bottom: ${props => props.isExpanded ? '400px' : '0'};
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 1.5rem;
  background: ${props => props.isDarkMode ? '#262626' : '#ffffff'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 41;
  
  &:hover {
    padding-top: 0.75rem;
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.3s ease;
    transform: ${props => props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

export const TeamSection = styled.div`
  margin-top: 1rem;
`;

export const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.isDarkMode ? '#262626' : '#ffffff'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isDarkMode ? '#333333' : '#f9fafb'};
  }
`;

export const TeamInfo = styled.div`
  padding: 1rem;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 12px;
  margin-top: ${props => props.isExpanded ? '1rem' : '0'};
  max-height: ${props => props.isExpanded ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.isExpanded ? '1' : '0'};
`;

export const TeamMember = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const MemberAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
`;

export const MemberInfo = styled.div`
  flex: 1;
`;

export const MemberName = styled.div`
  font-weight: 600;
  color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
  font-size: 0.875rem;
`;

export const MemberRole = styled.div`
  font-size: 0.75rem;
  color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
`;

export const TeamStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: ${props => props.isDarkMode ? '#262626' : '#f9fafb'};
  border-radius: 8px;
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  margin-bottom: 0.25rem;
`;

export const StatValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
`;