'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import Cookies from 'js-cookie';
import ResetPasswordModal from '../../components/Objects/ResetPasswordModal';

// Create a dynamic import for the password visibility toggle button
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

const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-t-transparent border-orange-500 rounded-full animate-spin"></div>
  </div>
);

const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-30">
    <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
    <div className="bg-white p-6 rounded shadow-lg z-40">
      <h2 className="text-lg font-semibold mb-4">Login Failed</h2>
      <p>{message}</p>
      <div className="flex justify-center mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });

      console.log('Login successful:', response.data);
      Cookies.set('authToken', response.data.token, { expires: 7 });
      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      setLoading(false);
      
      if (!error.response) {
        // Network error or API is down
        setModalMessage('Unable to connect to the server. Please check your connection or try again later.');
      } else if (error.response.status === 401) {
        // Authentication error
        setModalMessage('Invalid username or password. Please try again.');
      } else {
        // Other server errors
        setModalMessage('An unexpected error occurred. Please try again later.');
      }
      
      setShowModal(true);
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image */}
      <div className="fixed inset-0">
        <Image
          src="https://eagleeyecollection.com/wp-content/uploads/2021/07/hero-eagle-eye-1568x1045.jpg"
          alt="Background"
          fill
          priority
          style={{ objectFit: 'cover' }}
          className="brightness-[0.85] blur-[2px]"
        />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
          <Spinner />
        </div>
      )}

      {/* Failed Login Modal */}
      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}

      {/* Mobile View */}
      <div className="w-full max-w-sm p-4 md:hidden">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-12">
              <Image
                src="https://eagleeyecollection.com/wp-content/uploads/2023/12/cropped-logo.jpg"
                alt="Eagle Eye Business & Collection Services, Inc."
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-light text-gray-900 mb-1">Welcome</h1>
            <p className="text-xs text-gray-500">Enter your credentials to log in to your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              isClearable
              size="lg"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              classNames={{
                base: "max-w-full",
                input: "text-sm",
                inputWrapper: "border-1 bg-white/50",
              }}
            />

            <div className="space-y-1">
              <Input
                isClearable
                type={isVisible ? "text" : "password"}
                size="lg"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                classNames={{
                  base: "max-w-full",
                  input: "text-sm",
                  inputWrapper: "border-1 bg-white/50",
                }}
                endContent={
                  <PasswordToggleButton isVisible={isVisible} toggleVisibility={toggleVisibility} />
                }
              />
              <div className="text-right">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsResetModalOpen(true);
                  }} 
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#f97316] text-white text-sm font-medium rounded hover:bg-[#ea580c] transition-colors shadow-md hover:shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-900">or</span>
            <button
              className="w-full h-11 mt-2 flex items-center justify-center gap-2 text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-all text-sm shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex w-full max-w-[1200px] h-[600px] rounded-lg shadow-2xl overflow-hidden relative z-10">
        {/* Left side - Login Form */}
        <div className="w-1/2 p-16 bg-white/95 backdrop-blur-sm">
          <div className="mb-8">
            <h1 className="text-[28px] font-light text-gray-900 mb-1">Welcome</h1>
            <p className="text-[13px] text-gray-500">Enter your credentials to log in to your dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              isClearable
              bordered
              fullWidth
              color="default"
              size="lg"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              classNames={{
                input: "text-sm",
                inputWrapper: "border-1",
              }}
            />
            
            <div>
              <Input
                isClearable
                type={isVisible ? "text" : "password"}
                classNames={{
                  input: "text-sm",
                  inputWrapper: "border-1",
                }}
                size="lg"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endContent={
                  <PasswordToggleButton isVisible={isVisible} toggleVisibility={toggleVisibility} />
                }
              />
              <div className="text-right">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsResetModalOpen(true);
                  }} 
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#f97316] text-white text-sm font-medium rounded hover:bg-[#ea580c] transition-colors shadow-md hover:shadow-lg"
            >
              Sign In
            </button>
          </form>
          <span className="flex items-center justify-center mt-4 text-gray-900"> or </span>
          <div className="mt-4">
            <button
              className="w-full h-11 mt-2 flex items-center justify-center gap-2 text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-all text-sm shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact Support
            </button>
          </div>
        </div>

        {/* Right side - Logo */}
        <div className="w-1/2 relative flex items-center justify-center bg-white/95 backdrop-blur-sm opacity-80">
          <div className="absolute inset-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[600px] h-[600px] border border-orange-200/20 rounded-full"></div>
              <div className="absolute w-[450px] h-[450px] border border-orange-200/20 rounded-full"></div>
              <div className="absolute w-[300px] h-[300px] border border-orange-200/20 rounded-full"></div>
            </div>
          </div>
          
          <div className="relative z-10 w-[500px] h-[500px]">
            <Image
              src="https://eagleeyecollection.com/wp-content/uploads/2023/12/cropped-logo.jpg"
              alt="Eagle Eye Business & Collection Services, Inc."
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
      </div>

      <ResetPasswordModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        isDarkMode={false}
      />
    </div>
  );
}