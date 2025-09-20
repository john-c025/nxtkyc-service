'use client';
import Bot from '../Objects/Bot';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import NotificationButton from '../Objects/NotificationButton';
import {
  DashboardContainer,
  Sidebar,
  TopBar,
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
  ReportCardIcon,
  SectionTitle,
  MainContent,
  StatsContainer,
  StatCard
} from './MainMenuStyled';
import NavPane from '../Objects/NavPane';
import FilterModal from '../Objects/FilterModal';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { FaFileAlt, FaUserShield, FaCog, FaArrowUp, FaArrowDown, FaGavel,FaClipboardCheck,FaPhone,FaMotorcycle,FaDatabase,FaUpload } from 'react-icons/fa';

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

export default function MainMenu() {
  const [activeNav, setActiveNav] = useState('reports');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [reportsList, setReportsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(7); // Set your desired page size
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [sortField, setSortField] = useState('age');
  const [userAccessLevel, setUserAccessLevel] = useState(null);
  const [userDetails, setUserDetails] = useState({
    fName: '',
    sName: '',
    positionDesc: '',
    positionId: null,
    profilePic: null,
    mainCompanyName: '',
    subCompanyName: ''
  });
  const [userPosition, setUserPosition] = useState({
    userId: '',
    positionId: null,
    positionDesc: ''
  });
  const [selectedFilters, setSelectedFilters] = useState({
    age: false, 
    borrower_name: false,
    months: false,
    overdue: false,
    balance: false,
    remain: false,
  });
  const allReports = [
    { title: 'INTEGRATED COLLECTION REPORTS MANAGEMENT SYSTEM', date: '', link: '/irs', backgroundImage: '../../assets/type.png/person.png', icon: <FaDatabase />, description: 'Access the Borrower Information System and start managing borrower information' },
    { title: 'COLLECTOR MANAGEMENT SYSTEM', date: '', link: '/telecollector-view', backgroundImage: '../../assets/images/law.png', icon: <FaPhone />, description: 'Access the Telecollector Dashboard' },
    { title: 'HR INFORMATION SYSTEM', date: '', link: '/ca-view', backgroundImage: '../../assets/images/law.png', icon: <FaFileAlt />, description: 'Access the Collection Associate Dashboard' },
    { title: 'LEGAL MANAGEMENT SYSTEM', date: '', link: '/irs-amend', backgroundImage: '/path/to/SUAM.jpg', icon: <FaClipboardCheck />, description: 'Manage and configure system user access' },
    { title: 'Upload Masterlist', date: '', link: '/irs-upload', backgroundImage: '/path/to/SC.jpg', icon: <FaUpload />, description: 'Manage and configure system settings' }
  ];


  // Filter reports based on user position
  const getFilteredReports = () => {
    const positionDesc = userPosition.positionDesc?.toUpperCase() || '';
    
    // If ADMIN, show all menu cards
    if (positionDesc.includes('ADMIN')) {
      return allReports;
    }
    
    // If CA (Collection Associate), show all except Telecollector Dashboard
    if (positionDesc.includes('CA') || positionDesc.includes('COLLECTION ASSOCIATE')) {
      return allReports.filter(report => report.title !== 'Telecollector Dashboard');
    }
    
    // If Telecollector, show all except Collection Associate Dashboard
    if (positionDesc.includes('TELECOLLECTOR')) {
      return allReports.filter(report => report.title !== 'Collection Associate Dashboard');
    }
    
    // Default: show basic reports (Masterlists, Data Management, Upload)
    return allReports.filter(report => 
      !report.title.includes('Dashboard') || 
      report.title === 'Masterlists' || 
      report.title === 'Data Management' || 
      report.title === 'Upload Masterlist'
    );
  };

  // Combine reports based on access level and position
  const sampleReports = getFilteredReports();

  const stats = [
    {
      label: 'Active Users',
      value: '6',
      change: '+6%',
      isPositive: true
    },
    {
      label: 'System Load',
      value: '10%',
      change: '-2.3%',
      isPositive: true
    },
    {
      label: 'Response Time',
      value: '0.2 ms',
      change: '+0.1s',
      isPositive: true
    }
  ];

  const [systemAccess, setSystemAccess] = useState({
    has_cirs_access: false,
    has_mgmt_access: false,
    has_collector_view: false,
    has_dcs_access: false,
    has_admin_access: false
  });


  useEffect(() => {
    // Get userId from token when component mounts
    const getUserFromToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.UserId);
          
          // Fetch user position details
          await fetchUserPosition(decoded.UserId);
          
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

  const fetchUserPosition = async (userId) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.GET_USER_POSITION_DETAILS}?userId=${userId}`);
      if (response.status === 200) {
        setUserPosition(response.data);
      }
    } catch (error) {
      console.error('Error fetching user position:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const userResponse = await axiosInstance.get(`${API_ENDPOINTS.USER_DETAILS}?userId=${userId}`);
        const {
          fName,
          sName,
          positionDesc,
          positionId,
          profilePicUrl,
          mainCompanyName,
          subCompanyName,
          accessLevel
        } = userResponse.data;
        setUserDetails({
          fName,
          sName,
          positionDesc,
          positionId,
          profilePic: profilePicUrl,
          mainCompanyName,
          subCompanyName
        });
        setUserAccessLevel(accessLevel);
        
        if (userResponse.data && userResponse.data.positionId) {
          const accessResponse = await axiosInstance.get(
            `${API_ENDPOINTS.LOAD_SYS_MODULE_ACCESS_LIST_BY_POSITION}?positionId=${userResponse.data.positionId}`
          );
          setSystemAccess(accessResponse.data.data);
        }

        // Fetch profile picture
        await fetchProfilePic(userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  

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

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleNewReportClick = () => {
    setIsUploadModalOpen(false);
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

  // Add animation delay for staggered card appearance
  const getAnimationDelay = (index) => `${index * 0.1}s`;

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
            <div className="welcome-section">
              <h1 className="text-2xl font-light mb-1">Integrated Collection Reports Management System</h1>
              <p className="text-sm text-gray-500">Access core system & management modules and configurations</p>
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
          {isLoading && (
            <SpinnerOverlay>
              <Spinner />
            </SpinnerOverlay>
          )}
{/*           
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
          </StatsContainer> */}

          <ReportCardsContainer>
            {sampleReports.map((report, index) => (
              <ReportCard 
                key={index} 
                isDarkMode={isDarkMode} 
                onClick={() => window.location.href = report.link}
                backgroundImage={report.backgroundImage}
                style={{ animationDelay: getAnimationDelay(index + stats.length) }}
              >
                <div className="status-indicator" />
                <div className="background-icon">{report.icon}</div>
                <div className="content">
                  <div className="card-header">
                    <span className="card-title">{report.title}</span>
                  </div>
                  <div className="card-description">
                    {report.description || 'Manage and configure system settings and user access'}
                  </div>
                </div>
              </ReportCard>
            ))}
            <NewReportButton 
              isDarkMode={isDarkMode} 
              onClick={handleNewReportClick}
              style={{ animationDelay: getAnimationDelay(sampleReports.length + stats.length) }}
            >
              <span className="plus-icon">?</span>
              <span className="text">Coming Soon</span>
            </NewReportButton>
          </ReportCardsContainer>
        </div>
      </MainContent>

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <Bot userId={userId}/> 
    </DashboardContainer>
  );
}