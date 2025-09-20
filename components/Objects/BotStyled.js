'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const bounceIn = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`;

// Pulse animation on hover
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.07);
  }
  100% {
    transform: scale(1);
  }
`;

// Add animation definitions
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

export const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffeacf'};
  display: flex;
  position: relative;
  color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
  transition: background-color 0.3s ease, color 0.3s ease;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FloatingChatButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 9999;
  transition: all 0.3s ease;
  animation: ${bounceIn} 0.4s ease-out;

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
    transition: transform 0.2s ease;
  }

  svg {
    width: 24px;
    height: 24px;
    color: white;
    transition: transform 0.2s ease;
  }

  &:hover {
    animation: ${pulse} 0.6s ease-in-out;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .notification-dot {
    position: absolute;
    top: 0;
    right: 0;
    width: 12px;
    height: 12px;
    background: #ef4444;
    border-radius: 50%;
    border: 2px solid ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  }
`;

export const ChatContainer = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  width: 400px;
  height: 500px;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 999;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.9)'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  z-index: 9999;
`;

export const ChatHeader = styled.div`
  padding: 1rem;
  background: ${props => props.isDarkMode ? '#262626' : '#f3f4f6'};
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: ${props => props.isDarkMode ? '#ffffff' : '#1f2937'};
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: ${props => props.isDarkMode ? '#94a3b8' : '#6b7280'};
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      color: ${props => props.isDarkMode ? '#ffffff' : '#1f2937'};
      background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    }
  }
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
    border-radius: 4px;
  }
