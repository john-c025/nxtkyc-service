'use client';

import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';

// Import universal colors
const colors = {
  primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
  neutral: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
  success: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
  warning: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
  error: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d' },
  background: { primary: '#ffffff', secondary: '#f8fafc', tertiary: '#f1f5f9', overlay: 'rgba(15, 23, 42, 0.05)' },
  text: { primary: '#0f172a', secondary: '#334155', tertiary: '#64748b', disabled: '#94a3b8', inverse: '#ffffff' },
  border: { light: '#e2e8f0', medium: '#cbd5e1', strong: '#94a3b8' },
  shadow: { light: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AttendanceContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease;
  @media (max-width: 768px) { padding: 1rem; }
`;

export const AttendanceStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${colors.shadow.light};
  transition: all 0.3s ease;
  &:hover { transform: translateY(-2px); box-shadow: ${colors.shadow.medium}; }
`;

export const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: ${props => {
    switch (props.type) {
      case 'present': return colors.success[100];
      case 'absent': return colors.error[100];
      case 'late': return colors.warning[100];
      default: return colors.primary[100];
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'present': return colors.success[600];
      case 'absent': return colors.error[600];
      case 'late': return colors.warning[600];
      default: return colors.primary[600];
    }
  }};
  svg { width: 24px; height: 24px; }
`;

export const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin-bottom: 0.25rem;
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.text.tertiary};
  font-weight: 500;
`;

export const AttendanceTable = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${colors.shadow.light};
`;

export const TableHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TableTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    background: ${colors.background.tertiary};
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.75rem;
    color: ${colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid ${colors.border.light};
  }
  
  td {
    padding: 1rem;
    border-bottom: 1px solid ${colors.border.light};
    color: ${colors.text.primary};
    font-size: 0.875rem;
  }
  
  tr:hover {
    background: ${colors.background.secondary};
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'present':
        return css`background: ${colors.success[100]}; color: ${colors.success[800]};`;
      case 'absent':
        return css`background: ${colors.error[100]}; color: ${colors.error[800]};`;
      case 'late':
        return css`background: ${colors.warning[100]}; color: ${colors.warning[800]};`;
      default:
        return css`background: ${colors.neutral[100]}; color: ${colors.neutral[800]};`;
    }
  }}
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

// Reusable components
export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  @media (max-width: 768px) { flex-direction: column; gap: 1rem; align-items: flex-start; }
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
  @media (max-width: 768px) { width: 100%; justify-content: space-between; }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
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
  
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
  svg { width: 16px; height: 16px; }
`;

export { colors, fadeIn };
