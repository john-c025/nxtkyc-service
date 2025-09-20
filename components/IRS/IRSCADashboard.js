"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ManageCaseModal from '../Objects/ManageCaseModal';
import NavPane from '../Objects/NavPane';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import NotificationButton from '../Objects/NotificationButton';
import axiosInstance from '../backend/axiosInstance';
import { FaFileAlt, FaUserShield, FaCog, FaArrowUp, FaArrowDown, FaEdit, FaFilter, FaEye, FaDownload, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { API_ENDPOINTS } from '../backend/apiHelper';
import Bot from '../Objects/Bot';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

// Add export utilities
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import {
  DashboardContainer,
  MainContent,
  Sidebar,
  Card,
  TopBar,
  StatusBadge,
  ThemeToggle,
  StatsContainer,
  StatCard,
  SpinnerOverlay,
  Spinner,
  ReportsTableContainer,
  ReportsTable,
  SearchInput,
  PaginationControls,
  ErrorMessage,
  TabContainer,
  TabList,
  TabButton,
  TableModal,
  TableModalContent,
  ActionButton,
  ModalForm,
  ModalFooter
} from './IRSCADashboardStyled';

// Daily Report Details Modal Component
const DailyReportDetailsModal = ({ isOpen, onClose, report, isDarkMode }) => {
  if (!isOpen || !report) return null;

  const formatCurrency = (amount) => {
    return amount ? `₱${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₱0.00';
  };

  const formatPercentage = (percentage) => {
    return percentage ? `${parseFloat(percentage).toFixed(2)}%` : '0.00%';
  };

  const detailSections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Report ID", value: report.autoid || '-' },
        { label: "Report Date", value: report.report_date ? new Date(report.report_date).toLocaleDateString() : '-' },
        { label: "Telecollector ID", value: report.telecollectorid || '-' },
        { label: "Telecollector Name", value: report.tele_name || '-' },
        { label: "Branch", value: report.branch || '-' },
        { label: "Account Type", value: report.handle_acct || '-' }
      ]
    },
    {
      title: "Collection Data",
      fields: [
        { label: "Collection Amount", value: formatCurrency(report.collection_for_the_day_amount) },
        { label: "Collection Count", value: report.collection_for_the_day_count || '0' },
        { label: "Principal Amount", value: formatCurrency(report.principal_amount) },
        { label: "Penalty Amount", value: formatCurrency(report.penalty_amount) },
        { label: "Penalty Percentage", value: formatPercentage(report.penalty_percentage) }
      ]
    },
    {
      title: "Forecast & Tracking",
      fields: [
        { label: "Forecast Amount", value: formatCurrency(report.forecast_amount) },
        { label: "Forecast Count", value: report.forecast_count || '0' },
        { label: "On Track Figures Amount", value: formatCurrency(report.on_track_figures_amount) },
        { label: "On Track Figures Percentage", value: formatPercentage(report.on_track_figures_percentage) },
        { label: "Collectibles Amount", value: formatCurrency(report.collectibles_amount) },
        { label: "Collectibles Count", value: report.collectibles_count || '0' }
      ]
    },
    {
      title: "Running Collection Data",
      fields: [
        { label: "Actual Running Collection Amount", value: formatCurrency(report.actual_running_collx_amount) },
        { label: "Actual Running Collection Percentage", value: formatPercentage(report.actual_running_collx_percentage) },
        { label: "Actual Running Principal Amount", value: formatCurrency(report.actual_running_principal_amount) },
        { label: "Actual Running Principal Percentage", value: formatPercentage(report.actual_running_principal_percentage) },
        { label: "Actual Running Penalty Amount", value: formatCurrency(report.actual_running_penalty_amount) },
        { label: "Actual Running Penalty Percentage", value: formatPercentage(report.actual_running_penalty_percentage) },
        { label: "Var OTF Amount", value: formatCurrency(report.var_otf_amount) }
      ]
    },
    {
      title: "Second Month Data",
      fields: [
        { label: "On Track Figures 2nd Month Amount", value: formatCurrency(report.on_track_figures_2ndmon_amount) },
        { label: "On Track Figures 2nd Month Percentage", value: formatPercentage(report.on_track_figures_2ndmon_percentage) },
        { label: "Second Month Provision Amount", value: formatCurrency(report.second_mon_provision_amount) },
        { label: "Second Month Provision Count", value: report.second_mon_provision_count || '0' },
        { label: "Second Month Fixed for Day Amount", value: formatCurrency(report.second_mon_fixed_for_the_day_amount) },
        { label: "Second Month Fixed for Day Count", value: report.second_mon_fixed_for_the_day_count || '0' },
        { label: "Second Month Running Fixed Amount", value: formatCurrency(report.second_mon_running_fixed_amount) },
        { label: "Second Month Running Fixed Count", value: report.second_mon_running_fixed_count || '0' },
        { label: "Second Month Variance Amount", value: formatCurrency(report.second_mon_variance_amount) },
        { label: "Second Month Variance Count", value: report.second_mon_variance_count || '0' },
        { label: "Var OTF 2nd Month Amount", value: formatCurrency(report.var_otf_2ndmon_amount) }
      ]
    }
  ];

  return (
    <TableModal 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <TableModalContent 
        isDarkMode={isDarkMode}
        className="w-[1200px] max-h-[90vh] overflow-hidden bg-[#1A1A1A] rounded-2xl shadow-2xl border border-gray-700/50"
      >
        {/* Header */}
        <div className="modal-header px-6 py-5 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Daily Report Details</h3>
                <p className="text-sm text-gray-400">Complete report information for {report.tele_name || 'Unknown Telecollector'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body overflow-auto p-6" style={{ maxHeight: 'calc(90vh - 160px)' }}>
          <div className="space-y-8">
            {detailSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
                <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  {section.title}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/20">
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                        {field.label}
                      </div>
                      <div className={`text-sm font-semibold ${
                        field.label.toLowerCase().includes('amount') && field.value !== '₱0.00' 
                          ? 'text-green-400' 
                          : field.label.toLowerCase().includes('percentage') && field.value !== '0.00%'
                          ? 'text-blue-400'
                          : 'text-gray-200'
                      }`}>
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer px-6 py-4 border-t border-gray-700/50 bg-gray-800/20">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </TableModalContent>
    </TableModal>
  );
};

DailyReportDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  report: PropTypes.object,
  isDarkMode: PropTypes.bool.isRequired
};

// Collector Area Assignment Modal Component
const CollectorAreaAssignmentModal = ({ isOpen, onClose, assignment, isDarkMode, onSave,companyId }) => {
  if (!isOpen || !assignment) return null;

  const [assignmentMode, setAssignmentMode] = useState('single'); // 'single', 'main-area', 'sub-area'
  const [formData, setFormData] = useState({
    telecollector: assignment.telecollector || '',
    field_collector: assignment.field_collector || '',
    spec_areaid: assignment.spec_areaid || '',
    sub_areadesc: assignment.sub_areadesc || '',
    main_areadesc: assignment.main_areadesc || '',
    main_areaid: assignment.main_areaid || '',
    sub_areaid: assignment.sub_areaid || ''
  });

  const [telecollectors, setTelecollectors] = useState([]);
  const [fieldCollectors, setFieldCollectors] = useState([]);
  const [specAreas, setSpecAreas] = useState([]);
  const [mainAreas, setMainAreas] = useState([]);
  const [subAreas, setSubAreas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen && assignment) {
      fetchDropdownOptions();
      setFormData({
        telecollector: assignment.telecollector || '',
        field_collector: assignment.field_collector || '',
        spec_areaid: assignment.spec_areaid || '',
        sub_areadesc: assignment.sub_areadesc || '',
        main_areadesc: assignment.main_areadesc || '',
        main_areaid: assignment.main_areaid || '',
        sub_areaid: assignment.sub_areaid || ''
      });
    }
  }, [isOpen, assignment]);

  const fetchDropdownOptions = async () => {
    try {
      const [telecollectorsResponse, fieldCollectorsResponse, areasResponse] = await Promise.all([
        // Get telecollectors (collectorType=6)
        axiosInstance.get(`${API_ENDPOINTS.COLLECTION_GET_EMPLOYEE_POSITIONS}?collectorType=6&page=1&pageSize=100&mainCompanyId=${companyId.toString()}`),
        // Get field collectors (collectorType=5)
        axiosInstance.get(`${API_ENDPOINTS.COLLECTION_GET_EMPLOYEE_POSITIONS}?collectorType=5&page=1&pageSize=100&mainCompanyId=${companyId.toString()}`),
        axiosInstance.get(API_ENDPOINTS.LOAD_ALL_AREAS)
      ]);

      setTelecollectors(telecollectorsResponse.data.data || []);
      setFieldCollectors(fieldCollectorsResponse.data.data || []);
      
      // Process areas to separate main, sub, and specific areas
      const areasData = areasResponse.data.data || [];
      const mainAreasMap = new Map();
      const subAreasMap = new Map();
      
      areasData.forEach(area => {
        if (area.main_areaid && area.main_areadesc) {
          mainAreasMap.set(area.main_areaid, {
            main_areaid: area.main_areaid,
            main_areadesc: area.main_areadesc
          });
        }
        if (area.sub_areaid && area.sub_areadesc) {
          subAreasMap.set(area.sub_areaid, {
            sub_areaid: area.sub_areaid,
            sub_areadesc: area.sub_areadesc,
            main_areaid: area.main_areaid
          });
        }
      });
      
      setMainAreas(Array.from(mainAreasMap.values()));
      setSubAreas(Array.from(subAreasMap.values()));
      setSpecAreas(areasData);
    } catch (error) {
      console.error('Error fetching dropdown options:', error);
      console.log('Error with API call:', error);
      setErrorMessage('Failed to load dropdown options. Please try again.');
      setShowErrorPopup(true);
    }
  };

  const handleModeChange = (mode) => {
    setAssignmentMode(mode);
    // Reset area-related fields when switching modes
    setFormData(prev => ({
      ...prev,
      spec_areaid: '',
      sub_areaid: '',
      main_areaid: '',
      sub_areadesc: '',
      main_areadesc: ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'spec_areaid') {
      const selectedArea = specAreas.find(area => area.spec_areaid.toString() === value);
      if (selectedArea) {
        setFormData(prev => ({
          ...prev,
          spec_areaid: value,
          sub_areadesc: selectedArea.sub_areadesc,
          main_areadesc: selectedArea.main_areadesc,
          sub_areaid: selectedArea.sub_areaid,
          main_areaid: selectedArea.main_areaid
        }));
      }
    } else if (name === 'sub_areaid') {
      const selectedSubArea = subAreas.find(area => area.sub_areaid.toString() === value);
      if (selectedSubArea) {
        setFormData(prev => ({
          ...prev,
          sub_areaid: value,
          sub_areadesc: selectedSubArea.sub_areadesc,
          main_areadesc: mainAreas.find(main => main.main_areaid === selectedSubArea.main_areaid)?.main_areadesc || '',
          main_areaid: selectedSubArea.main_areaid
        }));
      }
    } else if (name === 'main_areaid') {
      const selectedMainArea = mainAreas.find(area => area.main_areaid.toString() === value);
      if (selectedMainArea) {
        setFormData(prev => ({
          ...prev,
          main_areaid: value,
          main_areadesc: selectedMainArea.main_areadesc
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate that at least one collector is selected
    if (!formData.telecollector && !formData.field_collector) {
      setErrorMessage('Please select at least one collector (telecollector or field collector).');
      setShowErrorPopup(true);
      setIsSubmitting(false);
      return;
    }

    try {
      let requestBody;
      let apiEndpoint;

      // Prepare request body based on assignment mode
      switch (assignmentMode) {
        case 'single':
          // Single area assignment
          requestBody = {
            autoid: parseInt(assignment.autoid),
            fieldcollectorid: formData.field_collector || null,
            telecollectorid: formData.telecollector || null,
            CompanyId: companyId || null
          };
          apiEndpoint = API_ENDPOINTS.COLLECTION_SYSTEM_BIND_COLLECTOR;
          break;
          
        case 'main-area':
          // Bulk assignment by main area
          if (!formData.main_areaid) {
            setErrorMessage('Please select a main area for bulk assignment.');
            setShowErrorPopup(true);
            setIsSubmitting(false);
            return;
          }
          requestBody = {
            mainareaid: formData.main_areaid,
            fieldcollectorid: formData.field_collector || null,
            telecollectorid: formData.telecollector || null,
            CompanyId: companyId || null
          };
          apiEndpoint = API_ENDPOINTS.COLLECTION_BULK_ASSIGN_BY_MAIN_AREA;
          break;
          
        case 'sub-area':
          // Bulk assignment by sub area
          if (!formData.sub_areaid) {
            setErrorMessage('Please select a sub area for bulk assignment.');
            setShowErrorPopup(true);
            setIsSubmitting(false);
            return;
          }
          requestBody = {
            subareaid: formData.sub_areaid,
            fieldcollectorid: formData.field_collector || null,
            telecollectorid: formData.telecollector || null,
            CompanyId: companyId || null

          };
          apiEndpoint = API_ENDPOINTS.COLLECTION_BULK_ASSIGN_BY_SUB_AREA;
          break;
          
        default:
          setErrorMessage('Invalid assignment mode selected.');
          setShowErrorPopup(true);
          setIsSubmitting(false);
          return;
      }

      console.log('Sending assignment request:', requestBody);
      console.log('API Endpoint:', apiEndpoint);
      console.log('Assignment Mode:', assignmentMode);

      const response = await axiosInstance.post(apiEndpoint, requestBody);
      
      console.log('Assignment response:', response.data);

      if (response.status === 200) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          onSave(formData);
          onClose();
          setShowSuccessPopup(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      // Try to get more specific error message from API response
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update assignment. Please try again.';
      setErrorMessage(errorMsg);
      setShowErrorPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TableModal onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <TableModalContent isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h3>
            {assignmentMode === 'single' && 'Assign Collectors to Specific Area'}
            {assignmentMode === 'main-area' && 'Bulk Assign Collectors by Main Area'}
            {assignmentMode === 'sub-area' && 'Bulk Assign Collectors by Sub Area'}
          </h3>
          <button className="close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Assignment Mode Selection Tabs */}
          <div className="mb-5">
            <div className="flex gap-3 p-3 bg-gray-800/40 rounded-xl  mx-2">
              <button
                type="button"
                onClick={() => handleModeChange('single')}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex-1 ${
                  assignmentMode === 'single'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-700/70 text-white hover:text-white hover:bg-gray-600/70 border border-gray-600/50'
                }`}
              >
                Single Area Assignment
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('main-area')}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex-1 ${
                  assignmentMode === 'main-area'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-700/70 text-white hover:text-white hover:bg-gray-600/70 border border-gray-600/50'
                }`}
              >
                Bulk by Main Area
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('sub-area')}
                className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex-1 ${
                  assignmentMode === 'sub-area'
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-700/70 text-white hover:text-white hover:bg-gray-600/70 border border-gray-600/50'
                }`}
              >
                Bulk by Sub Area
              </button>
            </div>
          </div>

          <ModalForm isDarkMode={isDarkMode} onSubmit={handleSubmit}>
            {/* Collector Selection - Always visible */}
            <div className="form-group">
              <label>Telecollector <span className="text-gray-500 text-xs">(optional)</span></label>
              <select
                name="telecollector"
                value={formData.telecollector}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                style={{
                  backgroundColor: '#1f2937',
                  color: 'white'
                }}
              >
                <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select Telecollector</option>
                {telecollectors.map(collector => (
                  <option key={collector.userid} value={collector.userid} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                    {collector.fname} {collector.mname} {collector.sname}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Field Collector <span className="text-gray-500 text-xs">(optional)</span></label>
              <select
                name="field_collector"
                value={formData.field_collector}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                style={{
                  backgroundColor: '#1f2937',
                  color: 'white'
                }}
              >
                <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select Field Collector</option>
                {fieldCollectors.map(collector => (
                  <option key={collector.userid} value={collector.userid} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                    {collector.fname} {collector.mname} {collector.sname}
                  </option>
                ))}
              </select>
            </div>

            {/* Area Selection - Conditional based on mode */}
            {assignmentMode === 'single' && (
              <>
                <div className="form-group">
                  <label>Specific Area <span className="text-red-500">*</span></label>
                  <select
                    name="spec_areaid"
                    value={formData.spec_areaid}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    style={{
                      backgroundColor: '#1f2937',
                      color: 'white'
                    }}
                  >
                    <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select Specific Area</option>
                    {specAreas.map(area => (
                      <option key={area.spec_areaid} value={area.spec_areaid} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                        {area.spec_areadesc} - {area.sub_areadesc} ({area.main_areadesc})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Main Area</label>
                    <input
                      type="text"
                      value={formData.main_areadesc}
                      readOnly
                      placeholder="Auto-filled based on specific area"
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 text-white rounded-lg"
                      style={{
                        backgroundColor: '#1f2937',
                        color: 'white'
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Sub Area</label>
                    <input
                      type="text"
                      value={formData.sub_areadesc}
                      readOnly
                      placeholder="Auto-filled based on specific area"
                      className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 text-white rounded-lg"
                      style={{
                        backgroundColor: '#1f2937',
                        color: 'white'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {assignmentMode === 'main-area' && (
              <div className="form-group">
                <label>Main Area <span className="text-red-500">*</span></label>
                <select
                  name="main_areaid"
                  value={formData.main_areaid}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  style={{
                    backgroundColor: '#1f2937',
                    color: 'white'
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select Main Area</option>
                  {mainAreas.map(area => (
                    <option key={area.main_areaid} value={area.main_areaid} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                      {area.main_areadesc}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This will assign collectors to all sub-areas and specific areas under the selected main area.
                </p>
              </div>
            )}

            {assignmentMode === 'sub-area' && (
              <div className="form-group">
                <label>Sub Area <span className="text-red-500">*</span></label>
                <select
                  name="sub_areaid"
                  value={formData.sub_areaid}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  style={{
                    backgroundColor: '#1f2937',
                    color: 'white'
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select Sub Area</option>
                  {subAreas.map(area => (
                    <option key={area.sub_areaid} value={area.sub_areaid} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                      {area.sub_areadesc} ({area.main_areadesc})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  This will assign collectors to all specific areas under the selected sub area.
                </p>
                <div className="form-group mt-3">
                  <label>Main Area</label>
                  <input
                    type="text"
                    value={formData.main_areadesc}
                    readOnly
                    placeholder="Auto-filled based on sub area"
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-600 text-white rounded-lg"
                    style={{
                      backgroundColor: '#1f2937',
                      color: 'white'
                    }}
                  />
                </div>
              </div>
            )}
          </ModalForm>
        </div>

        <ModalFooter isDarkMode={isDarkMode}>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gray-700/50 hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
              'Save Assignment'
            )}
          </button>
        </ModalFooter>

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
                  <p className="text-sm text-gray-400">
                    {assignmentMode === 'single' && 'Collectors assigned to specific area successfully'}
                    {assignmentMode === 'main-area' && 'Collectors bulk assigned to main area successfully'}
                    {assignmentMode === 'sub-area' && 'Collectors bulk assigned to sub area successfully'}
                  </p>
                </div>
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
      </TableModalContent>
    </TableModal>
  );
};

const IRSCADashboard = () => {
  const [activeNav, setActiveNav] = useState('irs-menu');
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);
  const [masterlistData, setMasterlistData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('records'); // 'records' or 'bindings'
  const [companyId, setCompanyId] = useState('');
  // Area assignment states
  const [collectorAssignments, setCollectorAssignments] = useState([]);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignmentCurrentPage, setAssignmentCurrentPage] = useState(1);
  const [assignmentTotalPages, setAssignmentTotalPages] = useState(1);
  const [assignmentTotalRecords, setAssignmentTotalRecords] = useState(0);
  const [assignmentSearchTerm, setAssignmentSearchTerm] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filter and UI states
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [nameFilter, setNameFilter] = useState('');
  const [collectorFilter, setCollectorFilter] = useState('');
  const [visitFilter, setVisitFilter] = useState('all');
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState('all');
  const [assignmentCollectorFilter, setAssignmentCollectorFilter] = useState('');
  
  // Column visibility states for records
  const [visibleRecordColumns, setVisibleRecordColumns] = useState({
    pnNumber: true,
    refno: true,
    borrowerName: true,
    telecollector: true,
    fieldCollector: true,
    loanType: true,
    remark: true,
    status: true,
    visitRequested: true,
    actions: true
  });
  
  // Column visibility states for assignments
  const [visibleAssignmentColumns, setVisibleAssignmentColumns] = useState({
    telecollector: true,
    fieldCollector: true,
    specificArea: true,
    subArea: true,
    mainArea: true,
    actions: true
  });
  
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // Activity data states
  const [activityData, setActivityData] = useState([]);
  const [activityTotalRecords, setActivityTotalRecords] = useState(0);
  const [activityCurrentPage, setActivityCurrentPage] = useState(1);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  
  // Activity filters
  const [activityShowFilters, setActivityShowFilters] = useState(false);
  const [activityActionFilter, setActivityActionFilter] = useState('all');
  const [activityCollectorFilter, setActivityCollectorFilter] = useState('');
  const [activityDateFilter, setActivityDateFilter] = useState('');
  
  // Daily Reports states
  const [dailyReportsData, setDailyReportsData] = useState([]);
  const [dailyReportsTotalRecords, setDailyReportsTotalRecords] = useState(0);
  const [dailyReportsCurrentPage, setDailyReportsCurrentPage] = useState(1);
  const [dailyReportsTotalPages, setDailyReportsTotalPages] = useState(1);
  const [dailyReportsSearchTerm, setDailyReportsSearchTerm] = useState('');
  const [selectedDailyReport, setSelectedDailyReport] = useState(null);
  const [isDailyReportDetailModalOpen, setIsDailyReportDetailModalOpen] = useState(false);

  // Daily Reports filters
  const [dailyReportsShowFilters, setDailyReportsShowFilters] = useState(false);
  const [dailyReportsBranchFilter, setDailyReportsBranchFilter] = useState('');
  const [dailyReportsDateFilter, setDailyReportsDateFilter] = useState('');
  const [dailyReportsAcctTypeFilter, setDailyReportsAcctTypeFilter] = useState('all');

  // Daily Reports column visibility
  const [visibleDailyReportsColumns, setVisibleDailyReportsColumns] = useState({
    autoid: true,
    reportDate: true,
    teleName: true,
    branch: true,
    handleAcct: true,
    collectionForTheDayAmount: true,
    actions: true
  });

  // Activity column visibility
  const [visibleActivityColumns, setVisibleActivityColumns] = useState({
    activityId: true,
    refno: true,
    pnNumber: true,
    actionKey: true,
    description: true,
    collectorName: true,
    collectorType: true,
    amount: true,
    dateUpdated: true,
    telecollector: true,
    remarks: true
  });

  const [showActivityColumnSettings, setShowActivityColumnSettings] = useState(false);

  const stats = [
    {
      label: 'Total Records',
      value: totalRecords.toString(),
      change: '+6%',
      isPositive: true
    },
    {
      label: 'Assigned Records',
      value: '75%',
      change: '+5%',
      isPositive: true
    },
    {
      label: 'Processing Time',
      value: '0.3 ms',
      change: '-0.1s',
      isPositive: true
    }
  ];

  const getAnimationDelay = (index) => `${index * 0.1}s`;

  const handleEditRecord = async (record) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.TELE_ASSIGN_STATUS_TO_RECORD,
        record
      );
      
      if (response.status === 200) {
        // Refresh the table data after successful update
        await fetchMasterlistData();
        setIsEditModalOpen(false); // Close the modal after successful update
        setError(null);
      }
    } catch (error) {
      console.error('Error updating record:', error);
      setError('Failed to update the record.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.TELE_GET_RECORDS_BY_TELECOLLECTOR}?page=${newPage}&pageSize=${pageSize}`
      );

      if (response.status === 200) {
        setMasterlistData(response.data.data || []);
        setCurrentPage(newPage);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      setError('Failed to fetch records. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignmentPageChange = async (newPage) => {
    try {
      console.log('🔄 handleAssignmentPageChange called with page:', newPage);
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.CA_GET_AREA_COLLECTOR_ASSIGNMENTS}?page=${newPage}&pageSize=${pageSize}&companyid=${companyId}`
      );

      if (response.status === 200) {
        console.log('📄 Pagination Response:', {
          count: response.data.totalRecords,
          totalPages: response.data.totalPages,
          calculatedPages: Math.ceil(response.data.totalRecords / pageSize),
          newPage
        });
        
        setCollectorAssignments(response.data.data || []);
        setAssignmentCurrentPage(newPage);
        // Don't recalculate total pages here - keep original
        // setAssignmentTotalPages(response.data.totalPages || Math.ceil(response.data.totalRecords / pageSize));
        // setAssignmentTotalRecords(response.data.totalRecords || 0);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError('Failed to fetch assignments. Please try again.');
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
          
          // Fetch user details FIRST
          const userResponse = await axiosInstance.get(`${API_ENDPOINTS.USER_DETAILS}?userId=${decoded.UserId}`);
          setUserDetails(userResponse.data.data);
          setCompanyId(userResponse.data.mainCompanyId);
          
          // Then fetch masterlist data
          await fetchMasterlistData();
        }
      } catch (error) {
        console.error('Error in initialization:', error);
        setError('Failed to initialize the page.');
      }
    };

    getUserFromToken();
  }, []);

  // Add this useEffect to handle initial data loading for all tabs
  useEffect(() => {
    if (companyId) {
      if (activeTab === 'bindings' && collectorAssignments.length === 0) {
        fetchCollectorAssignments();
      } else if (activeTab === 'activity' && activityData.length === 0) {
        fetchActivityData();
      } else if (activeTab === 'daily-reports' && dailyReportsData.length === 0) {
        fetchDailyReportsData();
      }
    }
  }, [activeTab, companyId]);

  const fetchMasterlistData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.TELE_GET_RECORDS_BY_TELECOLLECTOR}?page=${currentPage}&pageSize=${pageSize}`
      );
      
      if (response.status === 200) {
        setMasterlistData(response.data.data || []);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      }
    } catch (error) {
      console.error('Error fetching masterlist:', error);
      setError('Failed to fetch masterlist data.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCollectorAssignments = async () => {
    // Add guard clause to prevent API call with empty companyId
    if (!companyId) {
      console.log('Company ID not available yet, skipping fetch');
      return;
    }

    try {
      console.log('🔍 fetchCollectorAssignments called with:', {
        assignmentCurrentPage,
        pageSize,
        companyId
      });
      
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.CA_GET_AREA_COLLECTOR_ASSIGNMENTS}?page=${assignmentCurrentPage}&pageSize=${pageSize}&companyid=${companyId}`
      );
      
      if (response.status === 200) {
        console.log(' API Response:', {
          count: response.data.totalRecords,
          totalPages: response.data.totalPages,
          calculatedPages: Math.ceil((response.data.totalRecords || 0) / pageSize),
          currentPage: assignmentCurrentPage
        });
        
        setCollectorAssignments(response.data.data || []);
        setAssignmentTotalRecords(response.data.totalRecords || 0);
        setAssignmentTotalPages(Math.ceil((response.data.totalRecords || 0) / pageSize));
      }
    } catch (error) {
      console.error('Error fetching collector assignments:', error);
      setError('Failed to fetch collector assignments.');
    }
  };

  const handleAssignmentEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentSave = async (updatedAssignment) => {
    try {
      await fetchCollectorAssignments(); // Refresh the data
      setError(null);
    } catch (error) {
      console.error('Error refreshing assignments:', error);
      setError('Failed to refresh assignments.');
    }
  };

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    setError(null); // Clear any existing errors
    
    // Reset search terms when switching tabs
    if (tabName === 'records') {
      setSearchTerm('');
    } else if (tabName === 'bindings') {
      setAssignmentSearchTerm('');
      // The useEffect will handle the fetch for bindings
    } else if (tabName === 'activity') {
      setActivitySearchTerm('');
      // Fetch activity data if not already loaded
      if (activityData.length === 0) {
        fetchActivityData();
      }
    } else if (tabName === 'daily-reports') {
      setDailyReportsSearchTerm('');
      // Fetch daily reports data if not already loaded
      if (dailyReportsData.length === 0) {
        fetchDailyReportsData();
      }
    }
  };

  // Export functions
  const exportToExcel = (data, filename, columns) => {
    const exportData = data.map(item => {
      const row = {};
      Object.keys(columns).forEach(key => {
        if (columns[key]) {
          // Map the internal keys to display names
          switch (key) {
            case 'pnNumber':
              row['PN Number'] = item.pn_number || '-';
              break;
            case 'refno':
              row['Reference Number'] = item.refno || '-';
              break;
            case 'borrowerName':
              row['Borrower Name'] = item.borrower_name || '-';
              break;
            case 'telecollector':
              row['Telecollector'] = item.telecollector || '-';
              break;
            case 'fieldCollector':
              row['Field Collector'] = item.field_collector || '-';
              break;
            case 'loanType':
              row['Loan Type'] = item.loan_type || '-';
              break;
            case 'remark':
              row['Remark'] = item.remark_name || 'Unassigned';
              break;
            case 'status':
              row['Borrower Status'] = item.sub_status_name_borrower || 'Unassigned';
              row['Unit Status'] = item.sub_status_name_unit || 'Unassigned';
              break;
            case 'visitRequested':
              row['Visit Requested'] = item.requested_visit ? 'Yes' : 'No';
              break;
            case 'specificArea':
              row['Specific Area'] = item.spec_areadesc || '-';
              break;
            case 'subArea':
              row['Sub Area'] = item.sub_areadesc || '-';
              break;
            case 'mainArea':
              row['Main Area'] = item.main_areadesc || '-';
              break;
            case 'handleAcct':
              row['Account Type'] = item.handle_acct || '-';
              break;
          }
        }
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportToPDF = (data, filename, columns) => {
    const doc = new jsPDF();
    const tableColumns = [];
    const tableRows = [];

    // Define columns based on visibility
    Object.keys(columns).forEach(key => {
      if (columns[key]) {
        switch (key) {
          case 'pnNumber': tableColumns.push('PN Number'); break;
          case 'refno': tableColumns.push('Ref Number'); break;
          case 'borrowerName': tableColumns.push('Borrower'); break;
          case 'telecollector': tableColumns.push('Telecollector'); break;
          case 'fieldCollector': tableColumns.push('Field Collector'); break;
          case 'loanType': tableColumns.push('Loan Type'); break;
          case 'remark': tableColumns.push('Remark'); break;
          case 'status': 
            tableColumns.push('Borrower Status');
            tableColumns.push('Unit Status');
            break;
          case 'visitRequested': tableColumns.push('Visit'); break;
          case 'specificArea': tableColumns.push('Specific Area'); break;
          case 'subArea': tableColumns.push('Sub Area'); break;
          case 'mainArea': tableColumns.push('Main Area'); break;
          case 'handleAcct': tableColumns.push('Account Type'); break;
        }
      }
    });

    data.forEach(item => {
      const row = [];
      Object.keys(columns).forEach(key => {
        if (columns[key]) {
          switch (key) {
            case 'pnNumber': row.push(item.pn_number || '-'); break;
            case 'refno': row.push(item.refno || '-'); break;
            case 'borrowerName': row.push(item.borrower_name || '-'); break;
            case 'telecollector': row.push(item.telecollector || '-'); break;
            case 'fieldCollector': row.push(item.field_collector || '-'); break;
            case 'loanType': row.push(item.loan_type || '-'); break;
            case 'remark': row.push(item.remark_name || 'Unassigned'); break;
            case 'status':
              row.push(item.sub_status_name_borrower || 'Unassigned');
              row.push(item.sub_status_name_unit || 'Unassigned');
              break;
            case 'visitRequested': row.push(item.requested_visit ? 'Yes' : 'No'); break;
            case 'specificArea': row.push(item.spec_areadesc || '-'); break;
            case 'subArea': row.push(item.sub_areadesc || '-'); break;
            case 'mainArea': row.push(item.main_areadesc || '-'); break;
            case 'handleAcct': row.push(item.handle_acct || '-'); break;
          }
        }
      });
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      margin: { top: 20 },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [255, 165, 0] } // Orange header
    });

    doc.save(`${filename}.pdf`);
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('all');
    setNameFilter('');
    setCollectorFilter('');
    setVisitFilter('all');
    setAssignmentStatusFilter('all');
    setAssignmentCollectorFilter('');
    setSearchTerm('');
    setAssignmentSearchTerm('');
  };

  // Clear daily reports filters
  const clearDailyReportsFilters = () => {
    setDailyReportsBranchFilter('');
    setDailyReportsDateFilter('');
    setDailyReportsAcctTypeFilter('all');
    setDailyReportsSearchTerm('');
  };

  const fetchDailyReportsData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.TELECOLLECTOR_DAILY_REPORTS}?page=${dailyReportsCurrentPage}&pageSize=${pageSize}`
      );
      
      if (response.status === 200) {
        // Map the API response data to match our component's expected structure
        const mappedData = (response.data.data || []).map(item => ({
          autoid: item.report_id,
          report_date: item.report_date,
          telecollectorid: item.telecollectorid,
          tele_name: item.telecollector_name,
          branch: item.branch,
          handle_acct: `${item.handle_acct_code} - ${item.handle_acct_desc}`,
          collection_for_the_day_amount: item.collection_for_day,
          collection_for_the_day_count: item.collection_for_day_count,
          principal_amount: item.principal,
          penalty_amount: item.penalty,
          penalty_percentage: item.penalty_percent,
          forecast_amount: item.forecast,
          forecast_count: item.forecast_count,
          on_track_figures_amount: item.on_track_figures,
          on_track_figures_percentage: item.on_track_percent,
          collectibles_amount: item.collectibles,
          collectibles_count: item.collectibles_count,
          actual_running_collx_amount: item.actual_running_collx,
          actual_running_collx_percentage: item.actual_running_collx_percent,
          actual_running_principal_amount: item.actual_running_principal,
          actual_running_principal_percentage: item.actual_running_principal_percent,
          actual_running_penalty_amount: item.actual_running_penalty,
          actual_running_penalty_percentage: item.actual_running_penalty_percent,
          var_otf_amount: item.var_otf,
          on_track_figures_2ndmon_amount: item.on_track_figures_2nd,
          on_track_figures_2ndmon_percentage: item.on_track_percent_2nd,
          second_mon_provision_amount: item.second_month_provision,
          second_mon_provision_count: item.second_month_count,
          second_mon_fixed_for_the_day_amount: item.second_month_fixed_for_day,
          second_mon_fixed_for_the_day_count: item.second_month_fixed_count,
          second_mon_running_fixed_amount: item.second_month_running_fixed,
          second_mon_running_fixed_count: item.second_month_running_fixed_count,
          second_mon_variance_amount: item.second_month_variance,
          second_mon_variance_count: item.second_month_variance_count,
          var_otf_2ndmon_amount: item.var_otf_2nd
        }));

        setDailyReportsData(mappedData);
        setDailyReportsTotalPages(response.data.totalPages || 1);
        setDailyReportsTotalRecords(response.data.totalRecords || 0);
        setDailyReportsCurrentPage(response.data.currentPage || 1);
      }
    } catch (error) {
      console.error('Error fetching daily reports data:', error);
      setError('Failed to fetch daily reports data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDailyReportsPageChange = async (newPage) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.TELECOLLECTOR_DAILY_REPORTS}?page=${newPage}&pageSize=${pageSize}`
      );

      if (response.status === 200) {
        // Map the API response data to match our component's expected structure
        const mappedData = (response.data.data || []).map(item => ({
          autoid: item.report_id,
          report_date: item.report_date,
          telecollectorid: item.telecollectorid,
          tele_name: item.telecollector_name,
          branch: item.branch,
          handle_acct: `${item.handle_acct_code} - ${item.handle_acct_desc}`,
          collection_for_the_day_amount: item.collection_for_day,
          collection_for_the_day_count: item.collection_for_day_count,
          principal_amount: item.principal,
          penalty_amount: item.penalty,
          penalty_percentage: item.penalty_percent,
          forecast_amount: item.forecast,
          forecast_count: item.forecast_count,
          on_track_figures_amount: item.on_track_figures,
          on_track_figures_percentage: item.on_track_percent,
          collectibles_amount: item.collectibles,
          collectibles_count: item.collectibles_count,
          actual_running_collx_amount: item.actual_running_collx,
          actual_running_collx_percentage: item.actual_running_collx_percent,
          actual_running_principal_amount: item.actual_running_principal,
          actual_running_principal_percentage: item.actual_running_principal_percent,
          actual_running_penalty_amount: item.actual_running_penalty,
          actual_running_penalty_percentage: item.actual_running_penalty_percent,
          var_otf_amount: item.var_otf,
          on_track_figures_2ndmon_amount: item.on_track_figures_2nd,
          on_track_figures_2ndmon_percentage: item.on_track_percent_2nd,
          second_mon_provision_amount: item.second_month_provision,
          second_mon_provision_count: item.second_month_count,
          second_mon_fixed_for_the_day_amount: item.second_month_fixed_for_day,
          second_mon_fixed_for_the_day_count: item.second_month_fixed_count,
          second_mon_running_fixed_amount: item.second_month_running_fixed,
          second_mon_running_fixed_count: item.second_month_running_fixed_count,
          second_mon_variance_amount: item.second_month_variance,
          second_mon_variance_count: item.second_month_variance_count,
          var_otf_2ndmon_amount: item.var_otf_2nd
        }));

        setDailyReportsData(mappedData);
        setDailyReportsCurrentPage(response.data.currentPage || newPage);
        setDailyReportsTotalPages(response.data.totalPages || 1);
        setDailyReportsTotalRecords(response.data.totalRecords || 0);
      }
    } catch (error) {
      console.error('Error fetching daily reports page:', error);
      setError('Failed to fetch daily reports records. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDailyReportsTab = () => (
    <Card isDarkMode={isDarkMode} className="mb-6">
      <Card isDarkMode={isDarkMode} className="mb-6">
            <span>See the Daily Reports of each Telecollector with the data of the day and the telecollector's performance.</span>
      </Card>
      <div className="flex flex-col gap-4 mb-4">
        {/* Main controls row */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <SearchInput
              type="text"
              placeholder="Search by telecollector or branch..."
              value={dailyReportsSearchTerm}
              onChange={(e) => setDailyReportsSearchTerm(e.target.value)}
              isDarkMode={isDarkMode}
            />
            <button
              onClick={() => setDailyReportsShowFilters(!dailyReportsShowFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                dailyReportsShowFilters 
                  ? 'bg-orange-500 text-white' 
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaFilter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaEye className="w-4 h-4" />
              Columns
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => exportToExcel(filteredDailyReportsData, 'daily-reports', visibleDailyReportsColumns)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
            >
              <FaFileExcel className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => exportToPDF(filteredDailyReportsData, 'daily-reports', visibleDailyReportsColumns)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              <FaFilePdf className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Daily Reports Filters section */}
        {dailyReportsShowFilters && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter by Branch
                </label>
                <input
                  type="text"
                  placeholder="Branch name..."
                  value={dailyReportsBranchFilter}
                  onChange={(e) => setDailyReportsBranchFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={dailyReportsDateFilter}
                  onChange={(e) => setDailyReportsDateFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Account Type Filter
                </label>
                <select
                  value={dailyReportsAcctTypeFilter}
                  onChange={(e) => setDailyReportsAcctTypeFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  style={{
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    color: isDarkMode ? 'white' : '#111827',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="all" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>All Account Types</option>
                  <option value="1" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Type 1</option>
                  <option value="2" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Type 2</option>
                  <option value="3" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Type 3</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={clearDailyReportsFilters}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Column settings */}
        {showColumnSettings && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Column Visibility
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(visibleDailyReportsColumns).filter(([key]) => key !== 'actions').map(([key, visible]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisibleDailyReportsColumns(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <ReportsTableContainer isDarkMode={isDarkMode}>
        <ReportsTable isDarkMode={isDarkMode}>
          <table>
            <thead>
              <tr>
                {visibleDailyReportsColumns.autoid && <th>Report ID</th>}
                {visibleDailyReportsColumns.reportDate && <th>Date</th>}
                {visibleDailyReportsColumns.teleName && <th>Telecollector</th>}
                {visibleDailyReportsColumns.branch && <th>Branch</th>}
                {visibleDailyReportsColumns.handleAcct && <th>Account Type</th>}
                {visibleDailyReportsColumns.collectionForTheDayAmount && <th>Collection Amount</th>}
                {visibleDailyReportsColumns.actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredDailyReportsData.map((report) => (
                <tr key={report.autoid}>
                  {visibleDailyReportsColumns.autoid && <td>{report.autoid || '-'}</td>}
                  {visibleDailyReportsColumns.reportDate && <td>{report.report_date ? new Date(report.report_date).toLocaleDateString() : '-'}</td>}
                  {visibleDailyReportsColumns.teleName && <td>{report.tele_name || '-'}</td>}
                  {visibleDailyReportsColumns.branch && <td>{report.branch || '-'}</td>}
                  {visibleDailyReportsColumns.handleAcct && <td>{report.handle_acct || '-'}</td>}
                  {visibleDailyReportsColumns.collectionForTheDayAmount && (
                    <td>
                      <StatusBadge className="StatusBadge assigned">
                        {report.collection_for_the_day_amount ? `₱${parseFloat(report.collection_for_the_day_amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₱0.00'}
                      </StatusBadge>
                    </td>
                  )}
                  {visibleDailyReportsColumns.actions && (
                    <td>
                      <div className="action-buttons">
                        <ActionButton
                          variant="edit"
                          isDarkMode={isDarkMode}
                          onClick={() => {
                            setSelectedDailyReport(report);
                            setIsDailyReportDetailModalOpen(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View Details
                        </ActionButton>
                      </div>
                    </td>
                  )}
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
          Showing {(dailyReportsCurrentPage - 1) * pageSize + 1} to {Math.min(dailyReportsCurrentPage * pageSize, dailyReportsTotalRecords)} of {dailyReportsTotalRecords} records
        </div>
        <div className="pagination-buttons">
          <button
            onClick={() => handleDailyReportsPageChange(dailyReportsCurrentPage - 1)}
            disabled={dailyReportsCurrentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <div className="page-info">
            Page {dailyReportsCurrentPage} of {dailyReportsTotalPages}
          </div>
          <button
            onClick={() => handleDailyReportsPageChange(dailyReportsCurrentPage + 1)}
            disabled={dailyReportsCurrentPage === dailyReportsTotalPages}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </PaginationControls>
    </Card>
  );

  const fetchActivityData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.COLLECTION_ACTIVITY_LOG}?page=${activityCurrentPage}&pageSize=${pageSize}`
      );
      
      if (response.status === 200) {
        // Handle direct array response or paginated response
        if (Array.isArray(response.data)) {
          setActivityData(response.data);
          setActivityCurrentPage(1);
          setActivityTotalRecords(response.data.length);
          setActivityTotalPages(Math.ceil(response.data.length / pageSize));
        } else {
          setActivityData(response.data.data || []);
          setActivityCurrentPage(1);
          setActivityTotalPages(response.data.totalPages || 1);
          setActivityTotalRecords(response.data.totalRecords || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
      setError('Failed to fetch activity data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivityPageChange = async (newPage) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.COLLECTION_ACTIVITY_LOG}?page=${newPage}&pageSize=${pageSize}`
      );

      if (response.status === 200) {
        // Handle direct array response or paginated response
        if (Array.isArray(response.data)) {
          console.log('CA Activity page data (direct array):', response.data);
          setActivityData(response.data);
          setActivityCurrentPage(newPage);
          setActivityTotalRecords(response.data.length);
          setActivityTotalPages(Math.ceil(response.data.length / pageSize));
        } else {
          console.log('CA Activity page data (paginated):', response.data);
          setActivityData(response.data.data || []);
          setActivityCurrentPage(newPage);
          setActivityTotalPages(response.data.totalPages || 1);
          setActivityTotalRecords(response.data.totalRecords || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching activity page:', error);
      setError('Failed to fetch activity records. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearActivityFilters = () => {
    setActivityActionFilter('all');
    setActivityCollectorFilter('');
    setActivityDateFilter('');
    setActivitySearchTerm('');
  };

  const exportActivityToExcel = (data, filename) => {
    const exportData = data.map(item => {
      const row = {};
      Object.keys(visibleActivityColumns).forEach(key => {
        if (visibleActivityColumns[key]) {
          switch (key) {
            case 'activityId':
              row['Activity ID'] = item.activityid || '-';
              break;
            case 'refno':
              row['Reference Number'] = item.refno || '-';
              break;
            case 'pnNumber':
              row['PN Number'] = item.pn_number || '-';
              break;
            case 'actionKey':
              row['Action'] = item.action_key || '-';
              break;
            case 'description':
              row['Description'] = item.description || '-';
              break;
            case 'collectorName':
              row['Collector Name'] = item.collectorid || '-';
              break;
            case 'collectorType':
              row['Collector Type'] = item.collector_type || '-';
              break;
            case 'amount':
              row['Amount'] = item.amount || '0';
              break;
            case 'dateUpdated':
              row['Date Updated'] = item.date_updated ? new Date(item.date_updated).toLocaleDateString() : '-';
              break;
            case 'telecollector':
              row['Telecollector'] = item.telecollector || '-';
              break;
            case 'remarks':
              row['Additional Remarks'] = item.additional_remarks || '-';
              break;
          }
        }
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Activity Data');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const filteredData = masterlistData.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    const nameLower = nameFilter.toLowerCase();
    const collectorLower = collectorFilter.toLowerCase();
    
    // Search filter
    const matchesSearch = !searchTerm || (
      record.borrower_name?.toLowerCase()?.includes(searchLower) ||
      record.pn_number?.toString()?.includes(searchLower) ||
      record.refno?.toString().includes(searchLower) ||
      record.telecollector?.toLowerCase()?.includes(searchLower) ||
      record.field_collector?.toLowerCase()?.includes(searchLower)
    );
    
    // Name filter
    const matchesName = !nameFilter || record.borrower_name?.toLowerCase()?.includes(nameLower);
    
    // Collector filter
    const matchesCollector = !collectorFilter || (
      record.telecollector?.toLowerCase()?.includes(collectorLower) ||
      record.field_collector?.toLowerCase()?.includes(collectorLower)
    );
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'assigned' && record.remark_name) ||
      (statusFilter === 'unassigned' && !record.remark_name) ||
      (statusFilter === 'borrower_assigned' && record.sub_status_name_borrower) ||
      (statusFilter === 'unit_assigned' && record.sub_status_name_unit);
    
    // Visit filter
    const matchesVisit = visitFilter === 'all' ||
      (visitFilter === 'requested' && record.requested_visit) ||
      (visitFilter === 'not_requested' && !record.requested_visit);
    
    return matchesSearch && matchesName && matchesCollector && matchesStatus && matchesVisit;
  });

  const filteredAssignments = collectorAssignments.filter(assignment => {
    const searchLower = assignmentSearchTerm.toLowerCase();
    const collectorLower = assignmentCollectorFilter.toLowerCase();
    
    // Search filter
    const matchesSearch = !assignmentSearchTerm || (
      assignment.telecollector?.toLowerCase()?.includes(searchLower) ||
      assignment.field_collector?.toLowerCase()?.includes(searchLower) ||
      assignment.sub_areadesc?.toLowerCase()?.includes(searchLower) ||
      assignment.main_areadesc?.toLowerCase()?.includes(searchLower)
    );
    
    // Collector filter
    const matchesCollector = !assignmentCollectorFilter || (
      assignment.telecollector?.toLowerCase()?.includes(collectorLower) ||
      assignment.field_collector?.toLowerCase()?.includes(collectorLower)
    );
    
    // Status filter
    const matchesStatus = assignmentStatusFilter === 'all' ||
      (assignmentStatusFilter === 'assigned' && assignment.telecollector && assignment.field_collector) ||
      (assignmentStatusFilter === 'partial' && (assignment.telecollector || assignment.field_collector) && !(assignment.telecollector && assignment.field_collector)) ||
      (assignmentStatusFilter === 'unassigned' && !assignment.telecollector && !assignment.field_collector);
    
    return matchesSearch && matchesCollector && matchesStatus;
  });

  const filteredDailyReportsData = dailyReportsData.filter(report => {
    const searchLower = dailyReportsSearchTerm.toLowerCase();
    const branchLower = dailyReportsBranchFilter.toLowerCase();
    
    // Search filter
    const matchesSearch = !dailyReportsSearchTerm || (
      report.tele_name?.toLowerCase()?.includes(searchLower) ||
      report.branch?.toLowerCase()?.includes(searchLower) ||
      report.autoid?.toString()?.includes(searchLower)
    );
    
    // Branch filter
    const matchesBranch = !dailyReportsBranchFilter || 
      report.branch?.toLowerCase()?.includes(branchLower);
    
    // Account type filter
    const matchesAcctType = dailyReportsAcctTypeFilter === 'all' || 
      report.handle_acct?.toLowerCase().includes(dailyReportsAcctTypeFilter.toLowerCase());
    
    // Date filter (if provided, filter by date)
    const matchesDate = !dailyReportsDateFilter || 
      (report.report_date && report.report_date.includes(dailyReportsDateFilter));
    
    return matchesSearch && matchesBranch && matchesAcctType && matchesDate;
  });

  const filteredActivityData = activityData.filter(activity => {
    const searchLower = activitySearchTerm.toLowerCase();
    const collectorLower = activityCollectorFilter.toLowerCase();
    
    // Search filter
    const matchesSearch = !activitySearchTerm || (
      activity.refno?.toString().includes(searchLower) ||
      activity.pn_number?.toString().includes(searchLower) ||
      activity.action_key?.toLowerCase()?.includes(searchLower) ||
      activity.collectorid?.toLowerCase()?.includes(searchLower) ||
      activity.telecollector?.toLowerCase()?.includes(searchLower)
    );
    
    // Collector filter
    const matchesCollector = !activityCollectorFilter || (
      activity.collectorid?.toLowerCase()?.includes(collectorLower) ||
      activity.telecollector?.toLowerCase()?.includes(collectorLower)
    );
    
    // Action filter
    const matchesAction = activityActionFilter === 'all' || 
      activity.action_key?.toLowerCase() === activityActionFilter.toLowerCase();
    
    // Date filter (if provided, filter by date)
    const matchesDate = !activityDateFilter || 
      (activity.date_updated && activity.date_updated.includes(activityDateFilter));
    
    return matchesSearch && matchesCollector && matchesAction && matchesDate;
  });

  // Debug logging for CA Dashboard
  console.log('CA Activity raw data:', activityData);
  console.log('CA Activity filtered data:', filteredActivityData);
  console.log('CA Activity state:', { 
    activityCurrentPage, 
    activityTotalPages, 
    activityTotalRecords,
    activeTab 
  });

  const renderRecordsTab = () => (
    
    <Card isDarkMode={isDarkMode} className="mb-6">
      <Card isDarkMode={isDarkMode} className="mb-6">
            <span>Overview of Records from each Telecollector along with their remarks, status, and visit status.</span>
      </Card>
      <div className="flex flex-col gap-4 mb-4">
        {/* Main controls row */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <SearchInput
              type="text"
              placeholder="Search by name, PN number, collector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              isDarkMode={isDarkMode}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showFilters 
                  ? 'bg-orange-500 text-white' 
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaFilter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaEye className="w-4 h-4" />
              Columns
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => exportToExcel(filteredData, 'records-export', visibleRecordColumns)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
            >
              <FaFileExcel className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => exportToPDF(filteredData, 'records-export', visibleRecordColumns)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              <FaFilePdf className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Filters section */}
        {showFilters && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter by Name
                </label>
                <input
                  type="text"
                  placeholder="Borrower name..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter by Collector
                </label>
                <input
                  type="text"
                  placeholder="Collector name..."
                  value={collectorFilter}
                  onChange={(e) => setCollectorFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Status Filter
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  style={{
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    color: isDarkMode ? 'white' : '#111827',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="all" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>All Status</option>
                  <option value="assigned" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Remark Assigned</option>
                  <option value="unassigned" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Remark Unassigned</option>
                  <option value="borrower_assigned" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Borrower Status Assigned</option>
                  <option value="unit_assigned" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Unit Status Assigned</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Visit Filter
                </label>
                <select
                  value={visitFilter}
                  onChange={(e) => setVisitFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  style={{
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    color: isDarkMode ? 'white' : '#111827',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="all" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>All Visits</option>
                  <option value="requested" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Visit Requested</option>
                  <option value="not_requested" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>No Visit</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Column settings */}
        {showColumnSettings && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Column Visibility
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(visibleRecordColumns).map(([key, visible]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisibleRecordColumns(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <ReportsTableContainer isDarkMode={isDarkMode}>
        <ReportsTable isDarkMode={isDarkMode}>
          <table>
            <thead>
              <tr>
                {visibleRecordColumns.pnNumber && <th>PN Number</th>}
                {visibleRecordColumns.refno && <th>Reference Number</th>}
                {visibleRecordColumns.borrowerName && <th>Borrower Name</th>}
                {/* {visibleRecordColumns.telecollector && <th>Telecollector ID</th>}
                {visibleRecordColumns.fieldCollector && <th>Field Collector ID </th>} */}
                {visibleRecordColumns.telecollector && <th>Telecollector Name</th>}
                {visibleRecordColumns.fieldCollector && <th>Field Collector Name</th>}
                {visibleRecordColumns.loanType && <th>Loan Type</th>}
                {visibleRecordColumns.remark && <th>Remark</th>}
                {visibleRecordColumns.status && <th className="status-column">Status</th>}
                {visibleRecordColumns.visitRequested && <th className="visit-column">Visit Requested</th>}
                {visibleRecordColumns.actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record) => (
                <tr key={record.refno}>
                  {visibleRecordColumns.pnNumber && <td>{record.pn_number || '-'}</td>}
                  {visibleRecordColumns.refno && <td>{record.refno}</td>}
                  {visibleRecordColumns.borrowerName && <td>{record.borrower_name || '-'}</td>}
                  {/* {visibleRecordColumns.telecollector && <td>{record.telecollector || '-'}</td>}
                  {visibleRecordColumns.fieldCollector && <td>{record.field_collector || '-'}</td>} */}
                  {visibleRecordColumns.telecollector && <td>{record.fname_tele || '-'}</td>}
                  {visibleRecordColumns.fieldCollector && <td>{record.fname_field || '-'}</td>}
                  {visibleRecordColumns.loanType && <td>{record.loan_type || '-'}</td>}
                  {visibleRecordColumns.remark && (
                    <td>
                      <StatusBadge className={record.remark_name ? 'assigned' : 'unassigned'}>
                        {record.remark_name || 'Unassigned'}
                      </StatusBadge>
                    </td>
                  )}
                  {visibleRecordColumns.status && (
                    <td className="status-column">
                      <div className="status-group">
                        <StatusBadge
                          className={record.sub_status_name_borrower ? 'assigned' : 'unassigned'}
                          size="sm"
                        >
                          {record.sub_status_name_borrower
                            ? 'Borrower: ' + record.sub_status_name_borrower
                            : 'Borrower: Unassigned'}
                        </StatusBadge>
                        <StatusBadge
                          className={record.sub_status_name_unit ? 'assigned' : 'unassigned'}
                          size="sm"
                        >
                          {record.sub_status_name_unit
                            ? 'Unit: ' + record.sub_status_name_unit
                            : 'Unit: Unassigned'}
                        </StatusBadge>
                      </div>
                    </td>
                  )}
                  {visibleRecordColumns.visitRequested && (
                    <td className="visit-column">
                      <StatusBadge
                        className={record.requested_visit ? 'warning' : 'unassigned'}
                        size="sm"
                      >
                        {record.requested_visit ? 'Visit Requested' : 'No Visit'}
                      </StatusBadge>
                    </td>
                  )}
                  {visibleRecordColumns.actions && (
                    <td>
                      <div className="action-buttons">
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
                          Assign Status
                        </ActionButton>
                      </div>
                    </td>
                  )}
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
  );

  const renderAssignmentsTab = () => (
    <Card isDarkMode={isDarkMode} className="mb-6">
      <Card isDarkMode={isDarkMode} className="mb-6">
            <span>Edit your field collector and telecollector bindings per area here, the automation engine will automatically use your bindings as its basis for automated tagging.</span>
      </Card>
      <div className="flex flex-col gap-4 mb-4">
        {/* Main controls row */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <SearchInput
              type="text"
              placeholder="Search by collector or area..."
              value={assignmentSearchTerm}
              onChange={(e) => setAssignmentSearchTerm(e.target.value)}
              isDarkMode={isDarkMode}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showFilters 
                  ? 'bg-orange-500 text-white' 
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaFilter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaEye className="w-4 h-4" />
              Columns
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => exportToExcel(filteredAssignments, 'assignments-export', visibleAssignmentColumns)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
            >
              <FaFileExcel className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => exportToPDF(filteredAssignments, 'assignments-export', visibleAssignmentColumns)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              <FaFilePdf className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Filters section */}
        {showFilters && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter by Collector
                </label>
                <input
                  type="text"
                  placeholder="Collector name..."
                  value={assignmentCollectorFilter}
                  onChange={(e) => setAssignmentCollectorFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Assignment Status
                </label>
                <select
                  value={assignmentStatusFilter}
                  onChange={(e) => setAssignmentStatusFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  style={{
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    color: isDarkMode ? 'white' : '#111827',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="all" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>All Assignments</option>
                  <option value="assigned" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Fully Assigned</option>
                  <option value="partial" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Partially Assigned</option>
                  <option value="unassigned" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Unassigned</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Column settings */}
        {showColumnSettings && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Column Visibility
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(visibleAssignmentColumns).map(([key, visible]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisibleAssignmentColumns(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <ReportsTableContainer isDarkMode={isDarkMode}>
        <ReportsTable isDarkMode={isDarkMode}>
          <table>
            <thead>
              <tr>
                {visibleAssignmentColumns.telecollector && <th>Telecollector</th>}
                {visibleAssignmentColumns.fieldCollector && <th>Field Collector</th>}
                {visibleAssignmentColumns.specificArea && <th>Specific Area</th>}
                {visibleAssignmentColumns.subArea && <th>Sub Area</th>}
                {visibleAssignmentColumns.mainArea && <th>Main Area</th>}
                {visibleAssignmentColumns.actions && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.autoid}>
                  {visibleAssignmentColumns.telecollector && (
                    <td>
                      <StatusBadge className={assignment.fname_tele ? 'assigned' : 'unassigned'}>
                        {assignment.fname_tele || 'Unassigned'}
                      </StatusBadge>
                    </td>
                  )}
                  {visibleAssignmentColumns.fieldCollector && (
                    <td>
                      <StatusBadge className={assignment.fname_field ? 'assigned' : 'unassigned'}>
                        {assignment.fname_field || 'Unassigned'}
                      </StatusBadge>
                    </td>
                  )}
                  {visibleAssignmentColumns.specificArea && <td>{assignment.spec_areadesc || '-'}</td>}
                  {visibleAssignmentColumns.subArea && <td>{assignment.sub_areadesc || '-'}</td>}
                  {visibleAssignmentColumns.mainArea && <td>{assignment.main_areadesc || '-'}</td>}
                  {visibleAssignmentColumns.actions && (
                    <td>
                      <ActionButton
                        variant="edit"
                        isDarkMode={isDarkMode}
                        onClick={() => handleAssignmentEdit(assignment)}
                      >
                        <FaEdit />
                        Edit Assignment
                      </ActionButton>
                    </td>
                  )}
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
          Showing {(assignmentCurrentPage - 1) * pageSize + 1} to {Math.min(assignmentCurrentPage * pageSize, assignmentTotalRecords)} of {assignmentTotalRecords} assignments
        </div>
        <div className="pagination-buttons">
          <button
            onClick={() => handleAssignmentPageChange(assignmentCurrentPage - 1)}
            disabled={assignmentCurrentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <div className="page-info">
            Page {assignmentCurrentPage} of {assignmentTotalPages}
          </div>
          <button
            onClick={() => handleAssignmentPageChange(assignmentCurrentPage + 1)}
            disabled={assignmentCurrentPage === assignmentTotalPages}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </PaginationControls>
    </Card>
  );

  const renderActivityTab = () => (
    <Card isDarkMode={isDarkMode} className="mb-6">
      <Card isDarkMode={isDarkMode} className="mb-6">
            <span>Record Transcript Log of Actual Activity of Collectors can be seen here.</span>
      </Card>
      <div className="flex flex-col gap-4 mb-4">
        {/* Main controls row */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <SearchInput
              type="text"
              placeholder="Search by collector or activity..."
              value={activitySearchTerm}
              onChange={(e) => setActivitySearchTerm(e.target.value)}
              isDarkMode={isDarkMode}
            />
            <button
              onClick={() => setActivityShowFilters(!activityShowFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activityShowFilters 
                  ? 'bg-orange-500 text-white' 
                  : isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaFilter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => setShowActivityColumnSettings(!showActivityColumnSettings)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaEye className="w-4 h-4" />
              Columns
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => exportActivityToExcel(filteredActivityData, 'activity-export', visibleActivityColumns)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200"
            >
              <FaFileExcel className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => exportToPDF(filteredActivityData, 'activity-export', visibleActivityColumns)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              <FaFilePdf className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>

        {/* Filters section */}
        {activityShowFilters && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter by Collector
                </label>
                <input
                  type="text"
                  placeholder="Collector name..."
                  value={activityCollectorFilter}
                  onChange={(e) => setActivityCollectorFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter by Action
                </label>
                <select
                  value={activityActionFilter}
                  onChange={(e) => setActivityActionFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  style={{
                    backgroundColor: isDarkMode ? '#374151' : 'white',
                    color: isDarkMode ? 'white' : '#111827',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none'
                  }}
                >
                  <option value="all" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>All Actions</option>
                  <option value="collection" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Collection</option>
                  <option value="visit" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Visit</option>
                  <option value="follow_up" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Follow-up</option>
                  <option value="other" style={{ backgroundColor: isDarkMode ? '#374151' : 'white', color: isDarkMode ? 'white' : '#111827' }}>Other</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={activityDateFilter}
                  onChange={(e) => setActivityDateFilter(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={clearActivityFilters}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Column settings */}
        {showActivityColumnSettings && (
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Column Visibility
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(visibleActivityColumns).map(([key, visible]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisibleActivityColumns(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <ReportsTableContainer isDarkMode={isDarkMode}>
        <ReportsTable isDarkMode={isDarkMode}>
          <table>
            <thead>
              <tr>
                {visibleActivityColumns.activityId && <th>Activity ID</th>}
                {visibleActivityColumns.refno && <th>Reference Number</th>}
                {visibleActivityColumns.pnNumber && <th>PN Number</th>}
                {visibleActivityColumns.actionKey && <th>Action</th>}
                {visibleActivityColumns.description && <th>Description</th>}
                {visibleActivityColumns.collectorName && <th>Collector Name</th>}
                {visibleActivityColumns.collectorType && <th>Collector Type</th>}
                {visibleActivityColumns.amount && <th>Amount</th>}
                {visibleActivityColumns.dateUpdated && <th>Date Updated</th>}
                {visibleActivityColumns.telecollector && <th>Telecollector</th>}
                {visibleActivityColumns.remarks && <th>Additional Remarks</th>}
              </tr>
            </thead>
            <tbody>
              {filteredActivityData.map((activity) => (
                <tr key={activity.activityid}>
                  {visibleActivityColumns.activityId && <td>{activity.activityid || '-'}</td>}
                  {visibleActivityColumns.refno && <td>{activity.refno || '-'}</td>}
                  {visibleActivityColumns.pnNumber && <td>{activity.pn_number || '-'}</td>}
                  <td>
                                <StatusBadge className="assigned">
                                  {activity.action_key.toUpperCase() || '-'}
                                </StatusBadge>
                  </td>
                  {visibleActivityColumns.description && <td>{activity.description || '-'}</td>}
                  {visibleActivityColumns.collectorName && <td>{activity.collectorid || '-'}</td>}
                  {visibleActivityColumns.collectorType && (
                              <td>
                                <StatusBadge className={activity.collector_type === 'TELECOLLECTOR' ? 'warning' : 'assigned'}>
                                  {activity.collector_type || '-'}
                                </StatusBadge>
                              </td>
                            )}
                  {visibleActivityColumns.amount && <td>{activity.amount || '0'}</td>}
                  {visibleActivityColumns.dateUpdated && <td>{activity.date_updated ? new Date(activity.date_updated).toLocaleDateString() : '-'}</td>}
                  {visibleActivityColumns.telecollector && <td>{activity.telecollector || '-'}</td>}
                  {visibleActivityColumns.remarks && <td>{activity.additional_remarks || '-'}</td>}
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
          Showing {(activityCurrentPage - 1) * pageSize + 1} to {Math.min(activityCurrentPage * pageSize, activityTotalRecords)} of {activityTotalRecords} activity records
        </div>
        <div className="pagination-buttons">
          <button
            onClick={() => handleActivityPageChange(activityCurrentPage - 1)}
            disabled={activityCurrentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <div className="page-info">
            Page {activityCurrentPage} of {activityTotalPages}
          </div>
          <button
            onClick={() => handleActivityPageChange(activityCurrentPage + 1)}
            disabled={activityCurrentPage === activityTotalPages}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </PaginationControls>
    </Card>
  );

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
            <div>
              <h1 className="text-2xl font-light text-gray-900 dark:text-white">Collection Associate Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-gray-300">Manage records and collector bindings</p>
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

        <StatsContainer>
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              isDarkMode={isDarkMode}
              style={{ animationDelay: getAnimationDelay(index) }}
            >
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                {stat.isPositive ? <FaArrowUp /> : <FaArrowDown />}
                {stat.change}
              </div>
            </StatCard>
          ))}
        </StatsContainer>

        <TabContainer isDarkMode={isDarkMode}>
          <TabList>
            <TabButton
              isActive={activeTab === 'records'}
              isDarkMode={isDarkMode}
              onClick={() => handleTabSwitch('records')}
            >
              Records Overview
            </TabButton>
            <TabButton
              isActive={activeTab === 'bindings'}
              isDarkMode={isDarkMode}
              onClick={() => handleTabSwitch('bindings')}
            >
              Edit Collector Area Assignment
            </TabButton>
            <TabButton
              isActive={activeTab === 'activity'}
              isDarkMode={isDarkMode}
              onClick={() => handleTabSwitch('activity')}
            >
              Collector Activity
            </TabButton>
            <TabButton
              isActive={activeTab === 'daily-reports'}
              isDarkMode={isDarkMode}
              onClick={() => handleTabSwitch('daily-reports')}
            >
              Daily Reports
            </TabButton>
          </TabList>
        </TabContainer>

        <div className="p-6 dark:bg-inherit min-h-screen relative">
          {error && (
            <ErrorMessage isDarkMode={isDarkMode}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </ErrorMessage>
          )}

          {activeTab === 'records' && (
            <div key="records-tab">
              {renderRecordsTab()}
            </div>
          )}
          
          {activeTab === 'bindings' && (
            <div key="bindings-tab">
              {renderAssignmentsTab()}
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div key="activity-tab">
              {renderActivityTab()}
            </div>
          )}

          {activeTab === 'daily-reports' && (
            <div key="daily-reports-tab">
              {renderDailyReportsTab()}
            </div>
          )}
        </div>
      </MainContent>

      <DailyReportDetailsModal
        isOpen={isDailyReportDetailModalOpen}
        onClose={() => setIsDailyReportDetailModalOpen(false)}
        report={selectedDailyReport}
        isDarkMode={isDarkMode}
      />

      <ManageCaseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditRecord}
        record={selectedRecord}
        isDarkMode={isDarkMode}
        userId={userId}
      />

      {typeof document !== 'undefined' && createPortal(
        <CollectorAreaAssignmentModal
          isOpen={isAssignmentModalOpen}
          onClose={() => setIsAssignmentModalOpen(false)}
          assignment={selectedAssignment}
          isDarkMode={isDarkMode}
          onSave={handleAssignmentSave}
          companyId={companyId}
        />,
        document.body
      )}

      <Bot userId={userId}/> 
    </DashboardContainer>
  );
};

export default IRSCADashboard; 