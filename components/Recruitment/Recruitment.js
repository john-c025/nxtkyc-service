'use client';

import React, { useState, useEffect } from 'react';
import NavPane from '../Objects/NavPane';
import {
  RecruitmentContainer,
  JobGrid,
  JobCard,
  JobHeader,
  JobTitle,
  JobDepartment,
  JobMeta,
  MetaItem,
  JobDescription,
  StatusBadge,
  JobActions,
  ActionButton,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
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
} from './RecruitmentStyled';

// Mock job postings data
const JOB_POSTINGS = [
  {
    id: 'job-001',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90,000 - $120,000',
    posted: '3 days ago',
    applications: 24,
    status: 'active',
    urgent: false,
    description: 'We are looking for an experienced Frontend Developer to join our growing engineering team. You will work on cutting-edge web applications using React, TypeScript, and modern web technologies.'
  },
  {
    id: 'job-002',
    title: 'Product Manager',
    department: 'Product',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    posted: '1 week ago',
    applications: 18,
    status: 'active',
    urgent: true,
    description: 'Join our product team to drive strategy and execution for our core platform. You will work closely with engineering, design, and business teams to deliver exceptional user experiences.'
  },
  {
    id: 'job-003',
    title: 'UX Designer',
    department: 'Design',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$80,000 - $100,000',
    posted: '5 days ago',
    applications: 31,
    status: 'active',
    urgent: false,
    description: 'We are seeking a talented UX Designer to create intuitive and engaging user experiences. You will conduct user research, create wireframes, and collaborate with cross-functional teams.'
  },
  {
    id: 'job-004',
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$95,000 - $125,000',
    posted: '2 days ago',
    applications: 12,
    status: 'draft',
    urgent: false,
    description: 'Help us scale our infrastructure and improve deployment processes. You will work with containerization, CI/CD pipelines, and cloud platforms to ensure reliable and efficient operations.'
  },
  {
    id: 'job-005',
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Austin, TX',
    type: 'Part-time',
    salary: '$50,000 - $65,000',
    posted: '1 month ago',
    applications: 45,
    status: 'closed',
    urgent: false,
    description: 'Drive marketing campaigns and content creation to increase brand awareness and customer acquisition. Experience with digital marketing tools and analytics platforms required.'
  },
  {
    id: 'job-006',
    title: 'Data Scientist',
    department: 'Analytics',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    posted: '4 days ago',
    applications: 27,
    status: 'active',
    urgent: true,
    description: 'Use advanced analytics and machine learning to derive insights from large datasets. You will collaborate with product and engineering teams to build data-driven features.'
  }
];

const RECRUITMENT_STATS = [
  { label: 'Open Positions', value: '12', color: colors.primary[600] },
  { label: 'Total Applications', value: '157', color: colors.success[600] },
  { label: 'Interviews Scheduled', value: '28', color: colors.warning[600] },
  { label: 'Offers Extended', value: '5', color: colors.error[600] }
];

const MainDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [jobs, setJobs] = useState(JOB_POSTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = JOB_POSTINGS;

    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(job => job.department === departmentFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(job => job.type === typeFilter);
    }

    setJobs(filtered);
  }, [searchQuery, statusFilter, departmentFilter, typeFilter]);

  const departments = [...new Set(JOB_POSTINGS.map(job => job.department))];
  const types = [...new Set(JOB_POSTINGS.map(job => job.type))];

  const handleViewApplications = (jobId) => {
    console.log(`Viewing applications for job: ${jobId}`);
  };

  const handleEditJob = (jobId) => {
    console.log(`Editing job: ${jobId}`);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: colors.background.secondary 
      }}>
        <NavPane
          activeNav="Recruitment"
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
        activeNav="Recruitment"
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
        <RecruitmentContainer>
          <PageHeader>
            <div>
              <PageTitle>Recruitment & Hiring</PageTitle>
              <PageSubtitle>Manage job postings, applications, and hiring pipeline</PageSubtitle>
            </div>
            <PageActions>
              <Button 
                variant="secondary"
                onClick={() => console.log('View reports')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                Hiring Reports
              </Button>
              <Button 
                variant="primary"
                onClick={() => console.log('Create new job')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                New Job Posting
              </Button>
            </PageActions>
          </PageHeader>

          {/* Stats */}
          <StatsGrid>
            {RECRUITMENT_STATS.map(stat => (
              <StatCard key={stat.label}>
                <StatValue style={{ color: stat.color }}>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>

          {/* Filters */}
          <FilterBar>
            <SearchInput
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <FilterGroup>
              <FilterLabel>Status:</FilterLabel>
              <Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </Select>
            </FilterGroup>

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
              <FilterLabel>Type:</FilterLabel>
              <Select 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </FilterGroup>
          </FilterBar>

          {/* Job Listings */}
          <JobGrid>
            {jobs.map(job => (
              <JobCard key={job.id} urgent={job.urgent}>
                <JobHeader>
                  <div style={{ flex: 1 }}>
                    <JobTitle>{job.title}</JobTitle>
                    <JobDepartment>{job.department}</JobDepartment>
                  </div>
                  <StatusBadge status={job.status}>
                    {job.status === 'active' && (
                      <svg viewBox="0 0 8 8" fill="currentColor" style={{ width: '6px', height: '6px' }}>
                        <circle cx="4" cy="4" r="4"/>
                      </svg>
                    )}
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </StatusBadge>
                </JobHeader>

                <JobMeta>
                  <MetaItem>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {job.location}
                  </MetaItem>
                  <MetaItem>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                      <path d="m12.5 7-1 0v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    {job.type}
                  </MetaItem>
                  <MetaItem>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                    </svg>
                    {job.salary}
                  </MetaItem>
                </JobMeta>

                <JobDescription>{job.description}</JobDescription>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                  color: colors.text.tertiary
                }}>
                  <span>Posted {job.posted}</span>
                  <span>{job.applications} applications</span>
                </div>

                <JobActions>
                  <ActionButton
                    className="primary"
                    onClick={() => handleViewApplications(job.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.03 3.03 0 0 0 16.07 6c-.8 0-1.54.37-2.01.97l-.91 1.36c-.45.68-.26 1.6.42 2.05L16 12v1l-1.75 5h1.89L17.5 13H18v9h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
                    </svg>
                    View Applications
                  </ActionButton>
                  <ActionButton onClick={() => handleEditJob(job.id)}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                    Edit
                  </ActionButton>
                </JobActions>
              </JobCard>
            ))}
          </JobGrid>

          {jobs.length === 0 && (
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
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
              </svg>
              <h3 style={{ margin: '0 0 0.5rem', color: colors.text.secondary }}>
                No jobs found
              </h3>
              <p style={{ margin: 0 }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </RecruitmentContainer>
      </div>
    </div>
  );
};

export default MainDashboard;
