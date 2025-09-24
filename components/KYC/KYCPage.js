'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../backend/apiHelper';
import axiosInstance from '../backend/axiosInstance';
import { getAuthToken, isAuthenticated, getUserFromToken } from '../../utils/cookieHelper';
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
  
  // API and real data state
  const [apiMode, setApiMode] = useState(true); // Default to API mode
  const [companies, setCompanies] = useState([]);
  const [clientAccounts, setClientAccounts] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [companyStatistics, setCompanyStatistics] = useState([]);
  const [privilegeLevels, setPrivilegeLevels] = useState([]);
  const [fileCategories, setFileCategories] = useState([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  
  // Authentication state
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    user: null,
    token: null
  });
  
  // Test mode state
  const [testMode, setTestMode] = useState(false);
  const [showTestGenerator, setShowTestGenerator] = useState(false);
  const [showClientCreator, setShowClientCreator] = useState(false);
  const [testFormData, setTestFormData] = useState({
    selectedCompany: '',
    selectedClient: '',
    requestType: 'initial_verification',
    priorityLevel: 2,
    currentLevel: 0,
    targetLevel: 1,
    requestDescription: '',
    generateFiles: true,
    fileCount: 3
  });
  const [clientFormData, setClientFormData] = useState({
    selectedCompany: '',
    fname: '',
    mname: '',
    sname: '',
    email: '',
    mobileno: '',
    accountOriginNumber: '',
    currentPrivilegeLevel: 0,
    accountMetadata: ''
  });
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);

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
        company_name: 'Blooms Wellness',
        company_code: '3297',
        company_type: 'Networking',
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
        company_name: 'Nanucell',
        company_code: '62144',
        company_type: 'Networking',
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
        company_name: 'Worldwide Premiere',
        company_code: '97821',
        company_type: 'Networking',
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
        company_name: 'Nextapp',
        company_code: '345254',
        company_type: 'Software',
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
      privilege_name: 'Level 1',
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
        company_name: 'Nanucell ',
        company_type: 'Networking'
      }
    }
  ];

  // API Integration Functions
  const loadCompanies = async () => {
    try {
      setIsLoadingCompanies(true);
      console.log('Loading companies from:', API_ENDPOINTS.KYC_GET_COMPANIES);
      const response = await axiosInstance.get(API_ENDPOINTS.KYC_GET_COMPANIES);
      console.log('Companies API response:', response.data);
      
      if (response.data.success) {
        setCompanies(response.data.data);
        console.log('Companies loaded successfully:', response.data.data);
      } else {
        console.error('Companies API returned success: false', response.data);
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
      console.error('Error details:', error.response?.data);
      // Set empty array to prevent dropdown issues
      setCompanies([]);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const loadClientAccounts = async (companyId = null) => {
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await axiosInstance.get(`${API_ENDPOINTS.KYC_GET_CLIENT_ACCOUNTS}?${params}`);
      if (response.data.success) {
        setClientAccounts(response.data.data);
      }
    } catch (error) {
      console.error('Error loading client accounts:', error);
    }
  };

  const loadKYCRequests = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedCompany !== 'all') params.append('companyId', selectedCompany);
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedPriority !== 'all') params.append('priorityLevel', selectedPriority);
      
      const response = await axiosInstance.get(`${API_ENDPOINTS.KYC_GET_REQUESTS}?${params}`);
      if (response.data.success) {
        console.log('KYC Requests API response structure:', response.data.data);
        console.log('First request structure:', response.data.data[0]);
        setKycRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error loading KYC requests:', error);
      // Fallback to mock data
      setKycRequests(mockKycData);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardSummary = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCompany !== 'all') params.append('companyId', selectedCompany);
      
      const response = await axiosInstance.get(`${API_ENDPOINTS.KYC_DASHBOARD_SUMMARY}?${params}`);
      if (response.data.success) {
        setDashboardSummary(response.data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard summary:', error);
    }
  };

  const loadPrivilegeLevels = async (companyId = null) => {
    try {
      const params = new URLSearchParams();
      if (companyId) params.append('companyId', companyId);
      
      const response = await axiosInstance.get(`${API_ENDPOINTS.KYC_GET_PRIVILEGES}?${params}`);
      if (response.data.success) {
        setPrivilegeLevels(response.data.data);
        console.log('Privilege levels loaded:', response.data.data);
      }
    } catch (error) {
      console.error('Error loading privilege levels:', error);
    }
  };

  const loadFileCategories = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.KYC_GET_FILE_CATEGORIES);
      if (response.data.success) {
        setFileCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error loading file categories:', error);
    }
  };

  // Load privileges for a specific company
  const loadCompanyPrivileges = async (companyId) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.KYC_GET_PRIVILEGES}?companyId=${companyId}`);
      if (response.data.success) {
        // Update the privilegeLevels state with company-specific privileges
        setPrivilegeLevels(prev => {
          const otherCompanies = prev.filter(p => p.company_id !== companyId);
          return [...otherCompanies, ...response.data.data];
        });
        console.log(`Privileges loaded for company ${companyId}:`, response.data.data);
      }
    } catch (error) {
      console.error(`Error loading privileges for company ${companyId}:`, error);
    }
  };

  const processKYCRequest = async (kycRequestId, actionType, remarks = '') => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.KYC_PROCESS_REQUEST, {
        kyc_request_id: kycRequestId,
        action_type: actionType,
        remarks: remarks
      });

      if (response.data.success) {
        // Reload requests after processing (always use API)
        await loadKYCRequests();
      }
      return response.data;
    } catch (error) {
      console.error('Error processing KYC request:', error);
      throw error;
    }
  };

  // Test Client Creation Function
  const createTestClient = async () => {
    try {
      setIsCreatingClient(true);
      
      // Phase 2: Client Account Creation using Full Details Endpoint
      const clientData = {
        company_id: parseInt(clientFormData.selectedCompany),
        account_origin_number: clientFormData.accountOriginNumber || `TEST-CLIENT-${Date.now()}`,
        fname: clientFormData.fname || 'Test',
        mname: clientFormData.mname || 'Client',
        sname: clientFormData.sname || `User${Date.now().toString().slice(-4)}`,
        email: clientFormData.email || `test.client.${Date.now()}@example.com`,
        mobileno: clientFormData.mobileno || `+1234567${Date.now().toString().slice(-3)}`,
        current_privilege_level: clientFormData.currentPrivilegeLevel,
        account_metadata: JSON.stringify({
          test_generated: true,
          generated_at: new Date().toISOString(),
          additional_notes: clientFormData.accountMetadata || 'Test client created via admin panel'
        })
      };

      // Validate required fields
      if (!clientFormData.selectedCompany || isNaN(parseInt(clientFormData.selectedCompany))) {
        throw new Error('Please select a valid company');
      }

      // Use the full client creation endpoint
      const clientResponse = await axiosInstance.post(API_ENDPOINTS.KYC_CREATE_CLIENT_ACCOUNT, clientData);
      
      if (clientResponse.data.success) {
        console.log('Test client created:', clientResponse.data.data);
        
        // Reload client accounts to show the new one
        await loadClientAccounts(clientFormData.selectedCompany);
        
        // Show success with generated details
        alert(`Test Client Created Successfully!
        
