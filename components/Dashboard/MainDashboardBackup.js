'use client';

import Image from 'next/image';
import Link from 'next/link';
import PasswordResetModal from '../Objects/PasswordResetModal';
import NotificationButton from '../Objects/NotificationButton';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  DashboardContainer,
  Sidebar,
  MainContent,
  TopBar,
  CardGrid,
  Card,
  ChartContainer,
  NavList,
  UserSection,
  ProfileImage,
  UserInfo,
  ThemeToggle,
  MobileMenuButton,
  Overlay,
  ReportsTableContainer,
  ReportsTable,
  PaginationControls,
  SpinnerOverlay,
  Spinner
} from '../Dashboard/MainDashboardStyled';
import NavPane from '../Objects/NavPane';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Update the CardOverlay styled component
const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.isDarkMode 
    ? 'linear-gradient(145deg, #262626, #1a1a1a)' 
    : 'linear-gradient(145deg, #ffffff, #fffaf7)'};
  border: 1.5px solid ${props => props.isDarkMode ? '#333333' : '#f0f0f0'};
  border-radius: 10px;
  padding: 1.5rem;
  z-index: 10;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export default function MainDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [reportsList, setReportsList] = useState([]);
  // Add state for collapsed cards
  const [collapsedCards, setCollapsedCards] = useState({});
  const [openOverlay, setOpenOverlay] = useState(null);
  const [activeTab, setActiveTab] = useState('visualized');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(7); // Set your desired page size
  const [error, setError] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);
  // Add toggle function for cards
  const toggleCard = (index) => {
    setOpenOverlay(openOverlay === index ? null : index);
  };

  const stats = [
    { title: 'Total Collections', value: '₱2.4M', change: '+12.5%' },
    { title: 'Active Cases', value: '1,234', change: '+3.2%' },
    { title: 'Success Rate', value: '85%', change: '+5.1%' },
    { title: 'Client Satisfaction', value: '4.8/5', change: '+0.3' }
  ];

  // Add this collection data
  const collectionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Successful Collections',
        data: [64000, 220000, 195000, 250000, 280000, 310000, 290000, 340000, 325000, 360000, 375000, 400000],
        borderColor: isDarkMode ? '#ff840b' : '#f97316',
        backgroundColor: isDarkMode ? 'rgba(255, 132, 11, 0.1)' : 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Unsuccessful Collections',
        data: [45000, 70000, 42000, 320000, 310000, 290000, 32000, 28000, 30000, 25000, 28000, 22000],
        borderColor: isDarkMode ? '#ef4444' : '#dc2626',

        backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(220, 38, 38, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#ff840b' : '#111827',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '₱' + (value / 1000) + 'k',
          color: isDarkMode ? '#ff840b' : '#111827',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 132, 11, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? '#ff840b' : '#111827',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 132, 11, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      }
    }
  };

  // Add pie chart data
  const pieChartData = {
    labels: ['Successful', 'In Progress', 'Failed', 'Pending'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: [
        isDarkMode ? '#ff840b' : '#f97316',
        isDarkMode ? '#3b82f6' : '#2563eb',
        isDarkMode ? '#ef4444' : '#dc2626',
        isDarkMode ? '#a855f7' : '#9333ea',
      ],
      borderColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      borderWidth: 2,
    }]
  };

  // Add custom bar chart data
  const barChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Collection Performance',
      data: [65, 78, 82, 75],
      backgroundColor: isDarkMode ? '#ff840b' : '#f97316',
      borderColor: isDarkMode ? '#ff840b' : '#f97316',
      borderWidth: 1,
    }]
  };

  // Pie chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDarkMode ? '#ff840b' : '#111827',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Collection Status Distribution',
        color: isDarkMode ? '#ff840b' : '#111827',
      }
    }
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#ff840b' : '#111827',
        }
      },
      title: {
        display: true,
        text: 'Quarterly Performance',
        color: isDarkMode ? '#ff840b' : '#111827',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? '#ff840b' : '#111827',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 132, 11, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      },
      x: {
        ticks: {
          color: isDarkMode ? '#ff840b' : '#111827',
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 132, 11, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      }
    }
  };

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
  }, []); // Only run once on mount

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

  const handleResetPassword = () => {
    // Logic to redirect to password reset page or open password reset form
    console.log('Redirecting to password reset page...');
    setIsModalOpen(false);
  };

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
  };

  return (
    <DashboardContainer isDarkMode={isDarkMode}>
      {isInitialLoading && (
        <SpinnerOverlay>
          <Spinner />
        </SpinnerOverlay>
      )}
      <Overlay 
        isOpen={isMobileMenuOpen} 
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <Sidebar isOpen={isMobileMenuOpen} isDarkMode={isDarkMode}>
        <div className="p-6 mb-8">
          <Image
            src="https://eagleeyecollection.com/wp-content/uploads/2023/12/cropped-logo.jpg"
            alt="Eagle Eye Logo"
            width={180}
            height={50}
            style={{ height: 'auto' }}
            priority
          />
        </div>

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
          <MobileMenuButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              isDarkMode={isDarkMode}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </MobileMenuButton>
            <div>
            <h1 className="text-2xl font-light dark:#ff840b">Overview</h1>
              <p className="text-sm">Welcome to your dashboard!</p>
              <PasswordResetModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onResetPassword={handleResetPassword}
                  isDarkMode={isDarkMode}
                  userId={userId}
                />
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

        <div className="p-6 bg-gray-100 dark:bg-inherit min-h-screen">
          <div className="flex justify-center">
            <button
              className={`px-4 py-2 rounded shadow ${
                activeTab === 'visualized' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab('visualized')}
            >
              Visualized Summary
            </button>
            <span className="mx-2"> </span>
            <button
              className={`px-4 py-2 rounded shadow ${
                activeTab === 'summary' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab('summary')}
            >
              Summary Data
            </button>
          </div>

          <div className="mt-4">
            {activeTab === 'visualized' && (
              <div>
                <CardGrid>
                  {stats.map((stat, index) => (
                    <Card key={index} isDarkMode={isDarkMode} className="shadow-lg relative">
                      <div className="h-auto opacity-100">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-orange-500 mb-1">{stat.title}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-semibold text-gray-900 dark:text-orange-500">{stat.value}</span>
                          <span className={`text-sm ${
                            stat.change.startsWith('+') 
                              ? 'text-green-500 dark:text-green-400' 
                              : 'text-red-500 dark:text-red-400'
                          }`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleCard(index)}
                        className="absolute bottom-2 right-2 text-gray-400 hover:text-gray-600 dark:text-orange-500 dark:hover:text-orange-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Card Overlay */}
                      {openOverlay === index && (
                        <CardOverlay isDarkMode={isDarkMode}>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-orange-500">
                              {stat.title} Details
                            </h3>
                            <button 
                              onClick={() => setOpenOverlay(null)}
                              className="text-gray-400 hover:text-gray-600 dark:text-orange-500 dark:hover:text-orange-400"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-3xl font-bold text-orange-500 dark:text-orange-500">
                                {stat.value}
                              </p>
                              <p className={`text-sm ${
                                stat.change.startsWith('+') 
                                  ? 'text-green-500 dark:text-green-400' 
                                  : 'text-red-500 dark:text-red-400'
                              }`}>
                                {stat.change} from last month
                              </p>
                            </div>
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                              <p className="text-gray-600 dark:text-gray-300">
                                Additional details and statistics can go here...
                              </p>
                            </div>
                          </div>
                        </CardOverlay>
                      )}
                    </Card>
                  ))}
                </CardGrid>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartContainer isDarkMode={isDarkMode} className="shadow-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-orange-500 mb-4">Collection Trends</h3>
                    <div className="h-[300px]">
                      <Line data={collectionData} options={options} />
                    </div>
                  </ChartContainer>

                  

                  {/* Add new row of charts */}
                  <ChartContainer isDarkMode={isDarkMode} className="shadow-lg">
                    <div className="h-[300px]">
                      <Pie data={pieChartData} options={pieOptions} />
                    </div>
                  </ChartContainer>

                  <ChartContainer isDarkMode={isDarkMode} className="shadow-lg">
                    <div className="h-[300px]">
                      <Bar data={barChartData} options={barOptions} />
                    </div>
                  </ChartContainer>

                  <ChartContainer isDarkMode={isDarkMode} className="shadow-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-orange-500 mb-4">Recent Activities</h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((_, index) => (
                        <div key={index} className="flex items-center gap-4 text-sm">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <p className="text-gray-600 dark:text-orange-500">New case assigned to FC-01</p>
                          <span className="ml-auto text-gray-400 dark:text-orange-400">2h ago</span>
                        </div>
                      ))}
                    </div>
                  </ChartContainer>
                </div>
              </div>
            )}
            {activeTab === 'summary' && (
              <div>
                <h2 className="text-xl font-semibold">Summary Data Overview</h2>
                {/* First Table View */}
                <ReportsTableContainer>
                  {isLoading && (
                    <SpinnerOverlay>
                      <Spinner />
                    </SpinnerOverlay>
                  )}
                  {reportsList.length > 0 ? (
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
                            {reportsList.map((report, index) => (
                              <tr key={index}>
                                <td>{report.branch}</td>
                                <td>{report.field_collector}</td>
                                <td>{report.month}</td>
                                <td>{report.age}</td>
                                <td>{report.pn_number}</td>
                                <td>{report.refno}</td>
                                <td>{report.borrower_name}</td>
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

                {/* Second Table View */}
                <ReportsTableContainer>
                  {/* Similar structure as the first table, adjust content as needed */}
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
                          <td>test</td>
                          <td>test</td>
                        </tbody>
                      </table>
                    </div>
                  </ReportsTable>
                </ReportsTableContainer>

                {/* Third Table View */}
                <ReportsTableContainer>
                  {/* Similar structure as the first table, adjust content as needed */}
                  <ReportsTable isDarkMode={isDarkMode}>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            {/* Define headers for the third table */}
                          </tr>
                        </thead>
                        <tbody>
                          {/* Map through data for the third table */}
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
            )}
          </div>
        </div>
      </MainContent>
    </DashboardContainer>
  );
}
