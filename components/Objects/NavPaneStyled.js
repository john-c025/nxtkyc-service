'use client';

import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';

// Universal Color System (matching MainDashboardStyled.js)
const colors = {
  // Primary Colors (Blue-based for professional look)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary Colors (Slate for neutral elements)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    overlay: 'rgba(15, 23, 42, 0.05)',
  },
  
  // Text Colors
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    tertiary: '#64748b',
    disabled: '#94a3b8',
    inverse: '#ffffff',
  },
  
  // Border Colors
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    strong: '#94a3b8',
  },
  
  // Shadow Colors
  shadow: {
    light: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  }
};

// Animation Keyframes
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Nav Container
export const NavContainer = styled.nav`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${colors.background.primary};
  position: relative;
  overflow: hidden;
`;

// Header Section
export const NavHeader = styled.div`
  padding: ${props => props.isCollapsed ? '1rem 0.75rem' : '1.5rem'};
  border-bottom: 1px solid ${colors.border.light};
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'space-between'};
  position: relative;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: ${colors.text.primary};
  
  .logo-icon {
    width: 32px;
    height: 32px;
    background: ${colors.primary[500]};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 0.875rem;
    flex-shrink: 0;
  }
  
  .logo-text {
    display: ${props => props.isCollapsed ? 'none' : 'block'};
    animation: ${props => props.isCollapsed ? 'none' : slideIn} 0.3s ease;
  }
`;

export const CollapseToggle = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: ${colors.background.tertiary};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.primary[50]};
    color: ${colors.primary[600]};
  }
  
  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
    transform: ${props => props.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

// Navigation List
export const NavList = styled.ul`
  flex: 1;
  padding: 1rem 0;
  list-style: none;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.border.medium};
    border-radius: 2px;
  }
`;

// Navigation Item
export const NavItem = styled.li`
  margin: 0.25rem 0;
`;

export const NavLink = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: ${props => props.isCollapsed ? '0.75rem' : '0.75rem 1.5rem'};
  border: none;
  background: none;
  color: ${props => props.isActive ? colors.primary[600] : colors.text.secondary};
  text-decoration: none;
  border-radius: 0;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  position: relative;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: ${props => props.isActive ? '24px' : '0px'};
    background: ${colors.primary[500]};
    border-radius: 0 3px 3px 0;
    transition: height 0.2s ease;
  }
  
  &:hover {
    background: ${colors.primary[50]};
    color: ${colors.primary[600]};
    
    &::before {
      height: 16px;
    }
  }
  
  ${props => props.isActive && css`
    background: ${colors.primary[50]};
    color: ${colors.primary[600]};
    
    .nav-icon {
      color: ${colors.primary[600]};
    }
  `}
  
  .nav-icon {
    width: 20px;
    height: 20px;
    color: ${props => props.isActive ? colors.primary[600] : colors.text.tertiary};
    transition: color 0.2s ease;
    flex-shrink: 0;
  }
  
  .nav-text {
    display: ${props => props.isCollapsed ? 'none' : 'block'};
    animation: ${props => props.isCollapsed ? 'none' : slideIn} 0.3s ease;
    white-space: nowrap;
  }
`;

// Group Header
export const GroupHeader = styled.div`
  padding: ${props => props.isCollapsed ? '0.5rem 0.75rem' : '1rem 1.5rem 0.5rem'};
  display: flex;
  align-items: center;
  justify-content: ${props => props.isCollapsed ? 'center' : 'space-between'};
  margin-top: 1.5rem;
  
  .group-title {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${colors.text.disabled};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: ${props => props.isCollapsed ? 'none' : 'block'};
  }
  
  .group-toggle {
    background: none;
    border: none;
    color: ${colors.text.disabled};
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    display: ${props => props.isCollapsed ? 'none' : 'flex'};
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${colors.background.tertiary};
      color: ${colors.text.secondary};
    }
    
    svg {
      width: 14px;
      height: 14px;
      transition: transform 0.2s ease;
      transform: ${props => props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
    }
  }
  
  .group-divider {
    width: ${props => props.isCollapsed ? '20px' : '100%'};
    height: 1px;
    background: ${colors.border.light};
    display: ${props => props.isCollapsed ? 'block' : 'none'};
  }
`;

// Group Content
export const GroupContent = styled.div`
  max-height: ${props => props.isExpanded ? '500px' : '0px'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

// User Profile Section
export const UserProfile = styled.div`
  padding: ${props => props.isCollapsed ? '1rem 0.75rem' : '1.5rem'};
  border-top: 1px solid ${colors.border.light};
  margin-top: auto;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${colors.primary[100]};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.primary[600]};
    font-weight: 600;
    font-size: 0.875rem;
    flex-shrink: 0;
    border: 2px solid ${colors.primary[200]};
  }
  
  .user-details {
    display: ${props => props.isCollapsed ? 'none' : 'flex'};
    flex-direction: column;
    animation: ${props => props.isCollapsed ? 'none' : slideIn} 0.3s ease;
    
    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: ${colors.text.primary};
      margin: 0;
    }
    
    .user-role {
      font-size: 0.75rem;
      color: ${colors.text.tertiary};
      margin: 0;
    }
  }
`;

export const UserActions = styled.div`
  display: ${props => props.isCollapsed ? 'none' : 'flex'};
  gap: 0.5rem;
  margin-top: 1rem;
  animation: ${props => props.isCollapsed ? 'none' : slideIn} 0.3s ease;
`;

export const UserActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${colors.border.medium};
  border-radius: 6px;
  background: ${colors.background.primary};
  color: ${colors.text.secondary};
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  
  &:hover {
    background: ${colors.primary[50]};
    border-color: ${colors.primary[200]};
    color: ${colors.primary[600]};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

// Tooltip for collapsed items
export const Tooltip = styled.div`
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  background: ${colors.text.primary};
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  box-shadow: ${colors.shadow.medium};
  
  &::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: ${colors.text.primary};
  }
  
  ${props => props.show && css`
    opacity: 1;
    visibility: visible;
  `}
`;

// Badge for notifications
export const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: ${colors.error[500]};
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 600;
  border: 2px solid ${colors.background.primary};
  animation: ${pulse} 2s infinite;
`;

// Mobile Overlay
export const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 39;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  
  @media (min-width: 1025px) {
    display: none;
  }
`;

// Status Indicator
export const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'online': return colors.success[500];
      case 'away': return colors.warning[500];
      case 'busy': return colors.error[500];
      default: return colors.neutral[400];
    }
  }};
  position: absolute;
  bottom: 2px;
  right: 2px;
  border: 2px solid ${colors.background.primary};
`;

// Export colors for consistency
export { colors };