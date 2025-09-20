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
  AreaGrid,
  AreaInfoBox,
  AreaLabel,
  AreaValue,
  Card,
  UserProfileContainer,
  UserProfileImage,
  UserProfileDetails
} from './UserAccessManagementStyled';
import NavPane from '../Objects/NavPane';
import FilterModal from '../Objects/FilterModal';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Position Filter Modal Component
const PositionFilterModal = ({ isOpen, onClose, availablePositions, selectedPositions, onSave, isDarkMode }) => {
  const [localSelectedPositions, setLocalSelectedPositions] = useState([]);

  useEffect(() => {
    setLocalSelectedPositions(selectedPositions);
  }, [selectedPositions]);

  const handlePositionToggle = (position) => {
    setLocalSelectedPositions(prev => {
      if (prev.includes(position)) {
        return prev.filter(p => p !== position);
      } else {
        return [...prev, position];
      }
    });
  };

  const handleSelectAll = () => {
    setLocalSelectedPositions([]);
  };

  const handleSave = () => {
    onSave(localSelectedPositions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <UploadModalOverlay>
      <UploadModalContent isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h2>Filter by Position Type</h2>
          <button onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="filter-content" style={{ 
          maxHeight: '400px', 
          overflowY: 'auto', 
          padding: '1rem 0',
          marginBottom: '1rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <button 
              onClick={handleSelectAll}
              style={{
                padding: '0.5rem 1rem',
                marginRight: '0.5rem',
                borderRadius: '6px',
                border: `1px solid ${isDarkMode ? '#444' : '#ccc'}`,
                background: isDarkMode ? '#333' : '#f5f5f5',
                color: isDarkMode ? '#fdba74' : '#111827',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
          </div>

          {availablePositions.map((position) => (
            <div key={position} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: `1px solid ${isDarkMode ? '#333' : '#eee'}`
            }}>
              <input
                type="checkbox"
                id={`position-${position}`}
                checked={localSelectedPositions.includes(position)}
                onChange={() => handlePositionToggle(position)}
                style={{ 
                  marginRight: '0.75rem',
                  accentColor: '#f97316'
                }}
              />
              <label 
                htmlFor={`position-${position}`}
                style={{
                  color: isDarkMode ? '#fed7aa' : '#374151',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {position}
              </label>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <Button
            variant="secondary"
            isDarkMode={isDarkMode}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            isDarkMode={isDarkMode}
            onClick={handleSave}
          >
            Apply Filter ({localSelectedPositions.length} selected)
          </Button>
        </div>
      </UploadModalContent>
    </UploadModalOverlay>
  );
};

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

const PermissionModal = ({ isOpen, onClose, userName, permissions, onSave, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <UploadModalOverlay isDarkMode={isDarkMode}>
      <UploadModalContent isDarkMode={isDarkMode}>
        <UserProfileContainer>
          <UserProfileImage src="/path/to/profile-image.jpg" alt="User Profile" />
          <UserProfileDetails isDarkMode={isDarkMode}>
            <h2>{userName}</h2>
            <p>@{userName}</p>
          </UserProfileDetails>
        </UserProfileContainer>

        <div className="permissions-table">
          <table>
            <thead>
              <tr>
                <th style={{ color: isDarkMode ? '#fdba74' : '#111827' }}>Permission</th>
                <th style={{ color: isDarkMode ? '#fdba74' : '#111827' }}>Enabled</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission, index) => (
                <tr key={index}>
                  <td style={{ color: isDarkMode ? '#fed7aa' : '#111827' }}>{permission.name}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={permission.enabled}
                      onChange={() => permission.toggle()}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <Button
            variant="primary"
            isDarkMode={isDarkMode}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            isDarkMode={isDarkMode}
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </UploadModalContent>
    </UploadModalOverlay>
  );
};

const CreateUserModal = ({ isOpen, onClose, isDarkMode, fetchSystemUsers }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    surname: '',
    positionId: '',
    branchId: '',
    contactNumber: '',
    emailAddress: '',
    password: '',
    mainCompanyId: '',
    subCompanyId: ''
  });

  const [positions, setPositions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch positions and branches when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [positionsRes, branchesRes, companiesRes] = await Promise.all([
            axiosInstance.get(API_ENDPOINTS.LOAD_POSITIONS),
            axiosInstance.get(API_ENDPOINTS.LOAD_BRANCHES),
            axiosInstance.get(API_ENDPOINTS.LOAD_FIN_COMPANIES)
          ]);

          // Map the response data to match the specific JSON structure
          if (positionsRes.data.status === 200) {
            setPositions(positionsRes.data.data);
          }
          if (branchesRes.data.status === 200) {
            setBranches(branchesRes.data.data);
          }
          if (companiesRes.data.status === 200) {
            setCompanies(companiesRes.data.data);
          }
          
        } catch (error) {
          console.error('Error fetching dropdown data:', error);
          alert('Failed to load positions and branches');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const requestBody = {
        codedPassword: formData.password ? MD5(formData.password).toString().toLowerCase() : "defaultpassword123",
        firstName: formData.firstName,
        middleName: formData.middleName || "",
        surname: formData.surname,
        positionId: parseInt(formData.positionId),
        branchId: formData.branchId,
        contactNumber: formData.contactNumber,
        emailAddress: formData.emailAddress,
        mainCompanyId: formData.mainCompanyId,
        subCompanyId: formData.subCompanyId
      };

      const response = await axiosInstance.post(API_ENDPOINTS.REGISTER_USER, requestBody);
      
      if (response.data.status === 200) {
        await fetchSystemUsers();
        alert(`User created successfully!\nUser ID: ${response.data.data.generatedUserId}`);
        onClose();
        return;
      } else {
        throw new Error(response.data.message || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create user';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <UploadModalOverlay>
      <UploadModalContent isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h2>Create New User</h2>
          <button onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <Spinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Middle Name (Optional)</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Surname</label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <select
                  name="positionId"
                  value={formData.positionId}
                  onChange={handleChange}
                  required
                  className="select-input"
                >
                  <option value="">Select Position</option>
                  {positions
                    .filter(position => 
                      !position.position_desc.toLowerCase().includes('system admin') && 
                      !position.position_desc.toLowerCase().includes('sysadmin')
                    )
                    .map((position) => (
                      <option 
                        key={position.position_id} 
                        value={position.position_id}
                      >
                        {position.position_desc}
                      </option>
                  ))}
                </select>
              </div>
              {/* Main Company - for now single select next time per select on drop down -> apppend company id like : 1/2/5/7 */}
              {/* then show company name selected as small bubbles with x, tapping on x will remove that company from the appended company ids */}
              <div className="form-group">
                <label>Main Company</label>
                <select
                  name="mainCompanyId"
                  value={formData.mainCompanyId}
                  onChange={handleChange}
                  required
                  className="select-input"
                >
                  <option value="">Select Company</option>
                  {companies
                    .filter(company => 
                      !company.company_name.toLowerCase().includes('none') 
                     
                    )
                    .map((company) => (
                      <option 
                        key={company.company_id} 
                        value={company.company_id}
                      >
                        {company.company_name}
                      </option>
                  ))}
                </select>
              </div>
              {/* Sub Company */}
              <div className="form-group">
                <label>Sub Company</label>
                <select
                  name="subCompanyId"
                  value={formData.subCompanyId}
                  onChange={handleChange}
                  required
                  className="select-input"
                >
                  <option value="">Select Company</option>
                  {companies
                    .filter(company => 
                      !company.company_name.toLowerCase().includes('no company') 
                     
                    )
                    .map((company) => (
                      <option 
                        key={company.company_id} 
                        value={company.company_id}
                      >
                        {company.company_name}
                      </option>
                  ))}
                </select>
              </div>
              {/*  */}
              <div className="form-group">
                <label>Branch</label>
                <select
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  required
                  className="select-input"
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option 
                      key={branch.branchid} 
                      value={branch.branchid}
                    >
                      {branch.branch_desc}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div> */}
            </div>

            <div className="modal-footer">
              <Button
                variant="secondary"
                isDarkMode={isDarkMode}
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isDarkMode={isDarkMode}
                disabled={isProcessing}
              >
                {isProcessing ? 'Creating User...' : 'Create User'}
              </Button>
            </div>
          </form>
        )}
      </UploadModalContent>
    </UploadModalOverlay>
  );
};

const UserManagementModal = ({ isOpen, onClose, user, isDarkMode, onUserDeactivated }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUserStatusChange = async () => {
    const action = user.isUserActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    setIsProcessing(true);
    try {
      // Choose the appropriate endpoint based on current user status
      const endpoint = user.isUserActive 
        ? API_ENDPOINTS.DEACTIVATE_USER 
        : API_ENDPOINTS.ACTIVATE_USER;

      const response = await axiosInstance.put(endpoint, {
        userId: user.userId
      });

      if (response.data && response.data.status === 200) {
        alert(response.data.message);
        onUserDeactivated(); // Refresh the user list
        onClose();
      } else {
        alert(response.data?.message || `Failed to ${action} user`);
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(error.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <UploadModalOverlay>
      <UploadModalContent isDarkMode={isDarkMode}>
        <div className="modal-header">
          <h2>User Management</h2>
          <button onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <UserProfileContainer>
          <UserProfileDetails isDarkMode={isDarkMode}>
            <h2>{`${user.fName} ${user.mName} ${user.sName}`.trim()}</h2>
            <p>@{user.userId}</p>
            <p>{user.positionDesc} - {user.branchDesc}</p>
            <p>{user.emailAddress}</p>
            <p>Status: <span className={user.isUserActive ? 'active' : 'inactive'}>
              {user.isUserActive ? 'Active' : 'Inactive'}
            </span></p>
          </UserProfileDetails>
        </UserProfileContainer>

        <div className="modal-footer">
          <Button
            variant="secondary"
            isDarkMode={isDarkMode}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant={user.isUserActive ? "danger" : "primary"}
            isDarkMode={isDarkMode}
            onClick={handleUserStatusChange}
            disabled={isProcessing}
          >
            {isProcessing 
              ? (user.isUserActive ? 'Deactivating...' : 'Activating...') 
              : (user.isUserActive ? 'Deactivate User' : 'Activate User')
            }
          </Button>
        </div>
      </UploadModalContent>
    </UploadModalOverlay>
  );
};

export default function UserAccessManagement() {
  const [activeNav, setActiveNav] = useState('reports');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [reportsList, setReportsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Set your desired page size
  const [error, setError] = useState(null);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [permissions, setPermissions] = useState([
    { name: 'View Reports', enabled: false, toggle: () => {} },
    { name: 'Edit Users', enabled: false, toggle: () => {} },
    // Add more permissions as needed
  ]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [systemUsers, setSystemUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);
  
  // Position filter states
  const [availablePositions, setAvailablePositions] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [isPositionFilterOpen, setIsPositionFilterOpen] = useState(false);

  // Calculate user statistics
  const userStats = useMemo(() => {
    return {
      totalUsers: systemUsers.length,
      adminUsers: systemUsers.filter(user => 
        ['SUPERADMIN', 'ADMIN'].includes(user.accessLevel)
      ).length,
      regularUsers: systemUsers.filter(user => 
        user.accessLevel === 'USER'
      ).length,
      collectors: systemUsers.filter(user => 
        user.isCollector && !['SUPERADMIN', 'ADMIN'].includes(user.accessLevel)
      ).length
    };
  }, [systemUsers]);

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

  

  const fetchSystemUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LOAD_SYS_MGMT_USER_LIST);
      if (response.data.status === 200) {
        setSystemUsers(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / pageSize));
      }
    } catch (error) {
      console.error('Error fetching system users:', error);
      setError('Failed to fetch system users list.');
    } finally {
      setIsLoading(false);
    }
  };

  // Move the useEffect content into a named function
  useEffect(() => {
    fetchSystemUsers();
  }, [pageSize]);

  // Extract unique positions from system users and fetch from API
  useEffect(() => {
    const extractUniquePositions = () => {
      const uniquePositions = [...new Set(
        systemUsers.map(user => user.positionDesc).filter(Boolean)
      )].sort((a, b) => a.localeCompare(b));
      setAvailablePositions(uniquePositions);
    };

    if (systemUsers.length > 0) {
      extractUniquePositions();
    }
  }, [systemUsers]);

  const handleUserDeactivated = async () => {
    await fetchSystemUsers(); // Ensure we wait for the fetch to complete
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };



  const filteredUsers = systemUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search filter
    const matchesSearch = (
      user.userId.toLowerCase().includes(searchLower) ||
      user.fName.toLowerCase().includes(searchLower) ||
      user.sName.toLowerCase().includes(searchLower) ||
      user.positionDesc.toLowerCase().includes(searchLower) ||
      user.branchDesc.toLowerCase().includes(searchLower)
    );
    
    // Position filter
    const matchesPosition = selectedPositions.length === 0 || 
      selectedPositions.includes(user.positionDesc);
    
    return matchesSearch && matchesPosition;
  });

  const downloadPDF = () => {
    console.log('Download PDF triggered');
    console.log('System Users:', systemUsers);

    const doc = new jsPDF();

    // Base64 string of the logo (replace with your actual Base64 string)
    const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...'; // Truncated for brevity

    // Add the logo to the PDF using the Base64 string
    doc.addImage(logoBase64, 'JPEG', 15, 10, 40, 20); // Adjust the position and size as needed

    // Add title
    doc.text('System User List', 14, 40); // Adjust Y position to avoid overlap with the logo

    autoTable(doc, {
      startY: 50, // Adjust startY to avoid overlap with the title
      head: [['User ID', 'Name', 'Position', 'Branch', 'Access Level', 'Status']],
      body: filteredUsers.map(user => [
        user.userId,
        `${user.fName} ${user.mName} ${user.sName}`.trim(),
        user.positionDesc,
        user.branchDesc,
        user.accessLevel,
        user.isUserActive ? 'Active' : 'Inactive',
      ]),
    });

    doc.save('system_user_list.pdf');
  };

  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setIsUserManagementModalOpen(true);
  };

  const handleSavePermissions = () => {
    // Logic to save permissions
    setIsPermissionModalOpen(false);
  };

  const handleCreateUserClick = () => {
    setIsCreateUserModalOpen(true);
  };

  const handlePositionFilterSave = (selectedPos) => {
    setSelectedPositions(selectedPos);
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
            
            <div>
            <h1 className="text-2xl font-light dark:#ff840b">User Access Management</h1>
              <p className="text-sm">Manage system users and their access levels here.</p>
              
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

        <div className="p-6  dark:bg-inherit min-h-screen relative">
          {isLoading && (
            <SpinnerOverlay>
              <Spinner />
            </SpinnerOverlay>
          )}
          {/* Report Cards Grid */}
          <Card isDarkMode={isDarkMode} className="mb-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">System Users</h3>
        </div>
        <AreaGrid>
            <AreaInfoBox isDarkMode={isDarkMode}>
              <AreaLabel>Total Users</AreaLabel>
              <AreaValue isDarkMode={isDarkMode} large>
                {userStats.totalUsers}
              </AreaValue>
            </AreaInfoBox>
            
            <AreaInfoBox isDarkMode={isDarkMode}>
              <AreaLabel>Admin Users</AreaLabel>
              <AreaValue isDarkMode={isDarkMode} large>
                {userStats.adminUsers}
              </AreaValue>
            </AreaInfoBox>
            
            <AreaInfoBox isDarkMode={isDarkMode}>
              <AreaLabel>Regular Users</AreaLabel>
              <AreaValue isDarkMode={isDarkMode} large>
                {userStats.regularUsers}
              </AreaValue>
            </AreaInfoBox>
            
            <AreaInfoBox isDarkMode={isDarkMode}>
              <AreaLabel>Active Collectors</AreaLabel>
              <AreaValue isDarkMode={isDarkMode} large>
                {userStats.collectors}
              </AreaValue>
            </AreaInfoBox>
        </AreaGrid>
        </Card>

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
              <Button
                variant="secondary"
                isDarkMode={isDarkMode}
                onClick={() => setIsPositionFilterOpen(true)}
              >
                Filter by Position {selectedPositions.length > 0 && `(${selectedPositions.length})`}
              </Button>
              <Button
                variant="primary"
                isDarkMode={isDarkMode}
                onClick={handleCreateUserClick}
              >
                Create a new system user
              </Button>
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
                Download System User List
              </Button>
              
            </div>
          </ReportsHeader>

          {/* Reports Table */}
          <ReportsTableContainer>
            {isLoading && (
              <SpinnerOverlay>
                <Spinner />
              </SpinnerOverlay>
            )}
            {filteredUsers.length > 0 ? (
              <ReportsTable isDarkMode={isDarkMode}>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Main Company</th>
                        <th>Sub Company</th>
                        <th>Branch</th>
                        <th>Access Level</th>
                        <th>Is Collector</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((user) => (
                          <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>
                              <strong>{`${user.fName} ${user.mName} ${user.sName}`.trim()}</strong>
                            </td>
                            <td>{user.positionDesc}</td>
                            <td>{user.mainCompanyName}</td>
                            <td>{user.subCompanyName}</td>
                            <td>{user.branchDesc}</td>
                            
                            <td>
                              <span className={`badge ${user.accessLevel.toLowerCase()}`}>
                                {user.accessLevel}
                              </span>
                            </td>
                            <td>
                              <span className={user.isCollector ? 'yes' : 'no'}>
                                {user.isCollector ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td>
                              <span className={user.isUserActive ? 'active' : 'inactive'}>
                                {user.isUserActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Button
                                  variant="primary"
                                  isDarkMode={isDarkMode}
                                  onClick={() => handleEditUserClick(user)}
                                >
                                  Edit
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </ReportsTable>
            ) : (
              !isLoading && <div>No users found.</div>
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
      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        userName={selectedUserName}
        permissions={permissions}
        onSave={handleSavePermissions}
        isDarkMode={isDarkMode}
      />
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        isDarkMode={isDarkMode}
        fetchSystemUsers={fetchSystemUsers}
      />
      <UserManagementModal
        isOpen={isUserManagementModalOpen}
        onClose={() => setIsUserManagementModalOpen(false)}
        user={selectedUser}
        isDarkMode={isDarkMode}
        onUserDeactivated={handleUserDeactivated}
      />
      <PositionFilterModal
        isOpen={isPositionFilterOpen}
        onClose={() => setIsPositionFilterOpen(false)}
        availablePositions={availablePositions}
        selectedPositions={selectedPositions}
        onSave={handlePositionFilterSave}
        isDarkMode={isDarkMode}
      />
      <Bot userId={userId}/> 
    </DashboardContainer>
  );
} 