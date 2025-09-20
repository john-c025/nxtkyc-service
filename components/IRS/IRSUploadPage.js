"use client";

import Bot from '../Objects/Bot';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import NavPane from '../Objects/NavPane';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import NotificationButton from '../Objects/NotificationButton';
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';
// Import consistent styling from MainDashboard
import {
  DashboardContainer,
  Sidebar,
  MainContent,
  TopBar,
  HeaderContent,
  HeaderTitle,
  HeaderActions,
  MobileMenuToggle,
  ContentLayout,
  ThemeToggle,
  Button,
  Card,
  colors
} from '../Dashboard/MainDashboardStyled';

import styled from '@emotion/styled';

// Modern styled components for the new design
const ModernStepperContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StepperHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const StepsProgress = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  flex: 1;
  max-width: 200px;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 20px;
    right: -50%;
    width: 100%;
    height: 2px;
    background: ${props => props.isCompleted ? colors.primary[300] : colors.border.light};
    z-index: 0;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const StepCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  
  ${props => {
    if (props.isCompleted) {
      return `
        background: ${colors.success[500]};
        color: white;
        box-shadow: 0 0 0 4px ${colors.success[100]};
      `;
    } else if (props.isActive) {
      return `
        background: ${colors.primary[500]};
        color: white;
        box-shadow: 0 0 0 4px ${colors.primary[100]};
        animation: pulse 2s infinite;
      `;
    } else {
      return `
        background: ${colors.background.tertiary};
        color: ${colors.text.tertiary};
        border: 2px solid ${colors.border.medium};
      `;
    }
  }}
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 4px ${colors.primary[100]}; }
    50% { box-shadow: 0 0 0 8px ${colors.primary[50]}; }
    100% { box-shadow: 0 0 0 4px ${colors.primary[100]}; }
  }
`;

const StepLabel = styled.div`
  text-align: center;
  
  .step-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${props => props.isActive ? colors.primary[600] : colors.text.secondary};
    margin-bottom: 0.25rem;
  }
  
  .step-description {
    font-size: 0.75rem;
    color: ${colors.text.tertiary};
  }
`;

const ContentArea = styled.div`
  background: ${colors.background.primary};
  border-radius: 16px;
  border: 1px solid ${colors.border.light};
  padding: 2rem;
  min-height: 500px;
  box-shadow: ${colors.shadow.light};
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.isDragActive ? colors.primary[400] : colors.border.medium};
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: ${props => props.isDragActive ? colors.primary[50] : colors.background.secondary};
  
  &:hover {
    border-color: ${colors.primary[400]};
    background: ${colors.primary[50]};
  }
  
  .upload-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1rem;
    background: ${colors.primary[100]};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
  }
  
  .upload-text {
    margin-bottom: 1rem;
    
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: ${colors.text.primary};
      margin-bottom: 0.5rem;
    }
    
    p {
      color: ${colors.text.tertiary};
    }
  }
  
  .file-types {
    font-size: 0.875rem;
    color: ${colors.text.disabled};
  }
`;

const FilePreview = styled.div`
  background: ${colors.background.tertiary};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .file-icon {
    width: 40px;
    height: 40px;
    background: ${colors.primary[100]};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
  
  .file-info {
    flex: 1;
    
    .file-name {
      font-weight: 500;
      color: ${colors.text.primary};
      margin-bottom: 0.25rem;
    }
    
    .file-size {
      font-size: 0.875rem;
      color: ${colors.text.tertiary};
    }
  }
  
  .file-actions {
    display: flex;
    gap: 0.5rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${colors.background.tertiary};
  border-radius: 3px;
  overflow: hidden;
  margin: 1rem 0;
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, ${colors.primary[500]}, ${colors.primary[400]});
    border-radius: 3px;
    transition: width 0.3s ease;
    width: ${props => props.progress}%;
  }
`;

const DataPreview = styled.div`
  .preview-header {
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    .record-count {
      background: ${colors.primary[50]};
      color: ${colors.primary[700]};
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
    }
  }
  
  .preview-table {
    border: 1px solid ${colors.border.light};
    border-radius: 8px;
    overflow: hidden;
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid ${colors.border.light};
      }
      
      th {
        background: ${colors.background.tertiary};
        font-weight: 600;
        font-size: 0.875rem;
        color: ${colors.text.secondary};
      }
      
      td {
        font-size: 0.875rem;
        color: ${colors.text.primary};
      }
      
      tr:last-child td {
        border-bottom: none;
      }
    }
  }
