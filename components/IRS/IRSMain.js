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
} from './IRSMainStyled';
import NavPane from '../Objects/NavPane';
import FilterModal from '../Objects/FilterModal';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import DownloadModal from '../Objects/DownloadModal';
import * as XLSX from 'xlsx';

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

export default function IRSMain() {
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
  const [userId, setUserId] = useState("0000000001");
  const [sortField, setSortField] = useState('age');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({ fName: '', sName: '', positionDesc: '' });
  const [selectedFilters, setSelectedFilters] = useState({
    age: false,
    borrower_name: false,
    months: false,
    overdue: false,
    balance: false,
    remain: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const sampleReports = [
    { title: 'Master List - 3 Months Ago', date: 'Modified 13.05.20 at 13:04' },
    { title: 'Master List - 2 Months Ago', date: 'Modified 13.05.20 at 15:21' },
    { title: 'Master List - Prev Month', date: 'Modified 14.05.20 at 12:10' }
  ];
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.USER_DETAILS}?userId=${userId}`);
        const { fName, sName, positionDesc } = response.data;
        setUserDetails({ fName, sName, positionDesc });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [userId]);
  useEffect(() => {
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
    const fetchReports = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, totalPages } = await fetchFilteredReports(currentPage, pageSize);
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
    // Example of adding a class for animations on load
    const cards = document.querySelectorAll('.report-card');
    cards.forEach(card => {
      card.classList.add('animate');
    });
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleNewReportClick = () => {
    // setIsUploadModalOpen(true);
    window.location.href = '/irs-upload';
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

  const filteredReports = reportsList.filter(report => {
    const nameMatch = report.borrower_name.toLowerCase().includes(searchTerm.toLowerCase());
    const collectorMatch = report.field_collector.toLowerCase().includes(searchTerm.toLowerCase());
    const pnMatch = report.pn_number?.toString().includes(searchTerm);
    const accountMatch = report.account_number?.toString().includes(searchTerm);
    return nameMatch || collectorMatch || pnMatch || accountMatch;
  });

  const downloadPDF = async () => {
    setIsLoading(true);
    try {
      let allReports = [];
      let currentPage = 1;
      let totalPages = 10;

      // Fetch all reports by looping through pages
      do {
        const { data, totalPages: fetchedTotalPages } = await fetchFilteredReports(currentPage, 100);
        allReports = allReports.concat(data);
        totalPages = fetchedTotalPages; // Update total pages
        currentPage++;
      } while (currentPage <= totalPages);

      // Apply filters to get the filtered reports
      const filteredReports = allReports.filter(report => {
        const nameMatch = report.borrower_name.toLowerCase().includes(searchTerm.toLowerCase());
        const collectorMatch = report.field_collector.toLowerCase().includes(searchTerm.toLowerCase());
        const pnMatch = report.pn_number?.toString().includes(searchTerm);
        const accountMatch = report.account_number?.toString().includes(searchTerm);
        return nameMatch || collectorMatch || pnMatch || accountMatch;
      });

      // Generate PDF
      const doc = new jsPDF();
      const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...'; // Replace with actual logo

      doc.addImage(logoBase64, 'JPEG', 15, 10, 40, 20);
      doc.text('Active Reports List', 14, 40);

      autoTable(doc, {
        startY: 50,
        head: [['PN Number', 'Account Number / Reference', 'Overdue', 'Balance', 'Name', 'Date Updated']],
        body: filteredReports.map(report => [
          report.pn_number,
          report.refno,
          report.overdue,
          report.balance,
          report.borrower_name.toUpperCase(),
          new Date(report.date_updated).toLocaleDateString(),
        ]),
      });

      doc.save('reports_list.pdf');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadXLSX = async () => {
    setIsLoading(true);
    try {
      let allReports = [];
      let currentPage = 1;
      let totalPages = 1;

      // Fetch all reports by looping through pages
      do {
        const { data, totalPages: fetchedTotalPages } = await fetchFilteredReports(currentPage, 100);
        allReports = allReports.concat(data);
        totalPages = fetchedTotalPages; // Update total pages
        currentPage++;
      } while (currentPage <= totalPages);

      // Apply filters to get the filtered reports
      const filteredReports = allReports.filter(report => {
        const nameMatch = report.borrower_name.toLowerCase().includes(searchTerm.toLowerCase());
        const collectorMatch = report.field_collector.toLowerCase().includes(searchTerm.toLowerCase());
        const pnMatch = report.pn_number?.toString().includes(searchTerm);
        const accountMatch = report.account_number?.toString().includes(searchTerm);
        return nameMatch || collectorMatch || pnMatch || accountMatch;
      });

      // Prepare data for XLSX to match the table columns
      const worksheetData = filteredReports.map(report => ({
        'Branch': report.branch,
        'Field Collector': report.field_collector,
        'Month': report.month,
        'Age': report.age,
        'PN Number': report.pn_number,
        'Reference Number': report.refno,
        'Borrower Name': report.borrower_name.toUpperCase(),
        'Terms': report.terms,
        'Maturity': new Date(report.maturity).toLocaleDateString(),
        'First Due': new Date(report.first_due).toLocaleDateString(),
        'Last Applied': new Date(report.last_applied).toLocaleDateString(),
        'Last Payment Date': report.last_payment_date ? new Date(report.last_payment_date).toLocaleDateString() : 'N/A',
        'Collectibles': report.collectibles,
        'Amortization': report.amortization,
        'Paid': report.paid,
        'Remain': report.remain,
        'Overdue': report.overdue,
        'Balance': report.balance,
        'Principal': report.principal,
        'Loan Type': report.loan_type,
        'AO': report.ao,
        'CM': report.cm,
        'Address': report.address,
        'Area': report.area,
        'Collection Company': report.collection_company,
        'Contact No.': report.contact_no,
        'Product Type': report.product_type,
        'Balance Less Amortization': report.balance_less_amount,
        'Date Last Updated': new Date(report.date_updated).toLocaleDateString(),
      }));

      // Create a new workbook and add the worksheet
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Active Reports');

      // Generate XLSX file and trigger download
      XLSX.writeFile(workbook, 'reports_list.xlsx');
    } catch (error) {
      console.error('Error downloading XLSX:', error);
      setError('Failed to download XLSX.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (format) => {
    if (format === 'pdf') {
      await downloadPDF();
    } else if (format === 'xlsx') {
      await downloadXLSX();
    }
  };

  const fetchFilteredReports = async (page, pageSize) => {
    let endpoint = API_ENDPOINTS.LOAD_MASTERLIST;
    const params = new URLSearchParams({
      page: page,
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
    return response.data; // Return the data for further processing
  };

  return (
    <DashboardContainer isDarkMode={isDarkMode}>
      {isFilterLoading && <SpinnerOverlay><Spinner /></SpinnerOverlay>}
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
            <div className="top-content">
              <div className="welcome-section">
                <h1 className="text-2xl font-light">Masterlist Records</h1>
                <p className="text-sm"> Masterlist Data</p>
              </div>
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
          <ReportCardsContainer>
            {sampleReports.map((report, index) => (
              <ReportCard key={index} isDarkMode={isDarkMode} className="report-card">
                <div className="card-header">
                  <span className="card-title">{report.title}</span>
                  <button className="card-menu">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                <div className="card-date">{report.date}</div>
              </ReportCard>
            ))}
            <NewReportButton isDarkMode={isDarkMode} onClick={handleNewReportClick}>
              <span className="plus-icon">+</span>
              <span className="text">Upload Masterlist</span>
            </NewReportButton>
          </ReportCardsContainer>

          {/* Reports Header */}
          <ReportsHeader>
            <div className="left-section">
              <Button variant="primary" isDarkMode={isDarkMode} onClick={() => setIsFilterModalOpen(true)}>Filter</Button>
              <SearchInput
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                isDarkMode={isDarkMode}
              />
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
              />
{/*               
              <ReportTypeSelect isDarkMode={isDarkMode}>
                <option value="all">All reports</option>
                <option value="custom">Custom</option>
                <option value="template">Template</option>
              </ReportTypeSelect> */}
              
            </div>
            <div className="right-section">
              <Button 
                variant="primary" 
                isDarkMode={isDarkMode} 
                onClick={() => {
                  console.log('Generate File button clicked');
                  setIsDownloadModalOpen(true);
                }}
              >
                Generate File
              </Button>
              <Button variant="primary">Request Edit or Reupload Masterlist</Button>
            </div>
          </ReportsHeader>

          {/* Reports Table */}
          <ReportsTableContainer>
            {isLoading && (
              <SpinnerOverlay>
                <Spinner />
              </SpinnerOverlay>
            )}
            {filteredReports.length > 0 ? (
              <ReportsTable isDarkMode={isDarkMode}>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Branch</th>
                        <th>Field Collector</th>
                        <th>Month</th>
                        <th>Age</th>
                        <th>PN Number</th>
                        <th>Reference Number</th>
                        <th>Borrower Name</th>
                        <th>Terms</th>
                        <th>Maturity</th>
                        <th>First Due</th>
                        <th>Last Applied</th>
                        <th>Last Payment Date</th>
                        <th>Collectibles</th>
                        <th>Amortization</th>
                        <th>Paid</th>
                        <th>Remain</th>
                        <th>Overdue</th>
                        <th>Balance</th>
                        <th>Principal</th>
                        <th>Loan Type</th>
                        <th>AO</th>
                        <th>CM</th>
                        <th>Address</th>
                        <th>Area</th>
                        <th>Collection Company</th>
                        <th>Contact No.</th>
                        <th>Product Type</th>
                        <th>Balance Less Amortization</th>
                        <th>Date Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReports.map((report, index) => (
                        <tr key={index}>
                          <td>{report.branch}</td>
                          <td>{report.field_collector}</td>
                          <td>{report.month}</td>
                          <td>{report.age}</td>
                          <td>{report.pn_number}</td>
                          <td>{report.refno}</td>
                          <td>{report.borrower_name.toUpperCase()}</td>
                          <td>{report.terms}</td>
                          <td>{new Date(report.maturity).toLocaleDateString()}</td>
                          <td>{new Date(report.first_due).toLocaleDateString()}</td>
                          <td>{new Date(report.last_applied).toLocaleDateString()}</td>
                          <td>{report.last_payment_date ? new Date(report.last_payment_date).toLocaleDateString() : 'N/A'}</td>
                          <td>{report.collectibles}</td>
                          <td>{report.amortization}</td>
                          <td>{report.paid}</td>
                          <td>{report.remain}</td>
                          <td>{report.overdue}</td>
                          <td>{report.balance}</td>
                          <td>{report.principal}</td>
                          <td>{report.loan_type}</td>
                          <td>{report.ao}</td>
                          <td>{report.cm}</td>
                          <td>{report.address}</td>
                          <td>{report.area}</td>
                          <td>{report.collection_company}</td>
                          <td>{report.contact_no}</td>
                          <td>{report.product_type}</td>
                          <td>{report.balance_less_amount}</td>
                          <td>{new Date(report.date_updated).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ReportsTable>
            ) : (
              !isLoading && <div>No reports available.</div>
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
      <DownloadModal 
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownload} 
      />
      <Bot userId={userId}/> 
    </DashboardContainer>
  );
} 



/*
  IRSMAIN OR THE MASTERLIST PAGE Component Summary

  
  Usage Guide:
    1. View recent masterlist reports in the report cards section at the top.
    2. Use the "Upload Masterlist" button to navigate to the upload page for adding new reports.
    3. Filter reports by clicking the "Filter" button and selecting companies or fields.
    4. Search for specific reports using the search bar.
    5. Browse reports in the table, which supports pagination for large datasets.
    6. Download the current list of reports as PDF or XLSX using the "Generate File" button.
    7. If you encounter errors, review the error modal for more information.
    8. Use the sidebar and top bar for navigation, notifications, and theme toggling.
*/
