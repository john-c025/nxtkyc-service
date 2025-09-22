'use client';

import React, { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
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

export default function ClientKYCPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
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
    
    // Address Information (stored in account_metadata as JSON)
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    
    // Identity Documents (stored in account_metadata as JSON)
    identityType: '',
    identityNumber: '',
    identityExpiry: '',
    identityDocument: null,
    
    // Address Verification (stored in account_metadata as JSON)
    addressDocument: null,
    addressDocumentType: '',
    
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

   // Company name - this will be dynamically set based on the client company using the service
   const companyName = "Blooms Wellness"; // TODO: Make this dynamic based on company_id or auth context

  const steps = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Basic personal details and contact information',
      icon: '👤'
    },
    {
      id: 2,
      title: 'Address Verification',
      description: 'Residential address and proof of residence',
      icon: '🏠'
    },
    {
      id: 3,
      title: 'Identity Verification',
      description: 'Government-issued ID and verification documents',
      icon: '🆔'
    },
    {
      id: 4,
      title: 'Review & Submit',
      description: 'Review all information and submit for verification',
      icon: '📋'
    }
  ];

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
    switch (stepNumber) {
      case 1:
        return formData.fname && formData.sname && formData.email && 
               formData.mobileno && formData.dateOfBirth && formData.nationality;
      case 2:
        return formData.address && formData.city && formData.state && 
               formData.postalCode && formData.country && formData.addressDocument;
      case 3:
        return formData.identityType && formData.identityNumber && 
               formData.identityExpiry && formData.identityDocument;
      case 4:
        return formData.termsAccepted && formData.privacyAccepted;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
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
      // Generate unique identifiers
      const timestamp = Date.now();
      const kycRequestId = `KYC-${new Date().getFullYear()}-${String(timestamp).slice(-6)}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const accountCode = `ACC-${timestamp}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const accountOriginNumber = `ORIG-${timestamp}`;
      const accountId = `CLIENT-${timestamp}`;
      
      // Prepare account metadata JSON (storing additional info in account_metadata field)
      const accountMetadata = {
        personal_info: {
          dateOfBirth: formData.dateOfBirth,
          nationality: formData.nationality
        },
        address_info: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
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

      // Prepare data for API submission matching database schema exactly
      const submissionData = {
        // Client Account Data (client_accounts table)
        client_account: {
          company_id: formData.company_id,
          account_code: accountCode,
          account_origin_number: accountOriginNumber,
          account_id: accountId,
          fname: formData.fname,
          mname: formData.mname,
          sname: formData.sname,
          account_status: formData.account_status, // 1 = Active
          current_privilege_level: formData.current_privilege_level, // 0 = Default
          account_metadata: JSON.stringify(accountMetadata),
          is_active: formData.is_active, // true = Active
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'CLIENT',
          updated_by: 'CLIENT'
        },
        
        // KYC Request Data (kyc_requests table)
        kyc_request: {
          kyc_request_id: kycRequestId,
          company_id: formData.company_id,
          client_account_id: null, // Will be set after account creation
          token_id: null, // Will be generated by system
          request_type: formData.request_type,
          request_status: 1, // 1 = Pending
          priority_level: formData.priority_level, // 2 = Medium
          request_description: formData.request_description || 'KYC verification request submitted by client',
          current_level: formData.current_level, // 0 = Default
          level_to_upgrade_to: formData.level_to_upgrade_to, // 1 = First upgrade
          has_files: uploadedDocuments.length > 0,
          is_one_time_only: formData.is_one_time_only, // true = One time only
          submitted_at: new Date().toISOString(),
          completed_at: null,
          archived_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'CLIENT',
          updated_by: 'CLIENT'
        },
        
        // Media Files Data (kyc_media_files table)
        media_files: uploadedDocuments.map(doc => ({
          kyc_request_id: kycRequestId,
          file_name: doc.name,
          file_original_name: doc.name,
          file_type: 1, // 1 = Document type (enum)
          file_extension: doc.name.split('.').pop(),
          file_size: doc.size,
          file_path: '', // Will be set by server after upload
          file_url: '', // Will be set by server after upload
          mime_type: doc.type,
          file_category: 1, // 1 = Document category (enum)
          file_description: doc.field,
          is_verified: false, // Default not verified
          uploaded_at: new Date().toISOString(),
          uploaded_by: 'CLIENT',
          verified_at: null,
          verified_by: null
        }))
      };
      
      console.log('Submitting KYC Request with Database Schema Compliance:', submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setCompletedSteps([...steps.map(s => s.id)]);
    } catch (error) {
      console.error('Error submitting KYC request:', error);
      setSubmitStatus('error');
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
              <p>Complete your Know Your Customer verification process</p>
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
                  Step {currentStep} of {steps.length}
                </span>
                <ProgressBar 
                  progress={(currentStep / steps.length) * 100}
                  total={steps.length}
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

           <WaterfallContainer>
            {/* Step Indicators */}
            <StepContainer>
              {steps.map((step) => (
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
                  </div>
                </StepIndicator>
              ))}
            </StepContainer>

            {/* Step Content */}
            <StepContent>
              <Card>
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                    {steps[currentStep - 1].title}
                  </h2>
                  <p style={{ color: '#64748b', margin: 0 }}>
                    {steps[currentStep - 1].description}
                  </p>
                </div>

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
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

                {/* Step 2: Address Verification */}
                {currentStep === 2 && (
                  <FormSection>
                    <InputGroup>
                      <label>Street Address *</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your street address"
                      />
                    </InputGroup>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <InputGroup>
                        <label>City *</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Enter your city"
                        />
                      </InputGroup>
                      <InputGroup>
                        <label>State/Province *</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          placeholder="Enter your state"
                        />
                      </InputGroup>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <InputGroup>
                        <label>Postal Code *</label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          placeholder="Enter your postal code"
                        />
                      </InputGroup>
                      <InputGroup>
                        <label>Country *</label>
                        <select
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                        >
                          <option value="">Select your country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="JP">Japan</option>
                          <option value="SG">Singapore</option>
                        </select>
                      </InputGroup>
                    </div>
                    <InputGroup>
                      <label>Proof of Address Document *</label>
                      <FileUpload>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && file.size <= 5 * 1024 * 1024) {
                              handleFileUpload('addressDocument', file);
                            } else {
                              alert('File size must be under 5MB');
                            }
                          }}
                        />
                        <DocumentUploadArea>
                          <div style={{ textAlign: 'center' }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p>Click to upload or drag and drop</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              PDF, JPG, PNG up to 5MB
                            </p>
                          </div>
                        </DocumentUploadArea>
                      </FileUpload>
                    </InputGroup>
                  </FormSection>
                )}

                {/* Step 3: Identity Verification */}
                {currentStep === 3 && (
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
                    </InputGroup>
                  </FormSection>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
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

                    {/* Address Summary */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#0f172a' }}>
                        Address Information
                      </h4>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        <p><strong>Address:</strong> {formData.address}</p>
                        <p><strong>City:</strong> {formData.city}, {formData.state} {formData.postalCode}</p>
                        <p><strong>Country:</strong> {formData.country}</p>
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
                  
                  {currentStep < steps.length ? (
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
