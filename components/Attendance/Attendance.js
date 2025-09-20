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
  ThemeToggle
} from '../Dashboard/MainDashboardStyled';
import {
  AttendanceContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PageActions,
  AttendanceStats,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  AttendanceTable,
  TableHeader,
  TableTitle,
  Table,
  StatusBadge,
  Button
} from './AttendanceStyled';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

// Mock attendance data
const MOCK_ATTENDANCE = [
  { id: 1, name: 'John Doe', department: 'Engineering', checkIn: '09:00', checkOut: '18:00', status: 'present', date: '2024-01-15' },
  { id: 2, name: 'Jane Smith', department: 'HR', checkIn: '09:15', checkOut: '17:45', status: 'late', date: '2024-01-15' },
  { id: 3, name: 'Mike Johnson', department: 'Sales', checkIn: '-', checkOut: '-', status: 'absent', date: '2024-01-15' },
  { id: 4, name: 'Sarah Williams', department: 'Marketing', checkIn: '08:45', checkOut: '17:30', status: 'present', date: '2024-01-15' },
  { id: 5, name: 'David Brown', department: 'Finance', checkIn: '09:30', checkOut: '18:15', status: 'late', date: '2024-01-15' },
];

const STATS_DATA = [
  { label: 'Present Today', value: '142', type: 'present' },
  { label: 'Absent Today', value: '8', type: 'absent' },
  { label: 'Late Arrivals', value: '12', type: 'late' },
  { label: 'On Time Rate', value: '89%', type: 'default' }
];

const IconComponents = {
  userCheck: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>),
  userX: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6M9 9l6 6" /></svg>),
  clock: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  trendingUp: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>),
  download: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>),
  filter: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" /></svg>),
  menu: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>),
  sun: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>),
  moon: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>)
};

const getStatIcon = (type) => {
  switch (type) {
    case 'present': return IconComponents.userCheck;
    case 'absent': return IconComponents.userX;
    case 'late': return IconComponents.clock;
    default: return IconComponents.trendingUp;
  }
};

export default function Attendance() {
  const [activeNav, setActiveNav] = useState('attendance');
  const { isDarkMode, toggleTheme } = useTheme();
  const [userId, setUserId] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <DashboardContainer>
      <Sidebar isCollapsed={isSidebarCollapsed} isOpen={isMobileMenuOpen}>
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

      <MainContent sidebarCollapsed={isSidebarCollapsed}>
        <TopBar>
          <HeaderContent>
            <MobileMenuToggle onClick={toggleMobileMenu}>
              {IconComponents.menu}
            </MobileMenuToggle>
            
            <HeaderTitle>
              <h1>Attendance Management</h1>
              <p>{currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}</p>
            </HeaderTitle>
          </HeaderContent>

          <HeaderActions>
            <ThemeToggle onClick={toggleTheme}>
              {isDarkMode ? IconComponents.sun : IconComponents.moon}
            </ThemeToggle>
          </HeaderActions>
        </TopBar>

        <AttendanceContainer>
          <PageHeader>
            <div>
              <PageTitle>Attendance</PageTitle>
              <PageSubtitle>Monitor employee attendance and work hours</PageSubtitle>
            </div>
            
            <PageActions>
              <Button variant="secondary">
                {IconComponents.filter}
                Filter
              </Button>
              <Button variant="secondary">
                {IconComponents.download}
                Export
              </Button>
            </PageActions>
          </PageHeader>

          <AttendanceStats>
            {STATS_DATA.map((stat, index) => (
              <StatCard key={index}>
                <StatIcon type={stat.type}>
                  {getStatIcon(stat.type)}
                </StatIcon>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </AttendanceStats>

          <AttendanceTable>
            <TableHeader>
              <TableTitle>Today's Attendance</TableTitle>
            </TableHeader>
            <Table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ATTENDANCE.map((record) => (
                  <tr key={record.id}>
                    <td>{record.name}</td>
                    <td>{record.department}</td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut}</td>
                    <td>
                      <StatusBadge status={record.status}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </AttendanceTable>
        </AttendanceContainer>
      </MainContent>
    </DashboardContainer>
  );
}
