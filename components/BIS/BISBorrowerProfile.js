'use client';

import Bot from '../Objects/Bot';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '../../context/ThemeContext';
import NavPane from '../Objects/NavPane';
import NotificationButton from '../Objects/NotificationButton';
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';
import {
  DashboardContainer,
  Sidebar,
  MainContent,
  TopBar,
  ThemeToggle
} from '../Dashboard/MainDashboardStyled';
import {
  ProfileHeader,
  ProfileImage,
  ProfileInfo,
  StatsContainer,
  StatCard,
  GraphContainer,
  ActivityGrid,
  TabContainer,
  TabList,
  Tab,
  LoanHealthCard,
  IndicatorPill,
  PaymentScheduleCard,
  PaymentItem,
  RiskIndicator,
  LoanSummaryCard,
  PaymentHistoryChart
} from './BISBorrowerProfileStyled';
import { SpinnerOverlay, Spinner } from './BISDirectoryStyled';
import dynamic from "next/dynamic";

import { ActivityTimeline, MetricGrid } from './BISBorrowerProfileStyled';
import { MetricCard } from './BISBorrowerProfileStyled';
import { createPortal } from 'react-dom';
import { PaymentDetailsModal, PaymentDetailsContent, PaymentInfo, ReceiptImage, StatusBadge } from './BISBorrowerProfileStyled';

const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

