'use client';

import React, { useState, useEffect, useMemo } from 'react';
import NavPane from '../Objects/NavPane';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import {
  AnalyticsContainer,
  MetricsGrid,
  MetricCard,
  MetricHeader,
  MetricIcon,
  MetricValue,
  MetricLabel,
  MetricChange,
  ChartsGrid,
  ChartContainer,
  ChartHeader,
  ChartTitle,
  TimeFilter,
  ChartContent,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PageActions,
  Button,
  colors
} from './AnalyticsStyled';

// HR-specific analytics metrics based on requirements
const ANALYTICS_METRICS = [
  {
    id: 'attrition-rate',
    label: 'Attrition Rate',
    value: '8.5%',
    change: '-1.2%',
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
      </svg>
    ),
    bg: colors.error[100],
    color: colors.error[600],
    accent: `linear-gradient(90deg, ${colors.error[500]}, ${colors.error[300]})`
  },
  {
    id: 'new-hires',
    label: 'New Hires (MTD)',
    value: '24',
    change: '+15%',
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    ),
    bg: colors.success[100],
    color: colors.success[600],
    accent: `linear-gradient(90deg, ${colors.success[500]}, ${colors.success[300]})`
  },
  {
    id: 'er-cases',
    label: 'Active ER Cases',
    value: '7',
    change: '-2',
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    ),
    bg: colors.warning[100],
    color: colors.warning[600],
    accent: `linear-gradient(90deg, ${colors.warning[500]}, ${colors.warning[300]})`
  },
  {
    id: 'training-compliance',
    label: 'Training Compliance',
    value: '92.3%',
    change: '+5.2%',
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
      </svg>
    ),
    bg: colors.primary[100],
    color: colors.primary[600],
    accent: `linear-gradient(90deg, ${colors.primary[500]}, ${colors.primary[300]})`
  },
  {
    id: 'medical-compliance',
    label: 'Medical Compliance',
    value: '88.7%',
    change: '+3.1%',
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 8h2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2h2c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2zm4-2v2h8V6H8z"/>
      </svg>
    ),
    bg: colors.accent[600],
    color: colors.accent[600],
    accent: `linear-gradient(90deg, ${colors.accent[500]}, ${colors.accent[300]})`
  },
  {
    id: 'performance-score',
    label: 'Avg Performance Score',
    value: '4.1/5',
    change: '+0.2',
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
      </svg>
    ),
    bg: colors.primary[100],
    color: colors.primary[600],
    accent: `linear-gradient(90deg, ${colors.primary[500]}, ${colors.primary[300]})`
  }
];

const INSIGHTS_DATA = [
  {
    id: 'hiring-trend',
    title: 'Peak Hiring Season',
    content: 'Historical data shows hiring increases by 40% in Q1. Consider preparing recruitment strategies for the upcoming quarter.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    bg: colors.primary[100],
    color: colors.primary[600],
    action: 'View Recruitment Plan'
  },
  {
    id: 'department-growth',
    title: 'Engineering Department Growth',
    content: 'Engineering team has grown 35% this year, making it our fastest-growing department. Monitor resource allocation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    ),
    bg: colors.success[100],
    color: colors.success[600],
    action: 'Department Details'
  },
  {
    id: 'retention-risk',
    title: 'Retention Risk Alert',
    content: 'Employees with 2-3 years experience show 15% higher turnover risk. Consider retention programs.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    ),
    bg: colors.warning[100],
    color: colors.warning[600],
    action: 'View At-Risk Employees'
  },
  {
    id: 'performance-trend',
    title: 'Performance Improvement',
    content: 'Overall performance ratings increased 8% following the new training program implementation.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
      </svg>
    ),
    bg: colors.success[100],
    color: colors.success[600],
    action: 'Training Analytics'
  }
];

// Chart Options Configuration
const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: '500'
        }
      }
    },
    tooltip: {
      backgroundColor: colors.background.primary,
      titleColor: colors.text.primary,
      bodyColor: colors.text.secondary,
      borderColor: colors.border.light,
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: colors.border.light,
        drawBorder: false
      },
      ticks: {
        color: colors.text.tertiary,
        font: {
          size: 11
        }
      }
    },
    x: {
      grid: {
        color: colors.border.light,
        drawBorder: false
      },
      ticks: {
        color: colors.text.tertiary,
        font: {
          size: 11
        }
      }
    }
  }
};

const MainDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [timeFilter, setTimeFilter] = useState('last-30-days');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [metricsData, setMetricsData] = useState(ANALYTICS_METRICS);

  // HR-specific chart data configurations
  const attritionTrendData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Attrition Rate %',
        data: [8.2, 7.8, 9.1, 8.5, 7.9, 8.8, 9.2, 8.3, 7.6, 8.9, 8.1, 8.5],
        borderColor: colors.error[500],
        backgroundColor: colors.error[100],
        tension: 0.4,
        fill: true,
      },
      {
        label: 'New Hires',
        data: [45, 40, 55, 35, 38, 42, 48, 35, 25, 30, 33, 40],
        borderColor: colors.success[500],
        backgroundColor: colors.success[100],
        tension: 0.4,
        fill: false,
      }
    ]
  }), []);

  const hrComplianceData = useMemo(() => ({
    labels: ['Medical Clearance', 'Training Completion', 'Document Submission', 'Performance Eval', 'Orientation', 'Background Check'],
    datasets: [{
      data: [88.7, 92.3, 95.2, 87.5, 96.8, 89.1],
      backgroundColor: [
        colors.primary[500],
        colors.success[500],
        colors.warning[500],
        colors.accent[500],
        colors.error[500],
        colors.neutral[500]
      ],
      borderWidth: 0,
    }]
  }), []);

  const erCasesData = useMemo(() => ({
    labels: ['0-30 days', '31-60 days', '61-90 days', '90+ days'],
    datasets: [{
      label: 'Case Count',
      data: [12, 8, 4, 3],
      backgroundColor: [colors.success[500], colors.warning[500], colors.error[400], colors.error[600]],
      borderRadius: 4,
    }]
  }), []);

  const trainingProgressData = useMemo(() => ({
    labels: ['New Employee Orientation', 'Safety Training', 'Compliance Training', 'Skills Development', 'Leadership Program'],
    datasets: [{
      label: 'Completion Rate %',
      data: [96.8, 89.2, 92.3, 76.5, 68.7],
      backgroundColor: colors.primary[500],
      borderRadius: 4,
    }, {
      label: 'Overdue %',
      data: [3.2, 10.8, 7.7, 23.5, 31.3],
      backgroundColor: colors.error[500],
      borderRadius: 4,
    }]
  }), []);

  // Get user ID from token
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.UserId);
        // Fetch analytics data after getting user ID
        fetchAnalyticsData();
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Fetch analytics data from API
  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // These endpoints would need to be added to API_ENDPOINTS
      // const metricsResponse = await axiosInstance.get(`${API_ENDPOINTS.ANALYTICS_METRICS}?timeFilter=${timeFilter}`);
      // const chartsResponse = await axiosInstance.get(`${API_ENDPOINTS.ANALYTICS_CHARTS}?timeFilter=${timeFilter}`);
      
      // For now, using mock data with some variation based on time filter
      const mockMetrics = ANALYTICS_METRICS.map(metric => ({
        ...metric,
        value: timeFilter === 'last-7-days' 
          ? (parseFloat(metric.value) * 0.8).toFixed(1) + (metric.value.includes('%') ? '%' : metric.value.includes('/') ? '/5' : '')
          : metric.value,
        change: timeFilter === 'last-7-days' 
          ? `${parseFloat(metric.change) > 0 ? '+' : ''}${(parseFloat(metric.change) * 0.5).toFixed(1)}%`
          : metric.change
      }));
      
      setMetricsData(mockMetrics);
      
      // if (metricsResponse.data && metricsResponse.data.data) {
      //   setMetricsData(metricsResponse.data.data);
      // }
      
      // if (chartsResponse.data && chartsResponse.data.data) {
      //   setAnalyticsData(chartsResponse.data.data);
      // }
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Keep default mock data on error
    } finally {
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  // Fetch data when time filter changes
  useEffect(() => {
    if (userId) {
      fetchAnalyticsData();
    }
  }, [timeFilter, userId]);

  // Handle time filter change
  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  // Export analytics data
  const exportAnalyticsData = async () => {
    try {
      // const response = await axiosInstance.get(`${API_ENDPOINTS.EXPORT_ANALYTICS}?timeFilter=${timeFilter}`, {
      //   responseType: 'blob'
      // });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `analytics-report-${timeFilter}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      console.log('Exporting analytics data for:', timeFilter);
    } catch (error) {
      console.error('Error exporting analytics data:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: colors.background.secondary 
      }}>
        <NavPane
          activeNav="Analytics"
          setActiveNav={() => {}}
          isDarkMode={false}
          userId="user123"
          isMobileMenuOpen={false}
          setIsMobileMenuOpen={() => {}}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.background.primary
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${colors.primary[200]}`,
            borderTop: `3px solid ${colors.primary[600]}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: colors.background.secondary 
    }}>
      <NavPane
        activeNav="Analytics"
        setActiveNav={() => {}}
        isDarkMode={false}
        userId="user123"
        isMobileMenuOpen={false}
        setIsMobileMenuOpen={() => {}}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div style={{
        flex: 1,
        background: colors.background.primary,
        overflow: 'auto'
      }}>
        <AnalyticsContainer>
          <PageHeader>
            <div>
              <PageTitle>Analytics & Insights</PageTitle>
              <PageSubtitle>Data-driven insights to optimize your HR operations</PageSubtitle>
            </div>
            <PageActions>
              <TimeFilter 
                value={timeFilter} 
                onChange={handleTimeFilterChange}
              >
                <option value="last-7-days">Last 7 days</option>
                <option value="last-30-days">Last 30 days</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="last-year">Last Year</option>
              </TimeFilter>
              <Button 
                variant="secondary"
                onClick={exportAnalyticsData}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                </svg>
                Export Report
              </Button>
              <Button 
                variant="primary"
                onClick={() => console.log('Create dashboard')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Custom Dashboard
              </Button>
            </PageActions>
          </PageHeader>

          {/* Key Metrics */}
          <MetricsGrid>
            {metricsData.map((metric, index) => (
              <MetricCard 
                key={metric.id} 
                delay={index * 100}
                accent={metric.accent}
              >
                <MetricHeader>
                  <MetricIcon bg={metric.bg} color={metric.color}>
                    {metric.icon}
                  </MetricIcon>
                  <MetricChange positive={metric.positive}>
                    {metric.positive ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
                      </svg>
                    )}
                    {metric.change}
                  </MetricChange>
                </MetricHeader>
                <MetricValue>{metric.value}</MetricValue>
                <MetricLabel>{metric.label}</MetricLabel>
              </MetricCard>
            ))}
          </MetricsGrid>

          {/* HR Analytics Charts Section */}
          <ChartsGrid>
            <ChartContainer className="large">
              <ChartHeader>
                <ChartTitle>Attrition & Hiring Trends</ChartTitle>
                <TimeFilter defaultValue="last-year">
                  <option value="last-quarter">Last Quarter</option>
                  <option value="last-year">Last Year</option>
                  <option value="last-2-years">Last 2 Years</option>
                </TimeFilter>
              </ChartHeader>
              <ChartContent className="large">
                <Line data={attritionTrendData} options={CHART_OPTIONS} />
              </ChartContent>
            </ChartContainer>

            <ChartContainer>
              <ChartHeader>
                <ChartTitle>HR Compliance Rates</ChartTitle>
              </ChartHeader>
              <ChartContent className="small">
                <Doughnut 
                  data={hrComplianceData} 
                  options={{
                    ...CHART_OPTIONS,
                    plugins: {
                      ...CHART_OPTIONS.plugins,
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              </ChartContent>
            </ChartContainer>

            <ChartContainer>
              <ChartHeader>
                <ChartTitle>ER Cases by Age</ChartTitle>
              </ChartHeader>
              <ChartContent className="small">
                <Bar data={erCasesData} options={{
                  ...CHART_OPTIONS,
                  plugins: {
                    ...CHART_OPTIONS.plugins,
                    legend: {
                      display: false
                    }
                  }
                }} />
              </ChartContent>
            </ChartContainer>

            <ChartContainer>
              <ChartHeader>
                <ChartTitle>Training Progress Overview</ChartTitle>
              </ChartHeader>
              <ChartContent className="small">
                <Bar 
                  data={trainingProgressData} 
                  options={{
                    ...CHART_OPTIONS,
                    scales: {
                      ...CHART_OPTIONS.scales,
                      y: {
                        ...CHART_OPTIONS.scales.y,
                        max: 100
                      }
                    }
                  }} 
                />
              </ChartContent>
            </ChartContainer>
          </ChartsGrid>

          {/* AI-Powered Insights */}
          {/* <div style={{ marginBottom: '1rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: colors.text.primary,
              margin: '0 0 0.5rem 0'
            }}>
              AI-Powered Insights
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: colors.text.tertiary,
              margin: 0
            }}>
              Intelligent recommendations based on your HR data patterns
            </p>
          </div>

          <InsightsGrid>
            {INSIGHTS_DATA.map(insight => (
              <InsightCard key={insight.id}>
                <InsightHeader>
                  <InsightIcon bg={insight.bg} color={insight.color}>
                    {insight.icon}
                  </InsightIcon>
                  <InsightTitle>{insight.title}</InsightTitle>
                </InsightHeader>
                <InsightContent>{insight.content}</InsightContent>
                <InsightAction onClick={() => console.log(`Action: ${insight.action}`)}>
                  {insight.action} →
                </InsightAction>
              </InsightCard>
            ))}
          </InsightsGrid> */}
        </AnalyticsContainer>
      </div>
    </div>
  );
};

export default MainDashboard;
