'use client';

import React, { useState, useEffect } from 'react';
import NavPane from '../Objects/NavPane';
import {
  PayrollContainer,
  PayrollTable,
  TableHeader,
  TableRow,
  EmployeeInfo,
  Avatar,
  EmployeeDetails,
  EmployeeName,
  EmployeeRole,
  Amount,
  StatusBadge,
  ActionButton,
  SummaryGrid,
  SummaryCard,
  SummaryIcon,
  SummaryValue,
  SummaryLabel,
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
} from './PayrollStyled';

// Mock payroll data
const PAYROLL_DATA = [
  {
    id: 1,
    employeeName: 'Juan Santos',
    role: 'Software Engineer',
    employeeId: 'EMP001',
    basicSalary: 45000,
    overtime: 5000,
    deductions: 8500,
    netPay: 41500,
    status: 'paid',
    payPeriod: 'December 2024'
  },
  {
    id: 2,
    employeeName: 'Maria Garcia',
    role: 'HR Specialist',
    employeeId: 'EMP002',
    basicSalary: 38000,
    overtime: 2000,
    deductions: 7200,
    netPay: 32800,
    status: 'pending',
    payPeriod: 'December 2024'
  },
  {
    id: 3,
    employeeName: 'Jose Cruz',
    role: 'Accountant',
    employeeId: 'EMP003',
    basicSalary: 42000,
    overtime: 3500,
    deductions: 8100,
    netPay: 37400,
    status: 'processing',
    payPeriod: 'December 2024'
  },
  {
    id: 4,
    employeeName: 'Ana Reyes',
    role: 'Marketing Manager',
    employeeId: 'EMP004',
    basicSalary: 55000,
    overtime: 4000,
    deductions: 11500,
    netPay: 47500,
    status: 'paid',
    payPeriod: 'December 2024'
  }
];

const PAYROLL_SUMMARY = [
  {
    title: 'Total Payroll',
    value: '₱2,450,000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
      </svg>
    ),
    bg: colors.primary[100],
    color: colors.primary[600]
  },
  {
    title: 'Employees Paid',
    value: '156',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.03 3.03 0 0 0 16.07 6c-.8 0-1.54.37-2.01.97l-.91 1.36c-.45.68-.26 1.6.42 2.05L16 12v1l-1.75 5h1.89L17.5 13H18v9h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
      </svg>
    ),
    bg: colors.success[100],
    color: colors.success[600]
  },
  {
    title: 'Pending Payments',
    value: '12',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <path d="m12.5 7-1 0v6l5.25 3.15.75-1.23-4.5-2.67z"/>
      </svg>
    ),
    bg: colors.warning[100],
    color: colors.warning[600]
  },
  {
    title: 'Total Deductions',
    value: '₱485,200',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 14H5l-5-5 5-5h14v10z"/>
        <path d="M6.5 10.5h2v-2h-2v2zm3-2v2h2v-2h-2zm3 0v2h2v-2h-2z"/>
      </svg>
    ),
    bg: colors.error[100],
    color: colors.error[600]
  }
];

const MainDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [payrollData, setPayrollData] = useState(PAYROLL_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('december-2024');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let filtered = PAYROLL_DATA;

    if (searchQuery) {
      filtered = filtered.filter(employee => 
        employee.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(employee => employee.status === statusFilter);
    }

    setPayrollData(filtered);
  }, [searchQuery, statusFilter]);

  const getInitials = (name) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: colors.background.secondary 
      }}>
        <NavPane
          activeNav="Payroll"
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
        activeNav="Payroll"
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
        <PayrollContainer>
          <PageHeader>
            <div>
              <PageTitle>Payroll Management</PageTitle>
              <PageSubtitle>Process and manage employee salaries and deductions</PageSubtitle>
            </div>
            <PageActions>
              <Button 
                variant="secondary"
                onClick={() => console.log('Generate payslips')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                </svg>
                Generate Payslips
              </Button>
              <Button 
                variant="primary"
                onClick={() => console.log('Process payroll')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Process Payroll
              </Button>
            </PageActions>
          </PageHeader>

          {/* Summary Cards */}
          <SummaryGrid>
            {PAYROLL_SUMMARY.map(summary => (
              <SummaryCard key={summary.title}>
                <SummaryIcon bg={summary.bg} color={summary.color}>
                  {summary.icon}
                </SummaryIcon>
                <SummaryValue>{summary.value}</SummaryValue>
                <SummaryLabel>{summary.title}</SummaryLabel>
              </SummaryCard>
            ))}
          </SummaryGrid>

          {/* Filters */}
          <FilterBar>
            <SearchInput
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <FilterGroup>
              <FilterLabel>Pay Period:</FilterLabel>
              <Select 
                value={periodFilter} 
                onChange={(e) => setPeriodFilter(e.target.value)}
              >
                <option value="december-2024">December 2024</option>
                <option value="november-2024">November 2024</option>
                <option value="october-2024">October 2024</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Status:</FilterLabel>
              <Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
              </Select>
            </FilterGroup>
          </FilterBar>

          {/* Payroll Table */}
          <PayrollTable>
            <TableHeader>
              <div>Employee</div>
              <div>Basic Salary</div>
              <div>Overtime</div>
              <div>Deductions</div>
              <div>Net Pay</div>
              <div>Status</div>
              <div>Actions</div>
            </TableHeader>

            {payrollData.map(employee => (
              <TableRow key={employee.id}>
                <EmployeeInfo>
                  <Avatar>
                    {getInitials(employee.employeeName)}
                  </Avatar>
                  <EmployeeDetails>
                    <EmployeeName>{employee.employeeName}</EmployeeName>
                    <EmployeeRole>{employee.role} • {employee.employeeId}</EmployeeRole>
                  </EmployeeDetails>
                </EmployeeInfo>
                
                <Amount>{formatCurrency(employee.basicSalary)}</Amount>
                <Amount>{formatCurrency(employee.overtime)}</Amount>
                <Amount>{formatCurrency(employee.deductions)}</Amount>
                <Amount style={{ fontWeight: '600', color: colors.success[600] }}>
                  {formatCurrency(employee.netPay)}
                </Amount>
                
                <StatusBadge status={employee.status}>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </StatusBadge>
                
                <ActionButton onClick={() => console.log('View payslip', employee.id)}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </ActionButton>
              </TableRow>
            ))}
          </PayrollTable>

          {payrollData.length === 0 && (
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
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
              </svg>
              <h3 style={{ margin: '0 0 0.5rem', color: colors.text.secondary }}>
                No payroll records found
              </h3>
              <p style={{ margin: 0 }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </PayrollContainer>
      </div>
    </div>
  );
};

export default MainDashboard;
