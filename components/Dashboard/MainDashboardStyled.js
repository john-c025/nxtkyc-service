'use client';

import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';

// Universal Color System - Pastel Yellow Theme
const colors = {
  // Primary Colors (Yellow-based for warm, professional look)
  primary: {
    50: '#fefdf8',
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
  
  // Accent Colors
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
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

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Main Container
export const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background.primary};
  display: flex;
  color: ${colors.text.primary};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Sidebar
export const Sidebar = styled.aside`
  width: ${props => props.isCollapsed ? '80px' : '280px'};
  background: ${colors.background.primary};
  border-right: 1px solid ${colors.border.light};
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 40;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  
  @media (max-width: 1024px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    width: 280px;
    box-shadow: ${props => props.isOpen ? colors.shadow.xl : 'none'};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 320px;
  }
`;

// Main Content Area
export const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.sidebarCollapsed ? '80px' : '280px'};
  min-height: 100vh;
  background: ${colors.background.secondary};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

// Header/TopBar
export const TopBar = styled.header`
  background: ${colors.background.primary};
  border-bottom: 1px solid ${colors.border.light};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 30;
  backdrop-filter: blur(8px);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Header Content
export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
`;

export const HeaderTitle = styled.div`
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: ${colors.text.primary};
    margin: 0;
    letter-spacing: -0.025em;
  }
  
  p {
    font-size: 0.875rem;
    color: ${colors.text.tertiary};
    margin: 0.25rem 0 0 0;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// Mobile Menu Toggle
export const MobileMenuToggle = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: ${colors.background.tertiary};
  border-radius: 8px;
  color: ${colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.primary[50]};
    color: ${colors.primary[600]};
  }
  
  @media (max-width: 1024px) {
    display: flex;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// Content Layout
export const ContentLayout = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1.5rem;
  }
`;

// Cards
export const Card = styled.div`
  background: ${colors.background.primary};
  border-radius: 16px;
  border: 1px solid ${colors.border.light};
  padding: 1.5rem;
  box-shadow: ${colors.shadow.light};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${colors.shadow.medium};
    border-color: ${colors.primary[200]};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${colors.primary[500]}, ${colors.accent[500]});
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

// Stats Card
export const StatsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: ${props => props.isEditMode ? 'grab' : 'default'};
  border: ${props => props.isEditMode ? `2px dashed ${colors.primary[300]}` : `1px solid ${colors.border.light}`};
  
  &:active {
    cursor: ${props => props.isEditMode ? 'grabbing' : 'default'};
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 800;
    color: ${colors.text.primary};
    line-height: 1;
    margin: 0.5rem 0;
  }
  
  .stat-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.text.secondary};
    margin-bottom: 0.5rem;
  }
  
  .stat-change {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    background: ${props => props.isPositive ? colors.success[50] : colors.error[50]};
    color: ${props => props.isPositive ? colors.success[700] : colors.error[700]};
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

// Chart Container
export const ChartContainer = styled(Card)`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin: 0 0 1.5rem 0;
  }
  
  .chart-wrapper {
    flex: 1;
    min-height: 300px;
    position: relative;
  }
`;

// Card Icon
export const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.variant) {
      case 'success': return colors.success[100];
      case 'warning': return colors.warning[100];
      case 'error': return colors.error[100];
      default: return colors.primary[100];
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'success': return colors.success[600];
      case 'warning': return colors.warning[600];
      case 'error': return colors.error[600];
      default: return colors.primary[600];
    }
  }};
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

// Grid Layouts
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// Tabs
export const TabContainer = styled.div`
  border-bottom: 1px solid ${colors.border.light};
  margin-bottom: 2rem;
`;

export const TabList = styled.div`
  display: flex;
  gap: 0;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TabButton = styled.button`
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: ${props => props.isActive ? colors.primary[600] : colors.text.tertiary};
  font-weight: ${props => props.isActive ? '600' : '500'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  white-space: nowrap;
  border-bottom: 2px solid ${props => props.isActive ? colors.primary[600] : 'transparent'};
  
  &:hover {
    color: ${colors.primary[600]};
    background: ${colors.primary[50]};
  }
  
  &:focus {
    outline: none;
    background: ${colors.primary[50]};
  }
`;

// Buttons
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
          
          &:active {
            transform: translateY(0);
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

// Input Components
export const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid ${colors.border.medium};
  border-radius: 8px;
  background: ${colors.background.primary};
  color: ${colors.text.primary};
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
  
  &::placeholder {
    color: ${colors.text.disabled};
  }
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: ${colors.text.disabled};
  }
`;

// Theme Toggle
export const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: ${colors.background.tertiary};
  color: ${colors.text.secondary};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${colors.primary[50]};
    color: ${colors.primary[600]};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

// Loading States
export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${colors.primary[200]};
  border-top: 2px solid ${colors.primary[600]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const SkeletonLoader = styled.div`
  background: linear-gradient(
    90deg,
    ${colors.neutral[200]},
    ${colors.neutral[100]},
    ${colors.neutral[200]}
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  border-radius: 4px;
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
`;

// Status Indicators
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
      case 'success':
        return css`
          background: ${colors.success[100]};
          color: ${colors.success[800]};
        `;
      case 'warning':
        return css`
          background: ${colors.warning[100]};
          color: ${colors.warning[800]};
        `;
      case 'error':
        return css`
          background: ${colors.error[100]};
          color: ${colors.error[800]};
        `;
      default:
        return css`
          background: ${colors.neutral[100]};
          color: ${colors.neutral[800]};
        `;
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

// Modal/Overlay
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

export const Modal = styled.div`
  background: ${colors.background.primary};
  border-radius: 16px;
  border: 1px solid ${colors.border.light};
  box-shadow: ${colors.shadow.xl};
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${scaleIn} 0.3s ease;
`;

// Data Table
export const Table = styled.div`
  background: ${colors.background.primary};
  border-radius: 12px;
  border: 1px solid ${colors.border.light};
  overflow: hidden;
  
  table {
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
  }
`;

// Notification Badge
export const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: ${colors.error[500]};
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid ${colors.background.primary};
`;

// Company Filter Container
export const CompanyFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.text.secondary};
    white-space: nowrap;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
    
    select {
      width: 100%;
      min-width: unset;
    }
  }
`;

// Export colors for use in other components
export { colors, fadeIn, slideIn, scaleIn, shimmer };