'use client';

import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/react';

// Universal Pastel Yellow Color System for NXTKYC
export const colorPalette = {
  // Primary Colors (Yellow-based matching the logo)
  primary: {
    50: '#fefdf8',    // Very light cream
    100: '#fef3c7',   // Light pastel yellow
    200: '#fde68a',   // Soft yellow
    300: '#fcd34d',   // Medium yellow
    400: '#fbbf24',   // Vibrant yellow
    500: '#f59e0b',   // Main yellow (from logo)
    600: '#d97706',   // Darker yellow
    700: '#b45309',   // Deep yellow
    800: '#92400e',   // Brown yellow
    900: '#78350f',   // Dark brown
  },
  
  // Secondary/Neutral Colors (Warm grays that complement yellow)
  neutral: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },
  
  // Accent Colors (Complementary warm tones)
  accent: {
    50: '#fef7f0',
    100: '#feeee0',
    200: '#fcdcc2',
    300: '#f9c99a',
    400: '#f5a76d',
    500: '#f18645',
    600: '#e96c2a',
    700: '#c4561f',
    800: '#9c4820',
    900: '#7d3c1c',
  },
  
  // Success Colors (Warm green)
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
  
  // Warning Colors (Enhanced yellow)
  warning: {
    50: '#fefce8',
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
  
  // Error Colors (Warm red)
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
  }
};

// Common animations
export const animations = {
  fadeIn: keyframes`
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  `,
  
  slideInLeft: keyframes`
    from { transform: translateX(-100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,
  
  slideInRight: keyframes`
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  `,
  
  pulse: keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  `,
  
  spin: keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `,
  
  bounce: keyframes`
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  `,
  
  glow: keyframes`
    0%, 100% { box-shadow: 0 0 5px ${colorPalette.primary[300]}; }
    50% { box-shadow: 0 0 20px ${colorPalette.primary[400]}, 0 0 30px ${colorPalette.primary[300]}; }
  `,
  
  gradientShift: keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `
};

// Theme helper functions
export const getThemeColor = (color, shade = 500, isDarkMode = false) => {
  const colorFamily = colorPalette[color];
  if (!colorFamily) return colorPalette.primary[shade];
  
  // Adjust for dark mode if needed
  if (isDarkMode && shade < 500) {
    return colorFamily[900 - shade];
  }
  
  return colorFamily[shade];
};

// Common styled components that can be reused
export const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.isDarkMode 
    ? `linear-gradient(135deg, ${colorPalette.neutral[900]} 0%, ${colorPalette.neutral[800]} 100%)`
    : `linear-gradient(135deg, ${colorPalette.primary[50]} 0%, ${colorPalette.primary[100]} 100%)`
  };
  transition: all 0.3s ease;
`;

export const Card = styled.div`
  background: ${props => props.isDarkMode 
    ? `linear-gradient(145deg, ${colorPalette.neutral[800]}, ${colorPalette.neutral[900]})`
    : `linear-gradient(145deg, white, ${colorPalette.primary[50]})`
  };
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: ${props => props.isDarkMode 
    ? `0 4px 20px rgba(0, 0, 0, 0.3)`
    : `0 4px 20px ${colorPalette.primary[200]}40`
  };
  border: 1px solid ${props => props.isDarkMode 
    ? colorPalette.neutral[700]
    : colorPalette.primary[200]
  };
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.isDarkMode 
      ? `0 8px 25px rgba(0, 0, 0, 0.4)`
      : `0 8px 25px ${colorPalette.primary[300]}60`
    };
  }
`;

export const Button = styled.button`
  background: ${props => {
    if (props.variant === 'secondary') {
      return props.isDarkMode 
        ? colorPalette.neutral[700]
        : colorPalette.primary[100];
    }
    return `linear-gradient(135deg, ${colorPalette.primary[500]} 0%, ${colorPalette.primary[600]} 100%)`;
  }};
  color: ${props => {
    if (props.variant === 'secondary') {
      return props.isDarkMode ? colorPalette.primary[200] : colorPalette.primary[700];
    }
    return 'white';
  }};
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: ${props => {
      if (props.variant === 'secondary') {
        return props.isDarkMode 
          ? colorPalette.neutral[600]
          : colorPalette.primary[200];
      }
      return `linear-gradient(135deg, ${colorPalette.primary[600]} 0%, ${colorPalette.primary[700]} 100%)`;
    }};
    box-shadow: 0 8px 25px ${colorPalette.primary[500]}40;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${props => props.isDarkMode 
    ? colorPalette.neutral[600]
    : colorPalette.primary[200]
  };
  border-radius: 8px;
  font-size: 1rem;
  background: ${props => props.isDarkMode 
    ? colorPalette.neutral[800]
    : colorPalette.primary[50]
  };
  color: ${props => props.isDarkMode 
    ? colorPalette.primary[100]
    : colorPalette.neutral[800]
  };
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${colorPalette.primary[500]};
    box-shadow: 0 0 0 3px ${colorPalette.primary[200]};
    background: ${props => props.isDarkMode 
      ? colorPalette.neutral[700]
      : 'white'
    };
  }
  
  &::placeholder {
    color: ${props => props.isDarkMode 
      ? colorPalette.neutral[400]
      : colorPalette.neutral[500]
    };
  }
`;

// Export all colors for easy access
export { colorPalette as colors };

export default {
  colorPalette,
  animations,
  getThemeColor,
  Container,
  Card,
  Button,
  Input
};