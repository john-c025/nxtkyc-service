import styled from 'styled-components';

export const ProfileHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  padding: 2.5rem;
  margin-bottom: 2rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border-radius: 1.5rem;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  box-shadow: ${props => props.isDarkMode 
    ? '0 4px 20px rgba(0, 0, 0, 0.2)' 
    : '0 4px 20px rgba(249, 115, 22, 0.1)'};

  .profile-details {
    margin-bottom: 1rem;
    
    p {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
      
      &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      }
    }
  }

  .profile-badges {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .profile-score {
    text-align: center;
    width: 250px;
    padding: 1rem;
    
    .score-details {
      margin-top: 1rem;
      
      .score-label {
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
        margin-bottom: 0.5rem;
      }
      
      .score-value {
        font-size: 2rem;
        font-weight: 700;
        color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
        margin-bottom: 0.25rem;
      }
      
      .score-category {
        font-size: 1rem;
        font-weight: 500;
        color: ${props => props.isDarkMode ? '#86efac' : '#4ade80'};
        padding: 0.25rem 1rem;
        border-radius: 1rem;
        background: ${props => props.isDarkMode ? 'rgba(74, 222, 128, 0.1)' : 'rgba(74, 222, 128, 0.1)'};
        display: inline-block;
      }
    }
  }
`;

export const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #333333, #262626)' 
    : 'linear-gradient(145deg, #f97316, #fdba74)'};
  position: relative;
  overflow: hidden;
  border: 4px solid ${props => props.isDarkMode ? '#333333' : '#ffffff'};
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/default-avatar.png') center/cover;
    opacity: 0.7;
  }
`;

export const ProfileInfo = styled.div`
  flex: 1;
  
  h2 {
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(90deg, #fdba74, #fed7aa)' 
      : 'linear-gradient(90deg, #f97316, #fdba74)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    letter-spacing: 0.025em;
  }
  
  p {
    font-size: 0.95rem;
    opacity: 0.8;
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    }
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

export const StatCard = styled.div`
  padding: 1.5rem;
  border-radius: 1.25rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 2px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  transition: all 0.3s ease;

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    }

    .trend-indicator {
      font-size: 0.875rem;
      font-weight: 500;
      color: ${props => props.trend === 'down' 
        ? (props.isDarkMode ? '#fca5a5' : '#ef4444')
        : (props.isDarkMode ? '#86efac' : '#4ade80')};
    }
  }

  .stat-value {
    font-size: 1.875rem;
    font-weight: 700;
    color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    margin-bottom: 1rem;
  }

  .stat-subtitle {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.2)' 
      : 'rgba(249, 115, 22, 0.1)'};
  }
`;

export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => props.status === 'paid' && `
    background: ${props.isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
    color: ${props.isDarkMode ? '#22c55e' : '#059669'};
  `}
  
  ${props => props.status === 'pending' && `
    background: ${props.isDarkMode ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.1)'};
    color: ${props.isDarkMode ? '#eab308' : '#b45309'};
  `}
`;

export const GraphContainer = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  padding: 2rem;
  border-radius: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  h2, h3 {
    color: ${props => props.isDarkMode ? '#fdba74' : '#ff840b'};
    font-weight: 600;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 2rem;
      height: 2px;
      background: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      border-radius: 2px;
    }
  }

  &.credit-report {
    .tips-card {
      background: ${props => props.isDarkMode 
        ? 'rgba(249, 115, 22, 0.15)' 
        : 'rgba(249, 115, 22, 0.08)'};
      border: 1px solid ${props => props.isDarkMode 
        ? 'rgba(249, 115, 22, 0.3)' 
        : 'rgba(249, 115, 22, 0.15)'};
      border-radius: 1rem;
      backdrop-filter: blur(8px);
      
      .text-blue-600 {
        color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
        font-weight: 500;
        transition: color 0.2s ease;
        
        &:hover {
          color: ${props => props.isDarkMode ? '#fed7aa' : '#ff840b'};
        }
      }
    }
  }
  
  &:hover {
    box-shadow: 0 8px 24px ${props => props.isDarkMode 
      ? 'rgba(249, 115, 22, 0.2)' 
      : 'rgba(249, 115, 22, 0.08)'};
    transform: translateY(-2px);
  }
