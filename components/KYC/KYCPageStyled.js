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

// Main Content Area
export const MainContent = styled.main`
  flex: 1;
  min-height: 100vh;
  background: ${colors.background.secondary};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }
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
  max-width: 1800px;
  margin: 0 auto;
  width: 100%;
  
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
  
  select {
    padding: 0.5rem 0.75rem;
    border: 1px solid ${colors.border.medium};
    border-radius: 6px;
    background: ${colors.background.primary};
    color: ${colors.text.primary};
    font-size: 0.875rem;
    min-width: 150px;
    
    &:focus {
      outline: none;
      border-color: ${colors.primary[500]};
      box-shadow: 0 0 0 3px ${colors.primary[100]};
    }
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

// Filter and Sort Controls
export const FilterSortContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1.5rem;
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 12px;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 1rem;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 140px;
  
  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  select {
    padding: 0.625rem 0.75rem;
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
    
    &:hover {
      border-color: ${colors.border.strong};
    }
  }
  
  @media (max-width: 768px) {
    min-width: 120px;
  }
`;

export const SortGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 140px;
  
  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .sort-controls {
    display: flex;
    gap: 0.5rem;
    
    select {
      flex: 1;
      padding: 0.625rem 0.75rem;
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
      
      &:hover {
        border-color: ${colors.border.strong};
      }
    }
    
    button {
      padding: 0.625rem;
      border: 1px solid ${colors.border.medium};
      border-radius: 8px;
      background: ${colors.background.primary};
      color: ${colors.text.secondary};
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background: ${colors.primary[50]};
        border-color: ${colors.primary[300]};
        color: ${colors.primary[600]};
      }
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

export const FilterActions = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-left: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    justify-content: stretch;
    
    button {
      flex: 1;
    }
  }
`;

// KYC Specific Components
export const DocumentUploadArea = styled.div`
  border: 2px dashed ${colors.border.medium};
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  background: ${colors.background.secondary};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${colors.primary[400]};
    background: ${colors.primary[50]};
  }
  
  &.drag-over {
    border-color: ${colors.primary[500]};
    background: ${colors.primary[100]};
  }
`;

export const DocumentPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 8px;
  margin-bottom: 0.5rem;
  
  .document-icon {
    width: 40px;
    height: 40px;
    background: ${colors.primary[100]};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colors.primary[600]};
  }
  
  .document-info {
    flex: 1;
    
    h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: ${colors.text.primary};
    }
    
    p {
      margin: 0;
      font-size: 0.75rem;
      color: ${colors.text.tertiary};
    }
  }
`;

export const VerificationStep = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.isCompleted ? colors.success[50] : colors.background.primary};
  border: 1px solid ${props => props.isCompleted ? colors.success[200] : colors.border.light};
  border-radius: 8px;
  margin-bottom: 0.5rem;
  
  .step-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.isCompleted ? colors.success[500] : colors.neutral[200]};
    color: ${props => props.isCompleted ? 'white' : colors.text.tertiary};
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .step-content {
    flex: 1;
    
    h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: ${colors.text.primary};
    }
    
    p {
      margin: 0;
      font-size: 0.75rem;
      color: ${colors.text.tertiary};
    }
  }
`;

// Action Button Container
export const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
  align-items: center;
  min-width: 200px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
  }
`;

// KYC Settings Components
export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const PrivilegeCard = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${colors.shadow.medium};
    border-color: ${colors.primary[200]};
  }
  
  .company-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${colors.border.light};
    
    h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: ${colors.text.primary};
    }
    
    .company-type {
      font-size: 0.75rem;
      color: ${colors.text.tertiary};
      background: ${colors.primary[100]};
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }
  }
`;

export const PrivilegeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const PrivilegeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: ${props => props.isActive ? colors.primary[50] : colors.background.secondary};
  border: 1px solid ${props => props.isActive ? colors.primary[200] : colors.border.light};
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.primary[50]};
    border-color: ${colors.primary[200]};
  }
  
  .privilege-info {
    flex: 1;
    
    .privilege-name {
      font-weight: 600;
      color: ${colors.text.primary};
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
    }
    
    .privilege-description {
      color: ${colors.text.tertiary};
      font-size: 0.75rem;
      margin: 0;
      line-height: 1.4;
    }
  }
  
  .privilege-level {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .level-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: ${props => props.isActive ? colors.primary[500] : colors.neutral[300]};
      color: ${props => props.isActive ? 'white' : colors.text.tertiary};
      font-size: 0.75rem;
      font-weight: 600;
    }
  }
`;

