'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import NavPane from '../Objects/NavPane';
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';
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
  EmployeesContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PageActions,
  FilterSection,
  FilterGrid,
  FilterGroup,
  FilterLabel,
  FilterInput,
  FilterSelect,
  EmployeeGrid,
  EmployeeCard,
  EmployeeAvatar,
  StatusIndicator,
  EmployeeInfo,
  EmployeeName,
  EmployeeRole,
  EmployeeDepartment,
  EmployeeDetails,
  DetailItem,
  DetailLabel,
  DetailValue,
  EmployeeActions,
  ActionButton,
  Button,
  StatusBadge,
  SearchInputWrapper,
  SearchInput,
  PaginationContainer,
  PaginationButton,
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  TabContainer,
  TabButton,
  TabContent,
  EmployeeProfileHeader,
  LargeAvatar,
  ProfileInfo,
  ProfileName,
  ProfileRole,
  ProfileCompany,
  DetailsGrid,
  DetailsSection,
  SectionTitle,
  DetailsList,
  DetailRow,
  DetailRowLabel,
  DetailRowValue,
  EditableInput,
  EditableField,
  FieldLabel,
  ModalActions,
  ImageUpload,
  ImagePreview
} from './EmployeesStyled';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import Employee201FileModal from '../Objects/Employee201FileModal';