`;

export const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const ActivityCard = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => props.isDarkMode 
      ? 'rgba(249, 115, 22, 0.2)' 
      : 'rgba(249, 115, 22, 0.08)'};
  }
  
  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    .activity-type {
      font-weight: 600;
      color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    }
    
    .activity-date {
      font-size: 0.875rem;
      opacity: 0.7;
    }
  }
  
  .activity-content {
    font-size: 0.95rem;
    line-height: 1.5;
    color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
  }
`;

export const TabContainer = styled.div`
  margin: 2rem 0;
`;

export const TabList = styled.div`
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
`;

export const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  color: ${props => props.isActive 
    ? (props.isDarkMode ? '#fdba74' : '#f97316')
    : (props.isDarkMode ? '#666666' : '#6b7280')};
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.isActive 
      ? (props.isDarkMode ? '#fdba74' : '#f97316')
      : 'transparent'};
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    
    &::after {
      background: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      opacity: ${props => props.isActive ? 1 : 0.5};
    }
  }
`;

export const InfoCard = styled.div`
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  box-shadow: ${props => props.isDarkMode 
    ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
    : '0 4px 12px rgba(249, 115, 22, 0.05)'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.isDarkMode ? '#404040' : 'rgba(249, 115, 22, 0.2)'};
    box-shadow: ${props => props.isDarkMode 
      ? '0 8px 24px rgba(0, 0, 0, 0.4)' 
      : '0 8px 24px rgba(249, 115, 22, 0.08)'};
  }
  
  .title {
    font-size: 1.1rem;
    font-weight: 500;
    color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    margin-bottom: 1rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 2rem;
      height: 2px;
      background: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      border-radius: 2px;
      opacity: 0.7;
    }
  }
  
  .content {
    display: grid;
    gap: 1rem;
    color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  .progress {
    height: 100%;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(90deg, #f97316, #fdba74)' 
      : 'linear-gradient(90deg, #f97316, #fdba74)'};
    width: ${props => props.progress}%;
    transition: width 1s ease;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.1),
        transparent
      );
      animation: shimmer 2s infinite;
    }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    if (props.type === 'success') {
      return props.isDarkMode 
        ? 'rgba(74, 222, 128, 0.15)' 
        : 'rgba(74, 222, 128, 0.1)';
    } else if (props.type === 'warning') {
      return props.isDarkMode 
        ? 'rgba(249, 115, 22, 0.15)' 
        : 'rgba(249, 115, 22, 0.1)';
    }
    return props.isDarkMode 
      ? 'rgba(239, 68, 68, 0.15)' 
      : 'rgba(239, 68, 68, 0.1)';
  }};
  color: ${props => {
    if (props.type === 'success') {
      return props.isDarkMode ? '#86efac' : '#4ade80';
    } else if (props.type === 'warning') {
      return props.isDarkMode ? '#fdba74' : '#f97316';
    }
    return props.isDarkMode ? '#fca5a5' : '#ef4444';
  }};
  border: 1px solid ${props => {
    if (props.type === 'success') {
      return props.isDarkMode 
        ? 'rgba(74, 222, 128, 0.2)' 
        : 'rgba(74, 222, 128, 0.2)';
    } else if (props.type === 'warning') {
      return props.isDarkMode 
        ? 'rgba(249, 115, 22, 0.2)' 
        : 'rgba(249, 115, 22, 0.2)';
    }
    return props.isDarkMode 
      ? 'rgba(239, 68, 68, 0.2)' 
      : 'rgba(239, 68, 68, 0.2)';
  }};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${props => {
      if (props.type === 'success') {
        return props.isDarkMode 
          ? 'rgba(74, 222, 128, 0.2)' 
          : 'rgba(74, 222, 128, 0.2)';
      } else if (props.type === 'warning') {
        return props.isDarkMode 
          ? 'rgba(249, 115, 22, 0.2)' 
          : 'rgba(249, 115, 22, 0.2)';
      }
      return props.isDarkMode 
        ? 'rgba(239, 68, 68, 0.2)' 
        : 'rgba(239, 68, 68, 0.2)';
    }};
  }
