'use client';

import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';

// Import universal colors from MainDashboardStyled
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
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Page Container
export const DepartmentsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Department Grid
export const DepartmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const DepartmentCard = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${colors.shadow.light};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${colors.shadow.large};
    border-color: ${colors.primary[200]};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => {
      switch (props.color) {
        case 'blue': return `linear-gradient(90deg, ${colors.primary[500]}, ${colors.primary[300]})`;
        case 'green': return `linear-gradient(90deg, ${colors.success[500]}, ${colors.success[300]})`;
        case 'orange': return `linear-gradient(90deg, ${colors.warning[500]}, ${colors.warning[300]})`;
        case 'red': return `linear-gradient(90deg, ${colors.error[500]}, ${colors.error[300]})`;
        default: return `linear-gradient(90deg, ${colors.primary[500]}, ${colors.primary[300]})`;
      }
    }};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

export const DepartmentIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${props => {
    switch (props.color) {
      case 'blue': return colors.primary[100];
      case 'green': return colors.success[100];
      case 'orange': return colors.warning[100];
      case 'red': return colors.error[100];
      default: return colors.primary[100];
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'blue': return colors.primary[600];
      case 'green': return colors.success[600];
      case 'orange': return colors.warning[600];
      case 'red': return colors.error[600];
      default: return colors.primary[600];
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

export const DepartmentName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

export const DepartmentDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.text.tertiary};
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

export const DepartmentStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: ${colors.background.secondary};
  border-radius: 8px;
`;

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin-bottom: 0.25rem;
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${colors.text.tertiary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const DepartmentManager = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${colors.background.secondary};
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

export const ManagerAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${colors.primary[100]};
  color: ${colors.primary[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
`;

export const ManagerInfo = styled.div`
  flex: 1;
`;

export const ManagerName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 0.125rem;
`;

export const ManagerTitle = styled.div`
  font-size: 0.75rem;
  color: ${colors.text.tertiary};
`;

export const DepartmentActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${colors.border.medium};
  border-radius: 6px;
  background: ${colors.background.primary};
  color: ${colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${colors.primary[50]};
    border-color: ${colors.primary[200]};
    color: ${colors.primary[600]};
  }
  
  &.primary {
    background: ${colors.primary[500]};
    border-color: ${colors.primary[500]};
    color: white;
    
    &:hover {
      background: ${colors.primary[600]};
      border-color: ${colors.primary[600]};
    }
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Page Header (reusing from Employees)
export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0;
  letter-spacing: -0.025em;
`;

export const PageSubtitle = styled.p`
  font-size: 1rem;
  color: ${colors.text.tertiary};
  margin: 0.5rem 0 0 0;
`;

export const PageActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

// Button Component (reusing from Employees)
export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '0.5rem 1rem';
      case 'lg': return '0.75rem 2rem';
      default: return '0.625rem 1.5rem';
    }
  }};
  border-radius: 8px;
  font-weight: 500;
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.75rem';
      case 'lg': return '1rem';
      default: return '0.875rem';
    }
  }};
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: ${colors.primary[600]};
          color: white;
          border-color: ${colors.primary[600]};
          
          &:hover {
            background: ${colors.primary[700]};
            border-color: ${colors.primary[700]};
            transform: translateY(-1px);
            box-shadow: ${colors.shadow.medium};
          }
        `;
      case 'secondary':
        return css`
          background: ${colors.background.primary};
          color: ${colors.text.secondary};
          border-color: ${colors.border.medium};
          
          &:hover {
            background: ${colors.background.tertiary};
            color: ${colors.text.primary};
            border-color: ${colors.border.strong};
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${colors.text.secondary};
          border-color: transparent;
          
          &:hover {
            background: ${colors.background.tertiary};
            color: ${colors.text.primary};
          }
        `;
      default:
        return css`
          background: ${colors.primary[600]};
          color: white;
          border-color: ${colors.primary[600]};
          
          &:hover {
            background: ${colors.primary[700]};
            border-color: ${colors.primary[700]};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Export colors for consistency
export { colors, fadeIn };
