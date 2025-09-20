'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import NavPane from '../Objects/NavPane';
import {
  DashboardContainer,
  Sidebar,
  MainContent,
  TopBar,
  HeaderContent,
  HeaderTitle,
  HeaderActions,
  MobileMenuToggle,
  ThemeToggle,
  colors
} from '../Dashboard/MainDashboardStyled';
import {
  DepartmentsContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PageActions,
  DepartmentGrid,
  DepartmentCard,
  DepartmentIcon,
  DepartmentName,
  DepartmentDescription,
  DepartmentStats,
  StatItem,
  StatValue,
  StatLabel,
  DepartmentManager,
  ManagerAvatar,
  ManagerInfo,
  ManagerName,
  ManagerTitle,
  DepartmentActions,
  ActionButton,
  Button
} from './DepartmentsStyled';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

// Mock department data
const MOCK_DEPARTMENTS = [
  {
    id: 1,
    name: 'Engineering',
    description: 'Software development, system architecture, and technical innovation.',
    employeeCount: 45,
    openPositions: 8,
    manager: {
      name: 'John Smith',
      title: 'VP of Engineering',
      initials: 'JS'
    },
    color: 'blue'
  },
  {
    id: 2,
    name: 'Human Resources',
    description: 'Talent acquisition, employee relations, and organizational development.',
    employeeCount: 12,
    openPositions: 2,
    manager: {
      name: 'Sarah Johnson',
      title: 'HR Director',
      initials: 'SJ'
    },
    color: 'green'
  },
  {
    id: 3,
    name: 'Sales',
    description: 'Revenue generation, customer acquisition, and market expansion.',
    employeeCount: 28,
    openPositions: 5,
    manager: {
      name: 'Michael Brown',
      title: 'Sales Director',
      initials: 'MB'
    },
    color: 'orange'
  },
  {
    id: 4,
    name: 'Marketing',
    description: 'Brand management, digital marketing, and customer engagement.',
    employeeCount: 18,
    openPositions: 3,
    manager: {
      name: 'Emily Davis',
      title: 'Marketing Manager',
      initials: 'ED'
    },
    color: 'blue'
  },
  {
    id: 5,
    name: 'Finance',
    description: 'Financial planning, accounting, and business operations.',
    employeeCount: 15,
    openPositions: 1,
    manager: {
      name: 'David Wilson',
      title: 'Finance Director',
      initials: 'DW'
    },
    color: 'green'
  },
  {
    id: 6,
    name: 'Design',
    description: 'User experience design, visual design, and product design.',
    employeeCount: 22,
    openPositions: 4,
    manager: {
      name: 'Lisa Anderson',
      title: 'Design Lead',
      initials: 'LA'
    },
    color: 'orange'
  }
];

// Icon Components
const IconComponents = {
  code: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  users: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  chart: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  ),
  speakerphone: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  calculator: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  palette: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M15 5l2 2" />
    </svg>
  ),
  plus: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  download: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  edit: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  eye: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
  )
};

// Department icon mapping
const getDepartmentIcon = (departmentName) => {
  switch (departmentName.toLowerCase()) {
    case 'engineering':
      return IconComponents.code;
    case 'human resources':
      return IconComponents.users;
    case 'sales':
      return IconComponents.chart;
    case 'marketing':
      return IconComponents.speakerphone;
    case 'finance':
      return IconComponents.calculator;
    case 'design':
      return IconComponents.palette;
    default:
      return IconComponents.users;
  }
};

export default function Departments() {
  // State management
  const [activeNav, setActiveNav] = useState('departments');
  const { isDarkMode, toggleTheme } = useTheme();
  const [userId, setUserId] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get user ID from token
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.UserId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper functions
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleEditDepartment = (department) => {
    console.log('Edit department:', department);
    // Implement edit functionality
  };

  const handleViewDepartment = (department) => {
    console.log('View department:', department);
    // Implement view functionality
  };

  const handleAddDepartment = () => {
    console.log('Add new department');
    // Implement add functionality
  };

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
              <h1>Department Management</h1>
              <p>{currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </HeaderTitle>
          </HeaderContent>

          <HeaderActions>
            <ThemeToggle onClick={toggleTheme}>
              {isDarkMode ? IconComponents.sun : IconComponents.moon}
            </ThemeToggle>
          </HeaderActions>
        </TopBar>

        {/* Page Content */}
        <DepartmentsContainer>
          {/* Page Header */}
          <PageHeader>
            <div>
              <PageTitle>Departments</PageTitle>
              <PageSubtitle>Manage organizational departments and their teams</PageSubtitle>
            </div>
            
            <PageActions>
              <Button variant="secondary">
                {IconComponents.download}
                Export
              </Button>
              <Button variant="primary" onClick={handleAddDepartment}>
                {IconComponents.plus}
                Add Department
              </Button>
            </PageActions>
          </PageHeader>

          {/* Department Grid */}
          <DepartmentGrid>
            {MOCK_DEPARTMENTS.map((department) => (
              <DepartmentCard key={department.id} color={department.color}>
                <DepartmentIcon color={department.color}>
                  {getDepartmentIcon(department.name)}
                </DepartmentIcon>
                
                <DepartmentName>{department.name}</DepartmentName>
                <DepartmentDescription>{department.description}</DepartmentDescription>

                <DepartmentStats>
                  <StatItem>
                    <StatValue>{department.employeeCount}</StatValue>
                    <StatLabel>Employees</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{department.openPositions}</StatValue>
                    <StatLabel>Open Positions</StatLabel>
                  </StatItem>
                </DepartmentStats>

                <DepartmentManager>
                  <ManagerAvatar>
                    {department.manager.initials}
                  </ManagerAvatar>
                  <ManagerInfo>
                    <ManagerName>{department.manager.name}</ManagerName>
                    <ManagerTitle>{department.manager.title}</ManagerTitle>
                  </ManagerInfo>
                </DepartmentManager>

                <DepartmentActions>
                  <ActionButton onClick={() => handleViewDepartment(department)}>
                    {IconComponents.eye}
                    View
                  </ActionButton>
                  <ActionButton className="primary" onClick={() => handleEditDepartment(department)}>
                    {IconComponents.edit}
                    Manage
                  </ActionButton>
                </DepartmentActions>
              </DepartmentCard>
            ))}
          </DepartmentGrid>
        </DepartmentsContainer>
      </MainContent>
    </DashboardContainer>
  );
}