export const PrivilegeForm = styled.form`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  
  .form-header {
    margin-bottom: 1.5rem;
    
    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: ${colors.text.primary};
    }
    
    p {
      margin: 0;
      color: ${colors.text.tertiary};
      font-size: 0.875rem;
    }
  }
  
  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: ${colors.text.secondary};
    }
    
    input, select, textarea {
      padding: 0.75rem;
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
    }
    
    textarea {
      resize: vertical;
      min-height: 80px;
    }
  }
  
  .form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${colors.border.light};
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`;

// View Files Modal Components
export const ViewFilesModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: ${colors.background.primary};
  border-radius: 16px;
  max-width: 1200px;
  max-height: 90vh;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  animation: ${scaleIn} 0.3s ease-out;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${colors.border.light};
  background: ${colors.primary[50]};
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: ${colors.text.primary};
  }
  
  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    color: ${colors.text.secondary};
    transition: all 0.2s ease;
    
    &:hover {
      background: ${colors.primary[100]};
      color: ${colors.primary[600]};
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const ModalBody = styled.div`
  flex: 1;
  overflow: auto;
  padding: 1.5rem 2rem;
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

export const FileList = styled.div`
  min-width: 280px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    min-width: unset;
    max-width: unset;
  }
`;

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid ${props => props.isSelected ? colors.primary[300] : colors.border.light};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isSelected ? colors.primary[50] : colors.background.primary};
  
  &:hover {
    border-color: ${colors.primary[200]};
    background: ${colors.primary[25]};
  }
  
  .file-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 0.75rem;
    
    &.image {
      background: ${colors.success[500]};
    }
    
    &.pdf {
      background: ${colors.error[500]};
    }
    
    &.docx {
      background: ${colors.primary[500]};
    }
    
    &.video {
      background: ${colors.warning[500]};
    }
    
    &.restricted {
      background: ${colors.neutral[400]};
    }
  }
  
  .file-info {
    flex: 1;
    min-width: 0;
    
    .file-name {
      font-weight: 500;
      color: ${colors.text.primary};
      margin: 0 0 0.25rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.875rem;
    }
    
    .file-size {
      color: ${colors.text.tertiary};
      font-size: 0.75rem;
      margin: 0;
    }
  }
`;

export const FilePreview = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  background: ${colors.background.secondary};
  border-radius: 12px;
  overflow: hidden;
  
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: ${colors.background.primary};
    border-bottom: 1px solid ${colors.border.light};
    
    .file-title {
      font-weight: 600;
      color: ${colors.text.primary};
      margin: 0;
    }
    
    .file-actions {
      display: flex;
      gap: 0.5rem;
    }
  }
  
  .preview-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    position: relative;
    
    img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 8px;
    }
    
    video {
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
    }
    
    .no-preview {
      text-align: center;
      color: ${colors.text.tertiary};
      
      .icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: ${colors.text.disabled};
      }
      
      h4 {
        margin: 0 0 0.5rem 0;
        color: ${colors.text.secondary};
      }
      
      p {
        margin: 0;
        font-size: 0.875rem;
      }
    }
  }
`;

// Right Navigation Pane Components
export const RightNavPane = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-320px'};
  width: 320px;
  height: 100vh;
  background: ${colors.background.primary};
  border-left: 1px solid ${colors.border.light};
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 900;
  transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 280px;
    right: ${props => props.isOpen ? '0' : '-280px'};
  }
`;

export const NavPaneHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${colors.border.light};
  background: ${colors.primary[50]};
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: ${colors.primary[500]};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 1.25rem;
    }
    
    .user-details {
      flex: 1;
      
      .user-name {
        font-weight: 600;
        color: ${colors.text.primary};
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
      }
      
      .user-id {
        color: ${colors.text.tertiary};
        font-size: 0.75rem;
        margin: 0;
        font-family: monospace;
      }
    }
  }
`;

export const NavPaneContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
`;

export const NavMenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.isActive ? colors.primary[100] : 'transparent'};
  color: ${props => props.isActive ? colors.primary[700] : colors.text.secondary};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  
  &:hover {
    background: ${colors.primary[50]};
    color: ${colors.primary[600]};
  }
  
  .icon {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export const NavPaneToggle = styled.button`
  position: fixed;
  top: 20px;
  right: ${props => props.isNavOpen ? '340px' : '20px'};
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${colors.primary[500]};
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 950;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${colors.primary[600]};
    transform: scale(1.05);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 768px) {
    right: ${props => props.isNavOpen ? '300px' : '20px'};
  }
`;

// Export colors for use in other components
export { colors, fadeIn, slideIn, scaleIn, shimmer };