export default function BISBorrowerProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeNav, setActiveNav] = useState('reports');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userId, setUserId] = useState(" ");
  const [borrowerId, setBorrowerId] = useState(null);
  const [borrowerDetails, setBorrowerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    console.log('Component rendered');
    if (router.isReady) {
      console.log('Router is ready');
      console.log('Router Query:', router.query);
      const { borrowerId } = router.query;
      setBorrowerId(borrowerId);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    const id = searchParams.get('borrowerId');
    if (id) {
      setBorrowerId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    const accountNumber = searchParams.get('borrowerId');
    if (accountNumber) {
      setBorrowerId(accountNumber);
      fetchBorrowerDetails(accountNumber);
    }
  }, [searchParams]);

  const fetchBorrowerDetails = async (accountNumber) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.LOAD_BORROWER_DETAILS}?accountNumber=${accountNumber}`);
      setBorrowerDetails(response.data.data);
    } catch (error) {
      console.error('Error fetching borrower details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
    setIsPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <SpinnerOverlay>
        <Spinner />
      </SpinnerOverlay>
    );
  }

  if (!borrowerId) {
    return <div>Loading...</div>;
  }

  const percentageValue = 50; // Example percentage value (0 to 100)

  // Calculate the score as a percentage
  const score = percentageValue;

  const gaugeValue = score; // Set the gauge value
  const minValue = 300; // Minimum score
  const maxValue = 850; // Maximum score

  const getColorArray = (score) => {
    if (score >= 700) {
      return ["#4ade80", "#e5e7eb"]; // Green
    } else if (score >= 600) {
      return ["#ffd93d", "#e5e7eb"]; // Yellow
    } else {
      return ["#ff6b6b", "#e5e7eb"]; // Red
    }
  };

  const colorArray = getColorArray(score);

  return (
    <DashboardContainer isDarkMode={isDarkMode}>
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
              <h1 className="text-2xl font-light text-gray-900 dark:text-white">Borrower Profile</h1>
              <p className="text-sm text-gray-500 dark:text-gray-300">Account Details</p>
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

        <div className="p-6  dark:bg-inherit min-h-screen">
          {borrowerDetails ? (
            <ProfileHeader isDarkMode={isDarkMode}>
              <ProfileImage isDarkMode={isDarkMode} />
              <ProfileInfo isDarkMode={isDarkMode}>
                <h2 className="text-2xl font-semibold mb-2">{borrowerDetails.borrower_name.toUpperCase()}</h2>
                <div className="profile-details">
                  <p className="text-gray-600 dark:text-gray-300">Account #: {borrowerDetails.primary_account_number}</p>
                  <p className="text-gray-600 dark:text-gray-300">Borrower ID: {borrowerDetails.borrower_id}</p>
                </div>
                <div className="profile-badges">
                  <StatusBadge isDarkMode={isDarkMode} status="active">Active</StatusBadge>
                  <StatusBadge isDarkMode={isDarkMode} status="verified">Verified</StatusBadge>
                </div>
              </ProfileInfo>
              {/* <div className="profile-score">
                <GaugeComponent
                  type="semicircle"
                  arc={{
                    width: 0.2,
                    padding: 0.005,
                    cornerRadius: 1,
                    colorArray: ['#FF2121', '#FFA500', '#00FF15'],
                    subArcs: [
                      { limit: 300, color: '#FF2121', showTick: true },
                      { limit: 500, color: '#FF8C00', showTick: true },
                      { limit: 650, color: '#FFA500', showTick: true },
                      { limit: 750, color: '#90EE90', showTick: true },
                      { limit: 850, color: '#00FF15', showTick: true }
                    ]
                  }}
                  pointer={{
                    type: "needle",
                    length: 0.8,
                    width: 15,
                    color: isDarkMode ? '#fdba74' : '#f97316',
                    elastic: true,
                    animationDelay: 0
                  }}
                  labels={{
                    valueLabel: { 
                      formatTextValue: value => value.toFixed(0), 
                      style: { 
                        fontSize: '24px', 
                        fill: isDarkMode ? '#fdba74' : '#f97316' 
                      } 
                    },
                    tickLabels: {
                      type: "outer",
                      ticks: [
                        { value: 300 },
                        { value: 500 },
                        { value: 650 },
                        { value: 750 },
                        { value: 850 }
                      ],
                      style: { 
                        fontSize: '12px', 
                        fill: isDarkMode ? '#9ca3af' : '#6b7280' 
                      }
                    }
                  }}
                  value={680}
                  minValue={300}
                  maxValue={850}
                  style={{ width: '100%', maxWidth: '250px' }}
                />
                <div className="score-details">
                  <div className="score-label">Credit Rating</div>
                  <div className="score-value">680</div>
                  <div className="score-category">Good</div>
                </div>
              </div> */}
            </ProfileHeader>
          ) : (
            <div>Error loading borrower details.</div>
          )}

          <StatsContainer>
            <StatCard isDarkMode={isDarkMode} trend="up">
              <div className="stat-header">
                <h3>Total Loan</h3>
                <div className="trend-indicator">+5.2%</div>
              </div>
              <div className="stat-value">₱24,000,000</div>
              <div className="stat-chart">
                {/* Mini sparkline chart here */}
              </div>
            </StatCard>
            <StatCard isDarkMode={isDarkMode} trend="up">
              <div className="stat-header">
                <h3>Completed Payment</h3>
                <div className="trend-indicator">+2.4%</div>
              </div>
              <div className="stat-value">₱1,350,000</div>
              <div className="stat-chart">
                {/* Mini sparkline chart here */}
              </div>
            </StatCard>
            <StatCard isDarkMode={isDarkMode} trend="down">
              <div className="stat-header">
                <h3>Overdue Amount</h3>
                <div className="trend-indicator">-1.8%</div>
              </div>
              <div className="stat-value">₱22,000,000</div>
              <div className="stat-chart">
                {/* Mini sparkline chart here */}
              </div>
            </StatCard>
            <StatCard isDarkMode={isDarkMode}>
              <div className="stat-header">
                <h3>Account Age</h3>
              </div>
              <div className="stat-value">2 Years</div>
              <div className="stat-subtitle">Since March 2022</div>
            </StatCard>
          </StatsContainer>

          <TabContainer>
            <TabList isDarkMode={isDarkMode}>
              <Tab 
                isActive={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </Tab>
              {/* <Tab 
                isActive={activeTab === 'activities'} 
                onClick={() => setActiveTab('activities')}
              >
                Activities
              </Tab>
              <Tab 
                isActive={activeTab === 'stats'} 
                onClick={() => setActiveTab('stats')}
              >
                Stats
              </Tab> */}
            </TabList>
          </TabContainer>

          {activeTab === 'overview' && (
            <>
              <GraphContainer isDarkMode={isDarkMode} className="credit-report">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Delinquency Rating</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 dark:text-gray-300">Last Updated: {new Date().toLocaleDateString()}</span>
                    <button className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="credit-score-gauge w-1/2">
                    <GaugeComponent
                      type="semicircle"
                      arc={{
                        width: 0.1,
                        padding: 0.004,
                        cornerRadius: 10,
                        colorArray: ['#22c55e', '#f97316', '#ef4444'],
                        subArcs: [
                          { limit: 20, color: '#ef4444', showTick: true },
                          { limit: 40, color: '#f97316', showTick: true },
                          { limit: 60, color: '#facc15', showTick: true },
                          { limit: 80, color: '#84cc16', showTick: true },
                          { limit: 100, color: '#22c55e', showTick: true }
                        ]
                      }}
                      pointer={{
                        type: "needle",
                        length: 0.8,
                        width: 10,
                        color: isDarkMode ? '#fdba74' : '#f97316',
                        elastic: true
                      }}
                      labels={{
                        valueLabel: { 
                          formatTextValue: value => value.toFixed(0), 
                          style: { fontSize: '24px', fill: isDarkMode ? '#fdba74' : '#f97316' } 
                        }
                      }}
                      value={40}
                      minValue={0}
                      maxValue={100}
                      style={{ width: '80%', maxHeight: '200px' }}
                    />
                    {/* <div className="text-center mt-4">
                      <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">Good Standing</div>
                    </div> */}
                  </div>
                  <div className="credit-info w-1/2">
                    <div className="grid grid-cols-2 gap-4">
                      <MetricCard isDarkMode={isDarkMode}>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">On-Time Payments</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-600 dark:text-green-500">98%</span>
                          <span className="text-sm text-green-600 dark:text-green-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          </span>
                        </div>
                      </MetricCard>
                      
                      <MetricCard isDarkMode={isDarkMode}>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Late Payments</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-2xl font-bold text-red-600 dark:text-red-500">2%</span>
                          <span className="text-sm text-red-600 dark:text-red-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </span>
                        </div>
                      </MetricCard>
                      
                      <MetricCard isDarkMode={isDarkMode} className="col-span-2">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment History</div>
                        <div className="mt-3 flex gap-1">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 flex-1 rounded-full ${
                                i < 11 ? 'bg-green-500 dark:bg-green-600' : 'bg-orange-500 dark:bg-orange-600'
                              }`}
                              title={`Month ${12 - i}`}
                            />
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Last 12 months
                        </div>
                      </MetricCard>
                    </div>
                  </div>
                </div>
              </GraphContainer>

               <div className="grid grid-cols-2 gap-6">
                <GraphContainer isDarkMode={isDarkMode}>
                  <h3 className="text-xl mb-4">Details</h3>
                  <div className="space-y-4">
                    <div className="factor-item">
                      <div className="flex justify-between mb-1">
                        <span>Truck Financing</span>
                        <span className="text-blue-600 font-semibold">24%</span>
                      </div>
                    </div>
                    <div className="factor-item">
                      <div className="flex justify-between mb-1">
                        <span>Payment History</span>
                        <span className="text-blue-600 font-semibold">99%</span>
                      </div>
                    </div>
                    <div className="factor-item">
                      <div className="flex justify-between mb-1">
                        <span>Age of Credit History</span>
                        <span className="text-blue-600 font-semibold">6Y 7M</span>
                      </div>
                    </div>
                  </div>
                </GraphContainer>

                <GraphContainer isDarkMode={isDarkMode}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl">Loan Products</h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total:</div>
                      <div className="text-xl font-semibold">$439,000</div>
                    </div>
                  </div>
                  <div className="relative pt-4">
                    <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="text-3xl font-bold">74%</div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                        Credit Cards
                      </span>
                      <span>20</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                        Real Estate
                      </span>
                      <span>5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-400"></span>
                        Auto
                      </span>
                      <span>3</span>
                    </div>
                  </div>
                </GraphContainer>
              </div> 
            </>
          )}
          
          {activeTab !== 'overview' && (
            <GraphContainer isDarkMode={isDarkMode}>
              <div className="h-64">Activity Graph</div>
            </GraphContainer>
          )}

          <ActivityGrid>
            {/* Add your activity cards here */}
          </ActivityGrid>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <LoanHealthCard isDarkMode={isDarkMode} health={85}>
              <div className="health-score">85</div>
              <div className="health-label">Loan Health Score</div>
              <div className="health-indicators">
                <IndicatorPill isDarkMode={isDarkMode}>
                  <div className="indicator-value">97%</div>
                  <div className="indicator-label">Payment History</div>
                </IndicatorPill>
                <IndicatorPill isDarkMode={isDarkMode}>
                  <div className="indicator-value">82%</div>
                  <div className="indicator-label">Utilization</div>
                </IndicatorPill>
                <IndicatorPill isDarkMode={isDarkMode}>
                  <div className="indicator-value">24m</div>
                  <div className="indicator-label">History Length</div>
                </IndicatorPill>
              </div>
            </LoanHealthCard>

            <PaymentScheduleCard isDarkMode={isDarkMode}>
              <div className="next-payment">
                <div className="amount">₱24,500</div>
                <div className="due-date">Next Payment Due: <span>Apr 15, 2024</span></div>
              </div>
              <div className="payment-list">
                <PaymentItem 
                  isDarkMode={isDarkMode} 
                  status="paid"
                  onClick={() => handlePaymentClick({
                    amount: 24500,
                    date: 'March 15, 2024',
                    status: 'paid',
                    receiptNo: 'RCP-2024-0315',
                    collectedBy: 'John Smith',
                    paymentMethod: 'GCash',
                    location: 'Pasig City',
                    receiptImage: '/assets/test-receipt.jpg',
                    timestamp: '2:30 PM'
                  })}
                >
                  <div className="payment-info">
                    <div className="amount">₱24,500</div>
                    <div className="date">March 15, 2024</div>
                  </div>
                  <div className="status">Paid</div>
                </PaymentItem>
                <PaymentItem 
                  isDarkMode={isDarkMode} 
                  status="pending"
                  onClick={() => handlePaymentClick({
                    amount: 24500,
                    date: 'April 15, 2024',
                    status: 'pending',
                    receiptNo: 'RCP-2024-0415',
                    collectedBy: 'Jane Doe',
                    paymentMethod: 'GCash',
                    location: 'Makati City',
                    receiptImage: '', // Replace with actual receipt image URL
                    timestamp: '10:15 AM'
                  })}
                >
                  <div className="payment-info">
                    <div className="amount">₱24,500</div>
                    <div className="date">April 15, 2024</div>
                  </div>
                  <div className="status">Pending</div>
                </PaymentItem>
              </div>
            </PaymentScheduleCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <ActivityTimeline isDarkMode={isDarkMode}>
                {/* ... existing ActivityTimeline content ... */}
              </ActivityTimeline>
            </div>
            <div>
              <MetricGrid isDarkMode={isDarkMode}>
                {/* ... existing MetricGrid content ... */}
              </MetricGrid>
            </div>
          </div>
        </div>
      </MainContent>

      {/* Payment Details Modal */}
      {createPortal(
        isPaymentModalOpen && selectedPayment && (
          <PaymentDetailsModal onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsPaymentModalOpen(false);
            }
          }}>
            <PaymentDetailsContent isDarkMode={isDarkMode} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Payment Details
                </h3>
                <button 
                  className="close-button"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="modal-body">
                <PaymentInfo isDarkMode={isDarkMode}>
                  <div className="info-group amount">
                    <div className="label">Amount</div>
                    <div className="value">₱{selectedPayment.amount.toLocaleString()}</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Status</div>
                    <StatusBadge isDarkMode={isDarkMode} status={selectedPayment.status}>
                      {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                    </StatusBadge>
                  </div>
                  <div className="info-group">
                    <div className="label">Receipt No.</div>
                    <div className="value">{selectedPayment.receiptNo}</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Date & Time</div>
                    <div className="value">{selectedPayment.date} at {selectedPayment.timestamp}</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Collected By</div>
                    <div className="value">{selectedPayment.collectedBy}</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Payment Method</div>
                    <div className="value">{selectedPayment.paymentMethod}</div>
                  </div>
                  <div className="info-group">
                    <div className="label">Location</div>
                    <div className="value">{selectedPayment.location}</div>
                  </div>
                </PaymentInfo>

                <ReceiptImage isDarkMode={isDarkMode}>
                  <div className="image-container">
                    <Image 
                      src="/assets/test-receipt.jpg"
                      alt="Payment Receipt"
                      fill
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </div>
                  <div className="image-caption">
                    Payment Receipt - {selectedPayment.receiptNo}
                  </div>
                </ReceiptImage>
              </div>
            </PaymentDetailsContent>
          </PaymentDetailsModal>
        ),
        document.body
      )}
      <Bot userId={userId}/> 
    </DashboardContainer>
  );
}