Account Code: ${clientResponse.data.data.account_code}
Account ID: ${clientResponse.data.data.account_id}
Full Name: ${clientData.fname} ${clientData.mname} ${clientData.sname}
Email: ${clientData.email}
Mobile: ${clientData.mobileno}
Privilege Level: ${clientData.current_privilege_level}

The client is now available for KYC request generation!`);
        
        // Reset client form
        setClientFormData({
          selectedCompany: '',
          fname: '',
          mname: '',
          sname: '',
          email: '',
          mobileno: '',
          accountOriginNumber: '',
          currentPrivilegeLevel: 0,
          accountMetadata: ''
        });
        
        setShowClientCreator(false);
        
        return {
          success: true,
          accountCode: clientResponse.data.data.account_code,
          accountId: clientResponse.data.data.account_id,
          clientData: clientData,
          message: 'Test client created successfully'
        };
      }
    } catch (error) {
      console.error('Error creating test client:', error);
      alert(`Error: ${error.response?.data?.message || error.message || 'Failed to create test client'}`);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create test client'
      };
    } finally {
      setIsCreatingClient(false);
    }
  };

  const generateTestKYCRequest = async () => {
    try {
      setIsGeneratingTest(true);
      
      // Phase 1: Setup & Preparation (already done - company exists)
      
      // Phase 2: Client Account Creation/Update (Using Upsert)
      let clientAccountCode = testFormData.selectedClient;
      
      if (!clientAccountCode) {
        // Validate company selection
        if (!testFormData.selectedCompany || isNaN(parseInt(testFormData.selectedCompany))) {
          throw new Error('Please select a valid company');
        }

        // Use the upsert endpoint as per documentation
        const upsertData = {
          account_origin_number: `TEST-${Date.now()}`,
          company_id: parseInt(testFormData.selectedCompany),
          current_privilege_level: testFormData.currentLevel
        };

        const upsertResponse = await axiosInstance.post(API_ENDPOINTS.KYC_UPSERT_CLIENT_ACCOUNT, upsertData);
        if (upsertResponse.data.success) {
          clientAccountCode = upsertResponse.data.data.account_code;
          console.log('Test client account created:', upsertResponse.data.data);
          
          // Reload client accounts to show the new one
          await loadClientAccounts(testFormData.selectedCompany);
        } else {
          throw new Error('Failed to create test client account');
        }
      }

      // Phase 3: Token Generation & Link Creation
      const tokenResponse = await axiosInstance.post(API_ENDPOINTS.KYC_GENERATE_ACCESS_TOKEN, {
        account_code: clientAccountCode,
        hours_valid: 24
      });

      if (tokenResponse.data.success) {
        const { token } = tokenResponse.data.data;
        
        // Generate the CAPTCHA link first, then redirect to KYC
        const captchaLink = `${window.location.origin}/captcha?token=${token}&account=${clientAccountCode}`;
        const kycLink = `${window.location.origin}/client?token=${token}&account=${clientAccountCode}`;
        
        console.log('Generated KYC Link:', kycLink);
        
        // Phase 4: Internal KYC Request Creation (Instead of client submission)
        const kycRequestData = {
          account_code: clientAccountCode,
          request_type: testFormData.requestType,
          priority_level: testFormData.priorityLevel,
          request_description: testFormData.requestDescription || `Test KYC request generated on ${new Date().toLocaleString()} - Link: ${kycLink}`,
          level_to_upgrade_to: testFormData.targetLevel,
          has_files: testFormData.generateFiles
        };

        const kycResponse = await axiosInstance.post(API_ENDPOINTS.KYC_CREATE_REQUEST, kycRequestData);
        
        if (kycResponse.data.success) {
          console.log('Test KYC request created:', kycResponse.data.data);
          
          // Reload requests to show the new test request
          await loadKYCRequests();
          
          // Show success with generated details
          alert(`Test KYC Request Generated Successfully!
          
