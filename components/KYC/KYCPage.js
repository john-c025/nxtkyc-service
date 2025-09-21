'use client';

import React, { useState, useEffect } from 'react';
import { 
  DashboardContainer, 
  MainContent, 
  TopBar, 
  HeaderContent, 
  HeaderTitle, 
  HeaderActions,
  ContentLayout,
  Card,
  Button,
  SearchInput,
  SearchInputWrapper,
  StatusBadge,
  Table,
  TabContainer,
  TabList,
  TabButton,
  MobileMenuToggle,
  CompanyFilterContainer,
  ActionButtonsContainer,
  SettingsGrid,
  PrivilegeCard,
  PrivilegeList,
  PrivilegeItem,
  PrivilegeForm,
  FilterSortContainer,
  FilterGroup,
  SortGroup,
  FilterActions,
  ViewFilesModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  FileList,
  FileItem,
  FilePreview,
  RightNavPane,
  NavPaneHeader,
  NavPaneContent,
  NavMenuItem,
  NavPaneToggle
} from './KYCPageStyled';

export default function KYCPage() {
  const [activeTab, setActiveTab] = useState('verification');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [kycRequests, setKycRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [kycPrivileges, setKycPrivileges] = useState([]);
  const [showPrivilegeForm, setShowPrivilegeForm] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [selectedRequestFiles, setSelectedRequestFiles] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isNavPaneOpen, setIsNavPaneOpen] = useState(false);

  // Mock data for KYC requests based on database schema
  const mockKycData = [
    {
      autoid: 1,
      kyc_request_id: 'KYC-2024-001-ABC123',
      company_id: 1,
      client_account_id: 1,
      token_id: 1,
      request_type: 'initial_verification',
      request_status: 1, // 1=Pending, 2=In Review, 3=Approved, 4=Rejected, 5=Archived
      priority_level: 2, // 1=Low, 2=Medium, 3=High, 4=Urgent
      request_description: 'Initial KYC verification for new client account',
      current_level: 0,
      level_to_upgrade_to: 1,
      has_files: true,
      is_one_time_only: true,
      submitted_at: '2024-01-15T10:30:00Z',
      completed_at: null,
      archived_at: null,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      created_by: 'CLIENT001',
      updated_by: 'CLIENT001',
      // Client account details
      client_account: {
        fname: 'John',
        mname: 'Michael',
        sname: 'Doe',
        account_code: 'ACC-001-2024',
        account_origin_number: 'ORIG-001',
        account_id: 'CLIENT-001',
        account_status: 1,
        current_privilege_level: 0,
        is_active: true
      },
      // Company details
      company: {
        company_id: 1,
        company_name: 'Acme Corporation',
        company_code: 'ACME-001',
        company_type: 'Financial Services',
        is_active: true
      },
      // File count
      file_count: 3
    },
    {
      autoid: 2,
      kyc_request_id: 'KYC-2024-002-DEF456',
      company_id: 2,
      client_account_id: 2,
      token_id: 2,
      request_type: 'level_upgrade',
      request_status: 3, // Approved
      priority_level: 1, // Low
      request_description: 'Upgrade to level 2 verification',
      current_level: 1,
      level_to_upgrade_to: 2,
      has_files: true,
      is_one_time_only: false,
      submitted_at: '2024-01-14T14:20:00Z',
      completed_at: '2024-01-16T09:15:00Z',
      archived_at: null,
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-16T09:15:00Z',
      created_by: 'CLIENT002',
      updated_by: 'ADMIN001',
      client_account: {
        fname: 'Jane',
        mname: 'Elizabeth',
        sname: 'Smith',
        account_code: 'ACC-002-2024',
        account_origin_number: 'ORIG-002',
        account_id: 'CLIENT-002',
        account_status: 1,
        current_privilege_level: 2,
        is_active: true
      },
      company: {
        company_id: 2,
        company_name: 'Tech Solutions Inc',
        company_code: 'TECH-002',
        company_type: 'Technology',
        is_active: true
      },
      file_count: 2
    },
    {
      autoid: 3,
      kyc_request_id: 'KYC-2024-003-GHI789',
      company_id: 3,
      client_account_id: 3,
      token_id: 3,
      request_type: 'initial_verification',
      request_status: 4, // Rejected
      priority_level: 3, // High
      request_description: 'Initial verification with incomplete documentation',
      current_level: 0,
      level_to_upgrade_to: 1,
      has_files: true,
      is_one_time_only: true,
      submitted_at: '2024-01-13T16:45:00Z',
      completed_at: '2024-01-15T11:30:00Z',
      archived_at: null,
      created_at: '2024-01-13T16:45:00Z',
      updated_at: '2024-01-15T11:30:00Z',
      created_by: 'CLIENT003',
      updated_by: 'ADMIN002',
      client_account: {
        fname: 'Mike',
        mname: 'Robert',
        sname: 'Johnson',
        account_code: 'ACC-003-2024',
        account_origin_number: 'ORIG-003',
        account_id: 'CLIENT-003',
        account_status: 1,
        current_privilege_level: 0,
        is_active: true
      },
      company: {
        company_id: 3,
        company_name: 'Global Finance Ltd',
        company_code: 'GLOBAL-003',
        company_type: 'Banking',
        is_active: true
      },
      file_count: 2
    },
    {
      autoid: 4,
      kyc_request_id: 'KYC-2024-004-JKL012',
      company_id: 4,
      client_account_id: 4,
      token_id: 4,
      request_type: 'compliance_review',
      request_status: 2, // In Review
      priority_level: 2, // Medium
      request_description: 'Annual compliance review and document update',
      current_level: 1,
      level_to_upgrade_to: 2,
      has_files: true,
      is_one_time_only: false,
      submitted_at: '2024-01-12T09:15:00Z',
      completed_at: null,
      archived_at: null,
      created_at: '2024-01-12T09:15:00Z',
      updated_at: '2024-01-12T09:15:00Z',
      created_by: 'CLIENT004',
      updated_by: 'CLIENT004',
      client_account: {
        fname: 'Sarah',
        mname: 'Anne',
        sname: 'Wilson',
        account_code: 'ACC-004-2024',
        account_origin_number: 'ORIG-004',
        account_id: 'CLIENT-004',
        account_status: 1,
        current_privilege_level: 1,
        is_active: true
      },
      company: {
        company_id: 4,
        company_name: 'StartupXYZ',
        company_code: 'STARTUP-004',
        company_type: 'Startup',
        is_active: true
      },
      file_count: 4
    }
  ];

  // Mock data for KYC privileges based on database schema
  const mockKycPrivileges = [
    {
      autoid: 1,
      company_id: 1,
      privilege_level: 1,
      privilege_name: 'Basic Verification',
      privilege_description: 'Standard KYC verification with basic document requirements',
      privileges_json: JSON.stringify({
        documents_required: ['ID', 'Proof of Address'],
        verification_time: '24 hours',
        approval_authority: 'Level 1 Officer'
      }),
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      created_by: 'ADMIN001',
      updated_by: 'ADMIN001',
      company: {
        company_name: 'Acme Corporation',
        company_type: 'Financial Services'
      }
    },
    {
      autoid: 2,
      company_id: 1,
      privilege_level: 2,
      privilege_name: 'Enhanced Verification',
      privilege_description: 'Advanced KYC with additional documentation and verification steps',
      privileges_json: JSON.stringify({
        documents_required: ['ID', 'Proof of Address', 'Bank Statement', 'Employment Letter'],
        verification_time: '48 hours',
        approval_authority: 'Level 2 Officer'
      }),
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      created_by: 'ADMIN001',
      updated_by: 'ADMIN001',
      company: {
        company_name: 'Acme Corporation',
        company_type: 'Financial Services'
      }
    },
    {
      autoid: 3,
      company_id: 2,
      privilege_level: 1,
      privilege_name: 'Tech Startup Basic',
      privilege_description: 'Streamlined verification for tech startup clients',
      privileges_json: JSON.stringify({
        documents_required: ['ID', 'Business Registration'],
        verification_time: '12 hours',
        approval_authority: 'Level 1 Officer'
      }),
      is_active: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      created_by: 'ADMIN001',
      updated_by: 'ADMIN001',
      company: {
        company_name: 'Tech Solutions Inc',
        company_type: 'Technology'
      }
    }
  ];

  useEffect(() => {
    setKycRequests(mockKycData);
    setKycPrivileges(mockKycPrivileges);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 3: return 'success'; // Approved
      case 1: return 'warning'; // Pending
      case 4: return 'error'; // Rejected
      case 2: return 'warning'; // In Review
      case 5: return 'neutral'; // Archived
      default: return 'neutral';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'In Review';
      case 3: return 'Approved';
      case 4: return 'Rejected';
      case 5: return 'Archived';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return 'success'; // Low
      case 2: return 'warning'; // Medium
      case 3: return 'error'; // High
      case 4: return 'error'; // Urgent
      default: return 'neutral';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      case 4: return 'Urgent';
      default: return 'Unknown';
    }
  };

  const getRequestTypeText = (type) => {
    switch (type) {
      case 'initial_verification': return 'Initial Verification';
      case 'level_upgrade': return 'Level Upgrade';
      case 'compliance_review': return 'Compliance Review';
      case 'document_update': return 'Document Update';
      default: return type.replace('_', ' ').toUpperCase();
    }
  };

  const filteredAndSortedRequests = kycRequests.filter(request => {
    const matchesCompany = selectedCompany === 'all' || request.company.company_id.toString() === selectedCompany;
    const matchesPriority = selectedPriority === 'all' || request.priority_level.toString() === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || request.request_status.toString() === selectedStatus;
    
    return matchesCompany && matchesPriority && matchesStatus;
  }).sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'date':
        compareValue = new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime();
        break;
      case 'request_id':
        compareValue = a.kyc_request_id.localeCompare(b.kyc_request_id);
        break;
      case 'company':
        compareValue = a.company.company_name.localeCompare(b.company.company_name);
        break;
      case 'priority':
        compareValue = a.priority_level - b.priority_level;
        break;
      case 'status':
        compareValue = a.request_status - b.request_status;
        break;
      default:
        compareValue = 0;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const handleStatusUpdate = (requestId, newStatus) => {
    setKycRequests(prev => 
      prev.map(request => 
        request.kyc_request_id === requestId ? { 
          ...request, 
          request_status: newStatus,
          completed_at: newStatus === 3 || newStatus === 4 ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
          updated_by: 'CURRENT_USER' // This would come from auth context
        } : request
      )
    );
  };

  const handleDocumentDownload = (requestId, documentType) => {
    // Mock download functionality
    console.log(`Downloading ${documentType} for request ${requestId}`);
  };

  const handleArchiveRequest = (requestId) => {
    setKycRequests(prev => 
      prev.map(request => 
        request.kyc_request_id === requestId ? { 
          ...request, 
          request_status: 5, // Archived
          archived_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          updated_by: 'CURRENT_USER'
        } : request
      )
    );
  };

  const companies = [...new Set(kycRequests.map(request => ({
    company_id: request.company.company_id,
    company_name: request.company.company_name
  })))];

  const handleResetFilters = () => {
    setSelectedCompany('all');
    setSelectedPriority('all');
    setSelectedStatus('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // Mock file data for different requests
  const mockFileData = {
    'KYC-2024-001-ABC123': [
      {
        id: 1,
        name: 'passport_scan.jpg',
        type: 'image',
        size: '2.4 MB',
        url: '/api/placeholder/800/600',
        extension: 'jpg'
      },
      {
        id: 2,
        name: 'proof_of_address.pdf',
        type: 'pdf',
        size: '1.2 MB',
        url: '/api/files/proof_of_address.pdf',
        extension: 'pdf'
      },
      {
        id: 3,
        name: 'bank_statement.docx',
        type: 'docx',
        size: '856 KB',
        url: '/api/files/bank_statement.docx',
        extension: 'docx'
      }
    ],
    'KYC-2024-002-DEF456': [
      {
        id: 4,
        name: 'identity_verification.png',
        type: 'image',
        size: '3.1 MB',
        url: '/api/placeholder/600/800',
        extension: 'png'
      },
      {
        id: 5,
        name: 'video_verification.mp4',
        type: 'video',
        size: '15.6 MB',
        url: '/api/files/video_verification.mp4',
        extension: 'mp4'
      }
    ],
    'KYC-2024-003-GHI789': [
      {
        id: 6,
        name: 'incomplete_doc.txt',
        type: 'restricted',
        size: '1 KB',
        url: null,
        extension: 'txt'
      },
      {
        id: 7,
        name: 'driver_license.jpg',
        type: 'image',
        size: '1.8 MB',
        url: '/api/placeholder/700/500',
        extension: 'jpg'
      }
    ]
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'video': return '🎥';
      default: return '🚫';
    }
  };

  const isFileSupported = (extension) => {
    const supportedTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'mp4', 'mov', 'avi'];
    return supportedTypes.includes(extension.toLowerCase());
  };

  const canPreview = (type) => {
    return ['image', 'pdf', 'video'].includes(type);
  };

  const handleViewFiles = (requestId) => {
    const files = mockFileData[requestId] || [];
    const supportedFiles = files.filter(file => isFileSupported(file.extension));
    
    setSelectedRequestFiles({
      requestId,
      files: supportedFiles
    });
    setSelectedFileIndex(0);
    setShowFilesModal(true);
  };

  const handleFileDownload = (file) => {
    if (file.type === 'docx' || file.type === 'video') {
      // Simulate download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleLogout = () => {
    // Simulate logout
    console.log('Logging out...');
    // You would typically clear tokens and redirect here
  };

  return (
    <DashboardContainer>
      <MainContent>
        <TopBar>
          <HeaderContent>
            <MobileMenuToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </MobileMenuToggle>
            <HeaderTitle>
              <h1>KYC Service Portal</h1>
              <p>Know Your Customer verification and compliance management</p>
            </HeaderTitle>
          </HeaderContent>
          <HeaderActions>
            {/* Filters and Sort Controls */}
          </HeaderActions>
        </TopBar>

        <ContentLayout>
          <TabContainer>
            <TabList>
              <TabButton 
                isActive={activeTab === 'verification'} 
                onClick={() => setActiveTab('verification')}
              >
                Verification Requests
              </TabButton>
              <TabButton 
                isActive={activeTab === 'documents'} 
                onClick={() => setActiveTab('documents')}
              >
                Document Management
              </TabButton>
              <TabButton 
                isActive={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
              >
                Privilege Settings
              </TabButton>
            </TabList>
          </TabContainer>

          {activeTab === 'verification' && (
            <>
              <FilterSortContainer>
                <FilterGroup>
                  <label>Company</label>
                  <select 
                    value={selectedCompany} 
                    onChange={(e) => setSelectedCompany(e.target.value)}
                  >
                    <option value="all">All Companies</option>
                    {companies.map(company => (
                      <option key={company.company_id} value={company.company_id.toString()}>
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                </FilterGroup>

                <FilterGroup>
                  <label>Priority</label>
                  <select 
                    value={selectedPriority} 
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    <option value="all">All Priorities</option>
                    <option value="1">Low</option>
                    <option value="2">Medium</option>
                    <option value="3">High</option>
                    <option value="4">Urgent</option>
                  </select>
                </FilterGroup>

                <FilterGroup>
                  <label>Status</label>
                  <select 
                    value={selectedStatus} 
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="1">Pending</option>
                    <option value="2">In Review</option>
                    <option value="3">Approved</option>
                    <option value="4">Rejected</option>
                    <option value="5">Archived</option>
                  </select>
                </FilterGroup>

                <SortGroup>
                  <label>Sort By</label>
                  <div className="sort-controls">
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="date">Date</option>
                      <option value="request_id">Request ID</option>
                      <option value="company">Company</option>
                      <option value="priority">Priority</option>
                      <option value="status">Status</option>
                    </select>
                    <button type="button" onClick={toggleSortOrder} title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
                      {sortOrder === 'asc' ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                        </svg>
                      )}
                    </button>
                  </div>
                </SortGroup>

                <FilterActions>
                  <Button size="sm" variant="secondary" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                </FilterActions>
              </FilterSortContainer>

              <Card>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                    KYC Verification Requests
                  </h2>
                  <p style={{ color: '#64748b', margin: 0 }}>
                    Manage and review client verification requests ({filteredAndSortedRequests.length} results)
                  </p>
                </div>

                <Table>
                <table>
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Client Name</th>
                      <th>Company</th>
                      <th>Account Code</th>
                      <th>Request Type</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Current Level</th>
                      <th>Target Level</th>
                      <th>Files</th>
                      <th>Submitted Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedRequests.map((request) => (
                      <tr key={request.autoid}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                            {request.kyc_request_id}
                          </span>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '600' }}>
                              {request.client_account.fname} {request.client_account.mname} {request.client_account.sname}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {request.client_account.account_id}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500' }}>
                              {request.company.company_name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {request.company.company_type}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {request.client_account.account_code}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.875rem' }}>
                            {getRequestTypeText(request.request_type)}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={getStatusColor(request.request_status)}>
                            {getStatusText(request.request_status)}
                          </StatusBadge>
                        </td>
                        <td>
                          <StatusBadge status={getPriorityColor(request.priority_level)}>
                            {getPriorityText(request.priority_level)}
                          </StatusBadge>
                        </td>
                        <td>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            background: '#e2e8f0', 
                            color: '#475569',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {request.current_level}
                          </span>
                        </td>
                        <td>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: request.level_to_upgrade_to >= 4 ? '32px' : '24px', 
                            height: '24px', 
                            borderRadius: request.level_to_upgrade_to >= 4 ? '12px' : '50%', 
                            background: request.level_to_upgrade_to >= 4 ? '#fcd34d' : '#dbeafe', 
                            color: request.level_to_upgrade_to >= 4 ? '#92400e' : '#2563eb',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {request.level_to_upgrade_to >= 4 ? 'MAX' : request.level_to_upgrade_to}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <span>{request.file_count}</span>
                            {request.has_files && (
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </td>
                        <td>{new Date(request.submitted_at).toLocaleDateString()}</td>
                        <td>
                          <ActionButtonsContainer>
                            <Button 
                              size="sm" 
                              variant="primary"
                              onClick={() => handleViewFiles(request.kyc_request_id)}
                            >
                              View Files
                            </Button>
                            {request.level_to_upgrade_to < 4 && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => handleStatusUpdate(request.kyc_request_id, 2)}
                                  disabled={request.request_status === 3 || request.request_status === 4 || request.request_status === 5}
                                >
                                  Review
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => handleStatusUpdate(request.kyc_request_id, 3)}
                                  disabled={request.request_status === 3 || request.request_status === 5}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => handleStatusUpdate(request.kyc_request_id, 4)}
                                  disabled={request.request_status === 4 || request.request_status === 5}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleArchiveRequest(request.kyc_request_id)}
                              disabled={request.request_status === 5}
                            >
                              Archive
                            </Button>
                          </ActionButtonsContainer>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </Table>
              </Card>
            </>
          )}

          {activeTab === 'documents' && (
            <Card>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                  Document Management
                </h2>
                <p style={{ color: '#64748b', margin: 0 }}>
                  Upload, review, and manage client documents
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                <p>Document management interface will be implemented here</p>
              </div>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                  KYC Privilege Settings
                </h2>
                <p style={{ color: '#64748b', margin: 0 }}>
                  Configure company-specific KYC privilege levels and verification requirements
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowPrivilegeForm(!showPrivilegeForm)}
                  >
                    {showPrivilegeForm ? 'Cancel' : 'Add New Privilege'}
                  </Button>
                </div>
              </div>

              {showPrivilegeForm && (
                <PrivilegeForm>
                  <div className="form-header">
                    <h3>Create New KYC Privilege</h3>
                    <p>Define a new privilege level for a specific company</p>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Company</label>
                      <select>
                        <option value="">Select Company</option>
                        {companies.map(company => (
                          <option key={company.company_id} value={company.company_id}>
                            {company.company_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Privilege Level</label>
                      <select>
                        <option value="">Select Level</option>
                        <option value="1">Level 1 - Basic</option>
                        <option value="2">Level 2 - Enhanced</option>
                        <option value="3">Level 3 - Premium</option>
                        <option value="4">Level 4 - Enterprise</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Privilege Name</label>
                      <input type="text" placeholder="e.g., Enhanced Verification" />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Description</label>
                      <textarea placeholder="Describe the privilege requirements and scope..."></textarea>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <Button type="submit" variant="primary">Create Privilege</Button>
                    <Button type="button" variant="secondary" onClick={() => setShowPrivilegeForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </PrivilegeForm>
              )}

              <SettingsGrid>
                {companies.map(company => {
                  const companyPrivileges = kycPrivileges.filter(p => p.company_id === company.company_id);
                  
                  return (
                    <PrivilegeCard key={company.company_id}>
                      <div className="company-header">
                        <div>
                          <h3>{company.company_name}</h3>
                          <span className="company-type">Financial Services</span>
                        </div>
                        <StatusBadge status={companyPrivileges.length > 0 ? 'success' : 'warning'}>
                          {companyPrivileges.length} Privilege{companyPrivileges.length !== 1 ? 's' : ''}
                        </StatusBadge>
                      </div>
                      
                      <PrivilegeList>
                        {companyPrivileges.length > 0 ? (
                          companyPrivileges.map(privilege => (
                            <PrivilegeItem key={privilege.autoid} isActive={privilege.is_active}>
                              <div className="privilege-info">
                                <div className="privilege-name">{privilege.privilege_name}</div>
                                <div className="privilege-description">{privilege.privilege_description}</div>
                              </div>
                              <div className="privilege-level">
                                <span className="level-badge">{privilege.privilege_level}</span>
                                <Button size="sm" variant="ghost">Edit</Button>
                              </div>
                            </PrivilegeItem>
                          ))
                        ) : (
                          <div style={{ 
                            textAlign: 'center', 
                            padding: '2rem', 
                            color: '#64748b',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px dashed #cbd5e1'
                          }}>
                            <p style={{ margin: 0, fontSize: '0.875rem' }}>
                              No privileges configured for this company
                            </p>
                          </div>
                        )}
                      </PrivilegeList>
                    </PrivilegeCard>
                  );
                })}
              </SettingsGrid>
            </Card>
          )}
        </ContentLayout>
      </MainContent>

      {/* Right Navigation Pane */}
      <NavPaneToggle 
        isNavOpen={isNavPaneOpen} 
        onClick={() => setIsNavPaneOpen(!isNavPaneOpen)}
      >
        {isNavPaneOpen ? (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </NavPaneToggle>

      <RightNavPane isOpen={isNavPaneOpen}>
        <NavPaneHeader>
          <div className="user-info">
            <div className="avatar">
              JD
            </div>
            <div className="user-details">
              <h4 className="user-name">John Doe</h4>
              <p className="user-id">USER001</p>
            </div>
          </div>
        </NavPaneHeader>

        <NavPaneContent>
          <NavMenuItem>
            <div className="icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Reports
          </NavMenuItem>
          
          <NavMenuItem>
            <div className="icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            Settings
          </NavMenuItem>

          <NavMenuItem onClick={handleLogout}>
            <div className="icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            Logout
          </NavMenuItem>
        </NavPaneContent>
      </RightNavPane>

      {/* View Files Modal */}
      {showFilesModal && selectedRequestFiles && (
        <ViewFilesModal onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowFilesModal(false);
          }
        }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Files for {selectedRequestFiles.requestId}</h3>
              <button 
                className="close-button" 
                onClick={() => setShowFilesModal(false)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </ModalHeader>

            <ModalBody>
              <FileList>
                {selectedRequestFiles.files.map((file, index) => (
                  <FileItem 
                    key={file.id}
                    isSelected={index === selectedFileIndex}
                    onClick={() => setSelectedFileIndex(index)}
                  >
                    <div className={`file-icon ${file.type}`}>
                      {getFileIcon(file.type)}
                    </div>
                    <div className="file-info">
                      <h4 className="file-name" title={file.name}>{file.name}</h4>
                      <p className="file-size">{file.size}</p>
                    </div>
                  </FileItem>
                ))}
              </FileList>

              <FilePreview>
                {selectedRequestFiles.files[selectedFileIndex] && (
                  <>
                    <div className="preview-header">
                      <h4 className="file-title">
                        {selectedRequestFiles.files[selectedFileIndex].name}
                      </h4>
                      <div className="file-actions">
                        {(selectedRequestFiles.files[selectedFileIndex].type === 'docx' || 
                          selectedRequestFiles.files[selectedFileIndex].type === 'video') && (
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={() => handleFileDownload(selectedRequestFiles.files[selectedFileIndex])}
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="preview-content">
                      {(() => {
                        const currentFile = selectedRequestFiles.files[selectedFileIndex];
                        
                        if (currentFile.type === 'image') {
                          return (
                            <img 
                              src={currentFile.url} 
                              alt={currentFile.name}
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                              }}
                            />
                          );
                        }
                        
                        if (currentFile.type === 'pdf') {
                          return (
                            <iframe 
                              src={`${currentFile.url}#toolbar=0`}
                              title={currentFile.name}
                            />
                          );
                        }
                        
                        if (currentFile.type === 'video') {
                          return (
                            <video controls>
                              <source src={currentFile.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          );
                        }
                        
                        return (
                          <div className="no-preview">
                            <div className="icon">📄</div>
                            <h4>{currentFile.type === 'docx' ? 'Document File' : 'File Not Supported'}</h4>
                            <p>
                              {currentFile.type === 'docx' 
                                ? 'Click download to view this document'
                                : 'This file type cannot be previewed'
                              }
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </>
                )}
              </FilePreview>
            </ModalBody>
          </ModalContent>
        </ViewFilesModal>
      )}
    </DashboardContainer>
  );
}
