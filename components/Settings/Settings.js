'use client';

import React, { useState, useEffect } from 'react';
import NavPane from '../Objects/NavPane';
import {
  SettingsContainer,
  SettingsLayout,
  SettingsSidebar,
  SidebarTitle,
  SidebarNav,
  SidebarNavItem,
  SettingsContent,
  ContentHeader,
  ContentTitle,
  ContentDescription,
  ContentBody,
  SettingSection,
  SectionTitle,
  SectionDescription,
  FormGroup,
  Label,
  Input,
  Select,
  Toggle,
  ToggleSwitch,
  ToggleLabel,
  Button,
  ButtonGroup,
  AlertBox,
  PageHeader,
  PageTitle,
  PageSubtitle,
  colors
} from './SettingsStyled';

const SETTINGS_SECTIONS = [
  {
    id: 'general',
    title: 'General',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
      </svg>
    )
  },
  {
    id: 'security',
    title: 'Security',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,17.4 15.4,18 14.8,18H9.2C8.6,18 8,17.4 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
      </svg>
    )
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
      </svg>
    )
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/>
      </svg>
    )
  },
  {
    id: 'backup',
    title: 'Backup & Recovery',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
      </svg>
    )
  }
];

const MainDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    companyName: 'CoreHR Solutions',
    timezone: 'UTC+8',
    language: 'English',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    twoFactorAuth: true,
    emailNotifications: true,
    pushNotifications: false,
    autoBackup: true,
    backupFrequency: 'daily'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <>
            <ContentHeader>
              <ContentTitle>General Settings</ContentTitle>
              <ContentDescription>
                Configure basic system settings and preferences
              </ContentDescription>
            </ContentHeader>
            <ContentBody>
              <SettingSection>
                <SectionTitle>Company Information</SectionTitle>
                <FormGroup>
                  <Label>Company Name</Label>
                  <Input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange('companyName', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Default Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    <option value="UTC+8">UTC+8 (Singapore)</option>
                    <option value="UTC+0">UTC+0 (London)</option>
                    <option value="UTC-5">UTC-5 (New York)</option>
                    <option value="UTC-8">UTC-8 (Los Angeles)</option>
                  </Select>
                </FormGroup>
              </SettingSection>

              <SettingSection>
                <SectionTitle>Localization</SectionTitle>
                <FormGroup>
                  <Label>Language</Label>
                  <Select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Currency</Label>
                  <Select
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="SGD">SGD (S$)</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Date Format</Label>
                  <Select
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </Select>
                </FormGroup>
              </SettingSection>
            </ContentBody>
          </>
        );

      case 'security':
        return (
          <>
            <ContentHeader>
              <ContentTitle>Security Settings</ContentTitle>
              <ContentDescription>
                Manage security preferences and authentication settings
              </ContentDescription>
            </ContentHeader>
            <ContentBody>
              <AlertBox type="warning">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                <div>
                  <strong>Important:</strong> Changes to security settings will affect all users in your organization.
                </div>
              </AlertBox>

              <SettingSection>
                <SectionTitle>Authentication</SectionTitle>
                <FormGroup>
                  <Toggle>
                    <ToggleSwitch
                      checked={settings.twoFactorAuth}
                      onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
                    />
                    <div>
                      <ToggleLabel>Two-Factor Authentication</ToggleLabel>
                      <div style={{ fontSize: '0.75rem', color: colors.text.tertiary, marginTop: '0.25rem' }}>
                        Require 2FA for all user accounts
                      </div>
                    </div>
                  </Toggle>
                </FormGroup>
              </SettingSection>

              <SettingSection>
                <SectionTitle>Password Policy</SectionTitle>
                <SectionDescription>
                  Configure password requirements for all users
                </SectionDescription>
                <FormGroup>
                  <Label>Minimum Password Length</Label>
                  <Select defaultValue="8">
                    <option value="6">6 characters</option>
                    <option value="8">8 characters</option>
                    <option value="12">12 characters</option>
                    <option value="16">16 characters</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Toggle>
                    <ToggleSwitch checked={true} />
                    <ToggleLabel>Require special characters</ToggleLabel>
                  </Toggle>
                </FormGroup>
                <FormGroup>
                  <Toggle>
                    <ToggleSwitch checked={true} />
                    <ToggleLabel>Require numbers</ToggleLabel>
                  </Toggle>
                </FormGroup>
              </SettingSection>
            </ContentBody>
          </>
        );

      case 'notifications':
        return (
          <>
            <ContentHeader>
              <ContentTitle>Notification Settings</ContentTitle>
              <ContentDescription>
                Configure how and when you receive notifications
              </ContentDescription>
            </ContentHeader>
            <ContentBody>
              <SettingSection>
                <SectionTitle>Email Notifications</SectionTitle>
                <FormGroup>
                  <Toggle>
                    <ToggleSwitch
                      checked={settings.emailNotifications}
                      onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                    />
                    <div>
                      <ToggleLabel>Enable Email Notifications</ToggleLabel>
                      <div style={{ fontSize: '0.75rem', color: colors.text.tertiary, marginTop: '0.25rem' }}>
                        Receive important updates via email
                      </div>
                    </div>
                  </Toggle>
                </FormGroup>
              </SettingSection>

              <SettingSection>
                <SectionTitle>Push Notifications</SectionTitle>
                <FormGroup>
                  <Toggle>
                    <ToggleSwitch
                      checked={settings.pushNotifications}
                      onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
                    />
                    <div>
                      <ToggleLabel>Enable Push Notifications</ToggleLabel>
                      <div style={{ fontSize: '0.75rem', color: colors.text.tertiary, marginTop: '0.25rem' }}>
                        Receive real-time notifications in your browser
                      </div>
                    </div>
                  </Toggle>
                </FormGroup>
              </SettingSection>

              <SettingSection>
                <SectionTitle>Notification Types</SectionTitle>
                <FormGroup>
                  <Toggle>
                    <ToggleSwitch checked={true} />
                    <ToggleLabel>New employee registrations</ToggleLabel>
                  </Toggle>
                </FormGroup>
                <FormGroup>
                  <Toggle>
                    <ToggleSwitch checked={true} />
                    <ToggleLabel>Leave requests</ToggleLabel>
                  </Toggle>
                </FormGroup>
                <FormGroup>
                  <Toggle>
                    <ToggleSwitch checked={false} />
                    <ToggleLabel>System maintenance alerts</ToggleLabel>
                  </Toggle>
                </FormGroup>
              </SettingSection>
            </ContentBody>
          </>
        );

      case 'integrations':
        return (
          <>
            <ContentHeader>
              <ContentTitle>Integrations</ContentTitle>
              <ContentDescription>
                Connect with third-party services and applications
              </ContentDescription>
            </ContentHeader>
            <ContentBody>
              <SettingSection>
                <SectionTitle>Available Integrations</SectionTitle>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[
                    { name: 'Slack', status: 'Connected', description: 'Team communication platform' },
                    { name: 'Google Workspace', status: 'Not Connected', description: 'Email and productivity suite' },
                    { name: 'Microsoft Teams', status: 'Not Connected', description: 'Collaboration platform' },
                    { name: 'Zoom', status: 'Connected', description: 'Video conferencing' }
                  ].map((integration, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: '8px'
                    }}>
                      <div>
                        <div style={{ fontWeight: '500', color: colors.text.primary }}>{integration.name}</div>
                        <div style={{ fontSize: '0.875rem', color: colors.text.tertiary }}>{integration.description}</div>
                      </div>
                      <Button variant={integration.status === 'Connected' ? 'secondary' : 'primary'}>
                        {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </SettingSection>
            </ContentBody>
          </>
        );

      case 'backup':
        return (
          <>
            <ContentHeader>
              <ContentTitle>Backup & Recovery</ContentTitle>
              <ContentDescription>
                Manage data backup and recovery settings
              </ContentDescription>
            </ContentHeader>
            <ContentBody>
              <SettingSection>
                <SectionTitle>Automatic Backup</SectionTitle>
                <FormGroup>
                  <Toggle>
                    <ToggleSwitch
                      checked={settings.autoBackup}
                      onClick={() => handleSettingChange('autoBackup', !settings.autoBackup)}
                    />
                    <div>
                      <ToggleLabel>Enable Automatic Backup</ToggleLabel>
                      <div style={{ fontSize: '0.75rem', color: colors.text.tertiary, marginTop: '0.25rem' }}>
                        Automatically backup your data at regular intervals
                      </div>
                    </div>
                  </Toggle>
                </FormGroup>
                {settings.autoBackup && (
                  <FormGroup>
                    <Label>Backup Frequency</Label>
                    <Select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    >
                      <option value="hourly">Every Hour</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Select>
                  </FormGroup>
                )}
              </SettingSection>

              <SettingSection>
                <SectionTitle>Manual Backup</SectionTitle>
                <SectionDescription>
                  Create a backup of your data immediately
                </SectionDescription>
                <Button variant="secondary">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                  </svg>
                  Create Backup Now
                </Button>
              </SettingSection>

              <SettingSection>
                <SectionTitle>Recent Backups</SectionTitle>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {[
                    { date: '2024-01-15 14:30', size: '2.3 GB', status: 'Completed' },
                    { date: '2024-01-14 14:30', size: '2.2 GB', status: 'Completed' },
                    { date: '2024-01-13 14:30', size: '2.1 GB', status: 'Completed' }
                  ].map((backup, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      border: `1px solid ${colors.border.light}`,
                      borderRadius: '6px',
                      fontSize: '0.875rem'
                    }}>
                      <div>
                        <span style={{ color: colors.text.primary }}>{backup.date}</span>
                        <span style={{ color: colors.text.tertiary, marginLeft: '1rem' }}>{backup.size}</span>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: colors.success[100],
                        color: colors.success[700],
                        fontSize: '0.75rem'
                      }}>
                        {backup.status}
                      </span>
                    </div>
                  ))}
                </div>
              </SettingSection>
            </ContentBody>
          </>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: colors.background.secondary 
      }}>
        <NavPane
          activeNav="Settings"
          setActiveNav={() => {}}
          isDarkMode={false}
          userId="user123"
          isMobileMenuOpen={false}
          setIsMobileMenuOpen={() => {}}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.background.primary
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${colors.primary[200]}`,
            borderTop: `3px solid ${colors.primary[600]}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: colors.background.secondary 
    }}>
      <NavPane
        activeNav="Settings"
        setActiveNav={() => {}}
        isDarkMode={false}
        userId="user123"
        isMobileMenuOpen={false}
        setIsMobileMenuOpen={() => {}}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div style={{
        flex: 1,
        background: colors.background.primary,
        overflow: 'auto'
      }}>
        <SettingsContainer>
          <PageHeader>
            <div>
              <PageTitle>Settings</PageTitle>
              <PageSubtitle>Manage your system preferences and configurations</PageSubtitle>
            </div>
          </PageHeader>

          {saveMessage && (
            <AlertBox type={saveMessage.includes('Error') ? 'error' : 'success'}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                {saveMessage.includes('Error') ? (
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                ) : (
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                )}
              </svg>
              {saveMessage}
            </AlertBox>
          )}

          <SettingsLayout>
            <SettingsSidebar>
              <SidebarTitle>Settings</SidebarTitle>
              <SidebarNav>
                {SETTINGS_SECTIONS.map(section => (
                  <SidebarNavItem
                    key={section.id}
                    active={activeSection === section.id}
                    onClick={() => setActiveSection(section.id)}
                  >
                    {section.icon}
                    {section.title}
                  </SidebarNavItem>
                ))}
              </SidebarNav>
            </SettingsSidebar>

            <div>
              <SettingsContent>
                {renderContent()}
              </SettingsContent>
              
              {(activeSection === 'general' || activeSection === 'notifications') && (
                <ButtonGroup>
                  <Button 
                    variant="primary" 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="secondary">
                    Reset to Defaults
                  </Button>
                </ButtonGroup>
              )}
            </div>
          </SettingsLayout>
        </SettingsContainer>
      </div>
    </div>
  );
};

export default MainDashboard;
