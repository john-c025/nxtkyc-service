'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [activeTab, setActiveTab] = useState('verification');
  const [searchTerm, setSearchTerm] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [captchaHistory, setCaptchaHistory] = useState([]);
  const [settings, setSettings] = useState({
    difficulty: 'medium',
    length: 5,
    caseSensitive: false,
    includeNumbers: true,
    includeSymbols: false
  });
  const [lastRegenerateTime, setLastRegenerateTime] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const canvasRef = useRef(null);

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = '#f8fafc';
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
  };

  // Generate new captcha
  const generateNewCaptcha = () => {
    const now = Date.now();
    const timeSinceLastRegenerate = now - lastRegenerateTime;
    const cooldownPeriod = 30000; // 30 seconds in milliseconds
    
    if (timeSinceLastRegenerate < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastRegenerate) / 1000);
      setCooldownRemaining(remainingTime);
      return;
    }
    
    const newText = generateCaptchaText();
    setCaptchaText(newText);
    setUserInput('');
    setIsVerified(false);
    setLastRegenerateTime(now);
    setCooldownRemaining(0);
    drawCaptcha(newText);
  };

  // Verify captcha
  const verifyCaptcha = () => {
    const input = settings.caseSensitive ? userInput : userInput.toLowerCase();
    const isCorrect = input === captchaText;
    
    setAttempts(prev => prev + 1);
    
    const verification = {
      id: Date.now(),
      text: captchaText,
      userInput: userInput,
      isCorrect,
      timestamp: new Date().toISOString(),
      difficulty: settings.difficulty
    };
    
    setCaptchaHistory(prev => [verification, ...prev.slice(0, 49)]); // Keep last 50
    
    if (isCorrect) {
      setIsVerified(true);
    } else {
      // Generate new captcha after wrong attempt
      setTimeout(() => {
        generateNewCaptcha();
      }, 1000);
    }
  };

  // Initialize captcha on component mount
  useEffect(() => {
    generateNewCaptcha();
  }, [settings]);

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
                  <CaptchaCanvas
                    ref={canvasRef}
                    width={300}
                    height={80}
                    onClick={generateNewCaptcha}
                    style={{ 
                      cursor: cooldownRemaining > 0 ? 'not-allowed' : 'pointer', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '8px',
                      opacity: cooldownRemaining > 0 ? 0.6 : 1
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
                      disabled={!userInput.trim() || isVerified}
                      variant="primary"
                    >
                      {isVerified ? '✓ Verified' : 'Verify'}
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
                          <td>2.3s</td>
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
