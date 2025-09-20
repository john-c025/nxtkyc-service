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
  SearchInput
} from './BISDirectoryStyled';
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

export default function BISDirectory() {
  const [activeNav, setActiveNav] = useState('reports');
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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
  const router = useRouter();

  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          const decodedUserId = decoded.UserId;
          console.log("Token decoded, userId:", decodedUserId);
          
          if (!decodedUserId) {
            console.error("No UserId found in token");
            return;
          }
          
          // Set userId first
          setUserId(decodedUserId);
          // Wait for userId to be set, then check password status
          const response = await axiosInstance.get(`${API_ENDPOINTS.PW_STATUS}?userId=${decodedUserId}`);
          if (response.data.data.pw_reset_req === "True") {
            setIsModalOpen(true);
          }

          // Fetch user details
          const userResponse = await axiosInstance.get(`${API_ENDPOINTS.USER_DETAILS}?userId=${decodedUserId}`);
          // setUserDetails(userResponse.data.data); // This line was not in the new_code, so it's removed.
          console.log("User Details:", userResponse.data);
          
          // Now that we have userId and user details, fetch borrowers
          await fetchBorrowers(decodedUserId, userResponse.data.mainCompanyId);
          
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

  const fetchBorrowers = async (currentUserId, companyId) => {
    if (!currentUserId || !companyId) {
      console.error('Missing userId or companyId for fetchBorrowers');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.LOAD_BORROWER_LIST}?companyId=${companyId}`
      );
      
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
                <h1 className="text-2xl font-light">Borrower Information System</h1>
                <p className="text-sm">BIS!</p>
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
          {/* Report Cards Grid */}
          {/* <ReportCardsContainer>
            
            <NewReportButton isDarkMode={isDarkMode} onClick={handleNewReportClick}>
              <span className="plus-icon">+</span>
              <span className="text">Process Borrower Accoounts</span>
            </NewReportButton>
          </ReportCardsContainer> */}

          {/* Reports Header */}
          <ReportsHeader>
            <div className="left-section">
              {/* <button onClick={() => setIsFilterModalOpen(true)}>Filter</button>
              <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onSave={(selected, filters) => {
                  setSelectedCompanies(selected);
                  setSelectedFilters(filters);
                  const activeFilter = Object.keys(filters).find(key => filters[key]);
                  setSortField(activeFilter || 'age');
                  applyFilters();
                }}
                companies={companies}
                selectedCompanies={selectedCompanies}
                isDarkMode={isDarkMode}
                setSortOrder={setSortOrder}
              /> */}
              
              <SearchInput
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                isDarkMode={isDarkMode}
              />
            </div>
            <div className="right-section">
              <Button
                variant="primary"
                isDarkMode={isDarkMode}
                onClick={() => {
                  console.log('Button clicked');
                  downloadPDF();
                }}
              >
                Download Borrower List
              </Button>
              <Button variant="primary">Refresh</Button>
            </div>
          </ReportsHeader>

          {/* Reports Table */}
          <ReportsTableContainer>
            {isLoading && (
              <SpinnerOverlay>
                <Spinner />
              </SpinnerOverlay>
            )}
            {filteredBorrowers.length > 0 ? (
              <ReportsTable isDarkMode={isDarkMode}>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: '20%' }}>Borrower ID</th>
                        <th style={{ width: '20%' }}>Account Number</th>
                        <th style={{ width: '20%' }}>Name</th>
                        <th style={{ width: '20%' }}>Date Updated</th>
                        <th style={{ width: '10%' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBorrowers
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((borrower, index) => (
                          <tr key={index}>
                            <td>{borrower.borrower_id}</td>
                            <td>{borrower.primary_account_number}</td>
                            <td><strong>{borrower.borrower_name.toUpperCase()}</strong></td>
                            <td>{new Date(borrower.date_updated).toLocaleDateString()}</td>
                            <td>
                              <Link href={`/bis_borrower_profile?borrowerId=${borrower.primary_account_number}`}>
                                <Button variant="primary" isDarkMode={isDarkMode}>
                                  Open Profile
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </ReportsTable>
            ) : (
              !isLoading && <div>No borrowers available.</div>
            )}
            
          </ReportsTableContainer>
          <PaginationControls isDarkMode={isDarkMode}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </PaginationControls>
        </div>
      </MainContent>

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <Bot userId={userId} /> 
    </DashboardContainer>
  );
} 