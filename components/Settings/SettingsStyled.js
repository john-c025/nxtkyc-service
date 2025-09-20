'use client';

import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';

// Universal colors (condensed)
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

const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

export const SettingsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease;
  @media (max-width: 768px) { padding: 1rem; }
`;

export const SettingsLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const SettingsSidebar = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 16px;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
  @media (max-width: 768px) {
    position: static;
    padding: 1rem;
  }
`;

export const SidebarTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1rem 0;
`;

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const SidebarNavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? colors.primary[50] : 'transparent'};
  color: ${props => props.active ? colors.primary[600] : colors.text.secondary};
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? colors.primary[50] : colors.background.tertiary};
    color: ${props => props.active ? colors.primary[600] : colors.text.primary};
  }
  
  svg { width: 18px; height: 18px; flex-shrink: 0; }
`;

export const SettingsContent = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 16px;
  min-height: 600px;
`;

export const ContentHeader = styled.div`
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid ${colors.border.light};
  @media (max-width: 768px) { padding: 1.5rem 1.5rem 1rem; }
`;

export const ContentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

export const ContentDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.text.tertiary};
  margin: 0;
  line-height: 1.5;
`;

export const ContentBody = styled.div`
  padding: 2rem;
  @media (max-width: 768px) { padding: 1.5rem; }
`;

export const SettingSection = styled.div`
  margin-bottom: 2rem;
  &:last-child { margin-bottom: 0; }
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1rem 0;
`;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.text.tertiary};
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  &:last-child { margin-bottom: 0; }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.text.secondary};
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.border.medium};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${colors.text.primary};
  background: ${colors.background.primary};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
  
  &:disabled {
    background: ${colors.background.tertiary};
    color: ${colors.text.disabled};
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.border.medium};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${colors.text.primary};
  background: ${colors.background.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
  
  &:disabled {
    background: ${colors.background.tertiary};
    color: ${colors.text.disabled};
    cursor: not-allowed;
  }
`;

export const Toggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ToggleSwitch = styled.button`
  position: relative;
  width: 44px;
  height: 24px;
  border: none;
  border-radius: 12px;
  background: ${props => props.checked ? colors.primary[500] : colors.neutral[300]};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.checked ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all 0.2s ease;
    box-shadow: ${colors.shadow.light};
  }
  
  &:hover {
    background: ${props => props.checked ? colors.primary[600] : colors.neutral[400]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ToggleLabel = styled.span`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  font-weight: 500;
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
      case 'danger':
        return css`
          background: ${colors.error[600]};
          color: white;
          border-color: ${colors.error[600]};
          &:hover {
            background: ${colors.error[700]};
            border-color: ${colors.error[700]};
            transform: translateY(-1px);
            box-shadow: ${colors.shadow.medium};
          }
        `;
      default:
        return css`
          background: ${colors.primary[600]};
          color: white;
          border-color: ${colors.primary[600]};
          &:hover { background: ${colors.primary[700]}; border-color: ${colors.primary[700]}; }
        `;
    }
  }}
  
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
  svg { width: 16px; height: 16px; }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const AlertBox = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return css`
          background: ${colors.success[50]};
          border: 1px solid ${colors.success[200]};
          color: ${colors.success[800]};
        `;
      case 'warning':
        return css`
          background: ${colors.warning[50]};
          border: 1px solid ${colors.warning[200]};
          color: ${colors.warning[800]};
        `;
      case 'error':
        return css`
          background: ${colors.error[50]};
          border: 1px solid ${colors.error[200]};
          color: ${colors.error[800]};
        `;
      default:
        return css`
          background: ${colors.primary[50]};
          border: 1px solid ${colors.primary[200]};
          color: ${colors.primary[800]};
        `;
    }
  }}
  
  svg { width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px; }
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

export { colors, fadeIn };
