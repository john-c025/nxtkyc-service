'use client';

import React, { useState, useEffect, useMemo } from 'react';
import PasswordResetModal from '../Objects/PasswordResetModal';
import NotificationButton from '../Objects/NotificationButton';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import { useTheme } from '../../context/ThemeContext';
import {
  DashboardContainer,
  Sidebar,
  MainContent,
  TopBar,
  HeaderContent,
  HeaderTitle,
  HeaderActions,
  MobileMenuToggle,
  ContentLayout,
  StatsGrid,
  ChartsGrid,
  StatsCard,
  ChartContainer,
  CardIcon,
  TabContainer,
  TabList,
  TabButton,
  Button,
  SearchInputWrapper,
  SearchInput,
  ThemeToggle,
  LoadingSpinner,
  CompanyFilterContainer,
  colors
} from './MainDashboardStyled';
import NavPane from '../Objects/NavPane';
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
import { Line, Pie, Bar } from 'react-chartjs-2';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

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

// Default Stats Data Configuration (will be replaced by API data)
const DEFAULT_STATS_DATA = [
  {
    id: 'employees',
    title: 'Total Employees',
    value: '0',
    change: '0%',
    isPositive: true,
    icon: 'users',
    variant: 'primary'
  },
  {
    id: 'pending',
    title: 'Probationary Employees',
    value: '0',
    change: '0%',
    isPositive: true,
    icon: 'clock',
    variant: 'error'
  },
  {
    id: 'regular',
    title: 'Regular Employees',
    value: '0',
    change: '0%',
    isPositive: true,
    icon: 'clock',
    variant: 'success'
  },
  {
    id: 'companies',
    title: 'Affiliate Companies',
    value: '0',
    change: '0',
    isPositive: true,
    icon: 'building',
    variant: 'success'
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

// Icon Components
const IconComponents = {
  users: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  building: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  check: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  clock: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  search: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  menu: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  sun: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  moon: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  filter: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
    </svg>
  ),
  download: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
};

export default function MainDashboard() {
  // State management
  const [activeNav, setActiveNav] = useState('dashboard');
  const { isDarkMode, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(DEFAULT_STATS_DATA);

  // Chart data

  const pieChartData = useMemo(() => ({
    labels: ['Full-time', 'Part-time', 'Contract', 'Intern'],
    datasets: [{
      data: [65, 20, 10, 5],
      backgroundColor: [
        colors.primary[500],
        colors.success[500],
        colors.warning[500],
        colors.accent[500]
      ],
      borderWidth: 0,
    }]
  }), []);

  const barChartData = useMemo(() => ({
    labels: ['HR', 'Engineering', 'Sales', 'Marketing', 'Finance'],
    datasets: [{
      label: 'Employees',
      data: [45, 850, 320, 180, 125],
      backgroundColor: colors.primary[500],
      borderRadius: 4,
    }]
  }), []);

  // HR-specific company metrics for visualization
  const hrMetricsData = useMemo(() => ({
    labels: ['Attrition Rate', 'New Hires', 'Training Compliance', 'Medical Compliance', 'Performance Score'],
    datasets: [{
      label: 'Current Period %',
      data: [8.5, 15.2, 92.3, 88.7, 82.1],
      backgroundColor: [
        colors.error[500], 
        colors.success[500], 
        colors.primary[500], 
        colors.warning[500], 
        colors.accent[500]
      ],
      borderRadius: 4,
    }]
  }), []);

  const employeeMovementData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Hires',
        data: [45, 40, 45, 35, 35, 42],
        borderColor: colors.success[500],
        backgroundColor: colors.success[100],
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Resignations',
        data: [25, 30, 28, 32, 27, 35],
        borderColor: colors.error[500],
        backgroundColor: colors.error[100],
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Transfers',
        data: [8, 12, 10, 15, 11, 9],
        borderColor: colors.warning[500],
        backgroundColor: colors.warning[100],
        tension: 0.4,
        fill: false,
      }
    ]
  }), []);

  // Effects
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        setIsLoading(true);
        const token = Cookies.get('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          const decodedUserId = decoded.UserId;
          
          if (!decodedUserId) {
            console.error("No UserId found in token");
            return;
          }
          
          setUserId(decodedUserId);
          
          // Check password status
          const pwResponse = await axiosInstance.get(`${API_ENDPOINTS.PW_STATUS}?userId=${decodedUserId}`);
          if (pwResponse.data.data.pw_reset_req === "True") {
            setIsModalOpen(true);
          }

          // Fetch user details
          const userResponse = await axiosInstance.get(`${API_ENDPOINTS.USER_DETAILS}?userId=${decodedUserId}`);
          setUserDetails(userResponse.data.data);

          // Fetch companies
          await fetchCompanies();
        }
      } catch (error) {
        console.error('Error in initialization:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };

    getUserFromToken();
  }, []);

  // Fetch companies for dropdown
  const fetchCompanies = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LOAD_FIN_COMPANIES);
      if (response.data && response.data.data) {
        setCompanies(response.data.data);
        // Set default company if available
        if (response.data.data.length > 0) {
          const defaultCompany = response.data.data[0].company_id || response.data.data[0].id;
          setSelectedCompany(defaultCompany);
          // Fetch dashboard data for default company
          await fetchDashboardData(defaultCompany);
        }
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  // Fetch dashboard data based on selected company
  const fetchDashboardData = async (companyId = selectedCompany) => {
    try {
      setIsLoading(true);
      
      // API endpoint for dashboard stats (this would need to be added to API_ENDPOINTS)
      // const statsResponse = await axiosInstance.get(`${API_ENDPOINTS.DASHBOARD_STATS}?companyId=${companyId}`);
      
      // For now, using mock data based on company selection
      const mockStatsData = [
        {
          id: 'employees',
          title: 'Total Employees',
          value: companyId === 'all' ? '2,847' : Math.floor(Math.random() * 1000 + 200).toLocaleString(),
          change: `+${Math.floor(Math.random() * 20)}%`,
          isPositive: true,
          icon: 'users',
          variant: 'primary'
        },
        {
          id: 'pending',
          title: 'Probationary Employees',
          value: companyId === 'all' ? '147' : Math.floor(Math.random() * 50 + 10).toString(),
          change: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 10)}%`,
          isPositive: Math.random() > 0.5,
          icon: 'clock',
          variant: 'error'
        },
        {
          id: 'regular',
          title: 'Regular Employees',
          value: companyId === 'all' ? '302' : Math.floor(Math.random() * 300 + 50).toString(),
          change: `+${Math.floor(Math.random() * 15)}%`,
          isPositive: true,
          icon: 'clock',
          variant: 'success'
        },
        {
          id: 'companies',
          title: 'Affiliate Companies',
          value: companies.length.toString(),
          change: '+2',
          isPositive: true,
          icon: 'building',
          variant: 'success'
        }
      ];
      
      setDashboardStats(mockStatsData);
      
      // You would also fetch chart data here
      // const chartResponse = await axiosInstance.get(`${API_ENDPOINTS.DASHBOARD_CHARTS}?companyId=${companyId}`);
      // setChartData(chartResponse.data.data);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default data on error
      setDashboardStats(DEFAULT_STATS_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleResetPassword = () => {
    console.log('Redirecting to password reset page...');
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCompanyChange = async (e) => {
    const newCompanyId = e.target.value;
    setSelectedCompany(newCompanyId);
    if (newCompanyId) {
      await fetchDashboardData(newCompanyId);
    }
  };

  // Effect to refresh data when selected company changes
  useEffect(() => {
    if (selectedCompany) {
      fetchDashboardData(selectedCompany);
    }
  }, []);

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Stats Grid */}
            <StatsGrid>
              {dashboardStats.map((stat) => (
                <StatsCard key={stat.id} isPositive={stat.isPositive}>
                  <div className="card-header">
                    <CardIcon variant={stat.variant}>
                      {IconComponents[stat.icon]}
                    </CardIcon>
                  </div>
                  <div className="stat-label">{stat.title}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-change">
                    {stat.isPositive ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    )}
                    {stat.change} from last month
                  </div>
                </StatsCard>
              ))}
            </StatsGrid>

            {/* Charts Grid - HR Focused */}
            <ChartsGrid>
              <ChartContainer>
                <h3>Employee Movement Trends</h3>
                <div className="chart-wrapper">
                  <Line data={employeeMovementData} options={CHART_OPTIONS} />
                </div>
              </ChartContainer>

              <ChartContainer>
                <h3>Employee Type Distribution</h3>
                <div className="chart-wrapper">
                  <Pie data={pieChartData} options={{
                    ...CHART_OPTIONS,
                    plugins: {
                      ...CHART_OPTIONS.plugins,
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} />
                </div>
              </ChartContainer>

              <ChartContainer>
                <h3>HR Key Metrics</h3>
                <div className="chart-wrapper">
                  <Bar data={hrMetricsData} options={{
                    ...CHART_OPTIONS,
                    plugins: {
                      ...CHART_OPTIONS.plugins,
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      ...CHART_OPTIONS.scales,
                      y: {
                        ...CHART_OPTIONS.scales.y,
                        max: 100
                      }
                    }
                  }} />
                </div>
              </ChartContainer>

              <ChartContainer>
                <h3>Department Breakdown</h3>
                <div className="chart-wrapper">
                  <Bar data={barChartData} options={CHART_OPTIONS} />
                </div>
              </ChartContainer>
            </ChartsGrid>
          </>
        );
      
      case 'analytics':
        return (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ color: colors.text.secondary, marginBottom: '1rem' }}>Analytics Dashboard</h2>
            <p style={{ color: colors.text.tertiary }}>Detailed analytics coming soon...</p>
          </div>
        );
      
      case 'reports':
        return (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ color: colors.text.secondary, marginBottom: '1rem' }}>Reports Center</h2>
            <p style={{ color: colors.text.tertiary }}>Advanced reporting features coming soon...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <LoadingSpinner />
          <p style={{ color: colors.text.tertiary }}>Loading dashboard...</p>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        isOpen={isMobileMenuOpen}
      >
        <NavPane 
          activeNav={activeNav} 
          setActiveNav={setActiveNav}
          isDarkMode={isDarkMode}
          userId={userId}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </Sidebar>

      {/* Main Content */}
      <MainContent sidebarCollapsed={isSidebarCollapsed}>
        {/* Top Bar */}
        <TopBar>
          <HeaderContent>
            <MobileMenuToggle onClick={toggleMobileMenu}>
              {IconComponents.menu}
            </MobileMenuToggle>
            
            <HeaderTitle>
              <h1>Welcome back, {userDetails?.firstName || 'User'}!</h1>
              <p>{currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </HeaderTitle>

            <SearchInputWrapper>
              {IconComponents.search}
              <SearchInput
                type="text"
                placeholder="Search employees, departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInputWrapper>

            <CompanyFilterContainer>
              <label>Company:</label>
              <select
                value={selectedCompany}
                onChange={handleCompanyChange}
                style={{
                  padding: '0.75rem 1rem',
                  border: `1px solid ${colors.border.medium}`,
                  borderRadius: '8px',
                  background: colors.background.primary,
                  color: colors.text.primary,
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '200px',
                  transition: 'all 0.2s ease'
                }}
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option 
                    key={company.company_id || company.id} 
                    value={company.company_id || company.id}
                  >
                    {company.company_name || company.name}
                  </option>
                ))}
              </select>
            </CompanyFilterContainer>
          </HeaderContent>

          <HeaderActions>
            <Button variant="ghost" size="sm">
              {IconComponents.filter}
              Filter
            </Button>
            
            <Button variant="secondary" size="sm">
              {IconComponents.download}
              Export
            </Button>

            <NotificationButton userId={userId} isDarkMode={isDarkMode} />
            
            <ThemeToggle onClick={toggleTheme}>
              {isDarkMode ? IconComponents.sun : IconComponents.moon}
            </ThemeToggle>
          </HeaderActions>
        </TopBar>

        {/* Content */}
        <ContentLayout>
          {/* Tabs */}
          <TabContainer>
            <TabList>
              <TabButton 
                isActive={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </TabButton>
              <TabButton 
                isActive={activeTab === 'analytics'}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </TabButton>
              <TabButton 
                isActive={activeTab === 'reports'}
                onClick={() => setActiveTab('reports')}
              >
                Reports
              </TabButton>
            </TabList>
          </TabContainer>

          {/* Tab Content */}
          {renderTabContent()}
        </ContentLayout>
      </MainContent>

      {/* Modals */}
      <PasswordResetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onResetPassword={handleResetPassword}
        isDarkMode={isDarkMode}
        userId={userId}
      />
    </DashboardContainer>
  );
}
