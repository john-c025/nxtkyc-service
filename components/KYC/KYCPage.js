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
  CompanyFilterContainer
} from './KYCPageStyled';

export default function KYCPage() {
  const [activeTab, setActiveTab] = useState('verification');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [kycRequests, setKycRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    setKycRequests(mockKycData);
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

  const filteredRequests = kycRequests.filter(request => {
    const clientName = `${request.client_account.fname} ${request.client_account.mname} ${request.client_account.sname}`;
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.kyc_request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.client_account.account_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === 'all' || request.company.company_id.toString() === selectedCompany;
    return matchesSearch && matchesCompany;
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
            <SearchInputWrapper>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <SearchInput
                type="text"
                placeholder="Search KYC requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchInputWrapper>
            <CompanyFilterContainer>
              <label>Company:</label>
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
            </CompanyFilterContainer>
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
                isActive={activeTab === 'compliance'} 
                onClick={() => setActiveTab('compliance')}
              >
                Compliance Reports
              </TabButton>
              <TabButton 
                isActive={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
              >
                KYC Settings
              </TabButton>
            </TabList>
          </TabContainer>

          {activeTab === 'verification' && (
            <Card>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                  KYC Verification Requests
                </h2>
                <p style={{ color: '#64748b', margin: 0 }}>
                  Manage and review client verification requests
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
                    {filteredRequests.map((request) => (
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
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            background: '#dbeafe', 
                            color: '#2563eb',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {request.level_to_upgrade_to}
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
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <Button 
                              size="sm" 
                              variant="primary"
                              onClick={() => handleDocumentDownload(request.kyc_request_id, 'all')}
                            >
                              View Files
                            </Button>
                            {request.request_status === 1 && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => handleStatusUpdate(request.kyc_request_id, 2)}
                                >
                                  Start Review
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => handleStatusUpdate(request.kyc_request_id, 3)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => handleStatusUpdate(request.kyc_request_id, 4)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {request.request_status === 2 && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => handleStatusUpdate(request.kyc_request_id, 3)}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => handleStatusUpdate(request.kyc_request_id, 4)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleArchiveRequest(request.kyc_request_id)}
                            >
                              Archive
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Table>
            </Card>
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

          {activeTab === 'compliance' && (
            <Card>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                  Compliance Reports
                </h2>
                <p style={{ color: '#64748b', margin: 0 }}>
                  Generate and view compliance reports
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                <p>Compliance reporting interface will be implemented here</p>
              </div>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                  KYC Settings
                </h2>
                <p style={{ color: '#64748b', margin: 0 }}>
                  Configure KYC verification settings and requirements
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                <p>KYC settings interface will be implemented here</p>
              </div>
            </Card>
          )}
        </ContentLayout>
      </MainContent>
    </DashboardContainer>
  );
}