`;

export const DataTable = styled.div`
  width: 100%;
  overflow: hidden;
  border-radius: 1rem;
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  background: ${props => props.isDarkMode 
    ? '#1a1a1a' 
    : '#ffffff'};
  
  .header {
    display: grid;
    grid-template-columns: repeat(${props => props.columns}, 1fr);
    padding: 1rem;
    background: ${props => props.isDarkMode 
      ? '#262626' 
      : '#f9fafb'};
    border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    
    span {
      font-weight: 600;
      color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }
  
  .row {
    display: grid;
    grid-template-columns: repeat(${props => props.columns}, 1fr);
    padding: 1rem;
    border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    transition: all 0.2s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: ${props => props.isDarkMode 
        ? '#262626' 
        : '#f9fafb'};
    }
    
    span {
      color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
      font-size: 0.95rem;
    }
  }
`;

export const MetricCard = styled.div`
  padding: 1rem;
  background: ${props => props.isDarkMode 
    ? 'rgba(38, 38, 38, 0.5)' 
    : 'rgba(249, 250, 251, 0.5)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 0.75rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.2)' 
      : 'rgba(249, 115, 22, 0.1)'};
  }
`;

export const TimelineContainer = styled.div`
  padding: 1.5rem;
  
  .timeline-item {
    position: relative;
    padding-left: 2rem;
    padding-bottom: 2rem;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      height: 100%;
      background: ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
    }
    
    &::after {
      content: '';
      position: absolute;
      left: -4px;
      top: 0;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      border: 2px solid ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
    }
    
    &:last-child {
      padding-bottom: 0;
      
      &::before {
        height: 0;
      }
    }
  }
  
  .timeline-date {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    margin-bottom: 0.5rem;
  }
  
  .timeline-content {
    background: ${props => props.isDarkMode 
      ? 'rgba(38, 38, 38, 0.5)' 
      : 'rgba(249, 250, 251, 0.5)'};
    border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    border-radius: 0.75rem;
    padding: 1rem;
    backdrop-filter: blur(8px);
    
    h4 {
      color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }
`;

export const FilterChip = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.isActive
    ? (props.isDarkMode ? '#fdba74' : '#f97316')
    : (props.isDarkMode ? 'rgba(38, 38, 38, 0.5)' : 'rgba(249, 250, 251, 0.5)')};
  color: ${props => props.isActive
    ? (props.isDarkMode ? '#1a1a1a' : '#ffffff')
    : (props.isDarkMode ? '#e5e7eb' : '#374151')};
  border: 1px solid ${props => props.isActive
    ? 'transparent'
    : (props.isDarkMode ? '#333333' : '#f0f0f0')};
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isActive
      ? (props.isDarkMode ? '#fdba74' : '#f97316')
      : (props.isDarkMode ? 'rgba(38, 38, 38, 0.8)' : 'rgba(249, 250, 251, 0.8)')};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const SearchInput = styled.div`
  position: relative;
  width: 100%;
  max-width: 24rem;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: 0.75rem;
    border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    background: ${props => props.isDarkMode 
      ? 'rgba(38, 38, 38, 0.5)' 
      : 'rgba(249, 250, 251, 0.5)'};
    color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
    backdrop-filter: blur(8px);
    transition: all 0.2s ease;
    
    &::placeholder {
      color: ${props => props.isDarkMode ? '#6b7280' : '#9ca3af'};
    }
    
    &:focus {
      outline: none;
      border-color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      box-shadow: 0 0 0 3px ${props => props.isDarkMode 
        ? 'rgba(253, 186, 116, 0.1)' 
        : 'rgba(249, 115, 22, 0.1)'};
    }
  }
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25rem;
    height: 1.25rem;
    color: ${props => props.isDarkMode ? '#6b7280' : '#9ca3af'};
    pointer-events: none;
  }