`;

export const Message = styled.div`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  line-height: 1.4;
  animation: ${fadeIn} 0.3s ease;

  ${props => props.isBot ? `
    background: ${props.isDarkMode ? '#262626' : '#f3f4f6'};
    color: ${props.isDarkMode ? '#e2e8f0' : '#1f2937'};
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  ` : `
    background: ${props.isDarkMode ? '#ff840b' : '#f97316'};
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  `}
`;

export const QuickChoices = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${props => props.isDarkMode ? '#262626' : '#f3f4f6'};
  border-top: 1px solid ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
  width: 100%;
  min-width: 0;

  /* Hide scrollbar in WebKit browsers */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.isDarkMode ? '#444' : '#ccc'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const ChoiceButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: ${props => props.isDarkMode ? '#333333' : '#ffffff'};
  border: 1px solid ${props => props.isDarkMode ? '#404040' : '#e5e7eb'};
  border-radius: 8px;
  font-size: 0.75rem;
  color: ${props => props.isDarkMode ? '#e2e8f0' : '#1f2937'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isDarkMode ? '#404040' : '#f9fafb'};
    border-color: ${props => props.isDarkMode ? '#525252' : '#d1d5db'};
  }
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'},
    ${props => props.isDarkMode ? '#ff840b' : '#f97316'}
  );
  animation: spin 1s linear infinite;
  
  &::before {
    content: '';
    position: absolute;
    inset: 5px;
    border-radius: 50%;
    background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export const MobileMenuTrigger = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 50;
  padding: 0.75rem;
  background: ${props => props.isDarkMode ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background-color 0.3s ease;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.isDarkMode ? '#fff' : '#1a1a1a'};
    transition: color 0.3s ease;
  }

  &:hover {
    background: ${props => props.isDarkMode ? 'rgba(38, 38, 38, 0.8)' : 'rgba(245, 245, 245, 0.8)'};
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
  z-index: 40;
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
  padding: 2rem 2.5rem;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#FFFAF6'};
  transition: all 0.3s ease-in-out;

  @media (max-width: 1280px) {
    margin-left: ${props => props.isSidebarOpen ? '250px' : '0'};
    padding: 2rem;
  }

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 1.5rem;
  }

  @media (max-width: 640px) {
    padding: 1rem;
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
  padding-bottom: 2rem;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  margin-bottom: 3rem;

  .top-content {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .welcome-section {
    h1 {
      color: ${props => props.isDarkMode ? '#fdba74' : '#111827'};
      font-size: 2.25rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: ${props => props.isDarkMode ? '#fed7aa' : '#6b7280'};
      font-size: 1.1rem;
    }
  }

  .datetime-section {
    padding: 1rem 1.5rem;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(145deg, #262626, #1a1a1a)'
      : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
    border-radius: 12px;
    border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    box-shadow: 0 4px 12px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.2)'
      : 'rgba(249, 115, 22, 0.1)'};
    
    .time {
      font-size: 1.75rem;
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
        width: 1rem;
        height: 1rem;
        color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
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
        font-size: 1.5rem;
      }
    }
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const DraggableWidget = styled.div`
  padding: 1rem;
  background: ${props => props.isEditMode 
    ? 'transparent'
    : (props.isDarkMode 
      ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
      : 'linear-gradient(145deg, #ffffff, #fffaf7)')};
  border-radius: 12px;
  margin-bottom: 1rem;
  cursor: ${props => props.isEditMode ? 'grab' : 'default'};
  transition: all 0.3s ease;
  border: 2px solid ${props => props.isEditMode 
    ? (props.isDarkMode ? 'rgba(255, 132, 11, 0.5)' : 'rgba(249, 115, 22, 0.5)')
    : 'transparent'};
  box-shadow: ${props => props.isEditMode 
    ? (props.isDarkMode ? '0 0 0 2px rgba(255, 132, 11, 0.3)' : '0 0 0 2px rgba(249, 115, 22, 0.3)')
    : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  position: relative;
  touch-action: none;

  &:hover {
    transform: ${props => props.isEditMode ? 'translateY(-2px)' : 'none'};
    box-shadow: ${props => props.isEditMode 
      ? (props.isDarkMode ? '0 4px 8px rgba(255, 132, 11, 0.2)' : '0 4px 8px rgba(249, 115, 22, 0.2)')
      : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  }

  &[data-dragging="true"] {
    transform: scale(1.02);
    box-shadow: ${props => props.isDarkMode 
      ? '0 8px 16px rgba(255, 132, 11, 0.3)' 
      : '0 8px 16px rgba(249, 115, 22, 0.3)'};
    z-index: 10;
  }

  &::before {
    content: '⋮⋮';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    opacity: ${props => props.isEditMode ? 0.7 : 0};
    transition: opacity 0.2s ease;
    color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  }

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .widget-title {
    font-weight: 500;
    color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
  }

  .widget-actions {
    display: flex;
    gap: 0.5rem;
  }

  .drag-handle {
    cursor: move;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    transition: color 0.3s ease;

    &:hover {
      color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
    }
  }
`;

export const WidgetPreview = styled.div`
  width: 100%;
  height: 120px;
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 132, 11, 0.1)' 
    : 'rgba(249, 115, 22, 0.05)'};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  
  svg {
    width: 2rem;
    height: 2rem;
    color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  }
