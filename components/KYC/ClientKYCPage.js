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

export default function ClientKYCPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({
    // Personal Information (matching client_accounts table)
    fname: '',
    mname: '',
    sname: '',
    email: '',
    mobileno: '',
    dateOfBirth: '',
    nationality: '',
    
    // Address Information
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    
    // Identity Documents
    identityType: '',
    identityNumber: '',
    identityExpiry: '',
    identityDocument: null,
    
    // Address Verification
    addressDocument: null,
    addressDocumentType: '',
    
    // Financial Information
    occupation: '',
    employer: '',
    annualIncome: '',
    sourceOfFunds: '',
    bankStatement: null,
    
    // Additional Information
    pepStatus: false,
    pepDetails: '',
    sanctionsCheck: false,
    riskAssessment: '',
    
    // Terms and Conditions
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
    
    // KYC Request specific fields
    request_type: 'initial_verification',
    priority_level: 2, // Medium priority
    request_description: '',
    current_level: 0,
    level_to_upgrade_to: 1,
    has_files: false,
    is_one_time_only: true
  });
  
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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
      title: 'Financial Information',
      description: 'Employment, income, and financial documentation',
      icon: '💰'
    },
    {
      id: 5,
      title: 'Compliance Check',
      description: 'PEP status, sanctions, and risk assessment',
      icon: '✅'
    },
    {
      id: 6,
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
        return formData.occupation && formData.employer && 
               formData.annualIncome && formData.sourceOfFunds;
      case 5:
        return formData.pepStatus !== null && formData.sanctionsCheck !== null;
      case 6:
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
      // Prepare data for API submission matching database schema
      const kycRequestData = {
        // Generate unique KYC request ID
        kyc_request_id: `KYC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        company_id: 1, // This would come from context or URL params
        client_account_id: null, // Will be created during submission
        token_id: null, // Will be generated
        request_type: formData.request_type,
        request_status: 1, // Pending
        priority_level: formData.priority_level,
        request_description: formData.request_description || 'KYC verification request submitted by client',
        current_level: formData.current_level,
        level_to_upgrade_to: formData.level_to_upgrade_to,
        has_files: uploadedDocuments.length > 0,
        is_one_time_only: formData.is_one_time_only,
        submitted_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'CLIENT', // This would come from auth context
        updated_by: 'CLIENT',
        
        // Client account data
        client_account: {
          fname: formData.fname,
          mname: formData.mname,
          sname: formData.sname,
          email: formData.email,
          mobileno: formData.mobileno,
          account_status: 1,
          current_privilege_level: 0,
          is_active: true
        },
        
        // Additional form data
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
        
        financial_info: {
          occupation: formData.occupation,
          employer: formData.employer,
          annualIncome: formData.annualIncome,
          sourceOfFunds: formData.sourceOfFunds
        },
        
        compliance_info: {
          pepStatus: formData.pepStatus,
          pepDetails: formData.pepDetails,
          sanctionsCheck: formData.sanctionsCheck,
          riskAssessment: formData.riskAssessment
        },
        
        // File uploads
        uploaded_files: uploadedDocuments.map(doc => ({
          file_name: doc.name,
          file_original_name: doc.name,
          file_type: 1, // Document type enum
          file_extension: doc.name.split('.').pop(),
          file_size: doc.size,
          file_path: '', // Will be set by server
          file_url: '', // Will be set by server
          mime_type: doc.type,
          file_category: 1, // Document category enum
          file_description: doc.field,
          is_verified: false,
          uploaded_at: new Date().toISOString(),
          uploaded_by: 'CLIENT'
        }))
      };
      
      console.log('Submitting KYC Request:', kycRequestData);
      
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Step {currentStep} of {steps.length}
              </span>
              <ProgressBar 
                progress={(currentStep / steps.length) * 100}
                total={steps.length}
                current={currentStep}
              />
            </div>
          </HeaderActions>
        </TopBar>

        <ContentLayout>
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
                    <InputGroup>
                      <label>First Name *</label>
                      <input
                        type="text"
                        value={formData.fname}
                        onChange={(e) => handleInputChange('fname', e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </InputGroup>
                    <InputGroup>
                      <label>Middle Name</label>
                      <input
                        type="text"
                        value={formData.mname}
                        onChange={(e) => handleInputChange('mname', e.target.value)}
                        placeholder="Enter your middle name (optional)"
                      />
                    </InputGroup>
                    <InputGroup>
                      <label>Last Name *</label>
                      <input
                        type="text"
                        value={formData.sname}
                        onChange={(e) => handleInputChange('sname', e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </InputGroup>
                    <InputGroup>
                      <label>Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email address"
                      />
                    </InputGroup>
                    <InputGroup>
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        value={formData.mobileno}
                        onChange={(e) => handleInputChange('mobileno', e.target.value)}
                        placeholder="Enter your mobile number"
                      />
                    </InputGroup>
                    <InputGroup>
                      <label>Date of Birth *</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      />
                    </InputGroup>
                    <InputGroup>
                      <label>Nationality *</label>
                      <select
                        value={formData.nationality}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
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
                        <option value="other">Other</option>
                      </select>
                    </InputGroup>
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
                      <FileUpload
                        onFileSelect={(file) => handleFileUpload('addressDocument', file)}
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={5 * 1024 * 1024} // 5MB
                      >
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
                      <FileUpload
                        onFileSelect={(file) => handleFileUpload('identityDocument', file)}
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={10 * 1024 * 1024} // 10MB
                      >
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

                {/* Step 4: Financial Information */}
                {currentStep === 4 && (
                  <FormSection>
                    <InputGroup>
                      <label>Occupation *</label>
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        placeholder="Enter your occupation"
                      />
                    </InputGroup>
                    <InputGroup>
                      <label>Employer/Company *</label>
                      <input
                        type="text"
                        value={formData.employer}
                        onChange={(e) => handleInputChange('employer', e.target.value)}
                        placeholder="Enter your employer or company name"
                      />
                    </InputGroup>
                    <InputGroup>
                      <label>Annual Income *</label>
                      <select
                        value={formData.annualIncome}
                        onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                      >
                        <option value="">Select your annual income range</option>
                        <option value="under-25k">Under $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="50k-75k">$50,000 - $75,000</option>
                        <option value="75k-100k">$75,000 - $100,000</option>
                        <option value="100k-150k">$100,000 - $150,000</option>
                        <option value="150k-250k">$150,000 - $250,000</option>
                        <option value="over-250k">Over $250,000</option>
                      </select>
                    </InputGroup>
                    <InputGroup>
                      <label>Source of Funds *</label>
                      <select
                        value={formData.sourceOfFunds}
                        onChange={(e) => handleInputChange('sourceOfFunds', e.target.value)}
                      >
                        <option value="">Select your primary source of funds</option>
                        <option value="employment">Employment Income</option>
                        <option value="business">Business Income</option>
                        <option value="investment">Investment Returns</option>
                        <option value="inheritance">Inheritance</option>
                        <option value="gift">Gift</option>
                        <option value="other">Other</option>
                      </select>
                    </InputGroup>
                    <InputGroup>
                      <label>Bank Statement (Optional)</label>
                      <FileUpload
                        onFileSelect={(file) => handleFileUpload('bankStatement', file)}
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={5 * 1024 * 1024} // 5MB
                      >
                        <DocumentUploadArea>
                          <div style={{ textAlign: 'center' }}>
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p>Upload bank statement (optional)</p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              PDF, JPG, PNG up to 5MB
                            </p>
                          </div>
                        </DocumentUploadArea>
                      </FileUpload>
                    </InputGroup>
                  </FormSection>
                )}

                {/* Step 5: Compliance Check */}
                {currentStep === 5 && (
                  <FormSection>
                    <InputGroup>
                      <label>Are you a Politically Exposed Person (PEP)? *</label>
                      <RadioGroup>
                        <label>
                          <input
                            type="radio"
                            name="pepStatus"
                            value="false"
                            checked={formData.pepStatus === false}
                            onChange={(e) => handleInputChange('pepStatus', e.target.value === 'true')}
                          />
                          No
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="pepStatus"
                            value="true"
                            checked={formData.pepStatus === true}
                            onChange={(e) => handleInputChange('pepStatus', e.target.value === 'true')}
                          />
                          Yes
                        </label>
                      </RadioGroup>
                      {formData.pepStatus && (
                        <textarea
                          value={formData.pepDetails}
                          onChange={(e) => handleInputChange('pepDetails', e.target.value)}
                          placeholder="Please provide details about your PEP status"
                          rows={3}
                        />
                      )}
                    </InputGroup>
                    <InputGroup>
                      <label>Sanctions Check *</label>
                      <CheckboxGroup>
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.sanctionsCheck}
                            onChange={(e) => handleInputChange('sanctionsCheck', e.target.checked)}
                          />
                          I confirm that I am not subject to any sanctions or restrictions
                        </label>
                      </CheckboxGroup>
                    </InputGroup>
                    <AlertBox type="info">
                      <strong>Important:</strong> All information provided will be verified through our compliance systems. 
                      Providing false information may result in account suspension or legal action.
                    </AlertBox>
                  </FormSection>
                )}

                {/* Step 6: Review & Submit */}
                {currentStep === 6 && (
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
                        Personal Information
                      </h4>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                        <p><strong>Name:</strong> {formData.fname} {formData.mname} {formData.sname}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Mobile:</strong> {formData.mobileno}</p>
                        <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                        <p><strong>Nationality:</strong> {formData.nationality}</p>
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

                    {/* Documents Summary */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#0f172a' }}>
                        Uploaded Documents
                      </h4>
                      <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                        {uploadedDocuments.map((doc) => (
                          <DocumentPreview key={doc.id}>
                            <div className="document-icon">
                              📄
                            </div>
                            <div className="document-info">
                              <h4>{doc.name}</h4>
                              <p>{(doc.size / 1024 / 1024).toFixed(2)} MB</p>
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
