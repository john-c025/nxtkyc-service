'use client';

import React, { useState, useEffect } from 'react';
import NavPane from '../Objects/NavPane';
import {
  PerformanceContainer,
  PerformanceGrid,
  PerformanceCard,
  EmployeeHeader,
  EmployeeAvatar,
  EmployeeInfo,
  EmployeeName,
  EmployeeRole,
  PerformanceScore,
  ScoreValue,
  ScoreLabel,
  MetricsGrid,
  MetricItem,
  MetricValue,
  MetricLabel,
  ProgressBar,
  ProgressFill,
  PerformanceActions,
  ActionButton,
  FilterBar,
  FilterGroup,
  FilterLabel,
  Select,
  SearchInput,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PageActions,
  Button,
  colors
} from './PerformanceStyled';

// Mock performance data
const PERFORMANCE_DATA = [
  {
    id: 1,
    employeeName: 'Juan Carlos Santos',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    company: 'ABC Corporation',
    overallScore: 4.8,
    goals: 95,
    productivity: 92,
    quality: 88,
    collaboration: 90,
    lastReview: '2024-01-15',
    nextReview: '2024-04-15'
  },
  {
    id: 2,
    employeeName: 'Maria Isabel Garcia',
    role: 'HR Manager',
    department: 'Human Resources',
    company: 'Techno Solutions Inc.',
    overallScore: 4.6,
    goals: 88,
    productivity: 85,
    quality: 92,
    collaboration: 95,
    lastReview: '2024-01-10',
    nextReview: '2024-04-10'
  },
  {
    id: 3,
    employeeName: 'Miguel Angelo Johnson',
    role: 'Marketing Specialist',
    department: 'Marketing',
    company: 'Global Tech Philippines',
    overallScore: 3.8,
    goals: 75,
    productivity: 78,
    quality: 82,
    collaboration: 80,
    lastReview: '2024-01-20',
    nextReview: '2024-04-20'
  },
  {
    id: 4,
    employeeName: 'Sarah Mae Williams',
    role: 'Finance Analyst',
    department: 'Finance',
    company: 'Innovate Philippines',
    overallScore: 4.2,
    goals: 82,
    productivity: 88,
    quality: 85,
    collaboration: 78,
    lastReview: '2024-01-08',
    nextReview: '2024-04-08'
  },
  {
    id: 5,
    employeeName: 'David Antonio Brown',
    role: 'Sales Representative',
    department: 'Sales',
    company: 'Manila Enterprises',
    overallScore: 3.2,
    goals: 65,
    productivity: 70,
    quality: 68,
    collaboration: 72,
    lastReview: '2024-01-12',
    nextReview: '2024-04-12'
  },
  {
    id: 6,
    employeeName: 'Emily Rose Davis',
    role: 'UX Designer',
    department: 'Design',
    company: 'Design Studio Philippines',
    overallScore: 4.5,
    goals: 90,
    productivity: 87,
    quality: 93,
    collaboration: 88,
    lastReview: '2024-01-18',
    nextReview: '2024-04-18'
  }
];

const MainDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [performanceData, setPerformanceData] = useState(PERFORMANCE_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let filtered = PERFORMANCE_DATA;

    if (searchQuery) {
      filtered = filtered.filter(employee => 
        employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(employee => employee.department === departmentFilter);
    }

    if (scoreFilter !== 'all') {
      filtered = filtered.filter(employee => {
        const score = employee.overallScore;
        switch (scoreFilter) {
          case 'excellent': return score >= 4.5;
          case 'good': return score >= 3.5 && score < 4.5;
          case 'needs-improvement': return score < 3.5;
          default: return true;
        }
      });
    }

    setPerformanceData(filtered);
  }, [searchQuery, departmentFilter, scoreFilter]);

  const departments = [...new Set(PERFORMANCE_DATA.map(emp => emp.department))];

  const getInitials = (name) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  const getScoreLevel = (score) => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Good';
    if (score >= 2.5) return 'Fair';
    return 'Needs Improvement';
  };

  const handleViewDetails = (employeeId) => {
    console.log('View performance details:', employeeId);
  };

  const handleCreateReview = (employeeId) => {
    console.log('Create performance review:', employeeId);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: colors.background.secondary 
      }}>
        <NavPane
          activeNav="Performance"
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
        activeNav="Performance"
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
        <PerformanceContainer>
          <PageHeader>
            <div>
              <PageTitle>Performance Management</PageTitle>
              <PageSubtitle>Track employee performance, reviews, and goal achievements</PageSubtitle>
            </div>
            <PageActions>
              <Button 
                variant="secondary"
                onClick={() => console.log('Performance analytics')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                Analytics
              </Button>
              <Button 
                variant="primary"
                onClick={() => console.log('Create review cycle')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                New Review Cycle
              </Button>
            </PageActions>
          </PageHeader>

          {/* Filters */}
          <FilterBar>
            <SearchInput
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <FilterGroup>
              <FilterLabel>Department:</FilterLabel>
              <Select 
                value={departmentFilter} 
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Performance:</FilterLabel>
              <Select 
                value={scoreFilter} 
                onChange={(e) => setScoreFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="excellent">Excellent (4.5+)</option>
                <option value="good">Good (3.5-4.4)</option>
                <option value="needs-improvement">Needs Improvement (&lt;3.5)</option>
              </Select>
            </FilterGroup>
          </FilterBar>

          {/* Performance Grid */}
          <PerformanceGrid>
            {performanceData.map(employee => (
              <PerformanceCard key={employee.id} score={employee.overallScore}>
                <EmployeeHeader>
                  <EmployeeAvatar>
                    {getInitials(employee.employeeName)}
                  </EmployeeAvatar>
                  <EmployeeInfo>
                    <EmployeeName>{employee.employeeName}</EmployeeName>
                    <EmployeeRole>{employee.role} • {employee.company}</EmployeeRole>
                  </EmployeeInfo>
                </EmployeeHeader>

                <PerformanceScore>
                  <ScoreValue score={employee.overallScore}>
                    {employee.overallScore.toFixed(1)}
                  </ScoreValue>
                  <ScoreLabel>{getScoreLevel(employee.overallScore)}</ScoreLabel>
                </PerformanceScore>

                <MetricsGrid>
                  <MetricItem>
                    <MetricValue>{employee.goals}%</MetricValue>
                    <MetricLabel>Goals</MetricLabel>
                    <ProgressBar>
                      <ProgressFill progress={employee.goals} />
                    </ProgressBar>
                  </MetricItem>
                  <MetricItem>
                    <MetricValue>{employee.productivity}%</MetricValue>
                    <MetricLabel>Productivity</MetricLabel>
                    <ProgressBar>
                      <ProgressFill progress={employee.productivity} />
                    </ProgressBar>
                  </MetricItem>
                  <MetricItem>
                    <MetricValue>{employee.quality}%</MetricValue>
                    <MetricLabel>Quality</MetricLabel>
                    <ProgressBar>
                      <ProgressFill progress={employee.quality} />
                    </ProgressBar>
                  </MetricItem>
                  <MetricItem>
                    <MetricValue>{employee.collaboration}%</MetricValue>
                    <MetricLabel>Collaboration</MetricLabel>
                    <ProgressBar>
                      <ProgressFill progress={employee.collaboration} />
                    </ProgressBar>
                  </MetricItem>
                </MetricsGrid>

                <div style={{ 
                  fontSize: '0.75rem', 
                  color: colors.text.tertiary, 
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  Last Review: {new Date(employee.lastReview).toLocaleDateString()} • 
                  Next: {new Date(employee.nextReview).toLocaleDateString()}
                </div>

                <PerformanceActions>
                  <ActionButton onClick={() => handleViewDetails(employee.id)}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    View Details
                  </ActionButton>
                  <ActionButton 
                    className="primary" 
                    onClick={() => handleCreateReview(employee.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Review
                  </ActionButton>
                </PerformanceActions>
              </PerformanceCard>
            ))}
          </PerformanceGrid>

          {performanceData.length === 0 && (
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
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
              <h3 style={{ margin: '0 0 0.5rem', color: colors.text.secondary }}>
                No performance data found
              </h3>
              <p style={{ margin: 0 }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </PerformanceContainer>
      </div>
    </div>
  );
};

export default MainDashboard;