`;

export const RiskIndicator = styled.div`
  position: relative;
  padding: 1.5rem;
  border-radius: 1rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  
  .risk-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    }
    
    .risk-score {
      font-size: 2rem;
      font-weight: 700;
      color: ${props => {
        const score = props.score;
        if (score >= 80) return props.isDarkMode ? '#86efac' : '#4ade80';
        if (score >= 60) return props.isDarkMode ? '#fdba74' : '#f97316';
        return props.isDarkMode ? '#fca5a5' : '#ef4444';
      }};
    }
  }
  
  .risk-meter {
    height: 8px;
    background: ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: ${props => props.score}%;
      background: ${props => {
        const score = props.score;
        if (score >= 80) return 'linear-gradient(90deg, #4ade80, #86efac)';
        if (score >= 60) return 'linear-gradient(90deg, #f97316, #fdba74)';
        return 'linear-gradient(90deg, #ef4444, #fca5a5)';
      }};
      transition: width 1s ease-in-out;
    }
  }
`;

export const LoanSummaryCard = styled.div`
  padding: 1.5rem;
  border-radius: 1rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  
  .loan-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    
    .loan-title {
      h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
        margin-bottom: 0.25rem;
      }
      
      .loan-id {
        font-size: 0.875rem;
        color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
      }
    }
    
    .loan-status {
      padding: 0.375rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      background: ${props => props.status === 'active' 
        ? (props.isDarkMode ? 'rgba(74, 222, 128, 0.1)' : 'rgba(74, 222, 128, 0.1)')
        : (props.isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)')};
      color: ${props => props.status === 'active'
        ? (props.isDarkMode ? '#86efac' : '#4ade80')
        : (props.isDarkMode ? '#fca5a5' : '#ef4444')};
      border: 1px solid ${props => props.status === 'active'
        ? (props.isDarkMode ? 'rgba(74, 222, 128, 0.2)' : 'rgba(74, 222, 128, 0.2)')
        : (props.isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.2)')};
    }
  }
  
  .loan-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    
    .detail-item {
      .label {
        font-size: 0.875rem;
        color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
        margin-bottom: 0.375rem;
      }
      
      .value {
        font-size: 1.125rem;
        font-weight: 600;
        color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
      }
    }
  }
`;

export const PaymentHistoryChart = styled.div`
  padding: 1.5rem;
  border-radius: 1rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    }
  }
  
  .payment-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 0.5rem;
    
    .payment-month {
      aspect-ratio: 1;
      border-radius: 0.375rem;
      background: ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
      transition: all 0.2s ease;
      
      &.on-time {
        background: ${props => props.isDarkMode ? '#065f46' : '#34d399'};
      }
      
      &.late {
        background: ${props => props.isDarkMode ? '#991b1b' : '#f87171'};
      }
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  
  .legend {
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
      
      &::before {
        content: '';
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 0.25rem;
      }
      
      &.on-time::before {
        background: ${props => props.isDarkMode ? '#065f46' : '#34d399'};
      }
      
      &.late::before {
        background: ${props => props.isDarkMode ? '#991b1b' : '#f87171'};
      }
    }
  }
`;

export const PulsingStatusBadge = styled.div`
  position: relative;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.875rem;
  background: ${props => props.status === 'active'
    ? (props.isDarkMode ? 'rgba(74, 222, 128, 0.15)' : 'rgba(74, 222, 128, 0.1)')
    : (props.isDarkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)')};
  color: ${props => props.status === 'active'
    ? (props.isDarkMode ? '#86efac' : '#4ade80')
    : (props.isDarkMode ? '#fca5a5' : '#ef4444')};
  border: 1px solid ${props => props.status === 'active'
    ? (props.isDarkMode ? 'rgba(74, 222, 128, 0.3)' : 'rgba(74, 222, 128, 0.2)')
    : (props.isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)')};
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: ${props => props.status === 'active'
      ? (props.isDarkMode ? '#86efac' : '#4ade80')
      : (props.isDarkMode ? '#fca5a5' : '#ef4444')};
    border-radius: 2rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    opacity: 0.2;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(1.05); opacity: 0.15; }
  }