`;

export const ConfigurationOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${props => props.isDarkMode 
    ? 'rgba(0, 0, 0, 0.7)' 
    : 'rgba(0, 0, 0, 0.5)'};
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.isVisible ? 1 : 0};
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

export const Card = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  box-shadow: inset 0 1px 1px ${props => props.isDarkMode 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.05)'};

  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  h3 {
    color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: 0.025em;
    margin: 0;
    position: relative;
    padding-bottom: 0.75rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 2.5rem;
      height: 3px;
      background: linear-gradient(90deg, #ff840b, transparent);
      border-radius: 3px;
    }
  }

  .stats-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }

  .stat-value {
    font-size: 2.75rem;
    font-weight: 700;
    line-height: 1.2;
    background: linear-gradient(90deg, #ff840b, #ea580c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.025em;
    margin: 1rem 0;
    transition: transform 0.3s ease;
    
    &.currency::before {
      content: '₱';
      font-size: 1.75rem;
      vertical-align: top;
      margin-right: 0.25rem;
      opacity: 0.8;
    }
  }

  .stat-change {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border-radius: 999px;
    font-size: 1rem;
    font-weight: 500;
    background: ${props => props.isPositive ? 
      (props.isDarkMode ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)') :
      (props.isDarkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)')};
    color: ${props => props.isPositive ? '#22c55e' : '#ef4444'};
    transition: all 0.3s ease;
    
    svg {
      width: 1.25rem;
      height: 1.25rem;
      transition: transform 0.3s ease;
    }

    &:hover svg {
      transform: translateY(-2px);
    }
  }

  .card-footer {
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }

  .progress-bar {
    height: 4px;
    width: 100%;
    background: ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};
    border-radius: 2px;
    overflow: hidden;
    margin-top: 0.75rem;

    .progress {
      height: 100%;
      background: linear-gradient(90deg, #ff840b, #ea580c);
      width: ${props => props.progress || '0'}%;
      transition: width 1s ease-in-out;
    }
  }

  data-card: true;
  
  transform-style: preserve-3d;
  perspective: 1000px;
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 20px 40px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(249, 115, 22, 0.15)'};
    
    &::after {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      125deg,
      ${props => props.isDarkMode 
        ? 'rgba(255, 132, 11, 0.1)' 
        : 'rgba(249, 115, 22, 0.05)'},
      transparent 50%
    );
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.4s ease;
  }

  .info-tooltip {
    position: absolute;
    top: 1rem;
    right: 1rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover .info-tooltip {
    opacity: 1;
  }
`;

export const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 100%;
`;

export const ChartContainer = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border-radius: 20px;
  padding: 2.5rem;
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  min-height: 400px;
  cursor: ${props => props.isEditMode ? 'move' : 'default'};
  border: 2px solid ${props => props.isEditMode ? 
    (props.isDarkMode ? '#ff840b' : '#f97316') : 'transparent'};
  
  &:hover {
    transform: translateY(-25px);
    box-shadow: 0 20px 40px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(249, 115, 22, 0.15)'};
  }

  &.draggable:hover {
    transform: ${props => props.isEditMode ? 'translateY(-4px)' : 'none'};
    box-shadow: ${props => props.isEditMode ? 
      '0 10px 15px rgba(0, 0, 0, 0.2)' : 'none'};
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
  }

  h3 {
    color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
  }

  .chart-wrapper {
    height: 300px;
    margin: 2rem 0;
    position: relative;
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
  overflow-x: auto;
  border-radius: 0.5rem;
  margin: 2.5rem 0;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .table-container {
    min-width: 100%;
    overflow-x: auto;
    border-radius: 0.75rem;
    background: ${props => props.isDarkMode ? '#1F2937' : '#e5e7eb'};
  }

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

  h3 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1rem;
    color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
  }
`;

export const ReportsTable = styled.div`
  width: 100%;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  border-radius: 0.75rem;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  }

  th {
    background: ${props => props.isDarkMode ? '#262626' : '#f97316'};
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
    color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
    border-bottom: 1px solid ${props => props.isDarkMode ? 'rgba(75, 85, 99, 0.4)' : '#e5e7eb'};
    background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  }

  tr {
    background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${props => props.isDarkMode ? '#262626' : '#fff5ed'};
    }
  }
`;

