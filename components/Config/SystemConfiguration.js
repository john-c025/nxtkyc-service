'use client';
import Bot from '../Objects/Bot';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import NotificationButton from '../Objects/NotificationButton';
import {
  DashboardContainer,
  Sidebar,
  MainContent,
  TopBar,
  NavList,
  UserSection,
  ProfileImage,
  UserInfo,
  ThemeToggle
} from '../Dashboard/MainDashboardStyled';
import {
  ReportCardsContainer,
  ReportCard,
  ReportsHeader,
  ReportTypeSelect,
  Button,
  ReportsTable,
  NewReportButton,
  UploadModalOverlay,
  UploadModalContent,
  ReportsTableContainer,
  SpinnerOverlay,
  Spinner,
  PaginationControls,
  SearchInput,
  ConfigurationGrid,
  ConfigCard,
  DataDictionaryModal,
  DataTable,
  StatsGrid,
  StatCard,
  ExpandedAreaView,
  AreaCountContent,
  AreaCountList,
  ClickableCell,
  ActionButton,
  EditModal
} from './SystemConfigurationStyled';
import NavPane from '../Objects/NavPane';
import FilterModal from '../Objects/FilterModal';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const UploadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <UploadModalOverlay>
      <UploadModalContent>
        <div className="modal-header">
          <h2>Upload document</h2>
          <button onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="upload-area">
          <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <div className="upload-text">Drag and drop files here</div>
          <div className="upload-hint">
            <span className="click-upload">Click here to upload</span>
          </div>
        </div>
      </UploadModalContent>
    </UploadModalOverlay>
  );
};

const ErrorModal = ({ message, onClose }) => (
  <UploadModalOverlay>
    <UploadModalContent>
      <div className="modal-header">
        <h2>Error</h2>
        <button onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="upload-area">
        <div className="upload-text">{message}</div>
      </div>
    </UploadModalContent>
  </UploadModalOverlay>
);

// Mock data for area hierarchies
const MOCK_AREA_HIERARCHIES = {
  "DIGOS 1": {
    count: 50,
    areas: [
      { name: "Digos Central", count: 20 },
      { name: "Digos East", count: 15 },
      { name: "Digos West", count: 15 }
    ]
  },
  "DIGOS 2": {
    count: 38,
    areas: [
      { name: "Digos North", count: 18 },
      { name: "Digos South", count: 20 }
    ]
  },
  "SOUTH 2": {
    count: 36,
    areas: [
      { name: "South Central", count: 12 },
      { name: "South Coast", count: 14 },
      { name: "South Highland", count: 10 }
    ]
  },
  "NORTH 2": {
    count: 36,
    areas: [
      { name: "North Central", count: 15 },
      { name: "North Coast", count: 11 },
      { name: "North Highland", count: 10 }
    ]
  }
  // ... add more hierarchies as needed
};

// Mock data for the area counts
const MOCK_AREA_COUNTS = [
  { name: "DIGOS 1", count: 50 },
  { name: "DIGOS 2", count: 38 },
  { name: "SOUTH 2", count: 36 },
  { name: "NORTH 2", count: 36 },
  { name: "SOUTH 1", count: 32 },
  { name: "NORTH 1", count: 31 },
  { name: "DIGOS 3", count: 29 },
  { name: "TAGUM 3", count: 20 },
  { name: "TAGUM 1", count: 19 },
  { name: "KIDAPAWAN 2", count: 18 },
  { name: "GENSAN 4", count: 16 },
  { name: "GENSAN 2", count: 13 },
  { name: "TAGUM 2", count: 12 },
  { name: "GENSAN 1", count: 12 },
  { name: "DAVAO ORIENTAL", count: 12 },
  { name: "KIDAPAWAN 1", count: 10 },
  { name: "GENSAN 3", count: 9 },
  { name: "DIGOS 4", count: 8 },
  { name: "MIDSAYAP 1", count: 7 },
  { name: "KORONADAL 2", count: 6 },
  { name: "KORONADAL 4", count: 6 },
  { name: "KORONADAL 3", count: 6 },
  { name: "KORONADAL 1", count: 5 },
  { name: "MIDSAYAP 2", count: 4 },
  { name: "TAGUM 4", count: 3 }
];

// Mock data for the data dictionary
const MOCK_AREA_DATA = [
  { mainArea: 'Metro Manila', subArea: 'Makati', specificArea: 'Ayala Avenue' },
  { mainArea: 'Metro Manila', subArea: 'Pasig', specificArea: 'Ortigas Center' },
  { mainArea: 'Metro Manila', subArea: 'Taguig', specificArea: 'BGC' },
  { mainArea: 'Cebu', subArea: 'Cebu City', specificArea: 'IT Park' },
  { mainArea: 'Davao', subArea: 'Davao City', specificArea: 'Downtown' },
];

