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

// Page Container
export const EmployeesContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Page Header
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

// Filter Section
export const FilterSection = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: ${colors.shadow.light};
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.text.secondary};
`;

export const FilterInput = styled.input`
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
  
  &::placeholder {
    color: ${colors.text.disabled};
  }
`;

export const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid ${colors.border.medium};
  border-radius: 8px;
  background: ${colors.background.primary};
  color: ${colors.text.primary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
    box-shadow: 0 0 0 3px ${colors.primary[100]};
  }
`;

// Employee Grid
export const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const EmployeeCard = styled.div`
  background: ${colors.background.primary};
  border: 1px solid ${colors.border.light};
  border-radius: 16px;
  padding: 1.5rem;
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
    background: linear-gradient(90deg, ${colors.primary[500]}, ${colors.primary[300]});
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

export const EmployeeAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'active': return colors.success[100];
      case 'inactive': return colors.error[100];
      case 'pending': return colors.warning[100];
      default: return colors.primary[100];
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return colors.success[600];
      case 'inactive': return colors.error[600];
      case 'pending': return colors.warning[600];
      default: return colors.primary[600];
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  position: relative;
  border: 3px solid ${colors.background.primary};
  box-shadow: ${colors.shadow.medium};
`;

export const StatusIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'active': return colors.success[500];
      case 'inactive': return colors.error[500];
      case 'pending': return colors.warning[500];
      default: return colors.neutral[400];
    }
  }};
  border: 3px solid ${colors.background.primary};
`;

export const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const EmployeeName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0;
`;

export const EmployeeRole = styled.p`
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin: 0;
`;

export const EmployeeDepartment = styled.p`
  font-size: 0.75rem;
  color: ${colors.text.tertiary};
  margin: 0;
`;

export const EmployeeDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.border.light};
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: ${colors.text.disabled};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const DetailValue = styled.span`
  font-size: 0.875rem;
  color: ${colors.text.primary};
  font-weight: 500;
`;

export const EmployeeActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const ActionButton = styled.button`
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
    width: 14px;
    height: 14px;
  }
`;

// Button Component
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

// Status Badge
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
      case 'active':
        return css`
          background: ${colors.success[100]};
          color: ${colors.success[800]};
        `;
      case 'inactive':
        return css`
          background: ${colors.error[100]};
          color: ${colors.error[800]};
        `;
      case 'pending':
        return css`
          background: ${colors.warning[100]};
          color: ${colors.warning[800]};
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

// Search Input
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

// Pagination
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${colors.border.medium};
  border-radius: 6px;
  background: ${props => props.active ? colors.primary[500] : colors.background.primary};
  color: ${props => props.active ? 'white' : colors.text.secondary};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? colors.primary[600] : colors.primary[50]};
    border-color: ${colors.primary[300]};
    color: ${props => props.active ? 'white' : colors.primary[600]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Modal Components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background: ${colors.background.primary};
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${colors.shadow.xl};
  animation: ${fadeIn} 0.3s ease;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${colors.border.light};
  background: ${colors.background.secondary};
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0;
`;

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: ${colors.text.tertiary};
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${colors.background.tertiary};
    color: ${colors.text.primary};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const ModalBody = styled.div`
  padding: 0;
  max-height: calc(90vh - 180px);
  overflow-y: auto;
  
  /* Ensure content is visible above modal actions */
  margin-bottom: 0;
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.border.light};
  background: ${colors.background.secondary};
`;

export const TabButton = styled.button`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  color: ${props => props.active ? colors.primary[600] : colors.text.tertiary};
  font-weight: ${props => props.active ? '600' : '500'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: ${colors.primary[600]};
    background: ${colors.primary[50]};
  }
  
  ${props => props.active && css`
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: ${colors.primary[600]};
    }
  `}
`;

export const TabContent = styled.div`
  padding: 2rem;
  padding-bottom: 3rem; /* Extra padding for modal actions */
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    padding-bottom: 2.5rem;
  }
`;

export const EmployeeProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${colors.border.light};
`;

export const LargeAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'active': return colors.success[100];
      case 'inactive': return colors.error[100];
      case 'pending': return colors.warning[100];
      default: return colors.primary[100];
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return colors.success[600];
      case 'inactive': return colors.error[600];
      case 'pending': return colors.warning[600];
      default: return colors.primary[600];
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.5rem;
  border: 4px solid ${colors.background.primary};
  box-shadow: ${colors.shadow.medium};
  position: relative;
`;

export const ProfileInfo = styled.div`
  flex: 1;
`;

export const ProfileName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

export const ProfileRole = styled.p`
  font-size: 1rem;
  color: ${colors.text.secondary};
  margin: 0 0 0.5rem 0;
`;

export const ProfileCompany = styled.p`
  font-size: 0.875rem;
  color: ${colors.text.tertiary};
  margin: 0;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

export const DetailsSection = styled.div`
  background: ${colors.background.secondary};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${colors.border.light};
`;

export const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.text.primary};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${colors.primary[600]};
  }
`;

export const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const DetailRowLabel = styled.span`
  font-size: 0.875rem;
  color: ${colors.text.tertiary};
  font-weight: 500;
`;

export const DetailRowValue = styled.span`
  font-size: 0.875rem;
  color: ${colors.text.primary};
  font-weight: 500;
  text-align: right;
`;

export const EditableInput = styled.input`
  width: 100%;
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
  
  &:disabled {
    background: ${colors.background.tertiary};
    color: ${colors.text.disabled};
    cursor: not-allowed;
  }
`;

export const EditableField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const FieldLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.text.secondary};
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid ${colors.border.light};
  background: ${colors.background.secondary};
  position: sticky;
  bottom: 0;
  z-index: 10;
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
    flex-direction: column-reverse;
    
    button {
      width: 100%;
    }
  }
`;

export const ImageUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const ImagePreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${colors.background.tertiary};
  border: 2px dashed ${colors.border.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text.tertiary};
  font-size: 0.875rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary[400]};
    color: ${colors.primary[600]};
  }
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

// Export colors for consistency
export { colors, fadeIn, slideIn };