`;

export const GlowingCard = styled.div`
  position: relative;
  padding: 2rem;
  border-radius: 1.5rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${props => props.isDarkMode ? 'rgba(253, 186, 116, 0.05)' : 'rgba(249, 115, 22, 0.05)'},
      transparent
    );
    transition: 0.5s;
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(249, 115, 22, 0.15)'};
  }
`;

export const AnimatedMetricCard = styled.div`
  padding: 2rem;
  border-radius: 1.5rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      ${props => props.isDarkMode ? 'rgba(253, 186, 116, 0.03)' : 'rgba(249, 115, 22, 0.03)'} 50%,
      transparent 100%
    );
    transform: translateY(100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    
    &::after {
      transform: translateY(-100%);
    }
    
    .metric-value {
      transform: scale(1.1);
      color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    }
  }

  .metric-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
    transition: all 0.3s ease;
    display: inline-block;
  }

  .metric-label {
    font-size: 1rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    margin-top: 0.5rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 2rem;
      height: 2px;
      background: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      transform: scaleX(0);
      transition: transform 0.3s ease;
      transform-origin: left;
    }
  }

  &:hover .metric-label::after {
    transform: scaleX(1);
  }
`;

export const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
  color: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px ${props => props.isDarkMode 
    ? 'rgba(253, 186, 116, 0.3)' 
    : 'rgba(249, 115, 22, 0.3)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 24px ${props => props.isDarkMode 
      ? 'rgba(253, 186, 116, 0.4)' 
      : 'rgba(249, 115, 22, 0.4)'};
  }

  &:active {
    transform: translateY(-2px) scale(0.95);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(90deg);
  }
`;

