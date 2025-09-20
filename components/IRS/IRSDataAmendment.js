"use client";
// import Image from 'next/image';
import Bot from '../Objects/Bot';
import React, { useState,useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import NavPane from '../Objects/NavPane';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import NotificationButton from '../Objects/NotificationButton';
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';
import {
  DashboardContainer,
  MainContent,
  Sidebar,
  StepContainer, 
  StepItem,
  StepNumber,
  StepLabel,
  StepStatus,
  NewReportButton,
  Button,
  Card,
  TopBar,
  ThemeToggle,
  
  UploadModalOverlay,
  SpinnerOverlay,
  Spinner,
  StepperLayout,
  StepperSidebar,
  StepperStep,
  StepperContent,
  StepperNavigation,
  ActionButton,
  ContentCard,
  // UploadZone,
  AnimatedProgress,
  StepTitle,
  StepIcon,
  UploadModalContent,
  ReportsTableContainer,
  ReportsTable,
  
  TableModal,
  TableModalContent,
  SearchInput,
  PaginationControls,
  ErrorMessage,
  ModalForm,
  ModalFooter
} from './IRSDataAmendmentStyled';
import { createPortal } from 'react-dom';
import AddRecordModal from '../Objects/AddRecordModal';

const steps = [
  {
    number: 1,
    title: "Upload Files",
    description: "Upload your master list file",
    longDescription: "Start by uploading your Excel or CSV file containing the master list data."
  },
  {
    number: 2,
    title: "Preview Masterlist",
    description: "Preview raw uploaded masterlist file",
    longDescription: "Preview the raw uploaded masterlist file before finalizing the report."
  },
  {
    number: 3,
    title: "Review & Confirm Upload",
    description: "Confirm the upload",
    longDescription: "Confirm masterlist upload to the Eagle Eye ICRM System"
  },
  {
    number: 4,
    title: "Configure & Send Processing Request",
    description: "Configure & Finalize",
    longDescription: "Finalize the masterlist upload and submit a pending request for processing of data analysis and report generation."
  }
];

const EditRecordModal = ({ isOpen, onClose, onEdit, record, isDarkMode }) => {
  if (!isOpen || !record) return null;

  const [editedRecord, setEditedRecord] = useState(record);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(editedRecord);
    onClose();
  };

  return (
    <TableModal onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <TableModalContent isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h3>Edit Record</h3>
          <button className="close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ModalForm isDarkMode={isDarkMode} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>PN Number</label>
            <input
              type="text"
              name="pn_number"
              value={editedRecord.pn_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Reference Number</label>
            <input
              type="text"
              name="refno"
              value={editedRecord.refno}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Borrower Name</label>
            <input
              type="text"
              name="borrower_name"
              value={editedRecord.borrower_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Field Collector</label>
            <input
              type="text"
              name="field_collector"
              value={editedRecord.field_collector}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="text"
              name="contact_no"
              value={editedRecord.contact_no}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={editedRecord.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Area</label>
            <input
              type="text"
              name="area"
              value={editedRecord.area}
              onChange={handleChange}
            />
          </div>
        </ModalForm>
        <ModalFooter isDarkMode={isDarkMode}>
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </ModalFooter>
      </TableModalContent>
    </TableModal>
  );
};

const IRSDataAmendment = () => {
  const [activeNav, setActiveNav] = useState('irs-amendment');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [masterlistData, setMasterlistData] = useState([]);
  const [masterlistColumns, setMasterlistColumns] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleNextStep = () => {
    if (currentStep === 1 && selectedFiles.length === 0) {
      alert('Please upload a valid file before proceeding.');
      return; // Prevent proceeding to the next step if no file is uploaded
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setCurrentStep(prevStep => Math.min(prevStep + 1, 4));
      setIsLoading(false);
    }, 1500); // 1.5-second delay
  };

  const handlePreviousStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const handleNewReportClick = () => {
    setIsUploadModalOpen(true);
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
          handleNextStep();
        }, 500);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
      setUploadProgress(0);
    }
  };

  const handleAcceptMasterlist = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(`${API_ENDPOINTS.CONFIRM_MASTERLIST_UPLOAD}/accept`, {
        userId: userId
      });
      
      if (response.status === 200) {
        alert('Masterlist processed successfully!');
        // Redirect or handle success as needed
      }
    } catch (error) {
      console.error('Error accepting masterlist:', error);
      alert('Error processing masterlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const simulateUpload = (files) => {
    setUploadProgress(0);
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    let loaded = 0;

    const interval = setInterval(() => {
      loaded += totalSize / 20; // Simulate chunks
      const progress = Math.min(Math.round((loaded / totalSize) * 100), 100);
      setUploadProgress(progress);

      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          handleNextStep();
          setIsUploadModalOpen(false);
        }, 500);
      }
    }, 200);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
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
          }
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
    const getUserFromToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.UserId);
          setIsTokenProcessed(true);
          await fetchMasterlistData();
        }
      } catch (error) {
        console.error('Error in initialization:', error);
        setError('Failed to initialize the page.');
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
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchMasterlistData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.LOAD_MASTERLIST}?page=${currentPage}&pageSize=${pageSize}`
      );
      
      if (response.status === 200) {
        setMasterlistData(response.data.data || []);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching masterlist:', error);
      setError('Failed to fetch masterlist data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRecord = async (record) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        `${API_ENDPOINTS.UPDATE_MASTERLIST_RECORD}/${record.id}`,
        record
      );
      
      if (response.status === 200) {
        await fetchMasterlistData();
        setError(null);
      }
    } catch (error) {
      console.error('Error updating record:', error);
      setError('Failed to update the record.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = async (record) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.ADD_MASTERLIST_RECORD,
        record
      );
      
      if (response.status === 200) {
        await fetchMasterlistData();
        setError(null);
      }
    } catch (error) {
      console.error('Error adding record:', error);
      setError('Failed to add the record.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.DELETE_MASTERLIST_RECORD}/${recordId}`
      );
      
      if (response.status === 200) {
        await fetchMasterlistData();
        setError(null);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      setError('Failed to delete the record.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = masterlistData.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    return (
      record.borrower_name?.toLowerCase().includes(searchLower) ||
      record.pn_number?.toString().includes(searchLower) ||
      record.refno?.toString().includes(searchLower) ||
      record.field_collector?.toLowerCase().includes(searchLower)
    );
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ContentCard isDarkMode={isDarkMode}>
            <StepTitle>
              <StepIcon isDarkMode={isDarkMode}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
              </StepIcon>
              <h3>Upload the Masterlist For Your Financing Company</h3>
            </StepTitle>

            {/* <UploadZone
              isDarkMode={isDarkMode}
              dragActive={dragActive}
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
              <div className="upload-content">
                <div className="upload-icon">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                </div>
                <div className="upload-text">
                  <p className="primary-text">Upload Masterlist Excel File Here</p>
                  <p className="secondary-text">Drag and drop or click to browse</p>
                </div>
                <div className="file-types">Supported files: .xlsx, .xls, .csv</div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </UploadZone> */}

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2">Selected Files:</h4>
                <ul className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                      <span>{file.name}</span>
                      <span className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {uploadProgress > 0 && (
              <AnimatedProgress isDarkMode={isDarkMode} className="mt-4">
                <div className="progress-header">
                  <span>Uploading {selectedFiles.length} files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </AnimatedProgress>
            )}

            {selectedFiles.length > 0 && (
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  className={`px-4 py-2 rounded ${
                    isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-700' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedFiles([]);
                    setUploadProgress(0);
                  }}
                >
                  Clear File
                </button>
              
              </div>
            )}
          </ContentCard>
        );
      case 2:
        return (
          <ContentCard isDarkMode={isDarkMode}>
            <div className="flex items-center gap-2 mb-4">
              <StepIcon isDarkMode={isDarkMode}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </StepIcon>
              <h3>Preview Masterlist</h3>
            </div>

            <div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-sm text-gray-300 font-medium">Masterlist Summary</span>
              </div>
              <div className="text-gray-400 text-sm mb-4">
                Your master list contains <span className="text-white font-semibold">{totalRecords}</span> records in total. 
                You can preview the data before proceeding to the next step.
              </div>
              
              <button 
                onClick={() => setIsPreviewModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview Master List Data
              </button>
            </div>

            {masterlistData.length > 0 && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`
                      flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${currentPage === 1 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                        : 'bg-orange-600 text-white hover:bg-orange-700 active:transform active:scale-95'
                      }
                    `}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-md">
                    <span className="text-sm text-gray-300">Page {currentPage} of {totalPages}</span>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`
                      flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${currentPage === totalPages 
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                        : 'bg-orange-600 text-white hover:bg-orange-700 active:transform active:scale-95'
                      }
                    `}
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Preview Modal - separate this from the render to prevent re-renders */}
            {createPortal(
              isPreviewModalOpen && (
                <TableModal onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setIsPreviewModalOpen(false);
                  }
                }}>
                  <TableModalContent 
                    isDarkMode={isDarkMode} 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-header">
                      <h3>Master List Preview</h3>
                      <button 
                        className="close-button"
                        onClick={() => setIsPreviewModalOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="modal-body">
                      <ReportsTableContainer isDarkMode={isDarkMode}>
                        <ReportsTable isDarkMode={isDarkMode}>
                          <thead>
                            <tr>
                              {masterlistColumns.map((column) => {
                                // Display proper column names with first letter capitalized
                                // and replace "davao" with "Branch"
                                let displayName = column;
                                
                                if (column === "davao") {
                                  displayName = "Branch";
                                } else {
                                  // Normalize column name: camelCase to Title Case with spaces
                                  displayName = column
                                    // Insert a space before all capital letters
                                    .replace(/([A-Z])/g, ' $1')
                                    // Capitalize the first letter
                                    .replace(/^./, str => str.toUpperCase());
                                }
                                
                                return (
                                  <th key={column}>
                                    {displayName}
                          </th>
                                );
                              })}
                    </tr>
                  </thead>
                          <tbody>
                    {masterlistData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                                {masterlistColumns.map((column) => {
                                  let cellContent = row[column];
                                  
                                  // Format dates
                                  if (['maturity', 'firstDue', 'lastApplied', 'lastPaymentDate'].includes(column)) {
                                    cellContent = cellContent ? new Date(cellContent).toLocaleDateString() : '-';
                                  }
                                  // Format numbers
                                  else if (['collectibles', 'amortization', 'balance', 'principal', 'overdue'].includes(column)) {
                                    cellContent = typeof cellContent === 'number' ? 
                                      new Intl.NumberFormat('en-US', { 
                                        style: 'decimal',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2 
                                      }).format(cellContent) : cellContent;
                                  }

                                  return (
                                    <td key={`${rowIndex}-${column}`}>
                                      {cellContent || '-'}
                          </td>
                                  );
                                })}
                      </tr>
                    ))}
                  </tbody>
                        </ReportsTable>
                      </ReportsTableContainer>
                    </div>
                    <div className="modal-footer">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} records
                        </div>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`
                              flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                              ${currentPage === 1 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                                : 'bg-orange-600 text-white hover:bg-orange-700 active:transform active:scale-95'
                              }
                            `}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                          </button>
                          
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-md">
                            <span className="text-sm text-white">Page {currentPage} of {totalPages}</span>
                          </div>
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`
                              flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                              ${currentPage === totalPages 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                                : 'bg-orange-600 text-white hover:bg-orange-700 active:transform active:scale-95'
                              }
                            `}
                          >
                            Next
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </TableModalContent>
                </TableModal>
              ),
              document.body
            )}
          </ContentCard>
        );
      case 3:
        // Implement the logic for step 3
        return (<div className="mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-sm text-gray-300 font-medium">Masterlist Confirmation</span>
          </div>
          <div className="text-gray-400 text-sm mb-4">
            Your master list contains <span className="text-white font-semibold">{totalRecords}</span> records in total. 
            Are you sure you want to proceed with the upload of the masterlist data?
          </div>

          <div className="form-group">
                <label>Financing Company</label>
                <select
                  name="companyId"
                  // value={formData.positionId}
                  // onChange={handleChange}
                  required
                  className="select-input"
                >
                  <option value="">Select Company</option>
                  
                </select>
              </div>
          
          
        </div>)
      case 4:
          return (
            <ContentCard isDarkMode={isDarkMode}>
              <StepTitle>
                <StepIcon isDarkMode={isDarkMode}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </StepIcon>
                <h3>Accept</h3>
              </StepTitle>
              <div className="mt-4">
                <p>Confirm to proceed with the upload of the masterlist data.</p>
                <button
                  className={`mt-4 px-6 py-2 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                  onClick={handleAcceptMasterlist}
                >
                  Accept and Process
                </button>
              </div>
            </ContentCard>
          );
      default:
        return <div>Unknown step content</div>;
    }
  };

  return (
    <DashboardContainer isDarkMode={isDarkMode}>
      {isLoading && (
        <SpinnerOverlay>
          <div className="flex flex-col items-center">
            <Spinner />
            <div className="mt-4 text-white text-lg">Processing your request...</div>
            <div className="mt-2 text-gray-300 text-sm">This may take a few moments</div>
          </div>
        </SpinnerOverlay>
      )}
      
      <Sidebar isDarkMode={isDarkMode}>
        {/* <div className="p-6 mb-8">
          <Image
            src="https://eagleeyecollection.com/wp-content/uploads/2023/12/cropped-logo.jpg"
            alt="Eagle Eye Logo"
            width={180}
            height={50}
            style={{ height: 'auto' }}
            priority
          />
        </div> */}

        <div className="flex flex-col flex-1 mt-4">
          {isTokenProcessed && (
            <NavPane 
              activeNav={activeNav} 
              setActiveNav={setActiveNav}
              isDarkMode={isDarkMode}
              userId={userId}
            />
          )}
        </div>
      </Sidebar>


      <MainContent isDarkMode={isDarkMode}>
        <TopBar isDarkMode={isDarkMode}>
          <div className="flex items-center gap-4">
            {/* <button 
              className="lg:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button> */}
            <div>
              <h1 className="text-2xl font-light text-gray-900 dark:text-white">ICRS Data Management</h1>
              <p className="text-sm text-gray-500 dark:text-gray-300">Edit and manage masterlist records</p>
            </div>
          </div>
          
          <div className="flex gap-4">
              <NotificationButton userId={userId} isDarkMode={isDarkMode} />
              <ThemeToggle onClick={toggleTheme} isDarkMode={isDarkMode}>
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </ThemeToggle>
          </div>
        </TopBar>

        <div className="p-6 dark:bg-inherit min-h-screen relative">
          <Card isDarkMode={isDarkMode} className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 items-center">
                <SearchInput
                  type="text"
                  placeholder="Search by name, PN number, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  isDarkMode={isDarkMode}
                />
                <Button
                  variant="primary"
                  isDarkMode={isDarkMode}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Record
                </Button>
              </div>
            </div>

            {error && (
              <ErrorMessage isDarkMode={isDarkMode}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </ErrorMessage>
            )}

            <ReportsTableContainer isDarkMode={isDarkMode}>
              <ReportsTable isDarkMode={isDarkMode}>
                <table>
                  <thead>
                    <tr>
                      <th>PN Number</th>
                      <th>Reference Number</th>
                      <th>Borrower Name</th>
                      <th>Field Collector</th>
                      <th>Contact No.</th>
                      <th>Address</th>
                      <th>Area</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((record) => (
                      <tr key={record.id}>
                        <td>{record.pn_number}</td>
                        <td>{record.refno}</td>
                        <td>{record.borrower_name}</td>
                        <td>{record.field_collector}</td>
                        <td>{record.contact_no}</td>
                        <td>{record.address}</td>
                        <td>{record.area}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <ActionButton
                              variant="edit"
                              isDarkMode={isDarkMode}
                              onClick={() => {
                                setSelectedRecord(record);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </ActionButton>
                            <ActionButton
                              variant="delete"
                              isDarkMode={isDarkMode}
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this record?')) {
                                  handleDeleteRecord(record.id);
                                }
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ReportsTable>
            </ReportsTableContainer>

            <PaginationControls isDarkMode={isDarkMode}>
              <div className="pagination-info">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} records
              </div>
              <div className="pagination-buttons">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <div className="page-info">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </PaginationControls>
          </Card>
        </div>
      </MainContent>

      <EditRecordModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditRecord}
        record={selectedRecord}
        isDarkMode={isDarkMode}
      />

      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRecord}
        isDarkMode={isDarkMode}
      />
      <Bot userId={userId}/> 
    </DashboardContainer>
  );
};

export default IRSDataAmendment;

/*
  IRSDataAmendment or DATA AMENDMENT PAGE Component Summary

  This page provides a comprehensive interface for previewing, editing, and managing masterlist records in the ICRS system.

  Usage Guide:
  
    5. Use the search bar to filter records in the table.
    6. Edit or delete records using the action buttons in the table.
    7. Add new records with the "Add New Record" button.
    8. Use the sidebar and top bar for navigation, notifications, and theme toggling.

    */