export const TablePaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background-color: ${props => props.isDarkMode ? '#374151' : '#f97316'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#ffffff'};
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: ${props => props.isDarkMode ? '#4B5563' : '#ea580c'};
    }
    
    &:disabled {
      background-color: ${props => props.isDarkMode ? '#1F2937' : '#d1d5db'};
      color: ${props => props.isDarkMode ? '#6B7280' : '#9CA3AF'};
      cursor: not-allowed;
    }
  }
  
  .page-info {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#D1D5DB' : '#4B5563'};
  }
  
  .page-size-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    span {
      color: ${props => props.isDarkMode ? '#D1D5DB' : '#4B5563'};
    }
    
    select {
      background: ${props => props.isDarkMode ? '#374151' : '#f97316'};
      color: ${props => props.isDarkMode ? '#ffffff' : '#ffffff'};
      border: none;
      border-radius: 0.375rem;
      padding: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: ${props => props.isDarkMode ? '#4B5563' : '#ea580c'};
      }
      
      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${props => props.isDarkMode ? '#4B5563' : 'rgba(249, 115, 22, 0.4)'};
      }
    }
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

export const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.000rem;
  white-space: nowrap;
  
  ${props => props.isActive ? `
    background: ${props.isDarkMode ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.1)'};
    color: ${props.isDarkMode ? '#ff840b' : '#ea580c'};
    
    svg {
      color: ${props.isDarkMode ? '#ff840b' : '#ea580c'};
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #ff840b, #ea580c);
      border-radius: 1px;
    }
  ` : `
    background: transparent;
    color: ${props.isDarkMode ? '#9ca3af' : '#6b7280'};
    
    svg {
      color: ${props.isDarkMode ? '#9ca3af' : '#6b7280'};
    }
    
    &:hover {
      background: ${props.isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
      color: ${props.isDarkMode ? '#ff840b' : '#ea580c'};
      
      svg {
        color: ${props.isDarkMode ? '#ff840b' : '#ea580c'};
      }
    }
  `}

  &:focus {
    outline: none;
    ring: 2px solid ${props => props.isDarkMode ? '#ff840b' : '#ea580c'};
    ring-offset: 2px;
  }
`;

export const Section = styled.section`
  margin-bottom: 3.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ContentGroup = styled.div`
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    color: ${props => props.isDarkMode ? '#fdba74' : '#111827'};
    letter-spacing: 0.025em;
  }

  .chart-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .activity-feed {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 300px;
    overflow-y: auto;
    padding-right: 1rem;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: ${props => props.isDarkMode ? '#374151' : '#f3f4f6'};
    }

    &::-webkit-scrollbar-thumb {
      background: ${props => props.isDarkMode ? '#4b5563' : '#d1d5db'};
      border-radius: 2px;
    }
  }
`;

// Add new responsive components
export const StatsCard = styled(Card)`
  cursor: ${props => props.isEditMode ? 'move' : 'default'};
  border: 2px solid ${props => props.isEditMode ? 
    (props.isDarkMode ? '#ff840b' : '#f97316') : 'transparent'};
  
  &.draggable:hover {
    transform: ${props => props.isEditMode ? 'translateY(-4px)' : 'none'};
    box-shadow: ${props => props.isEditMode ? 
      '0 10px 15px rgba(0, 0, 0, 0.2)' : 'none'};
  }
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

export const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid ${props => props.isDarkMode ? '#374151' : '#e5e7eb'};
  background: ${props => props.isDarkMode ? '#1f2937' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
  width: 100%;
  max-width: 300px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ff840b;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    transition: color 0.3s ease;
  }

  &:focus::placeholder {
    color: ${props => props.isDarkMode ? '#d1d5db' : '#9ca3af'};
  }
`;

export const ScrollIndicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff840b, #ea580c);
  width: ${props => props.scrollProgress}%;
  z-index: 1000;
  transition: width 0.1s ease;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;

  &[data-focused="true"] label,
  &[data-has-value="true"] label {
    transform: translateY(-130%) scale(0.8);
    color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  }

  label {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    transition: all 0.3s ease;
    transform-origin: left;
    pointer-events: none;
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  background: ${props => props.isDarkMode ? '#374151' : '#ffffff'};
  color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background: inherit;
  }

  ${props => props.isVisible && `
    opacity: 1;
    transform: translateY(0);
  `}
