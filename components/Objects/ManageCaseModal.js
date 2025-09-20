"use client";
// import Image from 'next/image';
import Bot from '../Objects/Bot';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import NavPane from '../Objects/NavPane';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import NotificationButton from '../Objects/NotificationButton';
import axiosInstance from '../backend/axiosInstance';
import { FaFileAlt, FaUserShield, FaCog, FaArrowUp, FaArrowDown, FaGavel,FaClipboardCheck } from 'react-icons/fa';

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
  StatusBadge,
  ThemeToggle,
  StatsContainer,
  StatCard,
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
} from '../IRS/IRSTelecollectorStyled';
import { createPortal } from 'react-dom';
export default function ManageCaseModal ({ isOpen, onClose, onEdit, record, isDarkMode, userId }) {
    const [editedRecord, setEditedRecord] = useState({
      ...record,
      main_remarkid: '',
      sub_status_borrowerid: '',
      sub_status_unitid: '',
      additional_remarks: '',
      requested_visit: false
    });
  
    const [remarkOptions, setRemarkOptions] = useState([]);
    const [unitStatusOptions, setUnitStatusOptions] = useState([]);
    const [borrowerStatusOptions, setBorrowerStatusOptions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Utility function to format currency
    const formatCurrency = (amount) => {
      return amount ? `₱${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₱0.00';
    };

    // Utility function to format dates
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Invalid Date';
      }
    };
  
    // Debug state changes
    useEffect(() => {
      console.log('remarkOptions state changed:', remarkOptions);
    }, [remarkOptions]);
  
    useEffect(() => {
      console.log('unitStatusOptions state changed:', unitStatusOptions);
    }, [unitStatusOptions]);
  
    useEffect(() => {
      console.log('borrowerStatusOptions state changed:', borrowerStatusOptions);
    }, [borrowerStatusOptions]);
  
    useEffect(() => {
      if (isOpen && record) {
        fetchDropdownOptions();
        // Reset form when modal opens
        setEditedRecord({
          ...record,
          main_remarkid: '',
          sub_status_borrowerid: '',
          sub_status_unitid: '',
          additional_remarks: '',
          requested_visit: false
        });
      }
    }, [isOpen, record]);
  
    const fetchDropdownOptions = async () => {
      try {
        const [remarksResponse, unitStatusResponse, borrowerStatusResponse] = await Promise.all([
          axiosInstance.get(API_ENDPOINTS.GET_RECORD_REMARKS_OPTIONS),
          axiosInstance.get(API_ENDPOINTS.GET_UNIT_STATUS_OPTIONS),
          axiosInstance.get(API_ENDPOINTS.GET_BORROWER_STATUS_OPTIONS)
        ]);
  
        // Debug logging to see the actual response structure
        console.log('Remarks Response:', remarksResponse.data);
        console.log('Unit Status Response:', unitStatusResponse.data);
        console.log('Borrower Status Response:', borrowerStatusResponse.data);
  
        // Try different possible data structures
        const remarksData = remarksResponse.data.data || remarksResponse.data || [];
        const unitStatusData = unitStatusResponse.data.data || unitStatusResponse.data || [];
        const borrowerStatusData = borrowerStatusResponse.data.data || borrowerStatusResponse.data || [];
  
        console.log('Processed Remarks Data:', remarksData);
        console.log('Processed Unit Status Data:', unitStatusData);
        console.log('Processed Borrower Status Data:', borrowerStatusData);
  
        setRemarkOptions(remarksData);
        setUnitStatusOptions(unitStatusData);
        setBorrowerStatusOptions(borrowerStatusData);
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
        setErrorMessage('Failed to load dropdown options. Please try again.');
        setShowErrorPopup(true);
      }
    };

    if (!isOpen || !record) return null;
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setEditedRecord(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Submit clicked', editedRecord); // Debug log
      
      if (!editedRecord.main_remarkid) {
        setErrorMessage('Please select a remark before submitting.');
        setShowErrorPopup(true);
        return;
      }
  
      setIsSubmitting(true);
      
      try {
        const postData = {
          updated_by: userId,
          pn_number: record.pn_number,
          refno: record.refno,
          main_remarkid: parseInt(editedRecord.main_remarkid),
          sub_status_borrowerid: editedRecord.sub_status_borrowerid ? parseInt(editedRecord.sub_status_borrowerid) : null,
          sub_status_unitid: editedRecord.sub_status_unitid ? parseInt(editedRecord.sub_status_unitid) : null,
          additional_remarks: editedRecord.additional_remarks || '',
          requested_visit: editedRecord.requested_visit || false,
          status:true
        };
  
        console.log('Sending data to API:', postData); // Debug log
  
        const response = await axiosInstance.post(API_ENDPOINTS.TELE_ASSIGN_STATUS_TO_RECORD, postData);
        console.log('API Response:', response); // Debug log
        
        if (response.status === 200) {
          setShowSuccessPopup(true);
          setTimeout(() => {
            onEdit(editedRecord); // Notify parent to refresh data
            onClose();
            setShowSuccessPopup(false);
          }, 2000);
        }
      } catch (error) {
        console.error('Error submitting case update:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to update case. Please try again.';
        console.log('Error details:', errorMsg); // Debug log
        setErrorMessage(errorMsg);
        setShowErrorPopup(true);
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <TableModal 
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <TableModalContent 
          isDarkMode={isDarkMode}
          className="w-[700px] max-h-[85vh] overflow-hidden bg-[#1A1A1A] rounded-2xl shadow-2xl border border-gray-700/50"
        >
          {/* Header */}
          <div className="modal-header px-6 py-5 border-b border-gray-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500/20 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Manage Case</h3>
                <p className="text-sm text-gray-400">Update case details and assign actions</p>
              </div>
            </div>
          </div>
  
          {/* Body */}
          <div className="modal-body px-6 py-6 max-h-[calc(85vh-140px)] overflow-y-auto">
            <ModalForm isDarkMode={isDarkMode} onSubmit={handleSubmit}>
              {/* Case Details Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-medium text-white">Case Details</h4>
                </div>
  
                <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1F1F1F] rounded-xl p-4 space-y-4 border border-gray-600/20 shadow-xl">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h5 className="text-sm font-semibold text-white">Basic Information</h5>
                      <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#1A1A1A] rounded-lg p-2.5 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-200 group">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-blue-300 transition-colors"></div>
                          <p className="text-xs font-medium text-blue-400 uppercase tracking-wide">PN Number</p>
                        </div>
                        <p className="text-sm text-white font-medium pl-3">{record.pn_number}</p>
                      </div>
                      <div className="bg-[#1A1A1A] rounded-lg p-2.5 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-200 group">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full group-hover:bg-purple-300 transition-colors"></div>
                          <p className="text-xs font-medium text-purple-400 uppercase tracking-wide">Reference Number</p>
                        </div>
                        <p className="text-sm text-white font-medium pl-3">{record.refno}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#1A1A1A] rounded-lg p-2.5 border border-gray-700/50 hover:border-green-500/30 transition-all duration-200 group">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full group-hover:bg-green-300 transition-colors"></div>
                        <p className="text-xs font-medium text-green-400 uppercase tracking-wide">Borrower Name</p>
                      </div>
                      <p className="text-sm text-white font-medium pl-3">{record.borrower_name}</p>
                    </div>
                    
                                      <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#1A1A1A] rounded-lg p-2.5 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-200 group">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover:bg-cyan-300 transition-colors"></div>
                          <p className="text-xs font-medium text-cyan-400 uppercase tracking-wide">Contact Number</p>
                        </div>
                        <p className="text-sm text-white font-medium pl-3">{record.contact_no || 'N/A'}</p>
                      </div>
                      <div className="bg-[#1A1A1A] rounded-lg p-2.5 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-200 group">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full group-hover:bg-indigo-300 transition-colors"></div>
                          <p className="text-xs font-medium text-indigo-400 uppercase tracking-wide">Loan Type</p>
                        </div>
                        <p className="text-sm text-white font-medium pl-3">{record.loan_type || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#1A1A1A] rounded-lg p-2.5 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-200 group">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full group-hover:bg-yellow-300 transition-colors"></div>
                        <p className="text-xs font-medium text-yellow-400 uppercase tracking-wide">Address</p>
                      </div>
                      <p className="text-sm text-white font-medium pl-3">{record.address || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h5 className="text-sm font-semibold text-white">Financial Information</h5>
                      <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-lg p-3 border border-red-500/30 shadow-lg hover:shadow-red-500/20 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex items-center justify-center w-5 h-5 bg-red-500/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-red-300 uppercase tracking-wide">Overdue Amount</p>
                        </div>
                        <p className="text-base font-bold text-red-400 tracking-tight">{formatCurrency(record.overdue)}</p>
                        <div className="mt-1 text-xs text-red-400/70">Past due balance</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 rounded-lg p-4 border border-amber-500/30 shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-amber-500/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-amber-300 uppercase tracking-wide">Outstanding Balance</p>
                        </div>
                        <p className="text-lg font-bold text-amber-400 tracking-tight">{formatCurrency(record.balance)}</p>
                        <div className="mt-1 text-xs text-amber-400/70">Total remaining</div>
                      </div>
                    </div>
                    
                    {record.prinicipal && (
                      <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg p-4 border border-blue-500/30 shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-500/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-blue-300 uppercase tracking-wide">Principal Amount</p>
                        </div>
                        <p className="text-lg font-bold text-blue-400 tracking-tight">{formatCurrency(record.prinicipal)}</p>
                        <div className="mt-1 text-xs text-blue-400/70">Original loan amount</div>
                      </div>
                    )}
                  </div>

                  {/* Assignment Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h5 className="text-sm font-semibold text-white">Assignment Information</h5>
                      <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 rounded-lg p-4 border border-blue-500/20 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-300 uppercase tracking-wide mb-1">Telecollector</p>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                              <span className="text-xs text-blue-400/80">Phone Support</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-base font-semibold text-white tracking-tight">{record.telecollector || 'Not Assigned'}</p>
                        {!record.telecollector && <p className="text-xs text-gray-400 mt-1">Awaiting assignment</p>}
                      </div>
                      
                      <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 rounded-lg p-4 border border-emerald-500/20 shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-emerald-300 uppercase tracking-wide mb-1">Field Collector</p>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                              <span className="text-xs text-emerald-400/80">Field Visits</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-base font-semibold text-white tracking-tight">{record.field_collector || 'Not Assigned'}</p>
                        {!record.field_collector && <p className="text-xs text-gray-400 mt-1">Awaiting assignment</p>}
                      </div>
                    </div>
                  </div>

                  {/* Current Status Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h5 className="text-sm font-semibold text-white">Current Status</h5>
                      <div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/20 rounded-lg p-4 border border-slate-600/30 shadow-lg hover:shadow-slate-500/10 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-slate-600/30 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-slate-300 uppercase tracking-wide">Current Remark</p>
                        </div>
                        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/30 px-3 py-2 rounded-lg border border-slate-500/20">
                          <p className="text-sm font-medium text-white">{record.remark_name || 'No Remark'}</p>
                        </div>
                      </div>
                      
                      <div className={`rounded-lg p-4 border shadow-lg transition-all duration-300 ${
                        record.requested_visit 
                          ? 'bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30 hover:shadow-green-500/10' 
                          : 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-500/30 hover:shadow-red-500/10'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`flex items-center justify-center w-6 h-6 rounded-lg ${
                            record.requested_visit ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            {record.requested_visit ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                          <p className={`text-xs font-medium uppercase tracking-wide ${
                            record.requested_visit ? 'text-green-300' : 'text-red-300'
                          }`}>Visit Requested</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${
                            record.requested_visit ? 'bg-green-400' : 'bg-red-400'
                          }`}></div>
                          <p className={`text-base font-bold tracking-tight ${
                            record.requested_visit ? 'text-green-400' : 'text-red-400'
                          }`}>{record.requested_visit ? 'YES' : 'NO'}</p>
                        </div>
                      </div>
                    </div>
                    
                                      <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-lg p-4 border border-purple-500/30 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-purple-500/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-purple-300 uppercase tracking-wide">Borrower Status</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-600/20 to-purple-500/10 px-3 py-2 rounded-lg border border-purple-400/20">
                          <p className="text-sm font-medium text-purple-200">{record.sub_status_name_borrower || 'No Status'}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-sky-900/30 to-sky-800/20 rounded-lg p-4 border border-sky-500/30 shadow-lg hover:shadow-sky-500/10 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-sky-500/20 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <p className="text-xs font-medium text-sky-300 uppercase tracking-wide">Unit Status</p>
                        </div>
                        <div className="bg-gradient-to-r from-sky-600/20 to-sky-500/10 px-3 py-2 rounded-lg border border-sky-400/20">
                          <p className="text-sm font-medium text-sky-200">{record.sub_status_name_unit || 'No Status'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timestamp Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h5 className="text-sm font-semibold text-white">Timeline</h5>
                      <div className="flex-1 h-px bg-gradient-to-r from-rose-500/50 to-transparent"></div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 rounded-lg p-4 border border-gray-600/30 shadow-lg hover:shadow-gray-500/10 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                    </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-orange-300 uppercase tracking-wide mb-1">Last Updated</p>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-orange-400/80">Record timestamp</span>
                    </div>
                  </div>
                  </div>
                      <div className="bg-gradient-to-r from-orange-900/30 to-orange-800/20 px-3 py-2 rounded-lg border border-orange-500/20">
                        <p className="text-sm font-medium text-orange-200 tracking-tight">{formatDate(record.date_updated)}</p>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Case Management Section */}
              <div className="case-management">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-medium text-white">Case Management</h4>
                </div>
                
                <div className="space-y-10">
                  {/* Remarks Dropdown */}
                  <div className="form-group space-y-10">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      Set Remark
                      <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="main_remarkid"
                      value={editedRecord.main_remarkid}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200 hover:border-gray-600"
                      style={{
                        backgroundColor: '#1A1A1A',
                        color: 'white',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                    >
                      <option value="" style={{ backgroundColor: '#1A1A1A', color: 'white' }}>Select a remark</option>
                      {remarkOptions.map(option => (
                        <option 
                          key={option.remarkid} 
                          value={option.remarkid} 
                          style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                        >
                          {option.remark_name}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  {/* Unit Status Dropdown */}
                  <div className="form-group space-y-10">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Unit Status
                    </label>
                    <select
                      name="sub_status_unitid"
                      value={editedRecord.sub_status_unitid}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200 hover:border-gray-600"
                      style={{
                        backgroundColor: '#1A1A1A',
                        color: 'white',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                    >
                      <option value="" style={{ backgroundColor: '#1A1A1A', color: 'white' }}>Select unit status</option>
                      {unitStatusOptions.map(option => (
                        <option 
                          key={option.autoid} 
                          value={option.autoid} 
                          style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                        >
                          {option.sub_status_name_unit}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  {/* Borrower Status Dropdown */}
                  <div className="form-group space-y-10">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Borrower Status
                    </label>
                    <select
                      name="sub_status_borrowerid"
                      value={editedRecord.sub_status_borrowerid}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg text-sm text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200 hover:border-gray-600"
                      style={{
                        backgroundColor: '#1A1A1A',
                        color: 'white',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      }}
                    >
                      <option value="" style={{ backgroundColor: '#1A1A1A', color: 'white' }}>Select borrower status</option>
                      {borrowerStatusOptions.map(option => (
                        <option 
                          key={option.autoid} 
                          value={option.autoid} 
                          style={{ backgroundColor: '#1A1A1A', color: 'white' }}
                        >
                          {option.sub_status_name_borrower}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  {/* Additional Remarks Text Field */}
                  <div className="form-group mt-8 space-y-10">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Additional Remarks
                      <span className="text-gray-500 text-xs ml-1">(optional)</span>
                    </label>
                    <textarea
                      name="additional_remarks"
                      value={editedRecord.additional_remarks}
                      onChange={handleChange}
                      placeholder="Enter any additional comments or notes..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-200 hover:border-gray-600 resize-none"
                      style={{ backgroundColor: '#1A1A1A' }}
                    />
                  </div>
  
                  {/* Request Visitation Checkbox */}
                  <div className="form-group mt-8 space-y-10">
                    <div className="flex items-start gap-4 p-4 bg-[#1A1A1A] rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200">
                      <input
                        type="checkbox"
                        name="requested_visit"
                        checked={editedRecord.requested_visit}
                        onChange={handleChange}
                        className="w-5 h-5 mt-0.5 bg-[#1A1A1A] border-2 border-gray-700 rounded text-orange-500 focus:ring-orange-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1A1A1A] transition-all duration-200"
                      />
                      <div className="flex-1">
                        <label className="flex items-center gap-2 text-sm font-medium text-white cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Request for Field Visitation
                        </label>
                        <p className="text-xs text-gray-400 mt-1">Check this to request a field collector to visit this location</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ModalForm>
          </div>
  
          {/* Footer */}
          <div className="modal-footer border-t border-gray-700/50 px-6 py-4 bg-[#1A1A1A]">
            <div className="flex justify-end gap-4">
              <button 
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </TableModalContent>
  
        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] border border-gray-700 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-90 duration-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Success!</h3>
                  <p className="text-sm text-gray-400">Case has been updated successfully</p>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        )}
  
        {/* Error Popup */}
        {showErrorPopup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1A1A1A] border border-gray-700 rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-90 duration-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Error</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowErrorPopup(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </TableModal>
    );
  };
  