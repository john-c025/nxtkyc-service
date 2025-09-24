'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { keyframes } from '@emotion/react';
import { API_ENDPOINTS } from '../backend/apiHelper';
import axiosPublicInstance from '../backend/axiosPublicInstance';
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
  WaterfallContainer,
  StepContainer,
  StepIndicator,
  StepContent,
  StepNavigation,
  DocumentUploadArea,
  DocumentPreview,
  VerificationStep,
  ProgressBar,
  FormSection,
  InputGroup,
  FileUpload,
  CheckboxGroup,
  RadioGroup,
  AlertBox
} from './ClientKYCPageStyled';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export default function ClientKYCPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const [tokenError, setTokenError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [accountCode, setAccountCode] = useState(null);
  const [submissionRequirements, setSubmissionRequirements] = useState(null);
  const [privilegeLevels, setPrivilegeLevels] = useState([]);
  const [enhancedPrivileges, setEnhancedPrivileges] = useState([]);
  const [fileCategories, setFileCategories] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Information (matching client_accounts table exactly)
    fname: '',
    mname: '',
    sname: '',
    email: '',
    mobileno: '',
    
    // Additional personal info (stored in account_metadata as JSON)
    dateOfBirth: '',
    nationality: '',
    
    // Identity Documents (stored in account_metadata as JSON)
    identityType: '',
    identityNumber: '',
    identityExpiry: '',
    identityDocument: null,
    identityDocumentCategory: '',
    
    // Address Verification (stored in account_metadata as JSON)
    // Address document requirement removed
    
    // Simplified form - removed financial and compliance sections
    
    // Terms and Conditions (stored in account_metadata as JSON)
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
    
    // KYC Request specific fields (matching kyc_requests table exactly)
    request_type: 'initial_verification',
    priority_level: 2, // Medium priority (2 = Medium)
    request_description: '',
    current_level: 0,
    level_to_upgrade_to: 1,
    has_files: false,
    is_one_time_only: true,
    
    // Company and account fields
    company_id: 1, // Will be set based on context
    account_code: '', // Will be generated
    account_origin_number: '', // Will be generated
    account_id: '', // Will be generated
    account_status: 1, // Default active
    current_privilege_level: 0, // Default level 0
    is_active: true // Default active
  });
  
   const [uploadedDocuments, setUploadedDocuments] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [submitStatus, setSubmitStatus] = useState(null);
   const [sidebarOpen, setSidebarOpen] = useState(false);

   // Company name - dynamically loaded from company information
   const companyName = companyInfo?.company_name || "Loading...";

  // Token validation and initialization
  useEffect(() => {
    const validateTokenAndInitialize = async () => {
      try {
        setIsLoadingToken(true);
        
        // Get token and account code from URL parameters
        const token = searchParams.get('token');
        const account = searchParams.get('account');
        
        if (!token || !account) {
          setTokenError('Missing access token or account code. Please use the link provided in your email.');
          setIsLoadingToken(false);
          return;
        }
        
        setAccessToken(token);
        setAccountCode(account);
        
        // Store token and account for use in catch block
        const currentToken = token;
        const currentAccount = account;
        
        // Load submission requirements
        const requirementsResponse = await axiosPublicInstance.get(API_ENDPOINTS.KYC_PUBLIC_REQUIREMENTS);
        if (requirementsResponse.data.success) {
          setSubmissionRequirements(requirementsResponse.data.data);
        }
        
        // Step 1: Get company information by account code
        console.log('🏢 Getting company information for account:', account);
        const companyResponse = await axiosPublicInstance.get(`${API_ENDPOINTS.KYC_PUBLIC_GET_COMPANY_BY_ACCOUNT}?account_code=${account}`);
        if (companyResponse.data.success) {
          const companyData = companyResponse.data.data;
          setCompanyInfo(companyData);
          console.log('✅ Company information loaded:', companyData);
          
          // Update form data with company information
          setFormData(prev => ({
            ...prev,
            company_id: companyData.company_id,
            account_code: companyData.account_info.account_code,
            current_privilege_level: companyData.account_info.current_privilege_level || 0,
            level_to_upgrade_to: (companyData.account_info.current_privilege_level || 0) + 1
          }));
          
          // Step 2: Load privilege levels using the actual company ID
          console.log('🎯 Loading privilege levels for company ID:', companyData.company_id);
          const privilegeLevelsResponse = await axiosPublicInstance.get(`${API_ENDPOINTS.KYC_PUBLIC_PRIVILEGE_LEVELS}/${companyData.company_id}`);
          if (privilegeLevelsResponse.data.success) {
            setPrivilegeLevels(privilegeLevelsResponse.data.data);
            
            // Process enhanced privilege structure (already in the correct format)
            const enhancedData = privilegeLevelsResponse.data.data.map(privilege => ({
              level: privilege.level,
              name: privilege.name,
              description: privilege.description,
              services: privilege.services || [],
              limits: privilege.limits || {},
              requirements: privilege.requirements || [],
              is_active: privilege.is_active
            }));
            
            setEnhancedPrivileges(enhancedData);
            console.log('✅ Enhanced privileges loaded:', enhancedData);
            
            // Generate dynamic steps based on the target privilege level
            const targetLevel = companyData.account_info.current_privilege_level + 1;
            const generatedSteps = generateDynamicSteps(enhancedData, targetLevel);
            setDynamicSteps(generatedSteps);
            console.log('🎯 Generated dynamic steps for level', targetLevel, ':', generatedSteps);
          } else {
            console.error('❌ Failed to load privilege levels:', privilegeLevelsResponse.data);
          }
        } else {
          console.error('❌ Failed to load company information:', companyResponse.data);
          throw new Error('Unable to load company information. Please check your account code.');
        }
        
        // Load file categories for file uploads
        const fileCategoriesResponse = await axiosPublicInstance.get(API_ENDPOINTS.KYC_GET_PUBLIC_FILE_CATEGORIES);
        if (fileCategoriesResponse.data.success) {
          setFileCategories(fileCategoriesResponse.data.data);
        }
        
        // Phase 2: Token Validation (NEW API)
        // This follows the official workflow documentation
        console.log('🔍 Starting token validation process...');
        console.log('🔍 Token validation endpoint:', API_ENDPOINTS.KYC_VALIDATE_TOKEN);
        console.log('🔍 Full token:', token);
        console.log('🔍 Account code:', account);
        
        let tokenValidationSuccess = false;
        
        try {
          console.log('📡 Making API call to validate token...');
          console.log('📡 Request payload:', { token, account_code: account });
          console.log('📡 Full URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/kyc/tokens/validate`);
          
          const tokenValidationResponse = await axiosPublicInstance.post(API_ENDPOINTS.KYC_VALIDATE_TOKEN, {
            token: token,
            account_code: account
          });
          
          console.log('✅ API call completed successfully');
          console.log('Token validation response:', tokenValidationResponse.data);
          console.log('Token validation response structure:', {
            success: tokenValidationResponse.data.success,
            data: tokenValidationResponse.data.data,
            is_valid: tokenValidationResponse.data.data?.is_valid
          });
          
          if (tokenValidationResponse.data.success && tokenValidationResponse.data.data.is_valid) {
            console.log('✅ Token validated successfully:', tokenValidationResponse.data.data);
            tokenValidationSuccess = true;
            
            // Update form data with the validated account information (company info already loaded above)
            setFormData(prev => ({
              ...prev,
              account_code: tokenValidationResponse.data.data.account_code,
              current_privilege_level: tokenValidationResponse.data.data.current_privilege_level || 0,
              level_to_upgrade_to: (tokenValidationResponse.data.data.current_privilege_level || 0) + 1 // Target the next level
            }));
            
            // Store token expiration info for UI display
            if (tokenValidationResponse.data.data.expires_at) {
              console.log('Token expires at:', tokenValidationResponse.data.data.expires_at);
            }
          } else {
            console.error('❌ Token validation failed - invalid response:', tokenValidationResponse.data);
            throw new Error(`Token validation failed: ${tokenValidationResponse.data.message || 'Invalid token'}`);
          }
        } catch (tokenError) {
          console.error('❌ Token validation failed:', tokenError);
          console.error('❌ Token validation error details:', {
            message: tokenError.message,
            response: tokenError.response?.data,
            status: tokenError.response?.status,
            url: tokenError.config?.url,
            method: tokenError.config?.method
          });
          
          // Check if it's a network error or API error
          if (tokenError.code === 'NETWORK_ERROR' || tokenError.message.includes('Network Error')) {
            console.error('🌐 Network error - API endpoint might not be available');
          } else if (tokenError.response?.status === 404) {
            console.error('🔍 404 Error - API endpoint not found');
          } else if (tokenError.response?.status === 500) {
            console.error('🔍 500 Error - Server error');
          }
          
          // Token validation failed - this should block access
          console.error('🚫 Token validation failed - access denied');
          throw new Error('Invalid or expired access token. Please request a new link.');
        }
        
        // Only proceed if token validation was successful
        if (!tokenValidationSuccess) {
          throw new Error('Token validation failed');
        }
        
        setIsValidToken(true);
      } catch (error) {
        console.error('Token validation error:', error);
        
        // Check if we're in development mode and should allow test access
        const isDevelopment = process.env.NODE_ENV === 'development';
        // const allowTestMode = isDevelopment && (currentToken && currentAccount);
        
        // if (allowTestMode) {
        //   console.warn('⚠️ Development mode: Allowing test access without token validation');
        //   console.log('Setting form data with provided account code for testing...');
          
        //   // Set form data with the provided account information for testing
        //   setFormData(prev => ({
        //     ...prev,
        //     account_code: currentAccount,
        //     company_id: 1, // Default company for testing
        //     current_privilege_level: 0, // Default level 0
        //     level_to_upgrade_to: 1 // Target level 1
        //   }));
          
        //   setIsValidToken(true);
        // } else {
        //   setTokenError('Invalid or expired access token. Please request a new link.');
        // }
      } finally {
        setIsLoadingToken(false);
      }
    };
    
    validateTokenAndInitialize();
  }, [searchParams]);

  // Dynamic steps will be generated based on privilege requirements
  const [dynamicSteps, setDynamicSteps] = useState([]);

  // Generate dynamic steps based on privilege requirements
  const generateDynamicSteps = (privileges, targetLevel) => {
    const targetPrivilege = privileges.find(p => p.level === targetLevel);
    if (!targetPrivilege || !targetPrivilege.requirements) {
      return [];
    }

    const steps = [];
    let stepId = 1;

    // Always include Personal Information as step 1
    steps.push({
      id: stepId++,
      title: 'Personal Information',
      description: 'Basic personal details and contact information',
      icon: '👤',
      type: 'personal_info',
      required: true
    });

    // Generate steps based on requirements
    const requirements = targetPrivilege.requirements;
    
    // Group requirements by type
    const requirementGroups = {
      'valid_id': {
        title: 'Identity Verification',
        description: 'Government-issued ID and verification documents',
        icon: '🆔',
        type: 'identity_verification'
      },
      'address_proof': {
        title: 'Address Verification',
        description: 'Proof of residential address',
        icon: '🏠',
        type: 'address_verification'
      },
      'income_proof': {
        title: 'Income Verification',
        description: 'Proof of income and financial status',
        icon: '💰',
        type: 'income_verification'
      },
      'business_documents': {
        title: 'Business Documents',
        description: 'Business registration and related documents',
        icon: '🏢',
        type: 'business_documents'
      },
      'additional_documents': {
        title: 'Additional Documents',
        description: 'Additional verification documents as required',
        icon: '📄',
        type: 'additional_documents'
      }
    };

    // Add steps for each requirement type
    Object.keys(requirementGroups).forEach(reqType => {
      const hasRequirement = requirements.some(req => req.type === reqType);
      if (hasRequirement) {
        const reqDetails = requirements.filter(req => req.type === reqType);
        steps.push({
          id: stepId++,
          ...requirementGroups[reqType],
          requirements: reqDetails,
          required: true
        });
      }
    });

    // Always add Review & Submit as the final step
    steps.push({
      id: stepId++,
      title: 'Review & Submit',
      description: 'Review all information and submit for verification',
      icon: '📋',
      type: 'review_submit',
      required: true
    });

    return steps;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field, file) => {
    const newDocument = {
      id: Date.now(),
      field,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString()
    };
    
    setUploadedDocuments(prev => [...prev, newDocument]);
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const removeDocument = (documentId) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const validateStep = (stepNumber) => {
    const step = dynamicSteps.find(s => s.id === stepNumber);
    if (!step) return false;

    switch (step.type) {
      case 'personal_info':
        return formData.fname && formData.sname && formData.email && 
               formData.mobileno && formData.dateOfBirth && formData.nationality;
      
      case 'identity_verification':
        return formData.identityType && formData.identityNumber && 
               formData.identityExpiry && formData.identityDocument;
      
      case 'address_verification':
        return formData.address && formData.city && formData.state && 
               formData.postalCode && formData.country && formData.addressDocument;
      
      case 'income_verification':
        return formData.incomeProof && formData.incomeAmount;
      
      case 'business_documents':
        return formData.businessRegistration && formData.businessPermit;
      
      case 'additional_documents':
        return formData.additionalDocuments && formData.additionalDocuments.length > 0;
      
      case 'review_submit':
        return formData.termsAccepted && formData.privacyAccepted;
      
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => Math.min(prev + 1, dynamicSteps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (stepNumber) => {
    if (completedSteps.includes(stepNumber) || stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare FormData for file upload
      const formDataToSubmit = new FormData();
      
      // Add access token and account code
      formDataToSubmit.append('access_token', accessToken);
      formDataToSubmit.append('account_code', accountCode);
      
      // Add basic request information
      formDataToSubmit.append('request_type', formData.request_type);
      formDataToSubmit.append('priority_level', formData.priority_level);
      formDataToSubmit.append('level_to_upgrade_to', formData.level_to_upgrade_to);
      
      // Prepare account metadata JSON (storing additional info in account_metadata field)
      const accountMetadata = {
        personal_info: {
          fname: formData.fname,
          mname: formData.mname,
          sname: formData.sname,
          email: formData.email,
          mobileno: formData.mobileno,
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality
        },
        identity_info: {
          identityType: formData.identityType,
          identityNumber: formData.identityNumber,
          identityExpiry: formData.identityExpiry
        },
        terms_info: {
          termsAccepted: formData.termsAccepted,
          privacyAccepted: formData.privacyAccepted,
          marketingAccepted: formData.marketingAccepted
        }
      };

      // Add detailed request description with client data
      const requestDescription = `KYC Level ${formData.level_to_upgrade_to} upgrade request for ${formData.fname} ${formData.sname}. Client metadata: ${JSON.stringify(accountMetadata)}`;
      formDataToSubmit.append('request_description', requestDescription);
      
      // Add file description
      formDataToSubmit.append('file_description', 'KYC verification documents uploaded by client');
      
      // Add uploaded files
      uploadedDocuments.forEach((doc, index) => {
        formDataToSubmit.append('files', doc.file);
      });
      
      console.log('Submitting KYC Request via API:', {
        access_token: accessToken ? 'PROVIDED' : 'MISSING',
        account_code: accountCode,
        request_type: formData.request_type,
        priority_level: formData.priority_level,
        level_to_upgrade_to: formData.level_to_upgrade_to,
        files_count: uploadedDocuments.length,
        account_metadata: accountMetadata
      });
      
      // Submit KYC request via API
      const response = await axiosPublicInstance.post(API_ENDPOINTS.KYC_PUBLIC_SUBMIT, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted + '%');
        }
      });
      
      if (response.data.success) {
        console.log('KYC Request submitted successfully:', response.data.data);
      setSubmitStatus('success');
      setCompletedSteps([...steps.map(s => s.id)]);
        
        // Store the KYC request ID for potential status checking
        if (response.data.data.kyc_request_id) {
          localStorage.setItem('kyc_request_id', response.data.data.kyc_request_id);
        }
      } else {
        throw new Error(response.data.message || 'Failed to submit KYC request');
      }
    } catch (error) {
      console.error('Error submitting KYC request:', error);
      setSubmitStatus('error');
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        setTokenError('Access token has expired. Please request a new link.');
      } else if (error.response?.data?.message) {
        console.error('API Error:', error.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepStatus = (stepNumber) => {
    if (completedSteps.includes(stepNumber)) return 'completed';
    if (stepNumber === currentStep) return 'current';
    if (stepNumber < currentStep) return 'available';
    return 'locked';
  };

  // Show loading state while validating token
  if (isLoadingToken) {
    return (
      <DashboardContainer>
        <MainContent>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #f59e0b',
              borderRadius: '50%',
              animation: `${spinAnimation} 1s linear infinite`
            }} />
            <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
              Validating access token...
            </p>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              <p>Token: {searchParams.get('token') ? `${searchParams.get('token').substring(0, 20)}...` : 'Missing'}</p>
              <p>Account: {searchParams.get('account') || 'Missing'}</p>
            </div>
          </div>
        </MainContent>
      </DashboardContainer>
    );
  }

  // Show error state if token is invalid
  if (tokenError) {
    return (
      <DashboardContainer>
        <MainContent>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            flexDirection: 'column',
            gap: '1.5rem',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{ 
              fontSize: '3rem',
              color: '#dc2626'
            }}>
              🚫
            </div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#dc2626',
              margin: 0
            }}>
              Access Denied
            </h2>
            <p style={{ 
              color: '#64748b', 
              fontSize: '1.125rem',
              maxWidth: '500px',
              lineHeight: '1.6'
            }}>
              {tokenError}
            </p>
            
            {/* Debug Information */}
            <div style={{ 
              background: '#f8fafc', 
              padding: '1rem', 
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#64748b',
              textAlign: 'left',
              maxWidth: '400px'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>Debug Information:</h4>
              <p><strong>Token:</strong> {searchParams.get('token') ? `${searchParams.get('token').substring(0, 20)}...` : 'Missing'}</p>
              <p><strong>Account:</strong> {searchParams.get('account') || 'Missing'}</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
              <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL}</p>
            </div>
            
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
            >
              Return to Home
            </button>
          </div>
        </MainContent>
      </DashboardContainer>
    );
  }

  // Show main KYC form if token is valid
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
              <h1>KYC Verification</h1>
              <p>Complete your Know Your Customer verification process </p>
            </HeaderTitle>
          </HeaderContent>
          <HeaderActions>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem',
              '@media (max-width: 768px)': {
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.75rem'
              }
            }}>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end',
                gap: '0.25rem'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)',
                  whiteSpace: 'nowrap'
                }}>
                  Applying for Level {formData.level_to_upgrade_to}
                </div>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: '#64748b',
                  textAlign: 'right',
                  whiteSpace: 'nowrap'
                }}>
                  {formData.level_to_upgrade_to === 1 ? 'Basic Verification' : 
                   formData.level_to_upgrade_to === 2 ? 'Enhanced Verification' :
                   formData.level_to_upgrade_to === 3 ? 'Premium Verification' :
                   'Enterprise Verification'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: '#64748b',
                  whiteSpace: 'nowrap'
                }}>
                  Step {currentStep} of {dynamicSteps.length}
                </span>
                <ProgressBar 
                  progress={(currentStep / dynamicSteps.length) * 100}
                  total={dynamicSteps.length}
                  current={currentStep}
                />
              </div>
            </div>
          </HeaderActions>
        </TopBar>

         <ContentLayout>
           {/* Company Banner */}
           <div style={{
             textAlign: 'center',
             marginBottom: '2rem',
             padding: '1.5rem',
             background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.05) 100%)',
             borderRadius: '16px',
             border: '2px solid rgba(245, 158, 11, 0.25)',
             boxShadow: '0 4px 20px rgba(245, 158, 11, 0.15)',
             backdropFilter: 'blur(10px)',
             position: 'relative',
             overflow: 'hidden',
             transition: 'all 0.3s ease',
             animation: `${fadeInUp} 0.6s ease-out`
           }}>
             <div style={{
               color: '#f59e0b',
               fontSize: '1.5rem',
               fontWeight: '700',
               marginBottom: '0.5rem',
               letterSpacing: '0.05em',
               textShadow: '0 2px 4px rgba(245, 158, 11, 0.2)',
               transition: 'color 0.3s ease'
             }}>
               {companyName}
             </div>
             <div style={{
               color: '#64748b',
               fontSize: '0.875rem',
               fontWeight: '500',
               letterSpacing: '0.025em',
               transition: 'color 0.3s ease'
             }}>
               KYC Verification Service
             </div>
             {companyInfo && (
               <div style={{
                 color: '#64748b',
                 fontSize: '0.75rem',
                 marginTop: '0.5rem',
                 opacity: 0.8
               }}>
                 Account: {companyInfo.account_info?.account_code} | 
                 Current Level: {companyInfo.account_info?.current_privilege_level} | 
                 Company ID: {companyInfo.company_id}
               </div>
             )}
             {/* Enhanced gradient overlay */}
             <div style={{
               position: 'absolute',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.08) 100%)',
               pointerEvents: 'none'
             }} />
           </div>

           {/* Enhanced Privilege Information */}
           {enhancedPrivileges.length > 0 && (
             <div style={{
               marginBottom: '2rem',
               padding: '1.5rem',
               background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.05) 100%)',
               borderRadius: '16px',
               border: '2px solid rgba(59, 130, 246, 0.25)',
               boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
               animation: `${fadeInUp} 0.6s ease-out`
             }}>
               <h3 style={{
                 color: '#2563eb',
                 fontSize: '1.25rem',
                 fontWeight: '700',
                 marginBottom: '1rem',
                 textAlign: 'center'
               }}>
                 🎯 Target Privilege Level: {formData.level_to_upgrade_to}
               </h3>
               
               {enhancedPrivileges
                 .filter(p => p.level === formData.level_to_upgrade_to)
                 .map((privilege, index) => (
                   <div key={index} style={{ marginBottom: '1rem' }}>
                     <h4 style={{ 
                       color: '#1e40af', 
                       fontSize: '1.125rem', 
                       fontWeight: '600',
                       marginBottom: '0.75rem'
                     }}>
                       {privilege.name}
                     </h4>
                     <p style={{ 
                       color: '#64748b', 
                       fontSize: '0.875rem',
                       marginBottom: '1rem'
                     }}>
                       {privilege.description}
                     </p>
                     
                     {/* Services */}
                     {privilege.services && privilege.services.length > 0 && (
                       <div style={{ marginBottom: '1rem' }}>
                         <h5 style={{ 
                           color: '#374151', 
                           fontSize: '0.875rem', 
                           fontWeight: '600',
                           marginBottom: '0.5rem'
                         }}>
                           🚀 Available Services:
                         </h5>
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                           {privilege.services.map((service, idx) => (
                             <span key={idx} style={{
                               background: '#dbeafe',
                               color: '#1e40af',
                               padding: '0.25rem 0.75rem',
                               borderRadius: '12px',
                               fontSize: '0.75rem',
                               fontWeight: '500'
                             }}>
                               {service.replace(/_/g, ' ').toUpperCase()}
                             </span>
                           ))}
                         </div>
                       </div>
                     )}
                     
                     {/* Limits */}
                     {privilege.limits && Object.keys(privilege.limits).length > 0 && (
                       <div style={{ marginBottom: '1rem' }}>
                         <h5 style={{ 
                           color: '#374151', 
                           fontSize: '0.875rem', 
                           fontWeight: '600',
                           marginBottom: '0.5rem'
                         }}>
                           💰 Transaction Limits:
                         </h5>
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                           {Object.entries(privilege.limits).map(([key, value]) => (
                             <div key={key} style={{
                               background: '#f8fafc',
                               padding: '0.5rem',
                               borderRadius: '8px',
                               fontSize: '0.75rem'
                             }}>
                               <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> ₱{value?.toLocaleString() || 'N/A'}
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                     
                     {/* Requirements */}
                     {privilege.requirements && privilege.requirements.length > 0 && (
                       <div>
                         <h5 style={{ 
                           color: '#374151', 
                           fontSize: '0.875rem', 
                           fontWeight: '600',
                           marginBottom: '0.5rem'
                         }}>
                           📋 Verification Requirements:
                         </h5>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                           {privilege.requirements.map((req, idx) => (
                             <div key={idx} style={{
                               background: '#f0fdf4',
                               border: '1px solid #bbf7d0',
                               padding: '0.75rem',
                               borderRadius: '8px',
                               fontSize: '0.75rem'
                             }}>
                               <div style={{ fontWeight: '600', color: '#15803d', marginBottom: '0.25rem' }}>
                                 {req.name} {req.qty > 1 && `(x${req.qty})`}
                               </div>
                               <div style={{ color: '#64748b' }}>
                                 {req.description}
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                   </div>
                 ))}
             </div>
           )}

           <WaterfallContainer>
            {/* Step Indicators */}
            <StepContainer>
              {dynamicSteps.map((step) => (
                <StepIndicator
                  key={step.id}
                  status={getStepStatus(step.id)}
                  onClick={() => goToStep(step.id)}
                  disabled={getStepStatus(step.id) === 'locked'}
                >
                  <div className="step-icon">
                    {completedSteps.includes(step.id) ? '✓' : step.icon}
                  </div>
                  <div className="step-info">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                    {step.requirements && step.requirements.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                        {step.requirements.map((req, idx) => (
                          <span key={idx}>
                            {req.name} {req.qty > 1 && `(x${req.qty})`}
                            {idx < step.requirements.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </StepIndicator>
              ))}
            </StepContainer>

            {/* Step Content */}
            <StepContent>
              <Card>
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                    {dynamicSteps[currentStep - 1]?.title || 'Loading...'}
                  </h2>
                  <p style={{ color: '#64748b', margin: 0 }}>
                    {dynamicSteps[currentStep - 1]?.description || 'Please wait...'}
                  </p>
                  {dynamicSteps[currentStep - 1]?.requirements && (
                    <div style={{ 
                      marginTop: '0.5rem', 
                      padding: '0.75rem', 
                      background: '#f0f9ff', 
                      border: '1px solid #bae6fd', 
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}>
                      <strong>Required Documents:</strong>
                      <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                        {dynamicSteps[currentStep - 1].requirements.map((req, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem' }}>
                            {req.name} {req.qty > 1 && `(x${req.qty})`} - {req.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Dynamic Step Content */}
                {dynamicSteps[currentStep - 1]?.type === 'personal_info' && (
                  <FormSection>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <InputGroup>
                        <label>First Name *</label>
                        <input
                          type="text"
                          value={formData.fname}
                          onChange={(e) => handleInputChange('fname', e.target.value)}
                          placeholder="Enter your first name"
                          required
                        />
                      </InputGroup>
                      <InputGroup>
                        <label>Last Name *</label>
                        <input
                          type="text"
                          value={formData.sname}
                          onChange={(e) => handleInputChange('sname', e.target.value)}
                          placeholder="Enter your last name"
                          required
                        />
                      </InputGroup>
                    </div>
                    <InputGroup>
                      <label>Middle Name</label>
                      <input
                        type="text"
                        value={formData.mname}
                        onChange={(e) => handleInputChange('mname', e.target.value)}
                        placeholder="Enter your middle name (optional)"
                      />
                    </InputGroup>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <InputGroup>
                        <label>Email Address *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email address"
                          required
                        />
                      </InputGroup>
                      <InputGroup>
                        <label>Mobile Number *</label>
                        <input
                          type="tel"
                          value={formData.mobileno}
                          onChange={(e) => handleInputChange('mobileno', e.target.value)}
                          placeholder="Enter your mobile number"
                          required
                        />
                      </InputGroup>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <InputGroup>
                        <label>Date of Birth *</label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          required
                        />
                      </InputGroup>
                      <InputGroup>
                        <label>Nationality *</label>
                        <select
                          value={formData.nationality}
                          onChange={(e) => handleInputChange('nationality', e.target.value)}
                          required
                        >
                          <option value="">Select your nationality</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="JP">Japan</option>
                          <option value="SG">Singapore</option>
                          <option value="PH">Philippines</option>
                          <option value="other">Other</option>
                        </select>
                      </InputGroup>
                    </div>
                  </FormSection>
                )}

                {/* Identity Verification Step */}
                {dynamicSteps[currentStep - 1]?.type === 'identity_verification' && (
                  <FormSection>
                    <InputGroup>
                      <label>Identity Document Type *</label>
                      <RadioGroup>
                        <label>
                          <input
                            type="radio"
                            name="identityType"
                            value="passport"
                            checked={formData.identityType === 'passport'}
                            onChange={(e) => handleInputChange('identityType', e.target.value)}
                          />
                          Passport
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="identityType"
                            value="drivers_license"
                            checked={formData.identityType === 'drivers_license'}
                            onChange={(e) => handleInputChange('identityType', e.target.value)}
                          />
                          Driver's License
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="identityType"
                            value="national_id"
                            checked={formData.identityType === 'national_id'}
                            onChange={(e) => handleInputChange('identityType', e.target.value)}
                          />
                          National ID
                        </label>
                      </RadioGroup>
                    </InputGroup>
                    <InputGroup>
                      <label>Document Number *</label>
                      <input
                        type="text"
                        value={formData.identityNumber}
                        onChange={(e) => handleInputChange('identityNumber', e.target.value)}
                        placeholder="Enter your document number"
                      />
                    </InputGroup>
                    <InputGroup>
                      <label>Expiry Date *</label>
                      <input
                        type="date"
                        value={formData.identityExpiry}
                        onChange={(e) => handleInputChange('identityExpiry', e.target.value)}
                      />
                    </InputGroup>
                    <InputGroup>
                      <label>Upload Identity Document *</label>
                      <FileUpload>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && file.size <= 10 * 1024 * 1024) {
                              handleFileUpload('identityDocument', file);
                            } else {
                              alert('File size must be under 10MB');
                            }
                          }}
                        />
                        <DocumentUploadArea>
                          <div style={{ textAlign: 'center' }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p>Upload your identity document</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              PDF, JPG, PNG up to 10MB
                            </p>
                          </div>
                        </DocumentUploadArea>
                      </FileUpload>
                      {fileCategories.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <label style={{ fontSize: '0.875rem', color: '#64748b' }}>File Category:</label>
                          <select
                            value={formData.identityDocumentCategory || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, identityDocumentCategory: e.target.value }))}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '0.875rem',
                              marginTop: '0.25rem'
                            }}
                          >
                            <option value="">Select category...</option>
                            {fileCategories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name} - {category.description}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </InputGroup>
                  </FormSection>
                )}

                {/* Review & Submit Step */}
                {dynamicSteps[currentStep - 1]?.type === 'review_submit' && (
                  <FormSection>
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#0f172a' }}>
                        Review Your Information
                      </h3>
                      <p style={{ color: '#64748b', margin: '0 0 1.5rem 0' }}>
                        Please review all the information you've provided before submitting for verification.
                      </p>
                    </div>

                    {/* Personal Information Summary */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#0f172a' }}>
                        Personal Information (Database Fields)
                      </h4>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <p><strong>First Name (fname):</strong> {formData.fname}</p>
                            <p><strong>Middle Name (mname):</strong> {formData.mname || 'N/A'}</p>
                            <p><strong>Last Name (sname):</strong> {formData.sname}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Mobile (mobileno):</strong> {formData.mobileno}</p>
                          </div>
                          <div>
                            <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                            <p><strong>Nationality:</strong> {formData.nationality}</p>
                            <p><strong>Account Status:</strong> {formData.account_status === 1 ? 'Active' : 'Inactive'}</p>
                            <p><strong>Privilege Level:</strong> {formData.current_privilege_level}</p>
                            <p><strong>Company ID:</strong> {formData.company_id}</p>
                          </div>
                        </div>
                      </div>
                    </div>


                    {/* Identity Verification Summary */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#0f172a' }}>
                        Identity Verification
                      </h4>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        <p><strong>Document Type:</strong> {formData.identityType ? formData.identityType.replace('_', ' ').toUpperCase() : 'N/A'}</p>
                        <p><strong>Document Number:</strong> {formData.identityNumber || 'N/A'}</p>
                        <p><strong>Expiry Date:</strong> {formData.identityExpiry || 'N/A'}</p>
                      </div>
                    </div>

                    {/* KYC Request Summary */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#0f172a' }}>
                        KYC Request Details (Database Fields)
                      </h4>
                      <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <p><strong>Request Type:</strong> {formData.request_type}</p>
                            <p><strong>Priority Level:</strong> {formData.priority_level} (Medium)</p>
                            <p><strong>Current Level:</strong> {formData.current_level}</p>
                            <p><strong>Upgrade To Level:</strong> {formData.level_to_upgrade_to}</p>
                          </div>
                          <div>
                            <p><strong>Has Files:</strong> {uploadedDocuments.length > 0 ? 'Yes' : 'No'}</p>
                            <p><strong>One Time Only:</strong> {formData.is_one_time_only ? 'Yes' : 'No'}</p>
                            <p><strong>Request Status:</strong> Pending (1)</p>
                            <p><strong>Files Count:</strong> {uploadedDocuments.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documents Summary */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#0f172a' }}>
                        Uploaded Documents (kyc_media_files)
                      </h4>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                        {uploadedDocuments.length > 0 ? (
                          uploadedDocuments.map((doc) => (
                            <DocumentPreview key={doc.id}>
                              <div className="document-icon">
                                📄
                              </div>
                              <div className="document-info">
                                <h4>{doc.name}</h4>
                                <p>{(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.field}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeDocument(doc.id)}
                              >
                                Remove
                              </Button>
                            </DocumentPreview>
                          ))
                        ) : (
                          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No documents uploaded</p>
                        )}
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div style={{ marginBottom: '2rem' }}>
                      <CheckboxGroup>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.termsAccepted}
                            onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                          />
                          I agree to the <a href="#" style={{ color: '#2563eb' }}>Terms and Conditions</a> *
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.privacyAccepted}
                            onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                          />
                          I agree to the <a href="#" style={{ color: '#2563eb' }}>Privacy Policy</a> *
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.marketingAccepted}
                            onChange={(e) => handleInputChange('marketingAccepted', e.target.checked)}
                          />
                          I would like to receive marketing communications (optional)
                        </label>
                      </CheckboxGroup>
                    </div>

                    {submitStatus === 'success' && (
                      <AlertBox type="success">
                        <strong>✓ Verification Submitted Successfully!</strong>
                        <p>Your KYC verification request has been submitted. You will receive an email confirmation shortly. 
                        Our team will review your information and get back to you within 2-3 business days.</p>
                      </AlertBox>
                    )}

                    {submitStatus === 'error' && (
                      <AlertBox type="error">
                        <strong>Submission Failed</strong>
                        <p>There was an error submitting your verification request. Please try again or contact support if the problem persists.</p>
                      </AlertBox>
                    )}
                  </FormSection>
                )}

                {/* Uploaded Documents Display */}
                {uploadedDocuments.length > 0 && (
                  <div style={{ marginTop: '2rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#0f172a' }}>
                      Uploaded Documents
                    </h4>
                    {uploadedDocuments.map((doc) => (
                      <DocumentPreview key={doc.id}>
                        <div className="document-icon">
                          📄
                        </div>
                        <div className="document-info">
                          <h4>{doc.name}</h4>
                          <p>{(doc.size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeDocument(doc.id)}
                        >
                          Remove
                        </Button>
                      </DocumentPreview>
                    ))}
                  </div>
                )}

                {/* Navigation */}
                <StepNavigation>
                  <Button
                    variant="secondary"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < dynamicSteps.length ? (
                    <Button
                      variant="primary"
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={!validateStep(currentStep) || isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Verification'}
                    </Button>
                  )}
                </StepNavigation>
              </Card>
            </StepContent>
          </WaterfallContainer>
        </ContentLayout>
      </MainContent>
    </DashboardContainer>
  );
}