`;

export const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

export const SkeletonLoader = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.isDarkMode ? '#262626' : '#f3f4f6'},
    ${props => props.isDarkMode ? '#333333' : '#e5e7eb'},
    ${props => props.isDarkMode ? '#262626' : '#f3f4f6'}
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export const CardActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;

  [data-card]:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  button {
    padding: 0.5rem;
    background: transparent;
    border: none;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
    }
  }
`;

export const CardBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  background: ${props => props.type === 'success' 
    ? 'rgba(34, 197, 94, 0.1)' 
    : props.type === 'warning'
    ? 'rgba(234, 179, 8, 0.1)'
    : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.type === 'success' 
    ? '#22c55e' 
    : props.type === 'warning'
    ? '#eab308'
    : '#ef4444'};
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.025em;
`;

export const TrendSparkline = styled.div`
  height: 30px;
  width: 100%;
  margin-top: 0.5rem;
  position: relative;

  svg {
    width: 100%;
    height: 100%;
    
    path {
      stroke: ${props => props.isPositive ? '#22c55e' : '#ef4444'};
      stroke-width: 2;
      fill: none;
    }

    path.area {
      fill: ${props => props.isPositive 
        ? 'rgba(34, 197, 94, 0.1)' 
        : 'rgba(239, 68, 68, 0.1)'};
      stroke: none;
    }
  }
`;

// New component for card icons
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
  cursor: move;
  position: relative;

  &::before {
    content: '⋮⋮';
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    font-size: 1rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  }

  &:hover::before {
    opacity: 0.7;
  }

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

// Enhanced Card with glass morphism effect
export const GlassCard = styled(Card)`
  background: ${props => props.isDarkMode 
    ? 'rgba(26, 26, 26, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(12px);
  border: 1px solid ${props => props.isDarkMode 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.7)'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      125deg,
      ${props => props.isDarkMode 
        ? 'rgba(255, 255, 255, 0.03)' 
        : 'rgba(255, 255, 255, 0.3)'},
      transparent
    );
    border-radius: 20px;
    z-index: -1;
  }
`;

// Animated metric display
export const MetricDisplay = styled.div`
  position: relative;
  padding: 1.5rem;
  border-radius: 12px;
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 132, 11, 0.1)' 
    : 'rgba(249, 115, 22, 0.05)'};
  
  .metric-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
    animation: countUp 2s ease-out forwards;
  }

  .metric-label {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    margin-top: 0.5rem;
  }

  @keyframes countUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Interactive data table
export const DataTable = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
  background: ${props => props.isDarkMode 
    ? 'rgba(26, 26, 26, 0.7)' 
    : 'rgba(255, 255, 255, 0.7)'};
  backdrop-filter: blur(12px);

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    
    th, td {
      padding: 1.25rem;
      text-align: left;
      transition: background-color 0.3s ease;
    }

    th {
      background: ${props => props.isDarkMode 
        ? 'rgba(255, 132, 11, 0.1)' 
        : 'rgba(249, 115, 22, 0.05)'};
      font-weight: 600;
      color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      position: sticky;
      top: 0;
      z-index: 10;
    }

    tr {
      transition: transform 0.3s ease, background-color 0.3s ease;

      &:hover {
        transform: translateX(4px);
        background: ${props => props.isDarkMode 
          ? 'rgba(255, 132, 11, 0.05)' 
          : 'rgba(249, 115, 22, 0.02)'};
      }
    }

    td {
      border-bottom: 1px solid ${props => props.isDarkMode 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.1)'};
    }
  }
