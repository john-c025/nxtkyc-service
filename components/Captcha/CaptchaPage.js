'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '../backend/apiHelper';
import axiosPublicInstance from '../backend/axiosPublicInstance';
import { 
  DashboardContainer, 
  MainContent, 
  TopBar, 
  HeaderContent, 
  HeaderTitle, 
  HeaderActions,
  ContentLayout,
  Card,
  Button,
  SearchInput,
  SearchInputWrapper,
  StatusBadge,
  Table,
  TabContainer,
  TabList,
  TabButton,
  MobileMenuToggle,
  CaptchaContainer,
  CaptchaCanvas,
  CaptchaInput,
  CaptchaControls,
  CaptchaStats,
  CaptchaHistory,
  CaptchaSettings
} from './CaptchaPageStyled';

export default function CaptchaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('verification');
  const [searchTerm, setSearchTerm] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [captchaId, setCaptchaId] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [captchaHistory, setCaptchaHistory] = useState([]);
  const [isValidAccess, setIsValidAccess] = useState(false);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true);
  const [accessError, setAccessError] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [accountValidation, setAccountValidation] = useState({
    isValid: false,
    isLoading: true,
    error: null,
    accountExists: false,
    originNumberUnique: false,
    accountOriginNumber: null,
    companyId: 0
  });
  const [settings, setSettings] = useState({
    difficulty: 'medium',
    length: 5,
    caseSensitive: false,
    includeNumbers: true,
    includeSymbols: false
  });
  const [lastRegenerateTime, setLastRegenerateTime] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const canvasRef = useRef(null);

  // Account validation function
  const validateAccountExistence = async (accountCode) => {
    if (!accountCode) {
      setAccountValidation(prev => ({
        ...prev,
        isLoading: false,
        error: 'Account code is required',
        isValid: false
      }));
      return false;
    }

    try {
      console.log('🔍 CaptchaPage: Checking account existence for:', accountCode);
      const response = await axiosPublicInstance.get(API_ENDPOINTS.KYC_PUBLIC_CHECK_ACCOUNT, {
        params: { account_code: accountCode }
      });

      if (response.data.success) {
        const data = response.data.data;
        console.log('✅ CaptchaPage: Account validation response:', data);
        
        setAccountValidation({
          isValid: data.account_exists,
          isLoading: false,
          error: null,
          accountExists: data.account_exists,
          originNumberUnique: data.origin_number_unique,
          accountOriginNumber: data.account_origin_number,
          companyId: data.company_id
        });

        return data.account_exists;
      } else {
        throw new Error(response.data.message || 'Account validation failed');
      }
    } catch (error) {
      console.error('❌ CaptchaPage: Account validation error:', error);
      setAccountValidation(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to validate account',
        isValid: false
      }));
      return false;
    }
  };

  // Generate random captcha text
  const generateCaptchaText = () => {
    const chars = settings.includeNumbers ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const symbols = settings.includeSymbols ? '!@#$%^&*' : '';
    const allChars = chars + symbols;
    
    let result = '';
    for (let i = 0; i < settings.length; i++) {
      result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    return settings.caseSensitive ? result : result.toLowerCase();
  };

  // Draw captcha on canvas
  const drawCaptcha = (text) => {
    console.log('🎨 drawCaptcha called with text:', text);
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('❌ Canvas ref is null!');
      return;
    }
    
    console.log('🎨 Canvas found, getting context...');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    console.log('🎨 Canvas dimensions:', width, 'x', height);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background with pastel yellow theme
    ctx.fillStyle = '#fefdf8';
    ctx.fillRect(0, 0, width, height);
    
    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
    
    // Add noise dots
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.2)`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }
    
    // Draw text
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = (width / text.length) * i + (width / text.length) / 2;
      const y = height / 2 + (Math.random() - 0.5) * 10;
      const angle = (Math.random() - 0.5) * 0.5;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
    
    console.log('✅ Captcha drawing completed');
  };

  // Generate new captcha via API
  const generateNewCaptcha = async () => {
    console.log('🎨 generateNewCaptcha called');
    const now = Date.now();
    const timeSinceLastRegenerate = now - lastRegenerateTime;
    const cooldownPeriod = 30000; // 30 seconds in milliseconds
    
    if (timeSinceLastRegenerate < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastRegenerate) / 1000);
      console.log('⏰ Captcha cooldown active, remaining:', remainingTime);
      setCooldownRemaining(remainingTime);
      return;
    }
    
    console.log('🎨 Starting captcha generation...');
    
    try {
      // Generate captcha via API
      const response = await axiosPublicInstance.post(API_ENDPOINTS.GENERATE_CAPTCHA, {
        difficulty: settings.difficulty,
        length: settings.length,
        case_sensitive: settings.caseSensitive,
        include_numbers: settings.includeNumbers,
        include_symbols: settings.includeSymbols
      });

      if (response.data.Success) {
        const { captcha_text, captcha_id, image_data } = response.data.Data;
        setCaptchaText(captcha_text);
        setCaptchaId(captcha_id);
        setUserInput('');
        setIsVerified(false);
        setLastRegenerateTime(now);
        setCooldownRemaining(0);
        
        // Draw the captcha image if image data is provided, otherwise use local generation
        if (image_data) {
          drawCaptchaFromBase64(image_data);
        } else {
          drawCaptcha(captcha_text);
        }
      } else {
        // Fallback to local generation
        console.log('🔄 API failed, using local captcha generation');
        const newText = generateCaptchaText();
        console.log('🎨 Generated captcha text:', newText);
        setCaptchaText(newText);
        setUserInput('');
        setIsVerified(false);
        setLastRegenerateTime(now);
        setCooldownRemaining(0);
        console.log('🎨 Drawing captcha on canvas...');
        drawCaptcha(newText);
      }
    } catch (error) {
      console.error('❌ Error generating captcha via API:', error);
      // Fallback to local generation
      console.log('🔄 API error, using local captcha generation');
      const newText = generateCaptchaText();
      console.log('🎨 Generated captcha text:', newText);
      setCaptchaText(newText);
      setUserInput('');
      setIsVerified(false);
      setLastRegenerateTime(now);
      setCooldownRemaining(0);
      console.log('🎨 Drawing captcha on canvas...');
      drawCaptcha(newText);
    }
  };

  // Draw captcha from base64 image data
  const drawCaptchaFromBase64 = (base64Data) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = `data:image/png;base64,${base64Data}`;
  };

  // Verify captcha via API
  const verifyCaptcha = async () => {
    setIsSubmittingVerification(true);
    
    try {
      const response = await axiosPublicInstance.post(API_ENDPOINTS.VERIFY_CAPTCHA, {
        captcha_id: captchaId,
        captcha_text: captchaText,
        user_input: userInput,
        case_sensitive: settings.caseSensitive
      });
    
    setAttempts(prev => prev + 1);
    
    const verification = {
      id: Date.now(),
      text: captchaText,
      userInput: userInput,
        isCorrect: response.data.Success,
      timestamp: new Date().toISOString(),
        difficulty: settings.difficulty,
        response_time: response.data.Data?.response_time || '0ms'
    };
    
    setCaptchaHistory(prev => [verification, ...prev.slice(0, 49)]); // Keep last 50
    
      if (response.data.Success) {
      setIsVerified(true);
        
        // If there's a redirect URL, redirect after verification
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1500);
        } else {
          // Default redirect to KYC page if no redirect URL provided
          const token = searchParams.get('token');
          const account = searchParams.get('account');
          if (token && account) {
            setTimeout(() => {
              window.location.href = `/client?token=${token}&account=${account}`;
            }, 1500);
          }
        }
    } else {
      // Generate new captcha after wrong attempt
      setTimeout(() => {
        generateNewCaptcha();
      }, 1000);
    }
    } catch (error) {
      console.error('Error verifying captcha:', error);
      setAttempts(prev => prev + 1);
      
      // Fallback to local verification
      const input = settings.caseSensitive ? userInput : userInput.toLowerCase();
      const isCorrect = input === captchaText;
      
      const verification = {
        id: Date.now(),
        text: captchaText,
        userInput: userInput,
        isCorrect,
        timestamp: new Date().toISOString(),
        difficulty: settings.difficulty,
        response_time: 'local'
      };
      
      setCaptchaHistory(prev => [verification, ...prev.slice(0, 49)]);
      
      if (isCorrect) {
        setIsVerified(true);
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1500);
        } else {
          // Default redirect to KYC page if no redirect URL provided
          const token = searchParams.get('token');
          const account = searchParams.get('account');
          if (token && account) {
            setTimeout(() => {
              window.location.href = `/client?token=${token}&account=${account}`;
            }, 1500);
          }
        }
      } else {
        setTimeout(() => {
          generateNewCaptcha();
        }, 1000);
      }
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  // Validate access and initialize
  useEffect(() => {
    const validateAccess = async () => {
      try {
        setIsLoadingAccess(true);
        
        // Get parameters from URL
        const redirect = searchParams.get('redirect');
        const source = searchParams.get('source');
        const token = searchParams.get('token');
        const account = searchParams.get('account');
        
        if (redirect) {
          setRedirectUrl(decodeURIComponent(redirect));
        }
        
        // Validate access - require token and account parameters
        if (token && account) {
          console.log('CaptchaPage: Valid access with token and account parameters');
          
          // Validate account existence first
          console.log('🔍 CaptchaPage: Validating account existence...');
          const accountExists = await validateAccountExistence(account);
          if (!accountExists) {
            setAccessError('Account not found or invalid. Please check your account code.');
            return;
          }
          
          setIsValidAccess(true);
          await generateNewCaptcha();
        } else if (redirect || source) {
          console.log('CaptchaPage: Valid access with redirect/source parameters');
          setIsValidAccess(true);
          await generateNewCaptcha();
        } else {
          console.log('CaptchaPage: Access denied - missing required parameters');
          setAccessError('Access denied. This page requires a valid access link with token and account parameters.');
        }
      } catch (error) {
        console.error('Access validation error:', error);
        setAccessError('Unable to validate access. Please try again.');
      } finally {
        setIsLoadingAccess(false);
      }
    };
    
    validateAccess();
  }, [searchParams]);

  // Initialize captcha when settings change
  useEffect(() => {
    console.log('🔄 useEffect triggered - isValidAccess:', isValidAccess);
    if (isValidAccess) {
      console.log('🎨 Calling generateNewCaptcha from useEffect...');
      generateNewCaptcha();
    }
  }, [settings, isValidAccess]);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [cooldownRemaining]);

  // Mock data for captcha statistics
  const captchaStats = {
    totalAttempts: 1247,
    successfulVerifications: 1089,
    failedAttempts: 158,
    averageTime: '3.2s',
    successRate: '87.3%'
  };

  const recentVerifications = captchaHistory.slice(0, 10);

  // Show loading state while validating access and account
  if (isLoadingAccess || accountValidation.isLoading) {
    return (
      <DashboardContainer>
        <MainContent>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #f59e0b',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
              {accountValidation.isLoading ? 'Validating account...' : 'Validating access...'}
            </p>
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              textAlign: 'center',
              marginTop: '1rem'
            }}>
              <p>Account: {searchParams.get('account') || 'Missing'}</p>
            </div>
          </div>
        </MainContent>
      </DashboardContainer>
    );
  }

  // Show error state if access is denied
  if (accessError) {
    return (
      <DashboardContainer>
        <MainContent>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            flexDirection: 'column',
            gap: '1.5rem',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <div style={{ 
              fontSize: '3rem',
              color: '#dc2626'
            }}>
              🤖
            </div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#dc2626',
              margin: 0
            }}>
              Access Restricted
            </h2>
            <p style={{ 
              color: '#64748b', 
              fontSize: '1.125rem',
              maxWidth: '500px',
              lineHeight: '1.6'
            }}>
              {accessError}
            </p>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
            >
              Return to Home
            </button>
          </div>
        </MainContent>
      </DashboardContainer>
    );
  }

  // Show main captcha form if access is valid
  return (
    <DashboardContainer>
      <MainContent>
        <TopBar>
          <HeaderContent>
            <MobileMenuToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </MobileMenuToggle>
            <HeaderTitle>
              <h1>Prove you're a human</h1>
              <p>Advanced bot protection and human verification system</p>
              {/* Account Validation Status */}
              {accountValidation.accountExists && (
                <div style={{
                  color: '#15803d',
                  fontSize: '0.75rem',
                  marginTop: '0.5rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>✓</span>
                  <span>Account Validated</span>
                  {accountValidation.accountOriginNumber && (
                    <span>| Origin: {accountValidation.accountOriginNumber}</span>
                  )}
                  {!accountValidation.originNumberUnique && (
                    <span style={{ color: '#d97706' }}>| ⚠️ Duplicate Origin Number</span>
                  )}
                </div>
              )}
            </HeaderTitle>
          </HeaderContent>
          <HeaderActions>
            
          </HeaderActions>
        </TopBar>

        <ContentLayout>
          {/* <TabContainer>
            <TabList>
              <TabButton 
                isActive={activeTab === 'verification'} 
                onClick={() => setActiveTab('verification')}
              >
                Live Verification
              </TabButton>
              <TabButton 
                isActive={activeTab === 'history'} 
                onClick={() => setActiveTab('history')}
              >
                Verification History
              </TabButton>
              <TabButton 
                isActive={activeTab === 'analytics'} 
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </TabButton>
              <TabButton 
                isActive={activeTab === 'settings'} 
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </TabButton>
            </TabList>
          </TabContainer> */}

          {activeTab === 'verification' && (
            <Card>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                  CAPTCHA Verification
                </h2>
                <p style={{ color: '#64748b', margin: 0 }}>
                  Complete the verification to prove you're human
                </p>
              </div>

              <CaptchaContainer>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={80}
                    onClick={generateNewCaptcha}
                    style={{ 
                      cursor: cooldownRemaining > 0 ? 'not-allowed' : 'pointer', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '8px',
                      opacity: cooldownRemaining > 0 ? 0.6 : 1,
                      display: 'block',
                      margin: '0 auto'
                    }}
                    title={cooldownRemaining > 0 ? `Please wait ${cooldownRemaining}s before regenerating` : "Click to generate new CAPTCHA"}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.5rem 0 0 0' }}>
                    {cooldownRemaining > 0 
                      ? `Please wait ${cooldownRemaining} seconds before generating a new CAPTCHA`
                      : 'Click on the image to generate a new CAPTCHA'
                    }
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  <CaptchaInput
                    type="text"
                    placeholder="Enter the text you see above"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && verifyCaptcha()}
                    disabled={isVerified}
                    style={{ 
                      textAlign: 'center',
                      fontSize: '1.125rem',
                      letterSpacing: '0.1em'
                    }}
                  />

                  <CaptchaControls>
                    <Button 
                      onClick={verifyCaptcha}
                      disabled={!userInput.trim() || isVerified || isSubmittingVerification}
                      variant="primary"
                    >
                      {isSubmittingVerification ? 'Verifying...' : isVerified ? '✓ Verified' : 'Verify'}
                    </Button>
                    <Button 
                      onClick={generateNewCaptcha}
                      variant="secondary"
                      disabled={cooldownRemaining > 0}
                    >
                      {cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : 'Generate New'}
                    </Button>
                  </CaptchaControls>

                  {isVerified && (
                    <div style={{ 
                      padding: '1rem', 
                      background: '#f0fdf4', 
                      border: '1px solid #bbf7d0', 
                      borderRadius: '8px',
                      color: '#15803d',
                      textAlign: 'center'
                    }}>
                      <strong>✓ Verification Successful!</strong>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                        You have successfully completed the CAPTCHA verification.
                        {redirectUrl && (
                          <><br />You will be redirected automatically in a few seconds...</>
                        )}
                      </p>
                    </div>
                  )}

                  {attempts > 0 && !isVerified && (
                    <div style={{ 
                      padding: '1rem', 
                      background: '#fef2f2', 
                      border: '1px solid #fecaca', 
                      borderRadius: '8px',
                      color: '#dc2626',
                      textAlign: 'center'
                    }}>
                      <strong>Verification Failed</strong>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
                        Attempts: {attempts} | Please try again with a new CAPTCHA.
                      </p>
                    </div>
                  )}
                </div>
              </CaptchaContainer>
            </Card>
          )}

          {activeTab === 'history' && (
            <Card>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                  Verification History
                </h2>
                <p style={{ color: '#64748b', margin: 0 }}>
                  Recent CAPTCHA verification attempts and results
                </p>
              </div>

              <CaptchaHistory>
                <Table>
                  <table>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>CAPTCHA Text</th>
                        <th>User Input</th>
                        <th>Result</th>
                        <th>Difficulty</th>
                        <th>Response Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentVerifications.map((verification) => (
                        <tr key={verification.id}>
                          <td>{new Date(verification.timestamp).toLocaleString()}</td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {verification.text}
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                            {verification.userInput}
                          </td>
                          <td>
                            <StatusBadge status={verification.isCorrect ? 'success' : 'error'}>
                              {verification.isCorrect ? 'SUCCESS' : 'FAILED'}
                            </StatusBadge>
                          </td>
                          <td>
                            <StatusBadge status="neutral">
                              {verification.difficulty.toUpperCase()}
                            </StatusBadge>
                          </td>
                          <td>{verification.response_time || '2.3s'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Table>
              </CaptchaHistory>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <Card>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                  CAPTCHA Analytics
                </h2>
                <p style={{ color: '#64748b', margin: 0 }}>
                  Performance metrics and verification statistics
                </p>
              </div>

              <CaptchaStats>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                      {captchaStats.totalAttempts.toLocaleString()}
                    </h3>
                    <p style={{ color: '#64748b', margin: 0 }}>Total Attempts</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: '#f0fdf4', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#15803d' }}>
                      {captchaStats.successfulVerifications.toLocaleString()}
                    </h3>
                    <p style={{ color: '#64748b', margin: 0 }}>Successful</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fef2f2', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#dc2626' }}>
                      {captchaStats.failedAttempts.toLocaleString()}
                    </h3>
                    <p style={{ color: '#64748b', margin: 0 }}>Failed</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: '#eff6ff', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#2563eb' }}>
                      {captchaStats.successRate}
                    </h3>
                    <p style={{ color: '#64748b', margin: 0 }}>Success Rate</p>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1.5rem', background: '#fef3c7', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 0.5rem 0', color: '#d97706' }}>
                      {captchaStats.averageTime}
                    </h3>
                    <p style={{ color: '#64748b', margin: 0 }}>Avg Response Time</p>
                  </div>
                </div>
              </CaptchaStats>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                  CAPTCHA Settings
                </h2>
                <p style={{ color: '#64748b', margin: 0 }}>
                  Configure CAPTCHA difficulty and appearance settings
                </p>
              </div>

              <CaptchaSettings>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                      Difficulty Level
                    </label>
                    <select 
                      value={settings.difficulty} 
                      onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                      style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px',
                        width: '200px'
                      }}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                      Text Length
                    </label>
                    <input 
                      type="number" 
                      min="3" 
                      max="8" 
                      value={settings.length} 
                      onChange={(e) => setSettings(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                      style={{ 
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '6px',
                        width: '100px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        checked={settings.caseSensitive} 
                        onChange={(e) => setSettings(prev => ({ ...prev, caseSensitive: e.target.checked }))}
                      />
                      Case Sensitive
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        checked={settings.includeNumbers} 
                        onChange={(e) => setSettings(prev => ({ ...prev, includeNumbers: e.target.checked }))}
                      />
                      Include Numbers
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        checked={settings.includeSymbols} 
                        onChange={(e) => setSettings(prev => ({ ...prev, includeSymbols: e.target.checked }))}
                      />
                      Include Symbols
                    </label>
                  </div>
                </div>
              </CaptchaSettings>
            </Card>
          )}
        </ContentLayout>
      </MainContent>
    </DashboardContainer>
  );
}
