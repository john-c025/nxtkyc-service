import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';

const StyledNotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.isDarkMode ? '#fdba74' : '#ea580c'};
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  span {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    background-color: #dc2626;
    color: #ffffff;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: bold;
  }
`;
const NotificationList = styled.div`
  position: absolute;
  top: 2.5rem;
  right: 0;
  width: 470px;
  background: ${props => props.isDarkMode ? '#333333' : '#ffffff'};
  border: 1px solid ${props => props.isDarkMode ? '#444444' : '#e5e7eb'};
  border-radius: 0.375rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 1.5rem;
  
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none; /* Prevents click blocking when hidden */

  &.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto; /* Allows interaction when visible */
  }
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.isDarkMode ? '#444444' : '#e5e7eb'};
  transition: opacity 0.5s ease-out;

  &.fade-out {
    opacity: 0;
  }

  &:last-child {
    border-bottom: none;
  }

  p {
    flex: 1;
    margin: 0 0.5rem;
    color: ${props => props.isDarkMode ? '#ffffff' : '#111827'};
  }

  .time-ago {
    margin-right: 0.5rem;
    color: ${props => props.isDarkMode ? 'text-gray-500' : 'text-gray-500'};
  }

  svg {
    cursor: pointer;
    color: ${props => props.isDarkMode ? '#fdba74' : '#ea580c'};
  }
`;

const NotificationButton = ({ userId, isDarkMode }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

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

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 2000); // Fetch every 15 seconds

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [userId]);

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
  };

  const handleMarkAsRead = (id) => {
    console.log(`Marking notification ${id} as read`);
    axiosInstance.post(API_ENDPOINTS.MARK_AS_READ, { userId: userId, notifId: id })
      .then(response => {
        console.log('Notification marked as read:', response.data);
        
        setNotifications(prevNotifications => 
          prevNotifications.map(notif => 
            notif.notification_id === id ? { ...notif, isFadingOut: true } : notif
          )
        );

        setTimeout(() => {
          fetchNotifications();
        }, 500);
      })
      .catch(error => {
        console.error('Error marking notification as read:', error);
      });
  };

  const getTimeAgo = (dateNotified) => {
    const now = new Date();
    const notifiedDate = new Date(dateNotified);
    const diffInSeconds = Math.floor((now - notifiedDate) / 1000);
    
    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        return `${diffInMinutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
        const diffInHours = Math.floor(diffInSeconds / 3600);
        return `${diffInHours} hours ago`;
    } else {
        const diffInDays = Math.floor(diffInSeconds / 86400);
        return `${diffInDays} days ago`;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <StyledNotificationButton onClick={handleNotifClick} isDarkMode={isDarkMode}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && <span>{unreadCount}</span>}
      </StyledNotificationButton>
      <NotificationList className={isNotifOpen ? 'open' : ''} isDarkMode={isDarkMode}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItem 
              key={notif.notification_id} 
              isDarkMode={isDarkMode} 
              className={notif.isFadingOut ? 'fade-out' : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m0-4h.01M12 18.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <p>{notif.notification_description}</p>
              <span className="time-ago text-xs text-gray-500">{getTimeAgo(notif.date_notified)}</span>
              <svg onClick={() => handleMarkAsRead(notif.notification_id)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </NotificationItem>
          ))
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-300">No notifications</p>
        )}
      </NotificationList>
    </div>
  );
};

export default NotificationButton;