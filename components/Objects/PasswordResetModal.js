// components/Objects/PasswordResetModal.js

import React, { useState } from 'react';
import { ModalOverlay, ModalContent, Button } from './PasswordResetModalStyled';
import { Input } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';

const PasswordToggleButton = dynamic(() => Promise.resolve(({ isVisible, toggleVisibility }) => (
    <button
      className="focus:outline-none"
      type="button"
      onClick={toggleVisibility}
    >
      {isVisible ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      )}
    </button>
  )), { ssr: false });

const PasswordResetModal = ({ isOpen, onClose, isDarkMode, userId }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  const Spinner = () => (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-t-transparent border-orange-500 rounded-full animate-spin"></div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.UPDATE_PW, {
        userId: userId,
        newPassword: newPassword
      });

      if (response.data.code === 200) {
        setShowLoadingOverlay(true); // Show loading overlay
        // Reset form and close modal after delay
        setTimeout(() => {
          setShowLoadingOverlay(false);
          setNewPassword('');
          setConfirmPassword('');
          onClose();
        }, 4000);
      } else {
        setError(response.data.message || 'Failed to update password');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while updating password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isDarkMode={isDarkMode}>
      <ModalContent isDarkMode={isDarkMode}>
        {/* Loading Overlay */}
        {showLoadingOverlay && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
            <Spinner />
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Password Reset Required</h2>
        <p className="mb-6">Your password has been reset. Please enter a new password to continue.</p>
        
        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              isClearable
              type={isNewPasswordVisible ? "text" : "password"}
              size="lg"
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              classNames={{
                base: "max-w-full",
                input: `text-sm ${isDarkMode ? 'text-[#ff8133]' : ''}`,
                inputWrapper: `border-1 ${isDarkMode 
                  ? 'bg-[#262626] border-[#333333] text-white' 
                  : 'bg-white/50 border-[#f0f0f0]'}`,
                label: isDarkMode ? "text-[#fed7aa]" : "text-gray-600",
              }}
              endContent={
                <PasswordToggleButton 
                  isVisible={isNewPasswordVisible} 
                  toggleVisibility={() => setIsNewPasswordVisible(!isNewPasswordVisible)} 
                />
              }
              style={{
                backgroundColor: isDarkMode ? '#262626' : '',
                '--nextui-input-bg': isDarkMode ? '#262626' : ''
              }}
            />
          </div>

          <div>
            <Input
              isClearable
              type={isConfirmPasswordVisible ? "text" : "password"}
              size="lg"
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              classNames={{
                base: "max-w-full",
                input: `text-sm ${isDarkMode ? 'text-[#ff8133]' : ''}`,
                inputWrapper: `border-1 ${isDarkMode 
                  ? 'bg-[#262626] border-[#333333] text-white' 
                  : 'bg-white/50 border-[#f0f0f0]'}`,
                label: isDarkMode ? "text-[#fed7aa]" : "text-gray-600",
              }}
              endContent={
                <PasswordToggleButton 
                  isVisible={isConfirmPasswordVisible} 
                  toggleVisibility={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} 
                />
              }
            />
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              type="submit"
              disabled={isLoading}
              className="primary"
              isDarkMode={isDarkMode}
            >
              {isLoading ? 'Updating...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PasswordResetModal;