KYC Request ID: ${kycResponse.data.data.kyc_request_id}
Account Code: ${clientAccountCode}
Access Token: ${token.substring(0, 20)}...

🔐 CAPTCHA Link (Start Here): ${captchaLink}
📋 KYC Link (After CAPTCHA): ${kycLink}

Flow: CAPTCHA → KYC Form → Submit
The CAPTCHA link is now ready for client access!`);
          
          // Reset test form
          setTestFormData({
            selectedCompany: '',
            selectedClient: '',
            requestType: 'initial_verification',
            priorityLevel: 2,
            currentLevel: 0,
            targetLevel: 1,
            requestDescription: '',
            generateFiles: true,
            fileCount: 3
          });
          
          setShowTestGenerator(false);
          
          return {
            success: true,
            kycRequestId: kycResponse.data.data.kyc_request_id,
            accountCode: clientAccountCode,
            token: token,
            kycLink: kycLink,
            message: 'Test KYC request created successfully with secure access link'
          };
        }
      }
    } catch (error) {
      console.error('Error generating test KYC request:', error);
      alert(`Error: ${error.response?.data?.message || error.message || 'Failed to generate test KYC request'}`);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to generate test KYC request'
      };
    } finally {
      setIsGeneratingTest(false);
    }
  };

  // Check authentication status
  const checkAuthStatus = () => {
    const token = getAuthToken();
    const authenticated = isAuthenticated();
    const user = getUserFromToken();
    
    setAuthStatus({
      isAuthenticated: authenticated,
      user: user,
      token: token
    });
    
    console.log('Authentication status:', {
      isAuthenticated: authenticated,
      user: user,
      hasToken: !!token
    });
  };

  // Initialize data
  useEffect(() => {
    // Check authentication status first
    checkAuthStatus();
    
    // Always load all necessary data on page load
    const loadAllData = async () => {
      try {
        console.log('Loading all data on page initialization...');
        
        // Load companies first (required for dropdowns)
        await loadCompanies();
        
        // Load all other data in parallel
        await Promise.all([
          loadKYCRequests(),
          loadDashboardSummary(),
          loadPrivilegeLevels(), // Load all privileges initially
          loadFileCategories()
        ]);
        
        console.log('All data loaded successfully');
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Fallback to mock data if API fails
    setKycRequests(mockKycData);
    setKycPrivileges(mockKycPrivileges);
      }
    };
    
    loadAllData();
  }, []); // Remove apiMode dependency since we always load API data

  // Load data when filters change in API mode
  useEffect(() => {
    if (apiMode) {
      loadKYCRequests();
      loadDashboardSummary();
    }
  }, [selectedCompany, selectedStatus, selectedPriority, apiMode]);

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
    const matchesCompany = selectedCompany === 'all' || 
      (request.company?.company_id?.toString() === selectedCompany) ||
      (request.company_id?.toString() === selectedCompany);
    const matchesPriority = selectedPriority === 'all' || request.priority_level?.toString() === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || request.request_status?.toString() === selectedStatus;
    
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
        compareValue = (a.company?.company_name || '').localeCompare(b.company?.company_name || '');
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

  // Get companies from API data (always use API data, no fallback to mock)
  const companiesForFilter = companies.length > 0 ? companies : [];

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* API Mode Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#10b981',
                  fontWeight: '600',
                  padding: '0.25rem 0.5rem',
                  background: '#f0fdf4',
                  borderRadius: '4px',
                  border: '1px solid #bbf7d0'
                }}>
                  ✅ API Mode (Always On)
                </div>
              </div>

              {/* Debug Info */}
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Companies: {companies.length} | Loading: {isLoadingCompanies ? 'Yes' : 'No'}
              </div>

              {/* Authentication Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: authStatus.isAuthenticated ? '#10b981' : '#dc2626' }}>
                  Auth: {authStatus.isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
                  {authStatus.user && (
                    <span style={{ marginLeft: '0.5rem' }}>
                      | User: {authStatus.user.email || authStatus.user.userId || 'Unknown'}
                    </span>
                  )}
                </div>
                <button
                  onClick={checkAuthStatus}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  title="Refresh authentication status"
                >
                  🔄
                </button>
              </div>

              {/* Test Mode Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  <input
                    type="checkbox"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Test Mode
                </label>
              </div>

              {/* Test Generator Button */}
              {testMode && (
                <>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => setShowClientCreator(!showClientCreator)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    {showClientCreator ? 'Close Client Creator' : 'Create Test Client'}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={() => setShowTestGenerator(!showTestGenerator)}
                  >
                    {showTestGenerator ? 'Close Generator' : 'Generate Test KYC'}
                  </Button>
                </>
              )}
            </div>
          </HeaderActions>
        </TopBar>

        <ContentLayout>
          {/* Test Client Creator Section */}
          {testMode && showClientCreator && (
            <Card style={{ marginBottom: '1.5rem', border: '2px solid #8b5cf6', background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#6b46c1' }}>
                  👤 Test Client Creator
                </h2>
                <p style={{ color: '#6b46c1', fontSize: '0.875rem', margin: 0 }}>
                  Create test client accounts for KYC testing and development
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                {/* Company Selection */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Company *
                  </label>
                  <select
                    value={clientFormData.selectedCompany}
                    onChange={(e) => setClientFormData(prev => ({ ...prev, selectedCompany: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">{isLoadingCompanies ? 'Loading companies...' : 'Select Company'}</option>
                    {companiesForFilter.map(company => (
                      <option key={company.company_id} value={company.company_id}>
                        {company.company_name} ({company.company_code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* First Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={clientFormData.fname}
                    onChange={(e) => setClientFormData(prev => ({ ...prev, fname: e.target.value }))}
                    placeholder="John"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Middle Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={clientFormData.mname}
                    onChange={(e) => setClientFormData(prev => ({ ...prev, mname: e.target.value }))}
                    placeholder="Middle"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={clientFormData.sname}
                    onChange={(e) => setClientFormData(prev => ({ ...prev, sname: e.target.value }))}
                    placeholder="Doe"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={clientFormData.email}
                    onChange={(e) => setClientFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@example.com"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={clientFormData.mobileno}
                    onChange={(e) => setClientFormData(prev => ({ ...prev, mobileno: e.target.value }))}
                    placeholder="+1234567890"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Account Origin Number */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Account Origin Number
                  </label>
                  <input
                    type="text"
                    value={clientFormData.accountOriginNumber}
                    onChange={(e) => setClientFormData(prev => ({ ...prev, accountOriginNumber: e.target.value }))}
                    placeholder="AUTO-GENERATED if empty"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>

                {/* Current Privilege Level */}
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    Initial Privilege Level
                  </label>
                  <select
                    value={clientFormData.currentPrivilegeLevel}
                    onChange={(e) => setClientFormData(prev => ({ ...prev, currentPrivilegeLevel: parseInt(e.target.value) }))}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}
                  >
                    {apiMode && privilegeLevels.length > 0 ? (
                      privilegeLevels.map(privilege => (
                        <option key={privilege.autoid} value={privilege.privilege_level}>
                          Level {privilege.privilege_level} - {privilege.privilege_name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value={0}>Level 0 - New User</option>
                        <option value={1}>Level 1 - Basic Verified</option>
                        <option value={2}>Level 2 - Enhanced Verified</option>
                        <option value={3}>Level 3 - Premium Verified</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Additional Metadata */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                  Additional Notes (Account Metadata)
                </label>
                <textarea
                  value={clientFormData.accountMetadata}
                  onChange={(e) => setClientFormData(prev => ({ ...prev, accountMetadata: e.target.value }))}
                  placeholder="Additional information or notes about this test client..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Button
                  onClick={createTestClient}
                  disabled={!clientFormData.selectedCompany || isCreatingClient}
                  style={{
                    background: isCreatingClient ? '#9ca3af' : '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: isCreatingClient ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isCreatingClient ? 'Creating Client...' : 'Create Test Client'}
                </Button>
                
                <Button
                  onClick={() => setShowClientCreator(false)}
                  style={{
                    background: 'transparent',
                    color: '#6b46c1',
                    border: '1px solid #6b46c1',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </Button>
              </div>

              {/* Client Creator Information */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#8b5cf6',
                borderRadius: '8px',
                color: 'white'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
                  ℹ️ Test Client Creation Process
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.8rem', lineHeight: '1.4' }}>
                  <li><strong>Phase 2:</strong> Client Account Creation via /api/KYC/clients</li>
                  <li><strong>ID Generation:</strong> Account Code (CompanyCode + 10 digits) and Account ID (15 digits)</li>
                  <li><strong>Auto-Generation:</strong> Missing fields will be auto-generated with TEST prefixes</li>
                  <li><strong>Metadata:</strong> All test clients include test_generated flag and timestamp</li>
                  <li><strong>Availability:</strong> Created clients immediately available for KYC request generation</li>
                  <li><strong>Company Required:</strong> Must select a company before creating client</li>
                  <li><strong>🟢 API Mode:</strong> Real client creation via official endpoints (Always On)</li>
                </ul>
              </div>
            </Card>
          )}

          {/* Test KYC Generator Section */}
          {testMode && showTestGenerator && (
            <Card style={{ marginBottom: '1.5rem', border: '2px solid #fbbf24', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#92400e' }}>
                  🧪 Test KYC Request Generator
                </h2>
                <p style={{ color: '#b45309', margin: 0 }}>
                  Generate test KYC requests for development and testing purposes
                </p>
              </div>

              <PrivilegeForm>
                <div className="form-header">
                  <h3>Generate Test KYC Request</h3>
                  <p>Create a test KYC request with mock client data and optional file attachments</p>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Company *</label>
                    <select
                      value={testFormData.selectedCompany}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, selectedCompany: e.target.value }))}
                      required
                    >
                      <option value="">{isLoadingCompanies ? 'Loading companies...' : 'Select Company'}</option>
                      {companiesForFilter.map(company => (
                        <option key={company.company_id} value={company.company_id}>
                          {company.company_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Client Account ID (Optional)</label>
                    <input
                      type="text"
                      value={testFormData.selectedClient}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, selectedClient: e.target.value }))}
                      placeholder="Enter existing account ID or leave empty to create new client"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                      💡 Leave empty to create a new test client, or enter an existing account ID for testing
                    </div>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Request Type</label>
                    <select
                      value={testFormData.requestType}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, requestType: e.target.value }))}
                    >
                      <option value="initial_verification">Initial Verification</option>
                      <option value="level_upgrade">Level Upgrade</option>
                      <option value="compliance_review">Compliance Review</option>
                      <option value="document_update">Document Update</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Priority Level</label>
                    <select
                      value={testFormData.priorityLevel}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, priorityLevel: parseInt(e.target.value) }))}
                    >
                      <option value={1}>Low Priority</option>
                      <option value={2}>Medium Priority</option>
                      <option value={3}>High Priority</option>
                      <option value={4}>Urgent Priority</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Current Level</label>
                    <select
                      value={testFormData.currentLevel}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, currentLevel: parseInt(e.target.value) }))}
                    >
                      {apiMode && privilegeLevels.length > 0 ? (
                        privilegeLevels.map(privilege => (
                          <option key={privilege.autoid} value={privilege.privilege_level}>
                            Level {privilege.privilege_level} - {privilege.privilege_name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value={0}>Level 0 - Basic</option>
                          <option value={1}>Level 1 - Bronze</option>
                          <option value={2}>Level 2 - Silver</option>
                          <option value={3}>Level 3 - Gold</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Target Level</label>
                    <select
                      value={testFormData.targetLevel}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, targetLevel: parseInt(e.target.value) }))}
                    >
                      {apiMode && privilegeLevels.length > 0 ? (
                        privilegeLevels
                          .filter(privilege => privilege.privilege_level > testFormData.currentLevel)
                          .map(privilege => (
                            <option key={privilege.autoid} value={privilege.privilege_level}>
                              Level {privilege.privilege_level} - {privilege.privilege_name}
                            </option>
                          ))
                      ) : (
                        <>
                          <option value={1}>Level 1 - Bronze</option>
                          <option value={2}>Level 2 - Silver</option>
                          <option value={3}>Level 3 - Gold</option>
                          <option value={4}>Level 4 - Platinum</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Request Description</label>
                    <textarea
                      value={testFormData.requestDescription}
                      onChange={(e) => setTestFormData(prev => ({ ...prev, requestDescription: e.target.value }))}
                      placeholder="Optional description for the test request..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={testFormData.generateFiles}
                        onChange={(e) => setTestFormData(prev => ({ ...prev, generateFiles: e.target.checked }))}
                      />
                      Generate Mock Files
                    </label>
                  </div>
                  {testFormData.generateFiles && (
                    <div className="form-group">
                      <label>Number of Files</label>
                      <select
                        value={testFormData.fileCount}
                        onChange={(e) => setTestFormData(prev => ({ ...prev, fileCount: parseInt(e.target.value) }))}
                      >
                        <option value={1}>1 file</option>
                        <option value={2}>2 files</option>
                        <option value={3}>3 files</option>
                        <option value={4}>4 files</option>
                        <option value={5}>5 files</option>
                      </select>
                    </div>
                  )}
                </div>
                
                <div className="form-actions">
                  <Button 
                    type="button" 
                    variant="primary"
                    onClick={generateTestKYCRequest}
                    disabled={!testFormData.selectedCompany || isGeneratingTest}
                  >
                    {isGeneratingTest ? 'Generating...' : 'Generate Test KYC Request'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setShowTestGenerator(false)}
                  >
                    Cancel
                  </Button>
                </div>

                {/* Test Mode Information */}
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: '#fbbf24',
                  borderRadius: '8px',
                  color: '#92400e'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
                    ℹ️ Official KYC Workflow & ID Patterns
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    <li><strong>Phase 1:</strong> Company Setup (Completed)</li>
                    <li><strong>Phase 2:</strong> Client Account Upsert (/api/KYC/clients/create) or Use Existing Account ID</li>
                    <li><strong>Phase 3:</strong> Token Generation & Secure Link Creation</li>
                    <li><strong>Phase 4:</strong> Internal KYC Request Creation</li>
                    <li><strong>Phase 5:</strong> Client Status Tracking (Public API)</li>
                    <li><strong>Phase 6:</strong> Admin Review & Processing</li>
                    <br />
                    <li><strong>ID Patterns:</strong></li>
                    <li>• KYC Request: KYC + 12 digits (e.g., KYC123456789012)</li>
                    <li>• Account Code: CompanyCode + 10 digits (e.g., BWC1234567890)</li>
                    <li>• Account ID: 15 random digits (e.g., 987654321098765)</li>
                    <li>• Access tokens are secure Base64 encoded (32 bytes)</li>
                    <br />
                    <li><strong>🟢 API Mode Active:</strong> Real API calls following official workflow (Always On)</li>
                    <li><strong>📝 Free Text Entry:</strong> Enter any account ID for testing, or leave empty to create new client</li>
                  </ul>
                </div>
              </PrivilegeForm>
            </Card>
          )}

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
                Company Privilege Settings
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
                    {companiesForFilter.map(company => (
                      <option key={company.company_id} value={company.company_id.toString()}>
                        {company.company_name}
                      </option>
                    ))}
                    {companiesForFilter.length === 0 && !isLoadingCompanies && (
                      <option value="" disabled>No companies available</option>
                    )}
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
                    <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>• API Mode Active (Always On)</span>
                    {isLoading && <span style={{ color: '#f59e0b', marginLeft: '0.5rem' }}>• Loading...</span>}
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
                    {filteredAndSortedRequests.length === 0 ? (
                      <tr>
                        <td colSpan="12" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          {isLoading ? 'Loading requests...' : 'No KYC requests found'}
                        </td>
                      </tr>
                    ) : (
                      filteredAndSortedRequests.map((request) => (
                        <tr key={request.autoid || request.kyc_request_id || Math.random()}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                            {request.kyc_request_id}
                          </span>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '600' }}>
                              {request.client_account?.fname || 'N/A'} {request.client_account?.mname || ''} {request.client_account?.sname || 'N/A'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {request.client_account?.account_id || request.client_account?.account_code || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500' }}>
                              {request.company?.company_name || 'N/A'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {request.company?.company_type || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {request.client_account?.account_code || request.account_code || 'N/A'}
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
                                  onClick={() => processKYCRequest(request.kyc_request_id, 4)}
                                  disabled={request.request_status === 3 || request.request_status === 4 || request.request_status === 5}
                                >
                                  Review
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => processKYCRequest(request.kyc_request_id, 1)}
                                  disabled={request.request_status === 3 || request.request_status === 5}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="secondary"
                                  onClick={() => processKYCRequest(request.kyc_request_id, 2)}
                                  disabled={request.request_status === 4 || request.request_status === 5}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => processKYCRequest(request.kyc_request_id, 3)}
                              disabled={request.request_status === 5}
                            >
                              Archive
                            </Button>
                          </ActionButtonsContainer>
                        </td>
                      </tr>
                      ))
                    )}
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
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowPrivilegeForm(!showPrivilegeForm)}
                  >
                    {showPrivilegeForm ? 'Cancel' : 'Add New Privilege'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => loadPrivilegeLevels()}
                    style={{ fontSize: '0.875rem' }}
                  >
                    🔄 Refresh Privileges
                  </Button>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Loaded: {privilegeLevels.length} privilege levels
                    {privilegeLevels.length > 0 && (
                      <span style={{ marginLeft: '0.5rem' }}>
                        | Companies: {[...new Set(privilegeLevels.map(p => p.company_id))].join(', ')}
                      </span>
                    )}
                  </div>
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
                        <option value="">{isLoadingCompanies ? 'Loading companies...' : 'Select Company'}</option>
                        {companiesForFilter.map(company => (
                          <option key={company.company_id} value={company.company_id}>
                            {company.company_name} ({company.company_code})
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
                {companiesForFilter.map(company => {
                  const companyPrivileges = privilegeLevels.filter(p => p.company_id === company.company_id);
                  
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