export const ShimmeringLoader = styled.div`
  width: 100%;
  height: ${props => props.height || '20px'};
  background: ${props => props.isDarkMode 
    ? '#262626' 
    : '#f9fafb'};
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${props => props.isDarkMode 
        ? 'rgba(38, 38, 38, 0.8)' 
        : 'rgba(249, 250, 251, 0.8)'} 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

export const CreditScoreGauge = styled.div`
  position: relative;
  width: 100%;
  padding: 2rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border-radius: 2rem;
  overflow: hidden;
  border: 2px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  
  .score-value {
    font-size: 3.5rem;
    font-weight: 800;
    text-align: center;
    background: ${props => props.score > 700
      ? 'linear-gradient(90deg, #4ade80, #86efac)'
      : props.score > 600
      ? 'linear-gradient(90deg, #f97316, #fdba74)'
      : 'linear-gradient(90deg, #ef4444, #fca5a5)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: scorePopIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .score-label {
    text-align: center;
    font-size: 1.25rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    margin-top: 1rem;
    font-weight: 500;
  }

  .score-ring {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 4px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    border-top-color: ${props => props.score > 700
      ? '#4ade80'
      : props.score > 600
      ? '#f97316'
      : '#ef4444'};
    animation: spin 1s linear infinite;
  }

  @keyframes scorePopIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const NotificationBell = styled.button`
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    transition: transform 0.3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 0.5rem;
    height: 0.5rem;
    background: #ef4444;
    border-radius: 50%;
    border: 2px solid ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
    animation: pulse 2s infinite;
  }

  &:hover {
    transform: translateY(-2px);
    
    svg {
      transform: rotate(15deg);
    }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

export const StatusTimeline = styled.div`
  position: relative;
  padding: 2rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border-radius: 1.5rem;
  border: 2px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};

  .timeline-track {
    position: relative;
    height: 4px;
    background: ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    margin: 3rem 0;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: ${props => props.progress}%;
      background: linear-gradient(90deg, #f97316, #fdba74);
      transition: width 1s ease-in-out;
    }
  }

  .milestone {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
    border: 4px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    transition: all 0.3s ease;

    &.completed {
      border-color: #f97316;
      background: #fdba74;
      animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    &:nth-child(1) { left: 0%; }
    &:nth-child(2) { left: 33%; }
    &:nth-child(3) { left: 66%; }
    &:nth-child(4) { left: 100%; }
  }

  @keyframes popIn {
    0% { transform: translateY(-50%) scale(0.8); }
    100% { transform: translateY(-50%) scale(1); }
  }
`;

export const AnimatedProgressRing = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${props => props.isDarkMode 
    ? '#262626' 
    : '#f9fafb'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 8px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    border: 8px solid transparent;
    border-top-color: #f97316;
    border-right-color: #f97316;
    animation: rotate 2s linear infinite;
  }

  .progress-text {
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    z-index: 1;
  }

  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const LoanHealthCard = styled.div`
  padding: 2rem;
  border-radius: 1.5rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 2px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: ${props => {
      const health = props.health;
      if (health >= 80) return 'linear-gradient(90deg, #4ade80, #86efac)';
      if (health >= 60) return 'linear-gradient(90deg, #f97316, #fdba74)';
      return 'linear-gradient(90deg, #ef4444, #fca5a5)';
    }};
  }

  .health-score {
    font-size: 3.5rem;
    font-weight: 800;
    background: ${props => {
      const health = props.health;
      if (health >= 80) return 'linear-gradient(90deg, #4ade80, #86efac)';
      if (health >= 60) return 'linear-gradient(90deg, #f97316, #fdba74)';
      return 'linear-gradient(90deg, #ef4444, #fca5a5)';
    }};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
    animation: pulseText 2s infinite;
  }

  @keyframes pulseText {
    0% { transform: scale(1); }
    50% { transform: scale(1.00); }
    100% { transform: scale(1); }
  }

  .health-label {
    font-size: 1.125rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    margin-bottom: 2rem;
  }

  .health-indicators {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
`;

export const IndicatorPill = styled.div`
  padding: 1rem;
  border-radius: 1rem;
  background: ${props => props.isDarkMode 
    ? 'rgba(38, 38, 38, 0.5)' 
    : 'rgba(249, 250, 251, 0.5)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px ${props => props.isDarkMode 
      ? 'rgba(0, 0, 0, 0.2)' 
      : 'rgba(249, 115, 22, 0.1)'};
  }

  .indicator-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    margin-bottom: 0.5rem;
  }

  .indicator-label {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }
`;

export const PaymentScheduleCard = styled.div`
  padding: 2rem;
  border-radius: 1.5rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 2px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};

  .next-payment {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};

    .amount {
      font-size: 2.5rem;
      font-weight: 800;
      color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      margin-bottom: 0.5rem;
    }

    .due-date {
      font-size: 1.125rem;
      color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
      
      span {
        color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
        font-weight: 600;
      }
    }
  }

  .payment-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

export const PaymentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  margin-bottom: 1rem;
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#e5e7eb'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-color: ${props => props.isDarkMode ? '#4a5568' : '#d1d5db'};
  }

  .payment-info {
    .amount {
      font-size: 1.125rem;
      font-weight: 600;
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
      margin-bottom: 0.25rem;
    }

    .date {
      font-size: 0.875rem;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    }
  }

  .status {
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    
    ${props => props.status === 'paid' && `
      background: ${props.isDarkMode ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
      color: ${props.isDarkMode ? '#22c55e' : '#059669'};
    `}
    
    ${props => props.status === 'pending' && `
      background: ${props.isDarkMode ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.1)'};
      color: ${props.isDarkMode ? '#eab308' : '#b45309'};
    `}
  }
`;

export const ContentSection = styled.section`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const SectionHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    font-size: 1rem;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: 2.5rem;

  @media (min-width: 1024px) {
    grid-template-columns: ${props => props.columns || 'repeat(2, 1fr)'};
  }

  @media (min-width: 1536px) {
    grid-template-columns: ${props => props.columnsXl || props.columns || 'repeat(2, 1fr)'};
  }
`;

export const InsightCard = styled.div`
  padding: 2rem;
  border-radius: 1.5rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 2px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  .insight-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .insight-content {
    padding: 1rem 0;
    position: relative;
    z-index: 1;
  }
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2.5rem;

  .metric-card {
    padding: 2rem;
  }
