import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import {
  StatsCard,
  WidgetCard
} from '../MainDashboardStyled';

export const StatWidget = ({ 
  title, 
  value, 
  change, 
  isDarkMode 
}) => {
  const isPositive = change >= 0;
  const Icon = isPositive ? FiTrendingUp : FiTrendingDown;

  return (
    <StatsCard isDarkMode={isDarkMode}>
      <div className="stat-header">
        <h3>{title}</h3>
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          <Icon />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
    </StatsCard>
  );
};

export const LineChartWidget = ({ 
  title, 
  data, 
  isDarkMode 
}) => {
  return (
    <WidgetCard isDarkMode={isDarkMode}>
      <h3>{title}</h3>
      {/* Line chart implementation will go here */}
    </WidgetCard>
  );
};

export const BarChartWidget = ({ 
  title, 
  data, 
  isDarkMode 
}) => {
  return (
    <WidgetCard isDarkMode={isDarkMode}>
      <h3>{title}</h3>
      {/* Bar chart implementation will go here */}
    </WidgetCard>
  );
};

export const PieChartWidget = ({ 
  title, 
  data, 
  isDarkMode 
}) => {
  return (
    <WidgetCard isDarkMode={isDarkMode}>
      <h3>{title}</h3>
      {/* Pie chart implementation will go here */}
    </WidgetCard>
  );
};

export const widgetMap = {
  STAT_CARD: StatWidget,
  LINE_CHART: LineChartWidget,
  BAR_CHART: BarChartWidget,
  PIE_CHART: PieChartWidget
}; 