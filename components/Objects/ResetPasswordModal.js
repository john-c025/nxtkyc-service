import React, { useState } from 'react';
import { Input } from "@nextui-org/react";
import axiosInstance from '../backend/axiosInstance';
import { API_ENDPOINTS } from '../backend/apiHelper';

const ResetPasswordModal = ({ isOpen, onClose, isDarkMode }) => {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    if (!userId) {
      setMessage('Please enter a User ID');
      return;
    }

    setIsLoading(true);
    try {
      // First API call - Reset Password
      const resetResponse = await axiosInstance.post(API_ENDPOINTS.RESET_PW, {
        userId: userId
      });

      // Second API call - Send Notification (changed to POST)
      await axiosInstance.post(`${API_ENDPOINTS.SEND_RESET_PASS_NOTIF}?userId=${userId}`);

      setMessage('Password reset successful. Check email for new password.');
      setTimeout(() => {
        onClose();
        setMessage('');
        setUserId('');
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className={`relative p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} w-96`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-orange-500' : 'text-gray-900'}`}>
          Reset Password
        </h2>
        
        <Input
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="mb-4"
          classNames={{
            input: isDarkMode ? 'text-orange-500' : 'text-gray-900',
            label: isDarkMode ? 'text-orange-500' : 'text-gray-900',
          }}
        />

        {message && (
          <p className={`mb-4 text-sm ${
            message.includes('successful') ? 'text-green-500' : 'text-red-500'
          }`}>
            {message}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${
              isDarkMode 
                ? 'bg-gray-700 text-orange-500 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleResetPassword}
            disabled={isLoading}
            className={`px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50`}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