const AreaCountsModal = ({ isOpen, onClose, isDarkMode }) => {
  const [areaDistribution, setAreaDistribution] = useState([]);
  const [expandedArea, setExpandedArea] = useState(null);
  const [expandedSubArea, setExpandedSubArea] = useState(null);
  const [specAreas, setSpecAreas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subAreaLoading, setSubAreaLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchAreaDistribution = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get(API_ENDPOINTS.LOAD_SUB_AREA_SPEC_COUNTS);
          if (response.data.status === 200) {
            console.log('Area distribution response:', response.data); // Debug log
            
            // Group the data by main area
            const groupedData = response.data.data.reduce((acc, item) => {
              const mainArea = item.main_areadesc;
              if (!acc[mainArea]) {
                acc[mainArea] = {
                  count: 0,
                  areas: []
                };
              }
              
              // Make sure we have the sub_areaid
              if (!item.sub_areaid) {
                console.error('Missing sub_areaid for item:', item);
                return acc;
              }
              
              acc[mainArea].areas.push({
                name: item.sub_areadesc,
                count: item.spec_area_count_in_sub,
                sub_areaid: item.sub_areaid.toString() // Ensure it's a string
              });
              acc[mainArea].count += item.spec_area_count_in_sub;
              return acc;
            }, {});
            
            const distributionData = Object.entries(groupedData).map(([key, value]) => ({
              name: key,
              ...value
            }));
            
            console.log('Processed distribution data:', distributionData); // Debug log
            setAreaDistribution(distributionData);
          }
        } catch (err) {
          setError('Failed to load area distribution');
          console.error('Error fetching area distribution:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchAreaDistribution();
    }
  }, [isOpen]);

  const handleAreaClick = (areaName) => {
    setExpandedArea(expandedArea === areaName ? null : areaName);
    setExpandedSubArea(null); // Reset expanded sub-area when main area is clicked
  };

  const handleSubAreaClick = async (mainAreaName, subArea) => {
    try {
      setSubAreaLoading(true);
      console.log('SubArea object:', subArea); // Debug log
      
      if (!subArea || !subArea.sub_areaid) {
        console.error('Invalid subArea object:', subArea);
        return;
      }

      if (expandedSubArea === subArea.sub_areaid) {
        setExpandedSubArea(null);
        return;
      }

      setExpandedSubArea(subArea.sub_areaid);
      
      const apiUrl = `${API_ENDPOINTS.LOAD_SPEC_AREA_UNDER_SUB_AREA_BY_SUB_AREA_ID}?subareaid=${subArea.sub_areaid}`;
      console.log('API URL:', apiUrl); // Debug log
      
      const response = await axiosInstance.get(apiUrl);

      if (response.data.status === 200) {
        // Remove duplicates based on spec_areaid
        const uniqueSpecAreas = Array.from(
          new Map(
            response.data.data.map(item => [item.spec_areaid, item])
          ).values()
        ).sort((a, b) => a.spec_areadesc.localeCompare(b.spec_areadesc));

        setSpecAreas(prev => ({
          ...prev,
          [subArea.sub_areaid]: uniqueSpecAreas
        }));
      }
    } catch (err) {
      console.error('Error fetching specific areas:', err);
      setError('Failed to load specific areas');
    } finally {
      setSubAreaLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ExpandedAreaView isDarkMode={isDarkMode}>
      <AreaCountContent isDarkMode={isDarkMode}>
        <div className="header">
          <h3>Area Distribution</h3>
          <button onClick={onClose} className="close-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="content">
          {isLoading ? (
            <SpinnerOverlay><Spinner isDarkMode={isDarkMode} /></SpinnerOverlay>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <AreaCountList isDarkMode={isDarkMode}>
              {areaDistribution.map((area, index) => (
                <div key={index}>
                  <div 
                    className="area-item expandable"
                    onClick={() => handleAreaClick(area.name)}
                  >
                    <div className="area-header">
                      <span className="area-name">
                        <svg 
                          className={`expand-icon ${expandedArea === area.name ? 'expanded' : ''}`}
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                        {area.name}
                      </span>
                      <span className="area-count">{area.count}</span>
                    </div>
                  </div>
                  {expandedArea === area.name && (
                    <div className="sub-areas">
                      {area.areas.map((subArea, subIndex) => (
                        <div key={subIndex}>
                          <div 
                            className="sub-area-item"
                            onClick={() => handleSubAreaClick(area.name, subArea)}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className="sub-area-name" style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <svg 
                                className={`expand-icon ${expandedSubArea === subArea.sub_areaid ? 'expanded' : ''}`}
                                width="12" 
                                height="12" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                                style={{ 
                                  flexShrink: 0,
                                  display: 'block'
                                }}
                              >
                                <path d="M9 5l7 7-7 7" />
                              </svg>
                              {subArea.name}
                            </span>
                            <span className="sub-area-count">{subArea.count}</span>
                          </div>
                          {expandedSubArea === subArea.sub_areaid && (
                            <div className="spec-areas" style={{ 
                              marginLeft: '24px',
                              marginTop: '8px',
                              display: 'grid',
                              gap: '4px'
                            }}>
                              {subAreaLoading ? (
                                <div style={{ padding: '8px', textAlign: 'center' }}>Loading...</div>
                              ) : (
                                specAreas[subArea.sub_areaid]?.map((specArea, specIndex) => (
                                  <div 
                                    key={specArea.spec_areaid}
                                    className="spec-area-item"
                                    style={{
                                      padding: '4px 8px',
                                      borderRadius: '4px',
                                      background: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(249, 115, 22, 0.03)',
                                      color: isDarkMode ? '#9ca3af' : '#6b7280',
                                      fontSize: '0.875rem'
                                    }}
                                  >
                                    {specArea.spec_areadesc}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </AreaCountList>
          )}
        </div>
      </AreaCountContent>
    </ExpandedAreaView>
  );
};

// Mock data for sub areas dropdown
const MOCK_SUB_AREAS = [
  "DIGOS 1", "DIGOS 2", "DIGOS 3", "DIGOS 4",
  "SOUTH 1", "SOUTH 2", "NORTH 1", "NORTH 2",
  "TAGUM 1", "TAGUM 2", "TAGUM 3", "TAGUM 4",
  "KIDAPAWAN 1", "KIDAPAWAN 2",
  "GENSAN 1", "GENSAN 2", "GENSAN 3", "GENSAN 4",
  "DAVAO ORIENTAL",
  "MIDSAYAP 1", "MIDSAYAP 2",
  "KORONADAL 1", "KORONADAL 2", "KORONADAL 3", "KORONADAL 4"
];

const EditAreaModal = ({ isOpen, onClose, area, isDarkMode, userId }) => {
  const [formData, setFormData] = useState({
    spec_areaid: '',
    spec_areadesc: '',
    main_areadesc: '',
    sub_areadesc: '',
    sub_areaid: '',
    isDisabled: false,
    remarks: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (area) {
      setFormData({
        spec_areaid: area.spec_areaid || '',
        spec_areadesc: area.spec_areadesc || '',
        main_areadesc: area.main_areadesc || '',
        sub_areadesc: area.sub_areadesc || '',
        sub_areaid: area.sub_areaid || '',
        isDisabled: false,
        remarks: ''
      });
    }
  }, [area]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Starting submission...');
      
      // Validate required fields
      if (!formData.spec_areaid || !formData.sub_areaid || !formData.spec_areadesc) {
        setError('All fields are required');
        return;
      }

      console.log('Validation passed...');
      
      const requestPayload = JSON.stringify({
        SpecAreaId: parseInt(formData.spec_areaid, 10),
        SubAreaId: formData.sub_areaid,
        Name: formData.spec_areadesc,
        Status: formData.isDisabled ? 0 : 1
      });

      console.log('Request payload:', requestPayload);

      const response = await axiosInstance.post(
        `${API_ENDPOINTS.SUBMIT_REQUEST}?initiatorId=${userId}&requestType=1`,
        requestPayload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Response received:', response.data);

      // Check if we have a refNo in the response (indicates success)
      if (response.data.refNo) {
        console.log('Request successful, proceeding with notifications...');
        try {
          console.log('Sending user notification...');
          const userNotifResponse = await axiosInstance.post(`${API_ENDPOINTS.SEND_UPDATE_REQ_NOTIF}?userId=${userId}`);
          console.log('User notification response:', userNotifResponse);

          console.log('Sending admin notification...');
          const adminNotifResponse = await axiosInstance.post(`${API_ENDPOINTS.SEND_ADMIN_UPDATE_NOTIF}?userId=${userId}`);
          console.log('Admin notification response:', adminNotifResponse);

          onClose();
        } catch (notifError) {
          console.error('Error sending notifications:', notifError);
          onClose();
        }
      } else {
        console.log('Request failed - no reference number received');
        setError(response.data.message || 'Failed to submit edit request');
      }
    } catch (err) {
      console.error('Error in submission:', err);
      setError('Failed to submit edit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <UploadModalOverlay>
      <EditModal isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h2>Edit Specific Area</h2>
          <button onClick={onClose} className="close-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                borderRadius: '0.375rem',
                backgroundColor: isDarkMode ? 'rgba(220, 38, 38, 0.1)' : 'rgba(254, 226, 226)',
                color: isDarkMode ? '#ef4444' : '#dc2626',
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(220, 38, 38, 0.2)' : 'rgba(220, 38, 38, 0.1)'
              }}>
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label>Specific Area ID</label>
              <input
                type="text"
                name="spec_areaid"
                value={formData.spec_areaid}
                disabled
                style={{
                  backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div className="form-group">
              <label>Main Area</label>
              <input
                type="text"
                name="main_areadesc"
                value={formData.main_areadesc}
                disabled
                style={{
                  backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div className="form-group">
              <label>Sub Area</label>
              <input
                type="text"
                name="sub_areadesc"
                value={formData.sub_areadesc}
                disabled
                style={{
                  backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div className="form-group">
              <label>Specific Area Name</label>
              <input
                type="text"
                name="spec_areadesc"
                value={formData.spec_areadesc}
                onChange={handleChange}
                placeholder="Enter new specific area name"
                required
              />
            </div>

            {/* <div className="form-group">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks for this change"
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                  backgroundColor: isDarkMode ? '#1F2937' : 'white',
                  color: isDarkMode ? '#e5e7eb' : '#374151',
                  resize: 'vertical'
                }}
              />
            </div> */}

            <div className="toggle-group">
              <div className="toggle-header">
                <label>Disable Area</label>
                <input
                  type="checkbox"
                  name="isDisabled"
                  checked={formData.isDisabled}
                  onChange={handleChange}
                />
              </div>
              <div className="toggle-description">
                Disabling this area will hide it from active assignments and reports.
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginTop: '1.5rem',
              justifyContent: 'flex-end' 
            }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                  backgroundColor: 'transparent',
                  color: isDarkMode ? '#e5e7eb' : '#374151',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: isDarkMode ? '#f97316' : '#ea580c',
                  color: 'white',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg 
                      className="animate-spin" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      style={{ width: '1rem', height: '1rem' }}
                    >
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10" />
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Edit Request'}
              </button>
            </div>
          </div>
        </form>
      </EditModal>
    </UploadModalOverlay>
  );
};

const DataDictionaryModalComponent = ({ isOpen, onClose, isDarkMode, userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [areaData, setAreaData] = useState([]);
  const [areaCounts, setAreaCounts] = useState({ main: 0, sub: 0, spec: 0 });
  const [showAreaCounts, setShowAreaCounts] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMainArea, setSelectedMainArea] = useState('');
  const [selectedSubArea, setSelectedSubArea] = useState('');
  const [sortField, setSortField] = useState('main_areadesc');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [10, 20, 50, 100];

  // Get unique main areas and sub areas for filters
  const mainAreas = useMemo(() => {
    const uniqueMainAreas = [...new Set(areaData.map(item => item.main_areadesc))];
    return uniqueMainAreas.sort();
  }, [areaData]);

  const subAreas = useMemo(() => {
    let filteredSubAreas = areaData;
    if (selectedMainArea) {
      filteredSubAreas = areaData.filter(item => item.main_areadesc === selectedMainArea);
    }
    const uniqueSubAreas = [...new Set(filteredSubAreas.map(item => item.sub_areadesc))];
    return uniqueSubAreas.sort();
  }, [areaData, selectedMainArea]);

  // Get filtered and sorted data
  const filteredAndSortedData = useMemo(() => {
    let filtered = areaData;

    if (selectedMainArea) {
      filtered = filtered.filter(item => item.main_areadesc === selectedMainArea);
    }

    if (selectedSubArea) {
      filtered = filtered.filter(item => item.sub_areadesc === selectedSubArea);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [areaData, selectedMainArea, selectedSubArea, searchTerm, sortField, sortOrder]);

  // Calculate pagination values
  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMainArea, selectedSubArea, searchTerm, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ 
          marginLeft: '4px',
          display: 'inline-block',
          verticalAlign: 'middle'
        }}
      >
        {sortOrder === 'asc' ? (
          <path d="M8 12l4-4 4 4M8 16l4 4 4-4" />
        ) : (
          <path d="M8 8l4 4 4-4M8 12l4 4 4-4" />
        )}
      </svg>
    );
  };

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch area counts
          const countsResponse = await axiosInstance.get(API_ENDPOINTS.LOAD_ALL_AREA_COUNTS);
          if (countsResponse.data.status === 200) {
            const counts = countsResponse.data.data[0];
            setAreaCounts({
              main: counts.main_areacount,
              sub: counts.sub_areacount,
              spec: counts.spec_areacount
            });
          }

          // Fetch area data
          const areasResponse = await axiosInstance.get(API_ENDPOINTS.LOAD_ALL_AREAS);
          if (areasResponse.data.status === 200) {
            setAreaData(areasResponse.data.data);
          }
        } catch (err) {
          setError('Failed to load area data');
          console.error('Error fetching area data:', err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <UploadModalOverlay>
      <DataDictionaryModal isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h2>Area Data Dictionary</h2>
          <button onClick={onClose} className="close-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '1rem'
          }}>
            <div style={{ flex: '1' }}>
              <SearchInput
                type="text"
                placeholder="Search areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                isDarkMode={isDarkMode}
              />
            </div>
            <select
              value={selectedMainArea}
              onChange={(e) => setSelectedMainArea(e.target.value)}
              style={{
                padding: '0.625rem',
                borderRadius: '0.5rem',
                border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                background: isDarkMode ? '#1F2937' : 'white',
                color: isDarkMode ? '#e5e7eb' : '#374151',
                minWidth: '150px'
              }}
            >
              <option value="">All Main Areas</option>
              {mainAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <select
              value={selectedSubArea}
              onChange={(e) => setSelectedSubArea(e.target.value)}
              style={{
                padding: '0.625rem',
                borderRadius: '0.5rem',
                border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                background: isDarkMode ? '#1F2937' : 'white',
                color: isDarkMode ? '#e5e7eb' : '#374151',
                minWidth: '150px'
              }}
            >
              <option value="">All Sub Areas</option>
              {subAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-body">
          {isLoading ? (
            <SpinnerOverlay><Spinner isDarkMode={isDarkMode} /></SpinnerOverlay>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <StatsGrid>
                <StatCard isDarkMode={isDarkMode}>
                  <div className="stat-label">Main Areas</div>
                  <div className="stat-value">{areaCounts.main}</div>
                  <div className="stat-description">Total main areas defined</div>
                </StatCard>
                <StatCard 
                  isDarkMode={isDarkMode} 
                  isClickable={true}
                  onClick={() => setShowAreaCounts(true)}
                  style={{ position: 'relative' }}
                >
                  <div className="stat-label">Sub Areas</div>
                  <div className="stat-value">{areaCounts.sub}</div>
                  <div className="stat-description">Click to view distribution</div>
                </StatCard>
                <StatCard isDarkMode={isDarkMode}>
                  <div className="stat-label">Specific Areas</div>
                  <div className="stat-value">{areaCounts.spec}</div>
                  <div className="stat-description">Total specific locations</div>
                </StatCard>
              </StatsGrid>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1rem',
                color: isDarkMode ? '#e5e7eb' : '#374151'
              }}>
                <div style={{ fontSize: '0.875rem' }}>
                  Showing {startIndex + 1} to {endIndex} of {totalItems} entries
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem' }}>Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                      background: isDarkMode ? '#1F2937' : 'white',
                      color: isDarkMode ? '#e5e7eb' : '#374151'
                    }}
                  >
                    {pageSizeOptions.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.875rem' }}>entries</span>
                </div>
              </div>
              <DataTable isDarkMode={isDarkMode}>
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('main_areadesc')} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Main Area
                          <SortIcon field="main_areadesc" />
                        </div>
                      </th>
                      <th onClick={() => handleSort('sub_areadesc')} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Sub Area
                          <SortIcon field="sub_areadesc" />
                        </div>
                      </th>
                      <th onClick={() => handleSort('spec_areadesc')} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Specific Area
                          <SortIcon field="spec_areadesc" />
                        </div>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.main_areadesc}</td>
                        <td>{item.sub_areadesc}</td>
                        <td>{item.spec_areadesc}</td>
                        <td>
                          <ActionButton
                            isDarkMode={isDarkMode}
                            onClick={() => setEditingArea(item)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </ActionButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DataTable>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '1rem',
                padding: '0.5rem',
                borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
              }}>
                <div style={{ color: isDarkMode ? '#e5e7eb' : '#374151', fontSize: '0.875rem' }}>
                  Page {currentPage} of {totalPages}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      background: isDarkMode ? '#374151' : '#f3f4f6',
                      color: isDarkMode ? '#e5e7eb' : '#374151',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      background: isDarkMode ? '#374151' : '#f3f4f6',
                      color: isDarkMode ? '#e5e7eb' : '#374151',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      background: isDarkMode ? '#374151' : '#f3f4f6',
                      color: isDarkMode ? '#e5e7eb' : '#374151',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      background: isDarkMode ? '#374151' : '#f3f4f6',
                      color: isDarkMode ? '#e5e7eb' : '#374151',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                  >
                    Last
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </DataDictionaryModal>
      <AreaCountsModal
        isOpen={showAreaCounts}
        onClose={() => setShowAreaCounts(false)}
        isDarkMode={isDarkMode}
      />
      <EditAreaModal
        isOpen={editingArea !== null}
        onClose={() => setEditingArea(null)}
        area={editingArea}
        isDarkMode={isDarkMode}
        userId={userId}
      />
    </UploadModalOverlay>
  );
};

const ProductLoanTypesModal = ({ isOpen, onClose, isDarkMode }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [loanTypes, setLoanTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({ product: 0, main: 0, sub: 0 });
  // Pagination for loan types table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [10, 20, 50, 100];

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      setCompanies([]);
      setSelectedCompanyId('');
      setLoanTypes([]);
      setCounts({ product: 0, main: 0, sub: 0 });
      setCurrentPage(1);
      // Load finance companies
      axiosInstance.get(API_ENDPOINTS.LOAD_FIN_COMPANIES)
        .then(res => {
          if (res.data.status === 200) {
            setCompanies(res.data.data);
          } else {
            setError('Failed to load finance companies');
          }
        })
        .catch(() => setError('Failed to load finance companies'))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedCompanyId) {
      setIsLoading(true);
      setError(null);
      setLoanTypes([]);
      setCounts({ product: 0, main: 0, sub: 0 });
      setCurrentPage(1);
      axiosInstance.get(`${API_ENDPOINTS.LOAD_ALL_LOAN_TYPES}?companyid=${selectedCompanyId}`)
        .then(res => {
          if (res.data.status === 200) {
            setLoanTypes(res.data.data);
            // Calculate counts
            const mainLoanSet = new Set();
            const subLoanSet = new Set();
            const productTypeSet = new Set();
            res.data.data.forEach(item => {
              if (item.main_loanid) mainLoanSet.add(item.main_loanid);
              if (item.sub_loanid) subLoanSet.add(item.sub_loanid);
              if (item.product_typeid) productTypeSet.add(item.product_typeid);
            });
            setCounts({
              product: productTypeSet.size || 0,
              main: mainLoanSet.size || 0,
              sub: subLoanSet.size || 0
            });
          } else {
            setError('Failed to load loan types');
          }
        })
        .catch(() => setError('Failed to load loan types'))
        .finally(() => setIsLoading(false));
    }
  }, [selectedCompanyId]);

  // Pagination logic
  const totalItems = loanTypes.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = loanTypes.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  if (!isOpen) return null;

  return (
    <UploadModalOverlay>
      <DataDictionaryModal isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h2>Manage Loan Types</h2>
          <button onClick={onClose} className="close-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '1rem'
          }}>
            <select
              value={selectedCompanyId}
              onChange={e => setSelectedCompanyId(e.target.value)}
              style={{
                padding: '0.625rem',
                borderRadius: '0.5rem',
                border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                background: isDarkMode ? '#1F2937' : 'white',
                color: isDarkMode ? '#e5e7eb' : '#374151',
                minWidth: '200px'
              }}
            >
              <option value="">Select Finance Company</option>
              {companies.map(company => (
                <option key={company.company_id} value={company.company_id}>{company.company_name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-body">
          {isLoading ? (
            <SpinnerOverlay><Spinner isDarkMode={isDarkMode} /></SpinnerOverlay>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <StatsGrid>
                <StatCard isDarkMode={isDarkMode}>
                  <div className="stat-label">Main Loan Types</div>
                  <div className="stat-value">{counts.main}</div>
                  <div className="stat-description">Total main loan types</div>
                </StatCard>
                <StatCard isDarkMode={isDarkMode}>
                  <div className="stat-label">Sub Loan Types</div>
                  <div className="stat-value">{counts.sub}</div>
                  <div className="stat-description">Total sub loan types</div>
                </StatCard>
              </StatsGrid>
              <div style={{ marginTop: '2rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem',
                  color: isDarkMode ? '#e5e7eb' : '#374151'
                }}>
                  <div style={{ fontSize: '0.875rem' }}>
                    Showing {startIndex + 1} to {endIndex} of {totalItems} entries
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem' }}>Show</span>
                    <select
                      value={pageSize}
                      onChange={e => handlePageSizeChange(e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                        background: isDarkMode ? '#1F2937' : 'white',
                        color: isDarkMode ? '#e5e7eb' : '#374151'
                      }}
                    >
                      {pageSizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                    <span style={{ fontSize: '0.875rem' }}>entries</span>
                  </div>
                </div>
                <DataTable isDarkMode={isDarkMode}>
                  <table>
                    <thead>
                      <tr>
                        <th>Main Loan Type</th>
                        <th>Sub Loan Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length === 0 ? (
                        <tr>
                          <td colSpan={2} style={{ textAlign: 'center', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                            No loan types found for this company.
                          </td>
                        </tr>
                      ) : (
                        currentData.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.main_loandesc || 'N/A'}</td>
                            <td>{item.sub_loandesc ? item.sub_loandesc : 'None'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </DataTable>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '1rem',
                padding: '0.5rem',
                borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
              }}>
                <div style={{ color: isDarkMode ? '#e5e7eb' : '#374151', fontSize: '0.875rem' }}>
                  Page {currentPage} of {totalPages}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      background: isDarkMode ? '#374151' : '#f3f4f6',
                      color: isDarkMode ? '#e5e7eb' : '#374151',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  >
                    First
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      background: isDarkMode ? '#374151' : '#f3f4f6',
                      color: isDarkMode ? '#e5e7eb' : '#374151',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1
                    }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      background: isDarkMode ? '#374151' : '#f3f4f6',
                      color: isDarkMode ? '#e5e7eb' : '#374151',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      border: 'none',
                      background: isDarkMode ? '#374151' : '#f3f4f6',
                      color: isDarkMode ? '#e5e7eb' : '#374151',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1
                    }}
                  >
                    Last
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </DataDictionaryModal>
    </UploadModalOverlay>
  );
};

export default function SystemConfigurationPage() {
  const [activeNav, setActiveNav] = useState('system');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [reportsList, setReportsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Set your desired page size
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [userId, setUserId] = useState(" ");
  const [sortField, setSortField] = useState('age');
  const [selectedFilters, setSelectedFilters] = useState({
    age: false,
    borrower_name: false,
    months: false,
    overdue: false,
    balance: false,
    remain: false,
  });
  const [borrowerList, setBorrowerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDataDictionaryModalOpen, setIsDataDictionaryModalOpen] = useState(false);
  const [isProductLoanTypesModalOpen, setIsProductLoanTypesModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get userId from token when component mounts
    const getUserFromToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.UserId);
          // Wait for userId to be set, then check password status
          const response = await axiosInstance.get(`${API_ENDPOINTS.PW_STATUS}?userId=${decoded.UserId}`);
          if (response.data.data.pw_reset_req === "True") {
            setIsModalOpen(true);
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    getUserFromToken();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let endpoint = API_ENDPOINTS.LOAD_MASTERLIST;
        const params = new URLSearchParams({
          page: currentPage,
          pageSize: pageSize,
        });

        // Check if filters are applied
        if (selectedCompanies.length > 0 || sortField !== 'age' || sortOrder !== 'asc') {
          endpoint = API_ENDPOINTS.LOAD_MASTERLIST_FILTERED;
          if (selectedCompanies.length > 0) {
            params.append('collectionCompany', selectedCompanies.join(','));
          }
          params.append('sortField', sortField);
          params.append('sortOrder', sortOrder);
        }

        const response = await axiosInstance.get(`${endpoint}?${params.toString()}`);
        const { data, totalPages } = response.data;
        setReportsList(Array.isArray(data) ? data : []);
        setTotalPages(totalPages);
        if (data.length === 0) {
          setError('No records found.');
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        setError('Failed to fetch reports.');
        setReportsList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [currentPage, selectedCompanies, sortField, sortOrder]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.LOAD_COMPANIES);
        const activeCompanies = response.data.data.filter(company => company.status);
        setCompanies(activeCompanies);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchBorrowers = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.LOAD_BORROWER_LIST);
        if (response.data.status === 200) {
          setBorrowerList(response.data.data);
          setTotalPages(Math.ceil(response.data.data.length / pageSize));
        }
      } catch (error) {
        console.error('Error fetching borrower list:', error);
        setError('Failed to fetch borrower list.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorrowers();
  }, [pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleNewReportClick = () => {
    setIsUploadModalOpen(true);
  };

  const applyFilters = () => {
    setIsFilterLoading(true);
    let filteredReports = reportsList;

    if (selectedCompanies.length > 0) {
      filteredReports = filteredReports.filter(report =>
        selectedCompanies.includes(report.collection_company)
      );
    }

    Object.keys(selectedFilters).forEach(filterName => {
      if (selectedFilters[filterName]) {
        filteredReports = filteredReports.filter(report => report[filterName]);
      }
    });

    filteredReports.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    setReportsList(filteredReports);
    setIsFilterLoading(false);
  };

  const filteredBorrowers = borrowerList.filter(borrower => {
    const nameMatch = borrower.borrower_name.toLowerCase().includes(searchTerm.toLowerCase());
    const accountMatch = borrower.primary_account_number.toString().includes(searchTerm);
    const idMatch = borrower.borrower_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return nameMatch || accountMatch || idMatch;
  });

  const downloadPDF = () => {
    console.log('Download PDF triggered');
    console.log('Borrower List:', borrowerList);

    const doc = new jsPDF();

    // Base64 string of the logo (replace with your actual Base64 string)
    const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...'; // Truncated for brevity

    // Add the logo to the PDF using the Base64 string
    doc.addImage(logoBase64, 'JPEG', 15, 10, 40, 20); // Adjust the position and size as needed

    // Add title
    doc.text('Active Borrower List', 14, 40); // Adjust Y position to avoid overlap with the logo

    autoTable(doc, {
      startY: 50, // Adjust startY to avoid overlap with the title
      head: [['Borrower ID', 'Account Number', 'Name', 'Date Updated']],
      body: borrowerList.map(borrower => [
        borrower.borrower_id,
        borrower.primary_account_number,
        borrower.borrower_name.toUpperCase(),
        new Date(borrower.date_updated).toLocaleDateString(),
      ]),
    });

    doc.save('borrower_list.pdf');
  };

  const configurationCards = [
    {
      title: "Area Data Dictionary",
      description: "View and manage area definitions including main areas, sub-areas, and specific locations",
      icon: (
        <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      onClick: () => setIsDataDictionaryModalOpen(true),
      isClickable: true
    },
    {
      title: "Manage Loan Types",
      description: "View & Manage Main & Sub Loan Types for Finance Companies",
      icon: (
        <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      onClick: () => setIsProductLoanTypesModalOpen(true),
      isClickable: true
    },
    {
      title: "System Settings",
      description: "Manage global system configurations and preferences",
      icon: (
        <svg className="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      isComingSoon: true
    }
  ];

  return (
    <DashboardContainer isDarkMode={isDarkMode}>
      {isFilterLoading && <SpinnerOverlay><Spinner /></SpinnerOverlay>}
      <Sidebar isOpen={isMobileMenuOpen} isDarkMode={isDarkMode}>
        

        <div className="flex flex-col flex-1 mt-4">
          <NavPane 
            activeNav={activeNav} 
            setActiveNav={setActiveNav}
            isDarkMode={isDarkMode}
            userId={userId}
          />
        </div>
      </Sidebar>

      <MainContent isDarkMode={isDarkMode}>
        <TopBar isDarkMode={isDarkMode}>
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="welcome-section">
              <h1 className="text-2xl font-light">System Configuration</h1>
              <p className="text-sm text-gray-500">Manage system settings and configurations</p>
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

        <div className="p-6">
          <ConfigurationGrid>
            {configurationCards.map((card, index) => (
              <ConfigCard 
                key={index}
                isDarkMode={isDarkMode}
                isClickable={card.isClickable}
                onClick={card.onClick}
              >
                <div className="card-content">
                  {card.icon}
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.description}</p>
                  {card.isComingSoon && (
                    <span className="coming-soon-badge">Coming Soon</span>
                  )}
                </div>
              </ConfigCard>
            ))}
          </ConfigurationGrid>
        </div>
      </MainContent>

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <DataDictionaryModalComponent
        isOpen={isDataDictionaryModalOpen}
        onClose={() => setIsDataDictionaryModalOpen(false)}
        isDarkMode={isDarkMode}
        userId={userId}
      />
      <ProductLoanTypesModal
        isOpen={isProductLoanTypesModalOpen}
        onClose={() => setIsProductLoanTypesModalOpen(false)}
        isDarkMode={isDarkMode}
      />
      <Bot userId={userId}/> 
    </DashboardContainer>
  );
} 