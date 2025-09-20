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
  SearchInput,
  StatCard,
  StatsContainer
} from './LegalDirectoryStyled';
import NavPane from '../Objects/NavPane';
import FilterModal from '../Objects/FilterModal';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFileAlt, FaUserShield, FaCog, FaArrowUp, FaArrowDown, FaGavel } from 'react-icons/fa';
const UploadModal = ({ isOpen, onClose, isDarkMode }) => {
  const [formData, setFormData] = useState({
    borrower_name: '',
    account_number: '',
    amount_involved: '',
    legal_grounds: '',
    priority: 'Medium',
    assigned_officer: '',
    description: '',
    attachments: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <UploadModalOverlay>
      <UploadModalContent isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h2>Create New Legal Case</h2>
          <button onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Borrower Name</label>
            <input
              type="text"
              value={formData.borrower_name}
              onChange={(e) => setFormData({...formData, borrower_name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              value={formData.account_number}
              onChange={(e) => setFormData({...formData, account_number: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount Involved</label>
            <input
              type="number"
              value={formData.amount_involved}
              onChange={(e) => setFormData({...formData, amount_involved: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Legal Grounds</label>
            <input
              type="text"
              value={formData.legal_grounds}
              onChange={(e) => setFormData({...formData, legal_grounds: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assigned Legal Officer</label>
            <input
              type="text"
              value={formData.assigned_officer}
              onChange={(e) => setFormData({...formData, assigned_officer: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Case Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Attachments</label>
            <div className="file-upload-area">
              <input
                type="file"
                multiple
                onChange={(e) => setFormData({...formData, attachments: Array.from(e.target.files)})}
              />
              <p className="file-hint">Drag and drop files here or click to browse</p>
            </div>
          </div>

          <div className="form-footer">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit">Create Case</Button>
          </div>
        </form>
      </UploadModalContent>
    </UploadModalOverlay>
  );
};

const CaseDetailsModal = ({ isOpen, onClose, caseData, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <UploadModalOverlay>
      <UploadModalContent isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h2>Legal Case Details</h2>
          <button onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="case-details">
          <div className="detail-section">
            <h3>Case Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Case ID</label>
                <p>{caseData.case_id}</p>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <span className={`status-badge ${caseData.status.toLowerCase().replace(' ', '-')}`}>
                  {caseData.status}
                </span>
              </div>
              <div className="detail-item">
                <label>Priority</label>
                <span className={`priority-badge ${caseData.priority.toLowerCase()}`}>
                  {caseData.priority}
                </span>
              </div>
              <div className="detail-item">
                <label>Date Escalated</label>
                <p>{new Date(caseData.date_escalated).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Borrower Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Borrower Name</label>
                <p>{caseData.borrower_name}</p>
              </div>
              <div className="detail-item">
                <label>Account Number</label>
                <p>{caseData.account_number}</p>
              </div>
              <div className="detail-item">
                <label>Amount Involved</label>
                <p>₱{caseData.amount_involved.toLocaleString()}</p>
              </div>
              <div className="detail-item">
                <label>Legal Officer</label>
                <p>{caseData.legal_officer}</p>
              </div>
            </div>
          </div>

          {/* <div className="detail-section">
            <h3>Case Timeline</h3>
            <div className="timeline">
              {caseData.timeline?.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-date">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="timeline-content">
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          <div className="detail-section">
            <h3>Attachments</h3>
            <div className="attachments-grid">
              {caseData.attachments?.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <svg className="attachment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                  <span>{attachment.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-footer">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button variant="primary">Update Case</Button>
        </div>
      </UploadModalContent>
    </UploadModalOverlay>
  );
};

export default function LegalDirectory() {
  const [activeNav, setActiveNav] = useState('reports');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [legalCases, setLegalCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState("0000000001");
  const router = useRouter();
  const [selectedCase, setSelectedCase] = useState(null);
  const [isCaseDetailsModalOpen, setIsCaseDetailsModalOpen] = useState(false);
  const getAnimationDelay = (index) => `${index * 0.1}s`;

  // Mock data - Replace with actual API call
  const mockLegalCases = [
    {
      case_id: "LC001",
      account_number: "1234567890",
      borrower_name: "John Doe",
      date_escalated: "2024-03-15",
      status: "Pending Review",
      amount_involved: 150000,
      legal_officer: "Atty. Decilos",
      priority: "High"
    },
    // Add more mock cases as needed
  ];

  useEffect(() => {
    // Get userId from token when component mounts
    const getUserFromToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.UserId);
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
    const fetchLegalCases = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        setLegalCases(mockLegalCases);
        setTotalPages(Math.ceil(mockLegalCases.length / pageSize));
      } catch (error) {
        console.error('Error fetching legal cases:', error);
        setError('Failed to fetch legal cases.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLegalCases();
  }, [currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const stats = [
    {
      label: 'Active Cases',
      value: '1',
      change: '+1%',
      isPositive: true
    },
    {
      label: 'Pending Review Cases',
      value: '1',
      change: '+1%',
      isPositive: true
    },
    {
      label: 'Resolved Cases',
      value: '0',
      change: '0%',
      isPositive: true
    },
    {
      label: 'Rejected Cases',
      value: '0',
      change: '+0%',
      isPositive: true
    }
  ];

  const filteredCases = legalCases.filter(legalCase => {
    const searchMatch = 
      legalCase.borrower_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      legalCase.case_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      legalCase.account_number.includes(searchTerm);
    
    const statusMatch = selectedStatus === 'all' || legalCase.status === selectedStatus;
    
    return searchMatch && statusMatch;
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.text('Legal Cases Report', 14, 20);
    
    autoTable(doc, {
      startY: 30,
      head: [['Case ID', 'Account', 'Borrower', 'Status', 'Date Escalated', 'Priority']],
      body: filteredCases.map(legalCase => [
        legalCase.case_id,
        legalCase.account_number,
        legalCase.borrower_name,
        legalCase.status,
        new Date(legalCase.date_escalated).toLocaleDateString(),
        legalCase.priority
      ]),
    });

    doc.save('legal_cases_report.pdf');
  };

  return (
    <DashboardContainer isDarkMode={isDarkMode}>
      {isLoading && <SpinnerOverlay><Spinner /></SpinnerOverlay>}
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
            {/* <button 
              className="lg:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button> */}
            <div className="welcome-section">
              <h1 className="text-2xl font-light">Legal Management System</h1>
              <p className="text-sm">Track and manage legal cases</p>
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

        <div className="p-6 dark:bg-inherit min-h-screen relative">
          <ReportsHeader>
            <div className="left-section">
              <SearchInput
                type="text"
                placeholder="Search by case ID, account, or borrower name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                isDarkMode={isDarkMode}
              />
              <ReportTypeSelect
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                isDarkMode={isDarkMode}
              >
                <option value="all">All Status</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Court Filing">Court Filing</option>
                <option value="Hearing">Hearing</option>
                <option value="Resolved">Resolved</option>
              </ReportTypeSelect>
            </div>
            <div className="right-section">
              <Button
                variant="primary"
                isDarkMode={isDarkMode}
                onClick={downloadPDF}
              >
                Download Report
              </Button>
              <Button 
                variant="primary"
                onClick={() => setIsUploadModalOpen(true)}
              >
                New Legal Case
              </Button>
            </div>
          </ReportsHeader>

          <ReportsTableContainer>
            {isLoading && (
              <SpinnerOverlay>
                <Spinner />
              </SpinnerOverlay>
            )}
            {filteredCases.length > 0 ? (
              <ReportsTable isDarkMode={isDarkMode}>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Case ID</th>
                        <th>Account Number</th>
                        <th>Borrower Name</th>
                        <th>Date Escalated</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Legal Officer</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCases
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((legalCase, index) => (
                          <tr key={index}>
                            <td>{legalCase.case_id}</td>
                            <td>{legalCase.account_number}</td>
                            <td><strong>{legalCase.borrower_name.toUpperCase()}</strong></td>
                            <td>{new Date(legalCase.date_escalated).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-badge ${legalCase.status.toLowerCase().replace(' ', '-')}`}>
                                {legalCase.status}
                              </span>
                            </td>
                            <td>
                              <span className={`priority-badge ${legalCase.priority.toLowerCase()}`}>
                                {legalCase.priority}
                              </span>
                            </td>
                            <td>{legalCase.legal_officer}</td>
                            <td>
                              <Button 
                                variant="primary" 
                                isDarkMode={isDarkMode}
                                onClick={() => {
                                  setSelectedCase(legalCase);
                                  setIsCaseDetailsModalOpen(true);
                                }}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </ReportsTable>
            ) : (
              !isLoading && <div>No legal cases found.</div>
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
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} isDarkMode={isDarkMode} />
      <CaseDetailsModal 
        isOpen={isCaseDetailsModalOpen} 
        onClose={() => setIsCaseDetailsModalOpen(false)}
        caseData={selectedCase}
        isDarkMode={isDarkMode}
      />
      <Bot userId={userId}/> 
    </DashboardContainer>
  );
} 