'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';
import {
  NavContainer,
  NavHeader,
  Logo,
  CollapseToggle,
  NavList,
  NavItem,
  NavLink,
  GroupHeader,
  GroupContent,
  UserProfile,
  UserInfo,
  UserActions,
  UserActionButton,
  Tooltip,
  Badge,
  MobileOverlay,
  StatusIndicator
} from './NavPaneStyled';

// Navigation Configuration
const NAV_CONFIG = [
  {
    id: 'main',
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard', badge: null },
      { id: 'employees', label: 'Employees', icon: 'users', path: '/employees', badge: null },
      { id: 'departments', label: 'Departments', icon: 'building', path: '/departments', badge: null },
      // { id: 'attendance', label: 'Attendance', icon: 'clock', path: '/attendance', badge: 3 }
    ]
  },
  {
    id: 'hr',
    title: 'HR Management',
    items: [
      { id: 'recruitment', label: 'Recruitment', icon: 'userPlus', path: '/recruitment', badge: 5 },
      { id: 'employee-masterfile', label: 'Employee Masterfile', icon: 'upload', path: '/employee-masterfile', badge: null },
      // { id: 'payroll', label: 'Payroll', icon: 'creditCard', path: '/payroll', badge: null },
      // { id: 'benefits', label: 'Benefits', icon: 'gift', path: '/benefits', badge: null },
      // { id: 'performance', label: 'Performance', icon: 'chart', path: '/performance', badge: 2 }
    ]
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    items: [
      { id: 'reports', label: 'Reports', icon: 'document', path: '/reports', badge: null },
      { id: 'analytics', label: 'Analytics', icon: 'analytics', path: '/analytics', badge: null },
      { id: 'exports', label: 'Data Export', icon: 'download', path: '/exports', badge: null }
    ]
  },
  {
    id: 'settings',
    title: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings', badge: null },
      { id: 'help', label: 'Help & Support', icon: 'help', path: '/help', badge: null }
    ]
  }
];

// Icon Components
const IconComponents = {
  dashboard: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /></svg>),
  users: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>),
  building: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>),
  clock: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  userPlus: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>),
  creditCard: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>),
  gift: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>),
  chart: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>),
  document: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>),
  analytics: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>),
  download: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>),
  upload: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>),
  settings: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
  help: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
  chevronRight: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>),
  chevronLeft: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>),
  chevronDown: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>),
  logout: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>),
  user: (<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>)
};

export default function NavPane({ 
  activeNav, 
  setActiveNav, 
  isDarkMode, 
  userId, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  isCollapsed,
  onToggleCollapse 
}) {
  const router = useRouter();
  const [expandedGroups, setExpandedGroups] = useState(['main']);
  const [userDetails, setUserDetails] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.USER_DETAILS}?userId=${userId}`);
        setUserDetails(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle navigation
  const handleNavigation = (navItem) => {
    setActiveNav(navItem.id);
    if (navItem.path) {
      router.push(navItem.path);
    }
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Handle group toggle
  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Handle logout
  const handleLogout = () => {
    router.push('/');
  };

  // Generate user initials
  const getUserInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <>
      <MobileOverlay 
        isOpen={isMobileMenuOpen} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />
      
      <NavContainer>
        {/* Header */}
        <NavHeader isCollapsed={isCollapsed}>
          <Logo isCollapsed={isCollapsed}>
            <div className="logo-icon">HR</div>
            <span className="logo-text">Core HR</span>
          </Logo>
          
          <CollapseToggle 
            onClick={onToggleCollapse}
            isCollapsed={isCollapsed}
          >
            {isCollapsed ? IconComponents.chevronRight : IconComponents.chevronLeft}
          </CollapseToggle>
        </NavHeader>

        {/* Navigation */}
        <NavList>
          {NAV_CONFIG.map((group) => (
            <div key={group.id}>
              <GroupHeader 
                isCollapsed={isCollapsed}
                isExpanded={expandedGroups.includes(group.id)}
              >
                {isCollapsed ? (
                  <div className="group-divider" />
                ) : (
                  <>
                    <span className="group-title">{group.title}</span>
                    <button 
                      className="group-toggle"
                      onClick={() => toggleGroup(group.id)}
                    >
                      {IconComponents.chevronDown}
                    </button>
                  </>
                )}
              </GroupHeader>
              
              <GroupContent isExpanded={expandedGroups.includes(group.id)}>
                {group.items.map((item) => (
                  <NavItem key={item.id}>
                    <NavLink
                      isCollapsed={isCollapsed}
                      isActive={activeNav === item.id}
                      onClick={() => handleNavigation(item)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="nav-icon" style={{ position: 'relative' }}>
                        {IconComponents[item.icon]}
                        {item.badge && <Badge>{item.badge > 9 ? '9+' : item.badge}</Badge>}
                      </div>
                      <span className="nav-text">{item.label}</span>
                      
                      {isCollapsed && hoveredItem === item.id && (
                        <Tooltip show={true}>
                          {item.label}
                          {item.badge && ` (${item.badge})`}
                        </Tooltip>
                      )}
                    </NavLink>
                  </NavItem>
                ))}
              </GroupContent>
            </div>
          ))}
        </NavList>

        {/* User Profile */}
        <UserProfile isCollapsed={isCollapsed}>
          <UserInfo isCollapsed={isCollapsed}>
            <div className="user-avatar" style={{ position: 'relative' }}>
              {userDetails ? 
                getUserInitials(userDetails.firstName, userDetails.lastName) : 
                'U'
              }
              <StatusIndicator status="online" />
            </div>
            
            <div className="user-details">
              <p className="user-name">
                {userDetails ? 
                  `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() : 
                  'User'
                }
              </p>
              <p className="user-role">HR Manager</p>
            </div>
          </UserInfo>
          
          <UserActions isCollapsed={isCollapsed}>
            <UserActionButton onClick={() => router.push('/profile')}>
              {IconComponents.user}
              Profile
            </UserActionButton>
            
            <UserActionButton onClick={handleLogout}>
              {IconComponents.logout}
              Logout
            </UserActionButton>
          </UserActions>
        </UserProfile>
      </NavContainer>
    </>
  );
}