`;

// Animated progress bar
export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #ff840b, #ea580c);
    border-radius: 4px;
    transition: width 1s ease-in-out;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

// Enhanced filter button
export const FilterButton = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  background: ${props => props.isDarkMode 
    ? 'rgba(255, 132, 11, 0.1)' 
    : 'rgba(249, 115, 22, 0.05)'};
  color: ${props => props.isDarkMode ? '#fdba74' : '#ea580c'};
  border: 1px solid ${props => props.isDarkMode 
    ? 'rgba(255, 132, 11, 0.2)' 
    : 'rgba(249, 115, 22, 0.1)'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-weight: 500;
  font-size: 0.975rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  &:hover {
    background: ${props => props.isDarkMode 
      ? 'rgba(255, 132, 11, 0.15)' 
      : 'rgba(249, 115, 22, 0.1)'};
    border-color: ${props => props.isDarkMode 
      ? 'rgba(255, 132, 11, 0.3)' 
      : 'rgba(249, 115, 22, 0.2)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0px);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.isDarkMode ? 'rgba(255, 132, 11, 0.3)' : 'rgba(249, 115, 22, 0.3)'};
  }
`;

// Animated status badge
export const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'success': return props.isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)';
      case 'warning': return props.isDarkMode ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.1)';
      case 'error': return props.isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)';
      default: return props.isDarkMode ? 'rgba(107, 114, 128, 0.1)' : 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'success': return '#22c55e';
      case 'warning': return '#eab308';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0.75rem;
    top: 50%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    transform: translateY(-50%);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

export const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  background: ${props => props.isDarkMode ? '#1a202c' : '#f7fafc'};
  border-radius: 12px;
  min-height: 200px;
  transition: all 0.3s ease;

  &.dragging {
    background: ${props => props.isDarkMode 
      ? 'rgba(255, 132, 11, 0.05)' 
      : 'rgba(249, 115, 22, 0.05)'};
  }
`;

// Add indicators for summary and graph areas
export const SummaryArea = styled.div`
  border: ${props => props.isEditMode ? '1px dashed rgba(255, 132, 11, 0.5)' : 'none'};
  padding: 1rem;
  margin-bottom: 1rem;
`;

export const GraphArea = styled.div`
  border: ${props => props.isEditMode ? '1px dashed rgba(255, 132, 11, 0.5)' : 'none'};
  padding: 1rem;
`;

export const ResponsiveContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

export const EnhancedButton = styled.button`
  position: relative;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  background: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    box-shadow: 0 0 10px ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  }

  &:active::after {
    transform: scale(4);
    opacity: 0;
    transition: 0s;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 60%);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
    transition: all 0.5s ease-out;
  }
`;

export const AnimatedCard = styled(Card)`
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const DailyDataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const DailyStatsCard = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .stat-icon {
    padding: 0.75rem;
    border-radius: 0.75rem;
    background: ${props => props.isDarkMode ? 'rgba(255, 132, 11, 0.1)' : 'rgba(249, 115, 22, 0.1)'};
    color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
  }

  .stat-title {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    font-weight: 500;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    margin: 0.5rem 0;
  }

  .stat-comparison {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  .stat-change {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: ${props => props.isPositive ? '#10b981' : '#ef4444'};
  }

  .stat-period {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }
`;

export const DailyTableContainer = styled(ReportsTableContainer)`
  margin-top: 2rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1px solid ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  
  .daily-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding: 0 1rem;
  }

  .daily-title {
    font-size: 1.25rem;
    font-weight: 500;
    color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
  }

  .daily-actions {
    display: flex;
    gap: 1rem;
  }

  .daily-filter {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: ${props => props.isDarkMode ? 'rgba(255, 132, 11, 0.1)' : 'rgba(249, 115, 22, 0.1)'};
    color: ${props => props.isDarkMode ? '#ff840b' : '#f97316'};
    border: 1px solid ${props => props.isDarkMode ? 'rgba(255, 132, 11, 0.2)' : 'rgba(249, 115, 22, 0.2)'};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: ${props => props.isDarkMode ? 'rgba(255, 132, 11, 0.2)' : 'rgba(249, 115, 22, 0.2)'};
    }
  }
`;
