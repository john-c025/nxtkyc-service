'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CloseButton,
  ProfilePicContainer,
  ProfilePic,
  UploadButton,
  SaveButton,
  CancelButton
} from './ProfileSettingsModalStyled';
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';

const ProfileSettingsModal = ({ isOpen, onClose, isDarkMode, userId, userDetails, setUserDetails }) => {
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [newProfilePicPreview, setNewProfilePicPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfilePic = async () => {
      try {
        const profilePicData = await fetchProfilePic(userId);
        if (profilePicData) {
          const imageUrl = URL.createObjectURL(profilePicData);
          console.log('Image URL:', imageUrl);
          if (!profilePicFile) {
            setProfilePicPreview(imageUrl);
          }
        } else {
          console.error('Profile picture data is empty');
        }
      } catch (error) {
        console.error('Error loading profile picture:', error);
      }
    };

    if (isOpen) {
      loadProfilePic();
    }

    // Reset preview when modal closes
    if (!isOpen) {
      setProfilePicFile(null);
      setProfilePicPreview(null);
    }

    // Cleanup function to revoke object URLs
    return () => {
      if (profilePicPreview && profilePicPreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePicPreview);
      }
    };
  }, [isOpen, userId, profilePicFile]);

  // Helper function to validate URL
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePicPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePicFile(null);
      setNewProfilePicPreview(userDetails.profilePic || '/assets/placeholder-person.png');
      alert('Please select a valid image file.');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const fetchProfilePic = async (userId) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.GET_USER_PROFILE_IMAGE}?userId=${userId}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile picture:', error);
      throw error;
    }
  };

  const uploadProfilePic = async (userId, profilePicFile) => {
    const formData = new FormData();
    formData.append('UserId', userId);
    formData.append('File', profilePicFile);

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.UPDATE_USER_PROFILE_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!profilePicFile) {
      alert('Please select an image to upload.');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await uploadProfilePic(userId, profilePicFile);

      if (response.status === 200) {
        // Ensure the profile picture path starts with a leading slash
        const profilePicturePath = response.data.profilePicturePath.startsWith('/')
          ? response.data.profilePicturePath
          : '/' + response.data.profilePicturePath;

        setUserDetails(prevDetails => ({
          ...prevDetails,
          profilePic: profilePicturePath || profilePicPreview
        }));
        setProfilePicFile(null);
        onClose();
        alert('Profile picture updated successfully!');

        // Refresh the page to reflect the new profile picture
        window.location.reload(); // Refresh the page
      } else {
        console.error('Failed to update profile picture:', response.message);
        alert(`Failed to update profile picture: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      alert(`Error updating profile picture: ${error.message || 'Network error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isDarkMode={isDarkMode}>
      <ModalContent isDarkMode={isDarkMode}>
        <ModalHeader isDarkMode={isDarkMode}>
          <h2>Update Profile Picture</h2>
          <CloseButton onClick={onClose} isDarkMode={isDarkMode} aria-label="Close modal">×</CloseButton>
        </ModalHeader>
        <ModalBody>
          <ProfilePicContainer>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <ProfilePic isDarkMode={isDarkMode}>
                <Image
                  src={profilePicPreview || '/assets/placeholder-person.png'}
                  alt="Current Profile Picture"
                  width={100}
                  height={100}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              </ProfilePic>
              <div style={{ margin: '0 20px' }}>
                {/* Arrow pointing to the new profile picture */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderTop: `2px solid ${isDarkMode ? '#ffffff' : '#000000'}`,
                  borderRight: `2px solid ${isDarkMode ? '#ffffff' : '#000000'}`,
                  transform: 'rotate(45deg)',
                }} />
              </div>
              <ProfilePic isDarkMode={isDarkMode}>
                <Image
                  src={newProfilePicPreview || '/assets/placeholder-person.png'}
                  alt="New Profile Picture Preview"
                  width={100}
                  height={100}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              </ProfilePic>
              <UploadButton 
                onClick={handleUploadClick} 
                title="Upload new picture"
                isDarkMode={isDarkMode}
                style={{ position: 'absolute', right: '-18px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
                </svg>
              </UploadButton>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </ProfilePicContainer>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ 
              margin: '0', 
              fontWeight: 'bold',
              color: isDarkMode ? '#f9fafb' : '#111827' 
            }}>
              {userDetails?.fName} {userDetails?.sName}
            </p>
            <p style={{ 
              margin: '0.25rem 0', 
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              fontSize: '0.875rem'
            }}>
              {userDetails?.positionDesc || 'N/A'}
            </p>
          </div>
          
          <div style={{ 
            marginTop: '1.5rem',
            backgroundColor: isDarkMode ? '#2d3748' : '#f3f4f6',
            borderRadius: '8px',
            padding: '1rem',
            fontSize: '0.875rem'
          }}>
            <p style={{ 
              margin: '0',
              color: isDarkMode ? '#cbd5e1' : '#4b5563'
            }}>
              Select a new profile picture. The image will be visible to colleagues and administrators.
            </p>
          </div>
        </ModalBody>
        <ModalFooter isDarkMode={isDarkMode}>
          <CancelButton onClick={onClose} isDarkMode={isDarkMode}>Cancel</CancelButton>
          <SaveButton 
            onClick={handleSave} 
            disabled={isSaving || !profilePicFile} 
            isDarkMode={isDarkMode}
          >
            {isSaving ? 'Uploading...' : 'Update Profile Picture'}
          </SaveButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProfileSettingsModal; 