`;

const CompanySelector = styled.div`
  .selector-group {
    margin-bottom: 2rem;
    
    label {
      display: block;
      font-weight: 500;
      color: ${colors.text.secondary};
      margin-bottom: 0.5rem;
    }
    
    select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid ${colors.border.medium};
      border-radius: 8px;
      background: ${colors.background.primary};
      color: ${colors.text.primary};
      font-size: 0.875rem;
      
      &:focus {
        outline: none;
        border-color: ${colors.primary[500]};
        box-shadow: 0 0 0 3px ${colors.primary[100]};
      }
    }
  }
  
  .confirmation {
    background: ${colors.background.tertiary};
    border-radius: 8px;
    padding: 1.5rem;
    
    .confirmation-icon {
      width: 48px;
      height: 48px;
      background: ${colors.success[100]};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin: 0 auto 1rem;
    }
    
    h3 {
      text-align: center;
      font-size: 1.125rem;
      font-weight: 600;
      color: ${colors.text.primary};
      margin-bottom: 0.5rem;
    }
    
    p {
      text-align: center;
      color: ${colors.text.tertiary};
      margin-bottom: 1.5rem;
    }
    
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      input[type="checkbox"] {
        width: 16px;
        height: 16px;
      }
      
      label {
        font-size: 0.875rem;
        color: ${colors.text.secondary};
        cursor: pointer;
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${colors.border.light};
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 1rem;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  
  .loading-content {
    text-align: center;
    color: white;
    
    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid ${colors.primary[500]};
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    
    .loading-text {
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    
    .loading-subtext {
      font-size: 0.875rem;
      opacity: 0.8;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SuccessModal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  
  .modal-content {
    background: ${colors.background.primary};
    border-radius: 16px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: ${colors.shadow.xl};
    
    .success-icon {
      width: 64px;
      height: 64px;
      background: ${colors.success[100]};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1rem;
    }
    
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: ${colors.text.primary};
      margin-bottom: 0.5rem;
    }
    
    p {
      color: ${colors.text.tertiary};
      margin-bottom: 1.5rem;
    }
  }
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  
  .access-icon {
    width: 64px;
    height: 64px;
    background: ${colors.error[100]};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin: 0 auto 1rem;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${colors.text.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${colors.text.tertiary};
    margin-bottom: 1.5rem;
  }
`;

// Modern step configuration
const steps = [
  {
    id: 'upload',
    title: "Upload File",
    description: "Select your employee data file",
    icon: "📄",
    status: 'pending'
  },
  {
    id: 'preview',
    title: "Preview Data",
    description: "Review your uploaded data",
    icon: "👁️",
    status: 'pending'
  },
  {
    id: 'configure',
    title: "Configure",
    description: "Select company and settings",
    icon: "⚙️",
    status: 'pending'
  },
  {
    id: 'complete',
    title: "Complete",
    description: "Finalize the upload process",
    icon: "✅",
    status: 'pending'
  }
];

const IRSUploadPage = () => {
  // UI State
  const [activeNav, setActiveNav] = useState('employee-masterfile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed for modern steps
  // User & Auth
  const [userId, setUserId] = useState("");
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);
  const [canUpload, setCanUpload] = useState(false);
  const [uploadReason, setUploadReason] = useState('');
  const [accessReference, setAccessReference] = useState('');
  
  // File Upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Data
  const [masterlistData, setMasterlistData] = useState([]);
  const [masterlistColumns, setMasterlistColumns] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  
  // Loading & Modal States
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('Processing your request...');
  const [currentSubMessage, setCurrentSubMessage] = useState('This may take a few moments');
  
  // Refs
  const fileInputRef = useRef(null);
  const [userDetails, setUserDetails] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  

  async function checkCanUpload(userId) {
    try {
      const res = await fetch(`${API_ENDPOINTS.CAN_UPLOAD_CHECK}?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to check upload access');
      const data = await res.json();
      
      // Update the access reference if it exists
      if (data.refno) {
        setAccessReference(data.refno);
      }
      
      return data; // { canUpload: true/false, reason: "..." }
    } catch (error) {
      return { canUpload: false, reason: error.message };
    }
  }
  const requestPayload = JSON.stringify({
        
        Message: "Request to Upload Masterlist",
        UserId: userId,
        
       
      });
  
  const handleRequestAccess = async () => {
  try {
    // API forrr requesting access
    const response = await axiosInstance.post(
            `${API_ENDPOINTS.SUBMIT_REQUEST}?initiatorId=${userId}&requestType=6`,
            requestPayload,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          
          console.log('Response received:', response.data);

    if (response.status === 200) {
      alert('Access request submitted successfully!');
    }
    
    alert('Access request is currently in progress. Please wait for further updates.');
  } catch (error) {
    console.error('Error requesting access:', error);
    alert('Error submitting access request. Please try again.');
  }
};




  const handleFileSelect = async (files) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    const validFiles = Array.from(files).filter(file => 
      allowedTypes.includes(file.type)
    );

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please only upload Excel or CSV files.');
      return;
    }

    setSelectedFiles(validFiles);
    try {
      const formData = new FormData();
      formData.append('file', validFiles[0]);
      
      setUploadProgress(0);
      const response = await axiosInstance.post(
        `${API_ENDPOINTS.UPLOAD_MASTERLIST_FILE}?page=${currentPage}&pageSize=${pageSize}`,
        formData,
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      if (response.status === 200) {
        console.log('API Response:', response.data);
        console.log('Total Records:', response.data.totalRecords);
        console.log('Current Page:', response.data.currentPage);
        console.log('Page Size:', response.data.pageSize);
        console.log('Total Pages:', response.data.totalPages);
        console.log('Data Array:', response.data.data);
        
        // Store all the pagination data
        setTotalRecords(response.data.totalRecords);
        setCurrentPage(response.data.currentPage);
        setPageSize(response.data.pageSize);
        setTotalPages(response.data.totalPages);
        setMasterlistData(response.data.data || []);
        
        // Get column names from the first row
        if (response.data.data && response.data.data.length > 0) {
          const columns = Object.keys(response.data.data[0]);
          console.log('Columns:', columns);
          setMasterlistColumns(columns);
        }
        
        setTimeout(() => {
          nextStep();
        }, 500);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
      setUploadProgress(0);
    }
  };
  


const runAutomateTagging = async (companyId) => {
  try {
    console.log('Starting automate tagging for company:', companyId);
    
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.AUTOMATE_AND_TAG}?companyId=${companyId}`,
      {}, // Empty body since we're using query parameters
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 200) {
      console.log('Automate tagging completed:', response.data);
      return {
        success: true,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        success: false,
        message: 'Automate tagging completed with warnings'
      };
    }
  } catch (error) {
    console.error('Error during automate tagging:', error);
    return {
      success: false,
      message: `Error during automated tagging: ${error.message}`
    };
  }
};

const handleAcceptMasterlist = async () => {
  try {
    setIsLoading(true);
    setIsModalLoading(true); // Show spinner overlay

    // First, re-upload the file to refresh the session data
    if (selectedFiles.length === 0) {
      alert('No file selected. Please upload a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFiles[0]);
    
    // Show upload progress message
    setUploadProgress(0);
    
    // Re-upload the file to refresh session data
    const uploadResponse = await axiosInstance.post(
      `${API_ENDPOINTS.UPLOAD_MASTERLIST_FILE}?page=1&pageSize=${pageSize}`,
      formData,
      {
        headers: {
          'accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      }
    );

    if (uploadResponse.status !== 200) {
      throw new Error('Failed to refresh file data');
    }

    // Update progress to show processing
    setUploadProgress(100);
    
    // Now call the accept endpoint
    const url = `${API_ENDPOINTS.CONFIRM_MASTERLIST_UPLOAD}?companyid=${selectedCompany}&refno=${encodeURIComponent(accessReference)}&uploaderId=${encodeURIComponent(userId)}`;

    const response = await axiosInstance.post(
      url,
      {},
      {
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      setIsUploadComplete(true);

            // Step 1: Process borrowers (create borrower accounts)
      console.log('🔄 Processing borrower accounts...');
      setCurrentMessage('🔄 Processing borrower accounts...');
      setCurrentSubMessage('Creating borrower accounts from masterlist data');
      
      let taggingResult;
      
      try {
        const borrowerResponse = await axiosInstance.post(
          `${API_ENDPOINTS.PROCESS_MASTERLIST_BORROWERS}`,
          {}, // Empty body since data is retrieved from session
          {
            withCredentials: true,
          }
        );

        if (borrowerResponse.status === 200) {
          console.log('✅ Borrower accounts processed successfully:', borrowerResponse.data);
          setCurrentMessage('✅ Borrower accounts processed successfully!');
          setCurrentSubMessage(`Processed ${borrowerResponse.data.TotalProcessed} records`);
          
          // Store borrower processing results for display
          const borrowerResultsData = {
            totalProcessed: borrowerResponse.data.TotalProcessed,
            successfulInserts: borrowerResponse.data.SuccessfulInserts,
            failedInserts: borrowerResponse.data.FailedInserts,
            failedDetails: borrowerResponse.data.FailedDetails
          };
          
          setBorrowerResults(borrowerResultsData);
          console.log('📊 Borrower processing summary:', borrowerResultsData);
          
          // Step 2: Now run the automate tagging
          console.log('🔄 Starting automated tagging...');
          setCurrentMessage('🔄 Starting automated tagging...');
          setCurrentSubMessage('Assigning areas and collectors');
          
          taggingResult = await runAutomateTagging(selectedCompany);
        } else {
          console.error('❌ Borrower processing failed:', borrowerResponse.data);
          setCurrentMessage('❌ Borrower processing failed');
          setCurrentSubMessage('Please contact support');
          throw new Error('Borrower processing failed');
        }
      } catch (borrowerError) {
        console.error('❌ Error processing borrower accounts:', borrowerError);
        setCurrentMessage('❌ Borrower processing failed');
        setCurrentSubMessage('Please contact support');
        throw borrowerError;
      }
      
      if (taggingResult && taggingResult.success) {
        // IMPORTANT: Keep the loading states active for the 20-second analytics process
        // Don't set isLoading to false here - keep it true for the spinner overlay
        
        // Progressive messages including success notifications
        const progressiveMessages = [
          { main: "✅ Masterlist processed successfully!", sub: "Upload completed successfully" },
          { main: "✅ Borrower accounts processed successfully!", sub: "All borrower records created" },
          { main: "🎯 Automated tagging completed!", sub: "All records have been tagged" },
          { main: " Agila is currently running processes...", sub: "Don't reload the page, don't quit!" },
          { main: "⚡ Running analytical engine...", sub: "Processing masterlist data" },
          { main: "🔍 Processing masterlist data...", sub: "Analyzing collection patterns" },
          { main: "📊 Generating insights and summaries...", sub: "Calculating collection metrics" },
          { main: "🎯 Calculating collection metrics...", sub: "Crunching numbers" },
          { main: "⚙️ Crunching numbers...", sub: "Building performance reports" },
          { main: "📈 Building performance reports...", sub: "Painting the data canvas" },
          { main: "🎨 Painting the data canvas...", sub: "Analyzing collection patterns" },
          { main: "🔮 Analyzing collection patterns...", sub: "Compiling final reports" },
          { main: "📋 Compiling final reports...", sub: "Almost there, keep calm!" },
          { main: " Almost there, keep calm!", sub: "Analytics generation completed!" },
          { main: "✨ Analytics generation completed!", sub: "Preparing success summary" },
          { main: "🎊 Preparing success summary...", sub: "Finalizing all processes" },
          { main: "🚀 Finalizing all processes...", sub: "Almost ready to proceed" },
          { main: "💫 Almost ready to proceed...", sub: "All systems operational!" },
          { main: "🌟 All systems operational!", sub: "Ready to continue!" },
          { main: "🎯 Ready to continue!", sub: "Preparing success modal" },
          { main: "🎊 Success! All done!", sub: "Showing final results" }
        ];
        
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
          if (messageIndex < progressiveMessages.length) {
            // Update the overlay messages using state
            setCurrentMessage(progressiveMessages[messageIndex].main);
            setCurrentSubMessage(progressiveMessages[messageIndex].sub);
            messageIndex++;
          }
        }, 1000); // Change message every second
        
        // Call analytics API twice
        try {
          console.log(' Starting analytics generation...');
          
          // First call: groupByCollector = false (no month parameter)
          console.log('📊 Calling analytics API (groupByCollector = false)...');
          const analyticsResponse1 = await axiosInstance.get(
            `${API_ENDPOINTS.ANALYZE_AND_SUMMARIZE_MASTERLIST_RECORDS}?collectionCompany=${selectedCompany}&groupByCollector=false`
          );
          
          if (analyticsResponse1.status === 200) {
            console.log('✅ Analytics Summary (Overall):', analyticsResponse1.data);
          } else {
            console.log('❌ Analytics API call 1 failed:', analyticsResponse1.status);
          }
          
          // Second call: groupByCollector = true (no month parameter)
          console.log('📊 Calling analytics API (groupByCollector = true)...');
          const analyticsResponse2 = await axiosInstance.get(
            `${API_ENDPOINTS.ANALYZE_AND_SUMMARIZE_MASTERLIST_RECORDS}?collectionCompany=${selectedCompany}&groupByCollector=true`
          );
          
          if (analyticsResponse2.status === 200) {
            console.log('✅ Analytics Summary (Grouped by Collector):', analyticsResponse2.data);
          } else {
            console.log('❌ Analytics API call 2 failed:', analyticsResponse2.status);
          }
          
          console.log('🎉 Analytics generation completed!');
          
        } catch (analyticsError) {
          console.error('❌ Error during analytics generation:', analyticsError);
        }
        
        // Wait for 20 seconds total, then show success modal
        setTimeout(() => {
          clearInterval(messageInterval);
          // Now hide the spinner overlay and show the success modal
          setIsLoading(false);
          setIsModalLoading(false);
          setShowSuccessModal(true);
        }, 20000); // 20 seconds total
        
      } else {
        // Show error message in overlay for 5 seconds before reload
        const errorMessages = [
          { main: `❌ ${taggingResult.message}`, sub: "Please contact support or try running the tagging manually" },
          { main: "⚠️ Please contact support", sub: "Try running the tagging manually" },
          { main: "🔄 Reloading page in a moment...", sub: "Please wait" },
          { main: "🔄 Reloading page in a moment...", sub: "Almost ready" },
          { main: "🔄 Reloading page in a moment...", sub: "Final countdown" }
        ];
        
        let errorIndex = 0;
        const errorInterval = setInterval(() => {
          if (errorIndex < errorMessages.length) {
            setCurrentMessage(errorMessages[errorIndex].main);
            setCurrentSubMessage(errorMessages[errorIndex].sub);
            errorIndex++;
          }
        }, 1000);
        
        setTimeout(() => {
          clearInterval(errorInterval);
          window.location.reload();
        }, 5000); // 5 seconds for error messages
      }
    }
  } catch (error) {
    console.error('Error accepting masterlist:', error);
    alert('Error processing masterlist. Please try again. ' + error.message);
    // Reset loading states on error
    setIsLoading(false);
    setIsModalLoading(false);
    setUploadProgress(0);
  }
  // Remove the finally block that was interfering with the loading states
};



  const handlePageChange = async (newPage) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.UPLOAD_MASTERLIST_FILE}?page=${newPage}&pageSize=${pageSize}`,
      formData,
      {
        headers: {
          'accept': '*/*',
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // ✅ this enables session cookie support
      }
    );

      if (response.status === 200) {
        setMasterlistData(response.data.data || []);
        setCurrentPage(newPage);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      alert('Error fetching page data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  

  useEffect(() => {
    // Get userId from token when component mounts
    const getUserFromToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          const decodedUserId = decoded.UserId;
          console.log("Token decoded, userId:", decodedUserId); // Debug log
          
          if (!decodedUserId) {
            console.error("No UserId found in token");
            return;
          }
          
          // Set userId first
          setUserId(decodedUserId);
          setIsTokenProcessed(true);
          
          // Check password status
          const pwResponse = await axiosInstance.get(`${API_ENDPOINTS.PW_STATUS}?userId=${decodedUserId}`);
          if (pwResponse.data.data.pw_reset_req === "True") {
            setIsModalOpen(true);
          }

          // Fetch user details
          const userResponse = await axiosInstance.get(`${API_ENDPOINTS.USER_DETAILS}?userId=${decodedUserId}`);
          setUserDetails(userResponse.data.data);
          console.log("User Details:", userResponse.data);
          // Artificial delay of 5 seconds
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          setIsInitialLoading(false);
        }
      } catch (error) {
        console.error('Error in initialization:', error);
        setIsInitialLoading(false);
      }
    };

    getUserFromToken();
  }, []);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.USER_NOTIFICATIONS}?userId=${userId}`);
        if (response.status === 200) {
          const notifData = response.data.data;
          setNotifications(notifData);
          setUnreadCount(notifData.filter(notif => notif.is_unread).length);
        }

        const result = await checkCanUpload(userId);
        setCanUpload(result.canUpload);
        setUploadReason(result.reason);
        
        // If access is granted or there's a reference number, allow upload
        if (result.canUpload || result.refno) {
          setCanUpload(true);
        }
        
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

 
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.LOAD_FIN_COMPANIES);
        if (response.status === 200) {
          setCompanies(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Modern step content renderer
  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'upload':
        return (
          <div>
            <UploadArea
              isDragActive={dragActive}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFileSelect(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📄</div>
              <div className="upload-text">
                <h3>Upload Employee Data File</h3>
                <p>Drag and drop your Excel or CSV file here, or click to browse</p>
              </div>
              <div className="file-types">Supported formats: .xlsx, .xls, .csv</div>
              
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                accept=".xlsx,.xls,.csv"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </UploadArea>

            {selectedFiles.length > 0 && (
              <FilePreview>
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <div className="file-name">{selectedFiles[0].name}</div>
                  <div className="file-size">
                    {(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <div className="file-actions">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedFiles([]);
                      setUploadProgress(0);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </FilePreview>
            )}

            {uploadProgress > 0 && (
              <ProgressBar progress={uploadProgress}>
                <div className="progress-fill" />
              </ProgressBar>
            )}
          </div>
        );

      case 'preview':
        return (
          <DataPreview>
            <div className="preview-header">
              <h3>Data Preview</h3>
              <div className="record-count">
                {totalRecords} records found
              </div>
            </div>
            
            {masterlistData.length > 0 && (
              <div className="preview-table">
                <table>
                  <thead>
                    <tr>
                      {masterlistColumns.slice(0, 6).map((column) => (
                        <th key={column}>
                          {column.charAt(0).toUpperCase() + column.slice(1)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {masterlistData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        {masterlistColumns.slice(0, 6).map((column) => (
                          <td key={column}>
                            {row[column] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Button variant="secondary" onClick={() => {}}>
                View Full Data
              </Button>
            </div>
          </DataPreview>
        );

      case 'configure':
        return (
          <CompanySelector>
            <div className="selector-group">
              <label>Select Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">Choose a company...</option>
                {companies.map((company) => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedCompany && (
              <div className="confirmation">
                <div className="confirmation-icon">⚙️</div>
                <h3>Configuration Summary</h3>
                <p>
                  Ready to upload {totalRecords} records to{' '}
                  <strong>
                    {companies.find(c => c.company_id === selectedCompany)?.company_name}
                  </strong>
                </p>
                
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="acknowledge"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                  />
                  <label htmlFor="acknowledge">
                    I confirm this data is accurate and ready for processing
                  </label>
                </div>
              </div>
            )}
          </CompanySelector>
        );

      case 'complete':
        return (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: colors.success[100],
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 1rem'
            }}>
              ✅
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Ready to Upload
            </h3>
            <p style={{ color: colors.text.tertiary, marginBottom: '1.5rem' }}>
              Click the button below to start processing your employee data
            </p>
            
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleAcceptMasterlist}
              disabled={!acknowledged || !selectedCompany}
            >
              Start Upload Process
            </Button>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <DashboardContainer>
      {/* Loading Overlay */}
      {isLoading && (
        <LoadingOverlay>
          <div className="loading-content">
            <div className="spinner" />
            <div className="loading-text">{currentMessage}</div>
            <div className="loading-subtext">{currentSubMessage}</div>
          </div>
        </LoadingOverlay>
      )}

      {/* Sidebar */}
      <Sidebar>
        {isTokenProcessed && (
          <NavPane 
            activeNav={activeNav} 
            setActiveNav={setActiveNav}
            isDarkMode={isDarkMode}
            userId={userId}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isCollapsed={false}
            onToggleCollapse={() => {}}
          />
        )}
      </Sidebar>

      {/* Main Content */}
      <MainContent sidebarCollapsed={false}>
        {/* Access Denied Overlay */}
        {!canUpload && !accessReference && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            marginLeft: '280px'
          }}>
            <AccessDenied>
              <div className="access-icon">🔒</div>
              <h2>Access Required</h2>
              <p>{uploadReason || 'You need permission to upload employee data.'}</p>
              <Button variant="primary" onClick={handleRequestAccess}>
                Request Access
              </Button>
            </AccessDenied>
          </div>
        )}

        {/* Header */}
        <TopBar>
          <HeaderContent>
            <MobileMenuToggle onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </MobileMenuToggle>
            
            <HeaderTitle>
              <h1>Employee Masterfile Upload</h1>
              <p>Upload and process employee data files</p>
            </HeaderTitle>
          </HeaderContent>

          <HeaderActions>
            <NotificationButton userId={userId} isDarkMode={isDarkMode} />
            <ThemeToggle onClick={toggleTheme}>
              {isDarkMode ? (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </ThemeToggle>
          </HeaderActions>
        </TopBar>

        {/* Content */}
        <ContentLayout>
          {/* Access Reference */}
          {accessReference && (
            <Card style={{ marginBottom: '2rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: colors.primary[100],
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  📋
                </div>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    Access Reference
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: colors.text.tertiary
                  }}>
                    {accessReference}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Modern Stepper */}
          <ModernStepperContainer>
            <StepperHeader>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Upload Process
              </h2>
              <p style={{ color: colors.text.tertiary }}>
                Follow these steps to upload and process your employee data
              </p>
            </StepperHeader>

            {/* Steps Progress */}
            <StepsProgress>
              {steps.map((step, index) => (
                <StepIndicator 
                  key={step.id}
                  isCompleted={index < currentStep}
                  isActive={index === currentStep}
                >
                  <StepCircle
                    isCompleted={index < currentStep}
                    isActive={index === currentStep}
                  >
                    {index < currentStep ? '✓' : step.icon}
                  </StepCircle>
                  <StepLabel isActive={index === currentStep}>
                    <div className="step-title">{step.title}</div>
                    <div className="step-description">{step.description}</div>
                  </StepLabel>
                </StepIndicator>
              ))}
            </StepsProgress>

            {/* Content Area */}
            <ContentArea>
              {renderStepContent()}
            </ContentArea>

            {/* Action Buttons */}
            <ActionButtons>
              <div>
                {currentStep > 0 && (
                  <Button variant="ghost" onClick={prevStep}>
                    ← Previous
                  </Button>
                )}
              </div>
              
              <div>
                {currentStep < steps.length - 1 && steps[currentStep].id !== 'complete' && (
                  <Button 
                    variant="primary" 
                    onClick={nextStep}
                    disabled={
                      (currentStep === 0 && selectedFiles.length === 0) ||
                      (currentStep === 2 && (!selectedCompany || !acknowledged))
                    }
                  >
                    Continue →
                  </Button>
                )}
              </div>
            </ActionButtons>
          </ModernStepperContainer>
        </ContentLayout>
      </MainContent>

      {/* Bot */}
     

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal>
          <div className="modal-content">
            <div className="success-icon">🎉</div>
            <h2>Upload Successful!</h2>
            <p>Your employee data has been processed successfully.</p>
            <Button 
              variant="primary" 
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = '/dashboard';
              }}
            >
              Go to Dashboard
            </Button>
          </div>
        </SuccessModal>
      )}
    </DashboardContainer>
  );
};

export default IRSUploadPage;