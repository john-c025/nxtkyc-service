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
  min-height: 100vh;
  padding: 1.5rem 2rem;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#FFFAF6'};
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 1024px) {
    margin-left: 0;
    width: 100%;
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

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
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

  @media (max-width: 640px) {
    padding: 1rem;
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
    pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  }
`;

export const CardOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 10px;
  padding: 2rem;
  z-index: 1000;
  min-width: 300px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

export const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.isDarkMode ? '#fdba74' : '#ea580c'};
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  span {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    background-color: #dc2626;
    color: #ffffff;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: bold;
  }
`;
