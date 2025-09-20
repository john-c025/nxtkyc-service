'use client';

import React, { useState, useEffect } from 'react';
import NavPane from '../Objects/NavPane';
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import {
  ReportsContainer,
  ReportGrid,
  ReportCard,
  ReportIcon,
  ReportTitle,
  ReportDescription,
  ReportActions,
  ActionButton,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PageActions,
  Button,
  colors
} from './ReportsStyled';

// Report types data based on the provided requirements
const REPORT_TYPES = [
  {
    id: 'employee-summary',
    title: 'Employee Summary Report',
    description: 'Comprehensive overview of all employees including personal details, positions, and departments.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
    category: 'HR Core',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  },
  {
    id: 'attrition-reports',
    title: 'Attrition Reports',
    description: 'Summary of attrition analysis with monthly, YTD and per company breakdown.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
      </svg>
    ),
    category: 'Attrition',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  },
  {
    id: 'new-hired-report',
    title: 'New Hired Report',
    description: 'Monthly and YTD new hire statistics with company-wise breakdown.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
    ),
    category: 'Recruitment',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  },
  {
    id: 'resigned-dismissed-movement',
    title: 'Resigned/Dismissed Employee Movement',
    description: 'Employee movement tracking including resignations and dismissals.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5z"/>
      </svg>
    ),
    category: 'Employee Movement',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  },
  {
    id: 'er-cases-monitoring',
    title: 'ER (Cases) Monitoring',
    description: 'Reasons of cases and aging of cases with monthly and YTD tracking.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
      </svg>
    ),
    category: 'Employee Relations',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  },
  {
    id: 'medicard-drug-test',
    title: 'Medicard/Drug Test Monitoring',
    description: 'Medical and drug test compliance monitoring with monthly and YTD reports.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 8h2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2h2c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2zm4-2v2h8V6H8z"/>
      </svg>
    ),
    category: 'Medical',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  },
  {
    id: 'training-monitoring',
    title: 'Training Monitoring',
    description: 'Training completion and compliance tracking with monthly and YTD analysis.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
      </svg>
    ),
    category: 'Training',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  },
  {
    id: 'rehiring-monitoring',
    title: 'Re-hiring Monitoring',
    description: 'Track re-hired employees and their integration progress.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
      </svg>
    ),
    category: 'Recruitment',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  },
  {
    id: 'new-employee-orientation',
    title: 'New Employee Orientation Monitoring',
    description: 'Track new employee orientation completion and effectiveness.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    category: 'Orientation',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  },
  {
    id: 'performance-management',
    title: 'Employee Performance Management',
    description: 'KPI/KRA tracking and performance analysis with monthly and YTD reports.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
      </svg>
    ),
    category: 'Performance',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  },
  {
    id: 'department-analysis',
    title: 'Department Analysis',
    description: 'Department-wise employee distribution, costs, and operational metrics.',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
      </svg>
    ),
    category: 'Departments',
    timeFilters: ['Monthly', 'YTD', 'Per Company']
  }
];

const MainDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('Monthly');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.UserId);
          await fetchCompanies();
        }
      } catch (error) {
        console.error('Error getting user from token:', error);
      } finally {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
      }
    };
    getUserFromToken();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LOAD_FIN_COMPANIES);
      if (response.data && response.data.data) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const categories = ['All', ...new Set(REPORT_TYPES.map(report => report.category))];

  const filteredReports = REPORT_TYPES.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleGenerateReport = async (reportId) => {
    try {
      console.log(`Generating report: ${reportId} with filters:`, {
        timeFilter: selectedTimeFilter,
        company: selectedCompany,
        userId: userId
      });
      
      // Here you would call the appropriate API endpoint based on reportId
      // const response = await axiosInstance.get(`${API_ENDPOINTS.GENERATE_REPORT}?reportType=${reportId}&timeFilter=${selectedTimeFilter}&companyId=${selectedCompany}&userId=${userId}`);
      
      alert(`Generating ${reportId} report for ${selectedTimeFilter} period${selectedCompany ? ` for company ${companies.find(c => c.company_id === selectedCompany)?.company_name}` : ''}`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  const handleScheduleReport = (reportId) => {
    console.log(`Scheduling report: ${reportId}`);
    // Implement report scheduling logic
    alert('Report scheduling feature coming soon!');
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: colors.background.secondary 
      }}>
        <NavPane
          activeNav="Reports"
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
        activeNav="Reports"
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
        <ReportsContainer>
          <PageHeader>
            <div>
              <PageTitle>Reports & Analytics</PageTitle>
              <PageSubtitle>Generate comprehensive reports and gain insights into your HR data</PageSubtitle>
            </div>
            <PageActions>
              <Button 
                variant="secondary"
                onClick={() => console.log('Export all reports')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                </svg>
                Export All
              </Button>
              <Button 
                variant="primary"
                onClick={() => console.log('Create custom report')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Custom Report
              </Button>
            </PageActions>
          </PageHeader>

          {/* Filters Section */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: '1px solid',
                  background: selectedCategory === category ? colors.primary[500] : colors.background.primary,
                  borderColor: selectedCategory === category ? colors.primary[500] : colors.border.medium,
                  color: selectedCategory === category ? 'white' : colors.text.secondary,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                {category}
              </button>
            ))}
            </div>

            {/* Time Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.text.secondary }}>
                Period:
              </label>
              <select
                value={selectedTimeFilter}
                onChange={(e) => setSelectedTimeFilter(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: `1px solid ${colors.border.medium}`,
                  borderRadius: '8px',
                  background: colors.background.primary,
                  color: colors.text.primary,
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '120px'
                }}
              >
                <option value="Monthly">Monthly</option>
                <option value="YTD">Year to Date</option>
                <option value="Yearly">Yearly</option>
                <option value="Custom">Custom Range</option>
              </select>
            </div>

            {/* Company Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.text.secondary }}>
                Company:
              </label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  border: `1px solid ${colors.border.medium}`,
                  borderRadius: '8px',
                  background: colors.background.primary,
                  color: colors.text.primary,
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  minWidth: '200px'
                }}
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ReportGrid>
            {filteredReports.map(report => (
              <ReportCard key={report.id}>
                <ReportIcon>
                  {report.icon}
                </ReportIcon>
                <ReportTitle>{report.title}</ReportTitle>
                <ReportDescription>{report.description}</ReportDescription>
                <ReportActions>
                  <ActionButton
                    className="primary"
                    onClick={() => handleGenerateReport(report.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
                    </svg>
                    Generate
                  </ActionButton>
                  <ActionButton onClick={() => handleScheduleReport(report.id)}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                      <path d="m12.5 7-1 0v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    Schedule
                  </ActionButton>
                </ReportActions>
              </ReportCard>
            ))}
          </ReportGrid>

          {filteredReports.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: colors.text.tertiary
            }}>
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor"
                style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}
              >
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
              </svg>
              <h3 style={{ margin: '0 0 0.5rem', color: colors.text.secondary }}>
                No reports found
              </h3>
              <p style={{ margin: 0 }}>
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </ReportsContainer>
      </div>
    </div>
  );
};

export default MainDashboard;
