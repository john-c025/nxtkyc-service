'use client';
import Bot from '../Objects/Bot';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'next/navigation';
import NotificationButton from '../Objects/NotificationButton';
import NavPane from '../Objects/NavPane';
import { getGeminiResponse } from '../../utils/gemini';
import {
  DashboardContainer,
  Sidebar,
  MainContent,
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
  UploadModalOverlay,
  UploadModalContent,
  ReportsTableContainer,
  StatusBadge,
  SpinnerOverlay,
  Spinner,
  PaginationControls,
  SearchInput,
  StatCard,
  StatsContainer,
  DescriptionBox
} from './UserRequestsStyled';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';


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

const RequestDetailsModal = ({ isOpen, onClose, requestData, isDarkMode, onAccept, onReject }) => {
  if (!isOpen) return null;

  const requestType = requestData.request_type?.toLowerCase();

  return (
    <UploadModalOverlay>
      <UploadModalContent isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h2>Request Details</h2>
          <button onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="request-details">
          <div className="detail-section">
            <h3>Request Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Request ID</label>
                <p>{requestData.request_id}</p>
              </div>
              <div className="detail-item">
                <label>Status</label>
                <StatusBadge className={requestData.status.toLowerCase()}>
                  {requestData.status}
                </StatusBadge>
              </div>
              <div className="detail-item">
                <label>Type</label>
                <p>{requestData.request_type}</p>
              </div>
              <div className="detail-item">
                <label>Date Submitted</label>
                <p>{new Date(requestData.date_submitted).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Requester Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Name</label>
                <p>{requestData.requester_name}</p>
              </div>
              {/* <div className="detail-item">
                <label>Department</label>
                <p>{requestData.department}</p>
              </div> */}
              {/* <div className="detail-item">
                <label>Position</label>
                <p>{requestData.position}</p>
              </div> */}
              <div className="detail-item">
                <label>Email</label>
                <p>{requestData.email}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Request Details</h3>
            <div className="description-box">
              {requestType === "area configuration" ? (() => {
                let areaConfig;
                try {
                  areaConfig = JSON.parse(requestData.description);
                } catch (e) {
                  return <p>Invalid area configuration data.</p>;
                }
                return (
                  <ul>
                    <strong>Changes for {areaConfig.SpecAreaId} </strong>
                    

                    <li><strong>New Sub Area ID:</strong>  {String(areaConfig.SubAreaId)}</li>
                    <li><strong>New Name:</strong> {areaConfig.Name}</li>
                    <strong>Current Status:</strong> {areaConfig.Status === 1 ? "Enabled" : "Disabled"}
                  </ul>
                );
              })() : (
                <p>{requestData.description}</p>
              )}
            </div>
          </div>
{/* 
          <div className="detail-section">
            <h3>Attachments</h3>
            <div className="attachments-grid">
              {requestData.attachments?.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <svg className="attachment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                  <span>{attachment.name}</span>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        <div className="form-footer">
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {requestData.status === 'Pending' && (
            <>
              <Button variant="danger" onClick={() => onReject(requestData.request_id)}>Reject</Button>
              <Button variant="success" onClick={() => onAccept(requestData.request_id)}>Accept</Button>
            </>
          )}
        </div>
      </UploadModalContent>
    </UploadModalOverlay>
  );
};

const ErrorModal = ({ message, onClose, isDarkMode }) => (
  <UploadModalOverlay>
    <UploadModalContent isDarkMode={isDarkMode}>
      <div className="modal-header">
        <h2>Error</h2>
        <button onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="modal-content">
        <p className="error-message">{message}</p>
      </div>
      <div className="form-footer">
        <Button variant="primary" onClick={onClose}>Close</Button>
      </div>
    </UploadModalContent>
  </UploadModalOverlay>
);

const getRequestTypeName = (type) => {
  const requestTypes = {
    1: 'Area Configuration',
    2: 'System Access',
    
    6: 'Masterlist Upload Access',
    // Add more types as needed
  };
  return requestTypes[type] || `Request Type ${type}`;
};

export default function UserRequestsPage() {
  const [activeNav, setActiveNav] = useState('reports');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRequestDetailsModalOpen, setIsRequestDetailsModalOpen] = useState(false);
  
  const handleGemini = async () => {
    setLoading(true);
    try {
      const geminiResult = await getGeminiResponse({ description });
      setResult(geminiResult);
    } catch (error) {
      console.error(error);
      setResult('Error fetching Gemini response');
    }
    setLoading(false);
  };

  const processDescriptionsWithGemini = async (requests) => {
    const processed = await Promise.all(
      requests.map(async (req) => {
        if (req.description) {
          // Call Gemini for each description
          const geminiResult = await handleGemini(req.request_message);
          return { ...req, description: geminiResult };
        }
        return req;
      })
    );
    return processed;
  };

  useEffect(() => {
    // Get userId from token when component mounts
    const getUserFromToken = async () => {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.UserId);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    getUserFromToken();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          selectedStatus === 'Pending' 
            ? API_ENDPOINTS.LOAD_PENDING_REQUESTS
            : API_ENDPOINTS.LOAD_ALL_REQUESTS
        );
        

        // Transform the API response to match our UI needs
        const transformedRequests = response.data.map(req => ({
          request_id: req.refno,
          request_type: getRequestTypeName(req.request_type),
          requester_name: req.initiator_id, // You might want to fetch user details separately
          date_submitted: req.createdat,
          status: req.is_approved ? 'Accepted' : req.is_rejected ? 'Rejected' : 'Pending',
          description: req.request_message,
          attachments: [], // Add if your API provides attachments
        }));


        setRequests(transformedRequests);
        setTotalPages(Math.ceil(transformedRequests.length / pageSize));
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('Failed to fetch requests.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [currentPage, pageSize, selectedStatus]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axiosInstance.post(`${API_ENDPOINTS.APPROVE_REQUEST}?refno=${requestId}`);
      
      // Update local state
      setRequests(requests.map(req => 
        req.request_id === requestId 
          ? { ...req, status: 'Accepted' } 
          : req
      ));
      setIsRequestDetailsModalOpen(false);
    } catch (error) {
      console.error('Error accepting request:', error);
      setError('Failed to accept request. Please try again.');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      // Note: Endpoint is WIP according to your comment
      await axiosInstance.post(`${API_ENDPOINTS.REJECT_REQUEST}?refno=${requestId}`);
      
      // Update local state
      setRequests(requests.map(req => 
        req.request_id === requestId 
          ? { ...req, status: 'Rejected' } 
          : req
      ));
      setIsRequestDetailsModalOpen(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Failed to reject request. Please try again.');
    }
  };

  const stats = [
    {
      label: 'Pending Requests',
      value: requests.filter(req => req.status === 'Pending').length.toString(),
      change: '+2',
      isPositive: true
    },
    {
      label: 'Accepted Requests',
      value: requests.filter(req => req.status === 'Accepted').length.toString(),
      change: '+1',
      isPositive: true
    },
    {
      label: 'Rejected Requests',
      value: requests.filter(req => req.status === 'Rejected').length.toString(),
      change: '0',
      isPositive: false
    }
  ];

  const filteredRequests = requests.filter(request => {
    const searchMatch = 
      request.requester_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = selectedStatus === 'all' || request.status === selectedStatus;
    
    return searchMatch && statusMatch;
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.text('Legal Cases Report', 14, 20);
    
    autoTable(doc, {
      startY: 30,
      head: [['Case ID', 'Account', 'Borrower', 'Status', 'Date Escalated', 'Priority']],
      body: filteredRequests.map(request => [
        request.request_id,
        request.account_number,
        request.requester_name,
        request.status,
        new Date(request.date_submitted).toLocaleDateString(),
        request.priority
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
            <div className="welcome-section">
              <h1 className="text-2xl font-light mb-1">System Requests</h1>
              <p className="text-sm text-gray-500">Manage and process system requests</p>
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
          <StatsContainer>
            {stats.map((stat, index) => (
              <StatCard 
                key={index} 
                isDarkMode={isDarkMode}
                style={{ animationDelay: `${index * 0.1}s` }}
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

          <ReportsHeader>
            <div className="left-section">
              <SearchInput
                type="text"
                placeholder="Search by ID, name, or type"
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
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </ReportTypeSelect>
            </div>
          </ReportsHeader>

          <ReportsTableContainer>
            <ReportsTable isDarkMode={isDarkMode}>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Type</th>
                      <th>Requester</th>
                      
                      <th>Date Submitted</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests
                      .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                      .map((request, index) => (
                        <tr key={index}>
                          <td>{request.request_id}</td>
                          <td>{request.request_type}</td>
                          <td>{request.requester_name}</td>
                          
                          <td>{new Date(request.date_submitted).toLocaleDateString()}</td>
                          <td>
                            <StatusBadge className={request.status.toLowerCase()}>
                              {request.status}
                            </StatusBadge>
                          </td>
                          <td>
                            <Button 
                              variant="primary" 
                              isDarkMode={isDarkMode}
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsRequestDetailsModalOpen(true);
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

      {error && <ErrorModal message={error} onClose={() => setError(null)} isDarkMode={isDarkMode} />}
      <RequestDetailsModal 
        isOpen={isRequestDetailsModalOpen} 
        onClose={() => setIsRequestDetailsModalOpen(false)}
        requestData={selectedRequest}
        isDarkMode={isDarkMode}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
      <Bot userId={userId}/> 
    </DashboardContainer>
  );
}