`;

export const ActivityTimeline = styled.div`
  padding: 2rem;
  border-radius: 1.5rem;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #1a1a1a, #262626)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  
  .timeline-item {
    position: relative;
    padding-left: 2.5rem;
    padding-bottom: 2.5rem;
    
    &:last-child {
      padding-bottom: 1rem;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      height: 100%;
      background: ${props => props.isDarkMode ? '#333333' : '#e5e7eb'};
    }
    
    &::after {
      content: '';
      position: absolute;
      left: -4px;
      top: 0;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      border: 2px solid ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
    }
  }
  
  .timeline-date {
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
    margin-bottom: 0.5rem;
  }
  
  .timeline-content {
    padding: 1.5rem;
    margin-top: 0.75rem;
    background: ${props => props.isDarkMode ? '#262626' : '#ffffff'};
    border: 1px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
    border-radius: 0.75rem;
    backdrop-filter: blur(8px);
    
    h4 {
      color: ${props => props.isDarkMode ? '#fdba74' : '#f97316'};
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: ${props => props.isDarkMode ? '#e5e7eb' : '#374151'};
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }
`;

export const PaymentDetailsModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  padding: 2rem;
  opacity: 1;
  transition: opacity 0.3s ease;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const PaymentDetailsContent = styled.div`
  background: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
  border-radius: 20px;
  width: 95%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
  position: relative;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: ${props => props.isDarkMode 
      ? 'linear-gradient(145deg, rgba(255, 132, 11, 0.2), rgba(99, 102, 241, 0.2))'
      : 'linear-gradient(145deg, rgba(255, 132, 11, 0.1), rgba(99, 102, 241, 0.1))'};
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid ${props => props.isDarkMode ? '#333' : '#e2e8f0'};
    background: ${props => props.isDarkMode 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'rgba(255, 255, 255, 0.8)'};

    h3 {
      font-size: 1.5rem;
      font-weight: 500;
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
      display: flex;
      align-items: center;
      gap: 0.75rem;

      svg {
        width: 24px;
        height: 24px;
        color: #ff840b;
      }
    }

    .close-button {
      background: none;
      border: none;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#64748b'};
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;

      &:hover {
        background: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6'};
        color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
        transform: rotate(90deg);
      }
    }
  }

  .modal-body {
    flex: 1;
    overflow: auto;
    padding: 2rem;
    position: relative;

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    &::-webkit-scrollbar-track {
      background: ${props => props.isDarkMode ? '#262626' : '#f3f4f6'};
    }

    &::-webkit-scrollbar-thumb {
      background: ${props => props.isDarkMode ? '#4b5563' : '#9ca3af'};
      border-radius: 5px;
      border: 2px solid ${props => props.isDarkMode ? '#262626' : '#f3f4f6'};

      &:hover {
        background: ${props => props.isDarkMode ? '#6b7280' : '#6b7280'};
      }
    }
  }
`;

export const PaymentInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  .info-group {
    .label {
      font-size: 0.875rem;
      color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
      margin-bottom: 0.5rem;
    }

    .value {
      font-size: 1.125rem;
      color: ${props => props.isDarkMode ? '#e2e8f0' : '#1a202c'};
      font-weight: 500;
    }

    &.amount .value {
      color: ${props => props.isDarkMode ? '#22c55e' : '#059669'};
      font-size: 1.5rem;
    }
  }
`;

export const ReceiptImage = styled.div`
  margin-top: 2rem;
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.isDarkMode ? '#262626' : '#f3f4f6'};
  padding: 1rem;

  .image-container {
    position: relative;
    width: 100%;
    padding-top: 75%; // 4:3 aspect ratio
    border-radius: 8px;
    overflow: hidden;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: ${props => props.isDarkMode ? '#1a1a1a' : 'white'};
    }
  }

  .image-caption {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.875rem;
    color: ${props => props.isDarkMode ? '#9ca3af' : '#6b7280'};
  }
`;