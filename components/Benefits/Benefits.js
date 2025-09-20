'use client';

import React, { useState, useEffect } from 'react';
import NavPane from '../Objects/NavPane';
import {
  BenefitsContainer,
  BenefitsGrid,
  BenefitCard,
  BenefitHeader,
  BenefitIcon,
  BenefitTitle,
  BenefitDescription,
  BenefitDetails,
  DetailItem,
  DetailLabel,
  DetailValue,
  EnrollmentStatus,
  StatusIcon,
  StatusText,
  BenefitActions,
  ActionButton,
  PageHeader,
  PageTitle,
  PageSubtitle,
  PageActions,
  Button,
  colors
} from './BenefitsStyled';

// Mock benefits data
const BENEFITS_DATA = [
  {
    id: 1,
    title: 'Health Insurance',
    description: 'Comprehensive medical coverage including hospitalization, outpatient care, and emergency services.',
    type: 'health',
    coverage: '₱500,000 annual limit',
    premium: '₱2,500/month',
    employerContribution: '80%',
    employeeContribution: '20%',
    status: 'enrolled',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    bg: colors.success[100],
    color: colors.success[600]
  },
  {
    id: 2,
    title: 'SSS Contribution',
    description: 'Social Security System contributions for retirement, disability, and death benefits.',
    type: 'retirement',
    coverage: 'Government mandated',
    premium: '₱1,800/month',
    employerContribution: '8.5%',
    employeeContribution: '4.5%',
    status: 'enrolled',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
      </svg>
    ),
    bg: colors.primary[100],
    color: colors.primary[600]
  },
  {
    id: 3,
    title: 'Pag-IBIG Fund',
    description: 'Home Development Mutual Fund for housing loans and savings programs.',
    type: 'savings',
    coverage: 'Housing loan eligibility',
    premium: '₱200/month',
    employerContribution: '₱100',
    employeeContribution: '₱100',
    status: 'enrolled',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
    bg: colors.warning[100],
    color: colors.warning[600]
  },
  {
    id: 4,
    title: 'PhilHealth',
    description: 'National Health Insurance Program providing healthcare benefits.',
    type: 'health',
    coverage: 'Basic healthcare package',
    premium: '₱900/month',
    employerContribution: '50%',
    employeeContribution: '50%',
    status: 'enrolled',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
      </svg>
    ),
    bg: colors.success[100],
    color: colors.success[600]
  },
  {
    id: 5,
    title: 'Life Insurance',
    description: 'Term life insurance coverage for employees and their beneficiaries.',
    type: 'insurance',
    coverage: '₱1,000,000',
    premium: '₱800/month',
    employerContribution: '100%',
    employeeContribution: '0%',
    status: 'pending',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
      </svg>
    ),
    bg: colors.primary[100],
    color: colors.primary[600]
  },
  {
    id: 6,
    title: 'Dental Coverage',
    description: 'Dental care benefits including cleanings, fillings, and basic procedures.',
    type: 'health',
    coverage: '₱50,000 annual limit',
    premium: '₱500/month',
    employerContribution: '75%',
    employeeContribution: '25%',
    status: 'not-enrolled',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    bg: colors.success[100],
    color: colors.success[600]
  }
];

const MainDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [benefits, setBenefits] = useState(BENEFITS_DATA);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearInterval(timer);
  }, []);

  const handleEnroll = (benefitId) => {
    setBenefits(prev => prev.map(benefit => 
      benefit.id === benefitId 
        ? { ...benefit, status: 'pending' }
        : benefit
    ));
  };

  const handleViewDetails = (benefitId) => {
    console.log('View benefit details:', benefitId);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: colors.background.secondary 
      }}>
        <NavPane
          activeNav="Benefits"
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
        activeNav="Benefits"
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
        <BenefitsContainer>
          <PageHeader>
            <div>
              <PageTitle>Employee Benefits</PageTitle>
              <PageSubtitle>Manage and enroll in company benefits and government mandated programs</PageSubtitle>
            </div>
            <PageActions>
              <Button 
                variant="secondary"
                onClick={() => console.log('Benefits summary')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
                Benefits Summary
              </Button>
              <Button 
                variant="primary"
                onClick={() => console.log('Contact HR')}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Contact HR
              </Button>
            </PageActions>
          </PageHeader>

          <BenefitsGrid>
            {benefits.map(benefit => (
              <BenefitCard key={benefit.id} benefitType={benefit.type}>
                <BenefitHeader>
                  <BenefitIcon bg={benefit.bg} color={benefit.color}>
                    {benefit.icon}
                  </BenefitIcon>
                  <EnrollmentStatus status={benefit.status}>
                    <StatusIcon status={benefit.status}>
                      {benefit.status === 'enrolled' && (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      )}
                      {benefit.status === 'pending' && (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                          <path d="m12.5 7-1 0v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                      )}
                      {benefit.status === 'not-enrolled' && (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                      )}
                    </StatusIcon>
                    <StatusText status={benefit.status}>
                      {benefit.status === 'enrolled' && 'Enrolled'}
                      {benefit.status === 'pending' && 'Pending'}
                      {benefit.status === 'not-enrolled' && 'Available'}
                    </StatusText>
                  </EnrollmentStatus>
                </BenefitHeader>

                <BenefitTitle>{benefit.title}</BenefitTitle>
                <BenefitDescription>{benefit.description}</BenefitDescription>

                <BenefitDetails>
                  <DetailItem>
                    <DetailLabel>Coverage</DetailLabel>
                    <DetailValue>{benefit.coverage}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Total Premium</DetailLabel>
                    <DetailValue>{benefit.premium}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Employer Pays</DetailLabel>
                    <DetailValue>{benefit.employerContribution}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>You Pay</DetailLabel>
                    <DetailValue>{benefit.employeeContribution}</DetailValue>
                  </DetailItem>
                </BenefitDetails>

                <BenefitActions>
                  <ActionButton onClick={() => handleViewDetails(benefit.id)}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    View Details
                  </ActionButton>
                  
                  {benefit.status === 'not-enrolled' && (
                    <ActionButton 
                      className="primary" 
                      onClick={() => handleEnroll(benefit.id)}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                      Enroll
                    </ActionButton>
                  )}
                  
                  {benefit.status === 'enrolled' && (
                    <ActionButton>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                      Manage
                    </ActionButton>
                  )}
                  
                  {benefit.status === 'pending' && (
                    <ActionButton>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                      <path d="m12.5 7-1 0v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    Pending
                  </ActionButton>
                  )}
                </BenefitActions>
              </BenefitCard>
            ))}
          </BenefitsGrid>
        </BenefitsContainer>
      </div>
    </div>
  );
};

export default MainDashboard;