// Mock employee data with Filipino names and Philippine locations
const MOCK_EMPLOYEES = [
  {
    id: 1,
    firstName: 'Juan Carlos',
    middleName: 'Mendoza',
    lastName: 'Santos',
    email: 'juan.santos@abc-corp.com',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    company: 'ABC Corporation',
    status: 'active',
    hireDate: '2022-01-15',
    employeeId: 'EMP001',
    phone: '+63 917 123 4567',
    location: 'Makati City, Metro Manila',
    sssId: '03-1234567-8',
    pagibigId: '1234-5678-9012',
    philhealthId: '12-345678901-2',
    tinId: '123-456-789-000',
    picture: null,
    birthDate: '1990-05-12',
    address: '123 Ayala Avenue, Makati City',
    civilStatus: 'Single',
    gender: 'Male',
    emergencyContact: 'Maria Santos - Mother',
    emergencyPhone: '+63 917 987 6543'
  },
  {
    id: 2,
    firstName: 'Maria Isabel',
    middleName: 'Cruz',
    lastName: 'Garcia',
    email: 'maria.garcia@techno-solutions.ph',
    role: 'HR Manager',
    department: 'Human Resources',
    company: 'Techno Solutions Inc.',
    status: 'active',
    hireDate: '2021-08-20',
    employeeId: 'EMP002',
    phone: '+63 918 234 5678',
    location: 'Taguig City, Metro Manila',
    sssId: '03-2345678-9',
    pagibigId: '2345-6789-0123',
    philhealthId: '23-456789012-3',
    tinId: '234-567-890-111',
    picture: null,
    birthDate: '1988-11-08',
    address: '456 BGC Central, Taguig City',
    civilStatus: 'Married',
    gender: 'Female',
    emergencyContact: 'Jose Garcia - Husband',
    emergencyPhone: '+63 918 876 5432'
  },
  {
    id: 3,
    firstName: 'Miguel Angelo',
    middleName: 'Reyes',
    lastName: 'Johnson',
    email: 'miguel.johnson@global-tech.com.ph',
    role: 'Marketing Specialist',
    department: 'Marketing',
    company: 'Global Tech Philippines',
    status: 'pending',
    hireDate: '2023-11-01',
    employeeId: 'EMP003',
    phone: '+63 919 345 6789',
    location: 'Quezon City, Metro Manila',
    sssId: '03-3456789-0',
    pagibigId: '3456-7890-1234',
    philhealthId: '34-567890123-4',
    tinId: '345-678-901-222',
    picture: null,
    birthDate: '1992-03-22',
    address: '789 Commonwealth Avenue, Quezon City',
    civilStatus: 'Single',
    gender: 'Male',
    emergencyContact: 'Ana Johnson - Sister',
    emergencyPhone: '+63 919 765 4321'
  },
  {
    id: 4,
    firstName: 'Sarah Mae',
    middleName: 'Dela Cruz',
    lastName: 'Williams',
    email: 'sarah.williams@innovate-ph.com',
    role: 'Finance Analyst',
    department: 'Finance',
    company: 'Innovate Philippines',
    status: 'active',
    hireDate: '2022-06-10',
    employeeId: 'EMP004',
    phone: '+63 920 456 7890',
    location: 'Cebu City, Cebu',
    sssId: '07-4567890-1',
    pagibigId: '4567-8901-2345',
    philhealthId: '45-678901234-5',
    tinId: '456-789-012-333',
    picture: null,
    birthDate: '1991-07-15',
    address: '321 IT Park, Cebu City',
    civilStatus: 'Married',
    gender: 'Female',
    emergencyContact: 'David Williams - Husband',
    emergencyPhone: '+63 920 654 3210'
  },
  {
    id: 5,
    firstName: 'David Antonio',
    middleName: 'Villanueva',
    lastName: 'Brown',
    email: 'david.brown@manila-enterprises.ph',
    role: 'Sales Representative',
    department: 'Sales',
    company: 'Manila Enterprises',
    status: 'inactive',
    hireDate: '2020-03-15',
    employeeId: 'EMP005',
    phone: '+63 921 567 8901',
    location: 'Pasig City, Metro Manila',
    sssId: '03-5678901-2',
    pagibigId: '5678-9012-3456',
    philhealthId: '56-789012345-6',
    tinId: '567-890-123-444',
    picture: null,
    birthDate: '1985-12-03',
    address: '654 Ortigas Center, Pasig City',
    civilStatus: 'Single',
    gender: 'Male',
    emergencyContact: 'Carmen Brown - Mother',
    emergencyPhone: '+63 921 543 2109'
  },
  {
    id: 6,
    firstName: 'Emily Rose',
    middleName: 'Gonzales',
    lastName: 'Davis',
    email: 'emily.davis@design-studio.ph',
    role: 'UX Designer',
    department: 'Design',
    company: 'Design Studio Philippines',
    status: 'active',
    hireDate: '2023-02-28',
    employeeId: 'EMP006',
    phone: '+63 922 678 9012',
    location: 'Davao City, Davao del Sur',
    sssId: '11-6789012-3',
    pagibigId: '6789-0123-4567',
    philhealthId: '67-890123456-7',
    tinId: '678-901-234-555',
    picture: null,
    birthDate: '1993-09-18',
    address: '987 Bajada District, Davao City',
    civilStatus: 'Single',
    gender: 'Female',
    emergencyContact: 'Roberto Davis - Father',
    emergencyPhone: '+63 922 432 1098'
  }
];

// Icon Components
const IconComponents = {
  search: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  plus: (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

export default function Employees() {
  // State management
  const [activeNav, setActiveNav] = useState('employees');
  const { isDarkMode, toggleTheme } = useTheme();
  const [userId, setUserId] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [is201FileModalOpen, setIs201FileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('primary');
  const [employees, setEmployees] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const itemsPerPage = 6;

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

  // Fetch employees from API
  const fetchEmployees = async (page = 1, filters = {}) => {
    try {
      setIsLoadingEmployees(true);
      
      // For now using mock data, but this would be the API call:
      // const response = await axiosInstance.get(`${API_ENDPOINTS.EMPLOYEES}`, {
      //   params: {
      //     page,
      //     limit: itemsPerPage,
      //     search: searchQuery,
      //     department: departmentFilter,
      //     company: companyFilter,
      //     status: statusFilter,
      //     ...filters
      //   }
      // });
      
      // Using mock data for now
      const filteredData = MOCK_EMPLOYEES.filter(employee => {
        const matchesSearch = 
          `${employee.firstName} ${employee.middleName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
        const matchesCompany = !companyFilter || employee.company === companyFilter;
        const matchesStatus = !statusFilter || employee.status === statusFilter;
        
        return matchesSearch && matchesDepartment && matchesCompany && matchesStatus;
      });
      
      setEmployees(filteredData);
      setTotalEmployees(filteredData.length);
      
      // if (response.data && response.data.data) {
      //   setEmployees(response.data.data.employees);
      //   setTotalEmployees(response.data.data.total);
      // }
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Set mock data on error
      setEmployees(MOCK_EMPLOYEES);
      setTotalEmployees(MOCK_EMPLOYEES.length);
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  // Create new employee
  const createEmployee = async (employeeData) => {
    try {
      // const response = await axiosInstance.post(API_ENDPOINTS.CREATE_EMPLOYEE, employeeData);
      // await fetchEmployees(currentPage);
      console.log('Creating employee:', employeeData);
      // For now just refresh the mock data
      await fetchEmployees(currentPage);
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  // Update employee
  const updateEmployee = async (employeeId, employeeData) => {
    try {
      // const response = await axiosInstance.put(`${API_ENDPOINTS.UPDATE_EMPLOYEE}/${employeeId}`, employeeData);
      // await fetchEmployees(currentPage);
      console.log('Updating employee:', employeeId, employeeData);
      // For now just refresh the mock data
      await fetchEmployees(currentPage);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Delete employee
  const deleteEmployee = async (employeeId) => {
    try {
      // const response = await axiosInstance.delete(`${API_ENDPOINTS.DELETE_EMPLOYEE}/${employeeId}`);
      // await fetchEmployees(currentPage);
      console.log('Deleting employee:', employeeId);
      // For now just refresh the mock data
      await fetchEmployees(currentPage);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Fetch employees on component mount and when filters change
  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage, searchQuery, departmentFilter, companyFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(totalEmployees / itemsPerPage);
  const paginatedEmployees = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get unique departments and companies
  const departments = [...new Set(MOCK_EMPLOYEES.map(emp => emp.department))];
  const companies = [...new Set(MOCK_EMPLOYEES.map(emp => emp.company))];

  // Helper functions
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
    setActiveTab('primary');
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
    setActiveTab('primary');
  };

  const closeModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIs201FileModalOpen(false);
    setSelectedEmployee(null);
    setActiveTab('primary');
  };

  const handle201FileUpload = (employee) => {
    setSelectedEmployee(employee);
    setIs201FileModalOpen(true);
  };

  const handleAddEmployee = () => {
    // This would open an add employee modal
    console.log('Add new employee');
    // Example of creating an employee:
    // const newEmployeeData = { ... };
    // createEmployee(newEmployeeData);
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
              <h1>Employee Management</h1>
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
        <EmployeesContainer>
          {/* Page Header */}
          <PageHeader>
            <div>
              <PageTitle>Employees</PageTitle>
              <PageSubtitle>Manage your team members and their information</PageSubtitle>
            </div>
            
            <PageActions>
              <Button variant="secondary">
                {IconComponents.download}
                Export
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = '/employee-masterfile'}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Upload Masterfile
              </Button>
              <Button variant="primary" onClick={handleAddEmployee}>
                {IconComponents.plus}
                Add Employee
              </Button>
            </PageActions>
          </PageHeader>

          {/* Filters */}
          <FilterSection>
            <FilterGrid>
              <FilterGroup>
                <FilterLabel>Search Employees</FilterLabel>
                <SearchInputWrapper>
                  {IconComponents.search}
                  <SearchInput
                    type="text"
                    placeholder="Search by name, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </SearchInputWrapper>
              </FilterGroup>
              
              <FilterGroup>
                <FilterLabel>Company</FilterLabel>
                <FilterSelect
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                >
                  <option value="">All Companies</option>
                  {companies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Department</FilterLabel>
                <FilterSelect
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </FilterSelect>
              </FilterGroup>
              
              <FilterGroup>
                <FilterLabel>Status</FilterLabel>
                <FilterSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </FilterSelect>
              </FilterGroup>
            </FilterGrid>
          </FilterSection>

          {/* Employee Grid */}
          {isLoadingEmployees ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '400px',
              color: colors.text.tertiary
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: `3px solid ${colors.primary[200]}`,
                borderTop: `3px solid ${colors.primary[600]}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ marginLeft: '1rem' }}>Loading employees...</span>
            </div>
          ) : (
            <EmployeeGrid>
              {paginatedEmployees.map((employee) => (
              <EmployeeCard key={employee.id}>
                <EmployeeAvatar status={employee.status}>
                  {getInitials(employee.firstName, employee.lastName)}
                  <StatusIndicator status={employee.status} />
                </EmployeeAvatar>
                
                <EmployeeInfo>
                  <EmployeeName>{employee.firstName} {employee.lastName}</EmployeeName>
                  <EmployeeRole>{employee.role}</EmployeeRole>
                  <EmployeeDepartment>{employee.company} • {employee.department}</EmployeeDepartment>
                </EmployeeInfo>

                <EmployeeDetails>
                  <DetailItem>
                    <DetailLabel>Employee ID</DetailLabel>
                    <DetailValue>{employee.employeeId}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Hire Date</DetailLabel>
                    <DetailValue>{formatDate(employee.hireDate)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Location</DetailLabel>
                    <DetailValue>{employee.location}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Status</DetailLabel>
                    <DetailValue>
                      <StatusBadge status={employee.status}>
                        {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                      </StatusBadge>
                    </DetailValue>
                  </DetailItem>
                </EmployeeDetails>

                <EmployeeActions>
                  <ActionButton onClick={() => handleViewEmployee(employee)}>
                    {IconComponents.eye}
                    View
                  </ActionButton>
                  <ActionButton onClick={() => handle201FileUpload(employee)}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Files
                  </ActionButton>
                  <ActionButton className="primary" onClick={() => handleEditEmployee(employee)}>
                    {IconComponents.edit}
                    Edit
                  </ActionButton>
                </EmployeeActions>
              </EmployeeCard>
              ))}
            </EmployeeGrid>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationButton
                  key={page}
                  active={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationButton>
              ))}
              
              <PaginationButton
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </PaginationButton>
            </PaginationContainer>
          )}

          {/* View Employee Modal */}
          {isViewModalOpen && selectedEmployee && (
            <ModalOverlay onClick={closeModals}>
              <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>Employee Details</ModalTitle>
                  <CloseButton onClick={closeModals}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </CloseButton>
                </ModalHeader>

                <TabContainer>
                  <TabButton 
                    active={activeTab === 'primary'} 
                    onClick={() => setActiveTab('primary')}
                  >
                    Primary Details
                  </TabButton>
                  <TabButton 
                    active={activeTab === 'secondary'} 
                    onClick={() => setActiveTab('secondary')}
                  >
                    Secondary Details
                  </TabButton>
                  <TabButton 
                    active={activeTab === 'requirements'} 
                    onClick={() => setActiveTab('requirements')}
                  >
                    Requirements
                  </TabButton>
                  <TabButton 
                    active={activeTab === 'trainings'} 
                    onClick={() => setActiveTab('trainings')}
                  >
                    Trainings & Seminars
                  </TabButton>
                </TabContainer>

                <ModalBody>
                  <TabContent>
                    <EmployeeProfileHeader>
                      <LargeAvatar status={selectedEmployee.status}>
                        {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                      </LargeAvatar>
                      <ProfileInfo>
                        <ProfileName>
                          {selectedEmployee.firstName} {selectedEmployee.middleName} {selectedEmployee.lastName}
                        </ProfileName>
                        <ProfileRole>{selectedEmployee.role}</ProfileRole>
                        <ProfileCompany>{selectedEmployee.company} • {selectedEmployee.department}</ProfileCompany>
                      </ProfileInfo>
                    </EmployeeProfileHeader>

                    {activeTab === 'primary' && (
                      <DetailsGrid>
                        <DetailsSection>
                          <SectionTitle>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Personal Information
                          </SectionTitle>
                          <DetailsList>
                            <DetailRow>
                              <DetailRowLabel>Employee ID</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.employeeId}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Birth Date</DetailRowLabel>
                              <DetailRowValue>{formatDate(selectedEmployee.birthDate)}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Gender</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.gender}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Civil Status</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.civilStatus}</DetailRowValue>
                            </DetailRow>
                          </DetailsList>
                        </DetailsSection>

                        <DetailsSection>
                          <SectionTitle>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Information
                          </SectionTitle>
                          <DetailsList>
                            <DetailRow>
                              <DetailRowLabel>Email</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.email}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Phone</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.phone}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Address</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.address}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Location</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.location}</DetailRowValue>
                            </DetailRow>
                          </DetailsList>
                        </DetailsSection>

                        <DetailsSection>
                          <SectionTitle>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                            </svg>
                            Employment Information
                          </SectionTitle>
                          <DetailsList>
                            <DetailRow>
                              <DetailRowLabel>Hire Date</DetailRowLabel>
                              <DetailRowValue>{formatDate(selectedEmployee.hireDate)}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Status</DetailRowLabel>
                              <DetailRowValue>
                                <StatusBadge status={selectedEmployee.status}>
                                  {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
                                </StatusBadge>
                              </DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Department</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.department}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Company</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.company}</DetailRowValue>
                            </DetailRow>
                          </DetailsList>
                        </DetailsSection>
                      </DetailsGrid>
                    )}

                    {activeTab === 'secondary' && (
                      <DetailsGrid>
                        <DetailsSection>
                          <SectionTitle>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            Emergency Contact
                          </SectionTitle>
                          <DetailsList>
                            <DetailRow>
                              <DetailRowLabel>Emergency Contact</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.emergencyContact}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Emergency Phone</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.emergencyPhone}</DetailRowValue>
                            </DetailRow>
                          </DetailsList>
                        </DetailsSection>

                        <DetailsSection>
                          <SectionTitle>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Government IDs
                          </SectionTitle>
                          <DetailsList>
                            <DetailRow>
                              <DetailRowLabel>SSS ID</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.sssId}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Pag-IBIG ID</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.pagibigId}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>PhilHealth ID</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.philhealthId}</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>TIN ID</DetailRowLabel>
                              <DetailRowValue>{selectedEmployee.tinId}</DetailRowValue>
                            </DetailRow>
                          </DetailsList>
                        </DetailsSection>
                      </DetailsGrid>
                    )}

                    {activeTab === 'requirements' && (
                      <>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          marginBottom: '1.5rem',
                          padding: '1rem',
                          background: colors.background.secondary,
                          borderRadius: '8px',
                          border: `1px solid ${colors.border.light}`
                        }}>
                          <div>
                            <h3 style={{ margin: 0, color: colors.text.primary, fontSize: '1.125rem' }}>
                              Employee 201 File Management
                            </h3>
                            <p style={{ margin: '0.25rem 0 0 0', color: colors.text.tertiary, fontSize: '0.875rem' }}>
                              Upload and manage employee requirements and documents
                            </p>
                          </div>
                          <Button 
                            variant="primary" 
                            onClick={() => handle201FileUpload(selectedEmployee)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Manage 201 Files
                          </Button>
                        </div>

                        <DetailsGrid>
                          <DetailsSection>
                            <SectionTitle>
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Recruitment Requirements
                            </SectionTitle>
                            <DetailsList>
                              <DetailRow>
                                <DetailRowLabel>SSS ID or E1 Form</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.success[600] }}>✓ Submitted</DetailRowValue>
                              </DetailRow>
                              <DetailRow>
                                <DetailRowLabel>TIN ID or BIR form 1902</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.warning[600] }}>⚠ Pending</DetailRowValue>
                              </DetailRow>
                              <DetailRow>
                                <DetailRowLabel>NBI Clearance</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.success[600] }}>✓ Submitted</DetailRowValue>
                              </DetailRow>
                              <DetailRow>
                                <DetailRowLabel>Birth Certificate</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.success[600] }}>✓ Submitted</DetailRowValue>
                              </DetailRow>
                              <DetailRow>
                                <DetailRowLabel>Medical Certificate</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.success[600] }}>✓ Submitted</DetailRowValue>
                              </DetailRow>
                              <DetailRow>
                                <DetailRowLabel>Drug Test</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.error[600] }}>✗ Missing</DetailRowValue>
                              </DetailRow>
                            </DetailsList>
                          </DetailsSection>

                          <DetailsSection>
                            <SectionTitle>
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              Training & Development
                            </SectionTitle>
                            <DetailsList>
                              <DetailRow>
                                <DetailRowLabel>New Employee Orientation Form</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.success[600] }}>✓ Completed</DetailRowValue>
                              </DetailRow>
                              <DetailRow>
                                <DetailRowLabel>Training Certificates</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.success[600] }}>✓ 3 Submitted</DetailRowValue>
                              </DetailRow>
                              <DetailRow>
                                <DetailRowLabel>Training Bonds</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.warning[600] }}>⚠ Pending</DetailRowValue>
                              </DetailRow>
                            </DetailsList>
                          </DetailsSection>

                          <DetailsSection>
                            <SectionTitle>
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Account Management
                            </SectionTitle>
                            <DetailsList>
                              <DetailRow>
                                <DetailRowLabel>Probationary Contract</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.success[600] }}>✓ Signed</DetailRowValue>
                              </DetailRow>
                              <DetailRow>
                                <DetailRowLabel>Performance Appraisal Form</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.error[600] }}>✗ Not Due</DetailRowValue>
                              </DetailRow>
                            </DetailsList>
                          </DetailsSection>

                          <DetailsSection>
                            <SectionTitle>
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Employee Relations
                            </SectionTitle>
                            <DetailsList>
                              <DetailRow>
                                <DetailRowLabel>COC Acknowledgment Form</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.success[600] }}>✓ Acknowledged</DetailRowValue>
                              </DetailRow>
                              <DetailRow>
                                <DetailRowLabel>Non-disclosure Agreement</DetailRowLabel>
                                <DetailRowValue style={{ color: colors.success[600] }}>✓ Signed</DetailRowValue>
                              </DetailRow>
                            </DetailsList>
                          </DetailsSection>
                        </DetailsGrid>
                      </>
                    )}

                    {activeTab === 'trainings' && (
                      <DetailsGrid>
                        <DetailsSection>
                          <SectionTitle>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Completed Trainings
                          </SectionTitle>
                          <DetailsList>
                            <DetailRow>
                              <DetailRowLabel>New Employee Orientation</DetailRowLabel>
                              <DetailRowValue>Jan 16, 2022</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Safety & Security Training</DetailRowLabel>
                              <DetailRowValue>Jan 18, 2022</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Software Development Best Practices</DetailRowLabel>
                              <DetailRowValue>Mar 15, 2023</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Leadership Development Program</DetailRowLabel>
                              <DetailRowValue>Sep 20, 2023</DetailRowValue>
                            </DetailRow>
                          </DetailsList>
                        </DetailsSection>

                        <DetailsSection>
                          <SectionTitle>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Upcoming/Pending
                          </SectionTitle>
                          <DetailsList>
                            <DetailRow>
                              <DetailRowLabel>Advanced React Training</DetailRowLabel>
                              <DetailRowValue style={{ color: colors.primary[600] }}>Feb 15, 2024</DetailRowValue>
                            </DetailRow>
                            <DetailRow>
                              <DetailRowLabel>Performance Management</DetailRowLabel>
                              <DetailRowValue style={{ color: colors.warning[600] }}>Pending Approval</DetailRowValue>
                            </DetailRow>
                          </DetailsList>
                        </DetailsSection>
                      </DetailsGrid>
                    )}
                  </TabContent>
                </ModalBody>
              </ModalContainer>
            </ModalOverlay>
          )}

          {/* Edit Employee Modal */}
          {isEditModalOpen && selectedEmployee && (
            <ModalOverlay onClick={closeModals}>
              <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                  <ModalTitle>Edit Employee</ModalTitle>
                  <CloseButton onClick={closeModals}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </CloseButton>
                </ModalHeader>

                <ModalBody>
                  <TabContent>
                    <EmployeeProfileHeader>
                      <LargeAvatar status={selectedEmployee.status}>
                        {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                      </LargeAvatar>
                      <ProfileInfo>
                        <ProfileName>
                          {selectedEmployee.firstName} {selectedEmployee.middleName} {selectedEmployee.lastName}
                        </ProfileName>
                        <ProfileRole>{selectedEmployee.role}</ProfileRole>
                        <ProfileCompany>{selectedEmployee.company} • {selectedEmployee.department}</ProfileCompany>
                      </ProfileInfo>
                    </EmployeeProfileHeader>

                    <ImageUpload>
                      <ImagePreview>
                        {selectedEmployee.picture ? (
                          <img src={selectedEmployee.picture} alt="Employee" />
                        ) : (
                          <div>
                            <svg style={{ width: '24px', height: '24px', marginBottom: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <div>Upload Photo</div>
                          </div>
                        )}
                      </ImagePreview>
                      <Button variant="secondary" size="sm">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Change Photo
                      </Button>
                    </ImageUpload>

                    <DetailsGrid>
                      <DetailsSection>
                        <SectionTitle>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Personal Information
                        </SectionTitle>
                        <EditableField>
                          <FieldLabel>First Name</FieldLabel>
                          <EditableInput 
                            type="text" 
                            defaultValue={selectedEmployee.firstName}
                          />
                        </EditableField>
                        <EditableField>
                          <FieldLabel>Middle Name</FieldLabel>
                          <EditableInput 
                            type="text" 
                            defaultValue={selectedEmployee.middleName}
                          />
                        </EditableField>
                        <EditableField>
                          <FieldLabel>Last Name</FieldLabel>
                          <EditableInput 
                            type="text" 
                            defaultValue={selectedEmployee.lastName}
                          />
                        </EditableField>
                      </DetailsSection>

                      <DetailsSection>
                        <SectionTitle>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Government IDs
                        </SectionTitle>
                        <EditableField>
                          <FieldLabel>SSS ID</FieldLabel>
                          <EditableInput 
                            type="text" 
                            defaultValue={selectedEmployee.sssId}
                          />
                        </EditableField>
                        <EditableField>
                          <FieldLabel>Pag-IBIG ID</FieldLabel>
                          <EditableInput 
                            type="text" 
                            defaultValue={selectedEmployee.pagibigId}
                          />
                        </EditableField>
                        <EditableField>
                          <FieldLabel>PhilHealth ID</FieldLabel>
                          <EditableInput 
                            type="text" 
                            defaultValue={selectedEmployee.philhealthId}
                          />
                        </EditableField>
                        <EditableField>
                          <FieldLabel>TIN ID</FieldLabel>
                          <EditableInput 
                            type="text" 
                            defaultValue={selectedEmployee.tinId}
                          />
                        </EditableField>
                      </DetailsSection>
                    </DetailsGrid>
                  </TabContent>
                </ModalBody>

                <ModalActions>
                  <Button variant="secondary" onClick={closeModals}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={async () => {
                    // Collect form data and save
                    await updateEmployee(selectedEmployee.id, {
                      // This would collect form data
                      // For now just logging
                    });
                    console.log('Save employee changes');
                    closeModals();
                  }}>
                    Save Changes
                  </Button>
                </ModalActions>
              </ModalContainer>
            </ModalOverlay>
          )}

          {/* Employee 201 File Upload Modal */}
          <Employee201FileModal
            isOpen={is201FileModalOpen}
            onClose={closeModals}
            employeeId={selectedEmployee?.employeeId}
            employeeName={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ''}
          />
        </EmployeesContainer>
      </MainContent>
    </DashboardContainer>
  );
}
