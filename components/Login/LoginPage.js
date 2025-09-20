'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    <div className="relative">
      <div className="w-12 h-12 border-4 border-orange-200 rounded-full"></div>
      <div className="w-12 h-12 border-4 border-t-orange-500 animate-spin rounded-full absolute left-0 top-0"></div>
    </div>
    <span className="ml-3 text-white font-medium">Loading...</span>
  </div>
);

const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-30">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
    <div className="bg-white p-8 rounded-lg shadow-xl z-40 max-w-md w-full mx-4 transform transition-all">
      <div className="flex items-center justify-center mb-4 text-orange-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-center mb-4">Login Failed</h2>
      <p className="text-gray-600 text-center">{message}</p>
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-orange-500 text-white rounded-md
            hover:bg-orange-600 transition-all duration-300 
            shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// Add a shimmer effect component
const ShimmerButton = ({ children, ...props }) => (
  <button
    {...props}
    className="relative w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-md
      overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer"></div>
    {children}
  </button>
);

// Add floating particles background effect
const ParticlesBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-orange-500/10 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${15 + Math.random() * 10}s`
        }}
      />
    ))}
  </div>
);

// Add a custom input wrapper with label animation
const AnimatedInput = ({ label, ...props }) => (
  <div className="relative">
    <Input
      {...props}
      classNames={{
        base: "max-w-full",
        input: "text-sm pt-4",
        inputWrapper: "border-1 bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white/80 transition-colors h-14",
      }}
    />
    <span className="absolute left-3 top-2 text-[10px] text-gray-500 transition-all">
      {label}
    </span>
  </div>
);

// Add a ripple effect component for buttons
const RippleButton = ({ children, className, ...props }) => {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const button = e.currentTarget.getBoundingClientRect();
    const circle = {
      x: e.clientX - button.x,
      y: e.clientY - button.y,
      id: Date.now()
    };
    setRipples([...ripples, circle]);
  };

  useEffect(() => {
    const timeouts = ripples.map((_, i) => 
      setTimeout(() => {
        setRipples(prev => prev.filter((_, idx) => idx !== 0));
      }, 1000)
    );
    return () => timeouts.forEach(t => clearTimeout(t));
  }, [ripples]);

  return (
    <button
      {...props}
      className={`relative overflow-hidden ${className}`}
      onClick={(e) => {
        addRipple(e);
        props.onClick?.(e);
      }}
    >
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className="absolute bg-white/30 rounded-full animate-ripple"
          style={{
            left: x,
            top: y,
            transform: 'translate(-50%, -50%)',
            width: '200%',
            paddingBottom: '200%',
          }}
        />
      ))}
      {children}
    </button>
  );
};

// Add animated background patterns
const BackgroundPatterns = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Gradient Orbs */}
    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full filter blur-3xl animate-float-slow"></div>
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gray-500/10 rounded-full filter blur-3xl animate-float-slow delay-1000"></div>
    
    {/* Grid Pattern */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(transparent 1px, white 1px), linear-gradient(90deg, transparent 1px, white 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.05
      }}></div>
    </div>
  </div>
);

// Enhanced system logo text with subtle animation
const SystemLogoText = () => (
  <div className="flex flex-col items-center space-y-1 relative">
   
    <div className="flex items-center justify-center space-x-2">
      <span className="text-gray-800 font-medium text-lg tracking-tight">UCMS</span>
      <div className="h-4 w-px bg-orange-400"></div>
      <span className="text-orange-500 font-medium text-lg">Eagle Eye Business & Collection Services</span>
    </div>
    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-light letter-spacing-wide">
      Unified Collection Management System
    </div>
  </div>
);

// Enhanced branded accent with animated gradient
const BrandedAccent = () => (
  <div className="absolute top-0 left-0 right-0 overflow-hidden">
    <div className="h-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 animate-gradient"></div>
    <div className="absolute top-0 right-0 w-16 h-16 rotate-45 translate-x-8 -translate-y-8 bg-white/5"></div>
  </div>
);

// Add keyboard shortcut component
const KeyboardShortcut = () => (
  <div className="mt-2 text-xs text-center text-gray-400">
    Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-gray-500 font-mono text-[10px]">Enter</kbd> to sign in
  </div>
);

// Add focused input highlight
const FocusRing = ({ visible }) => (
  <div className={`absolute -inset-1 bg-orange-100/50 rounded-lg transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}></div>
);

// Add typing effect component
const TypeEffect = ({ text, className }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    if (!text) return;
    
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(text.substring(0, index + 1));
      index++;
      
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [text]);
  
  return <span className={className}>{displayText}</span>;
};

// Add success animation for login
const SuccessOverlay = ({ show }) => (
  <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <div className="text-center animate-success-message">
      <svg
        className="w-20 h-20 mx-auto text-orange-500 animate-success"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        </svg>
      <p className="mt-4 text-xl font-medium text-gray-700">Login Successful!</p>
      <p className="text-sm text-gray-500">Entering Unified Collection Management System</p>
    </div>
  </div>
);

// Add a glass morphism card effect
const GlassCard = ({ children, className = "" }) => (
  <div className={`relative backdrop-blur-md bg-white/70 rounded-xl 
    shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] 
    border border-white/20 p-6 
    hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] 
    transition-all duration-300 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 rounded-xl" />
    <div className="relative z-10">{children}</div>
  </div>
);

// Enhanced wave background with better visibility
const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 flex items-center justify-center">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="absolute border-2 border-orange-300/30 rounded-full animate-wave"
          style={{
            width: `${800 + i * 200}px`,
            height: `${800 + i * 200}px`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: '4s'
          }}
        />
      ))}
    </div>
  </div>
);

// Add hover effect card
const HoverEffectCard = ({ children }) => (
  <div className="group relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-orange-600 
      rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
    <div className="relative bg-white rounded-lg">
      {children}
    </div>
  </div>
);

// Add animated dots background
const AnimatedDots = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-orange-500/20 rounded-full animate-twinkle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${1 + Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

// Add success checkmark animation
const SuccessCheckmark = () => (
  <svg className="w-16 h-16 text-green-500 animate-draw-check" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      d="M20 6L9 17l-5-5"
      className="stroke-dash"
    />
        </svg>
);

// Add a magnetic button effect
const MagneticButton = ({ children, className }) => {
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  };

  const handleMouseLeave = () => {
    buttonRef.current.style.transform = 'translate(0, 0)';
  };

  return (
    <button
      ref={buttonRef}
      className={`transition-transform duration-100 ease-out ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

// Add a text scramble effect for welcome message
const TextScramble = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    let frame = 0;
    let iteration = 0;
    const maxIterations = 3;

    const animate = () => {
      if (iteration >= maxIterations) {
        setDisplayText(text);
        return;
      }

      setDisplayText(
        text
          .split('')
          .map((char, idx) => {
            if (idx < iteration) return text[idx];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      frame = requestAnimationFrame(animate);
      iteration += 0.1;
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [text]);

  return (
    <span className="font-mono">{displayText}</span>
  );
};

// Add a dynamic gradient border
const GradientBorderCard = ({ children }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 
      rounded-lg opacity-30 group-hover:opacity-100 transition duration-1000 
      animate-gradient blur-sm group-hover:blur">
    </div>
    <div className="relative bg-white rounded-lg">
      {children}
    </div>
  </div>
);

// Add feature badge component
const FeatureBadge = ({ text }) => (
  <div className="inline-flex items-center px-3 py-1 text-xs bg-orange-100/50 text-orange-700 rounded-full border border-orange-200/50 m-1 hover:bg-orange-200/70 transition-all duration-300 hover:scale-105 transform">
    {text}
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [formReady, setFormReady] = useState(false);

  // Track if form is valid for enhanced UI feedback
  useEffect(() => {
    setFormReady(username.trim() !== '' && password.trim() !== '');
  }, [username, password]);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Enhanced validation with visual feedback
    const validationErrors = [];
    if (!username.trim()) validationErrors.push('Username is required');
    if (!password.trim()) validationErrors.push('Password is required');
    
    if (validationErrors.length > 0) {
      setModalMessage(validationErrors.join('\n'));
      setLoading(false);
      setShowModal(true);
      return;
    }

    try {
      // First check if user is active
      const statusResponse = await axiosInstance.get(`${API_ENDPOINTS.CHECK_USER_STATUS}?email=${encodeURIComponent(username)}`);

      if (statusResponse.data.status === 200) {
        const userData = statusResponse.data.data;
        
        if (userData.isActive !== "True") {
          setLoading(false);
          setModalMessage('This account is inactive. Please contact support.');
          setShowModal(true);
          return;
        }

        // If user is active, proceed with login
        const loginResponse = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
          username,
          password,
        });

        console.log('Login successful:', loginResponse.data);
        Cookies.set('authToken', loginResponse.data.token, { expires: 7 });
        
        // Show success animation before redirect
        setShowSuccess(true);
        setTimeout(() => {
          setLoading(false);
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      setLoading(false);

      if (!error.response) {
        // Network error or API is down
        setModalMessage('Unable to connect to the server. Please check your connection or try again later.');
      } else if (error.response.status === 404) {
        // User not found
        setModalMessage('User not found. Please check your username.');
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

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Submit form with Enter if ready
      if (e.key === 'Enter' && formReady) {
        const submitButton = document.querySelector('form button[type="submit"]');
        if (submitButton) submitButton.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formReady]);

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background layers in correct order */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-gray-100/30 z-10" />
        <div className="absolute inset-0 bg-black/30 z-5"></div>
        <Image
          src="https://eagleeyecollection.com/wp-content/uploads/2021/07/hero-eagle-eye-1568x1045.jpg"
          alt="Background"
          fill
          priority
          style={{ objectFit: 'cover' }}
          className="brightness-[0.85] blur-[2px]"
        />
        <WaveBackground />
        <AnimatedDots />
        <BackgroundPatterns />
        
        {/* Add subtle floating elements */}
        <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-orange-500/5 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-orange-500/5 rounded-full animate-float-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Loading Overlay with enhanced animation */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <div className="text-white text-sm mt-2 animate-pulse">Authenticating...</div>
          </div>
        </div>
      )}

      {/* Failed Login Modal */}
      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}

      {/* Mobile View with enhanced animations */}
      <div className="w-full max-w-sm p-4 md:hidden">
        <div className="animate-fadeInUp">
          <GradientBorderCard>
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 relative">
              <BrandedAccent />
              <div className="text-center mb-6">
                <div className="mb-3">
                  <SystemLogoText />
                </div>
                <h2 className="text-xl font-medium text-gray-800">Welcome Back</h2>
                <p className="text-sm text-gray-500 mt-2 animate-float-text">
                  Access your account securely
                </p>
              </div>




              <form onSubmit={handleLogin} className="space-y-7 py-4">
                <AnimatedInput
                  label="USERNAME"
                  isClearable
                  size="lg"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <div className="space-y-1">
                  <AnimatedInput
                    label="PASSWORD"
                    isClearable
                    type={isVisible ? "text" : "password"}
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
                      className="text-xs text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <MagneticButton
                  className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 
                    text-white text-sm font-medium rounded-md shadow-md 
                    hover:shadow-lg transform hover:-translate-y-0.5 
                    transition-all duration-300"
                >
                  Sign In
                </MagneticButton>
              </form>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
                <div className="text-[10px] text-gray-400">&copy; Eagle Eye Business Services</div>
              </div>
            </div>
          </GradientBorderCard>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex w-full max-w-[1200px] h-[600px] rounded-lg shadow-2xl overflow-hidden relative z-10 animate-fadeInUp">
        {/* Left side - Login Form */}
        <div className="w-1/2 p-16 bg-white/95 backdrop-blur-sm relative">
          <BrandedAccent />
          <div className="mb-10">
            <div className="mb-4">
              <SystemLogoText />
            </div>
            {/* <h1 className="text-[28px] font-light text-gray-900 mb-1">Welcome</h1>
            <p className="text-[13px] text-gray-500">Enter your credentials to access the dashboard</p> */}
          </div>
          
          <form onSubmit={handleLogin} className="space-y-7 py-4">
            <AnimatedInput
              label="USERNAME"
              isClearable
              size="lg"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            <div className="space-y-1">
              <AnimatedInput
                label="PASSWORD"
                isClearable
                type={isVisible ? "text" : "password"}
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
                  className="text-xs text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <RippleButton
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 
                text-white text-sm font-medium rounded-md shadow-md 
                hover:shadow-lg transform hover:-translate-y-0.5 
                transition-all duration-300"
            >
              Sign In
            </RippleButton>
           
          </form>
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button className="group flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-500 transition-colors text-sm">
              <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Need Help? Contact Support
            </button>
          </div>
        </div>

        {/* Right side - Logo with branded elements */}
        <div className="w-1/2 relative flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-50 backdrop-blur-sm">
          <div className="absolute inset-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[600px] h-[600px] border border-orange-200/20 rounded-full animate-pulse"></div>
              <div className="absolute w-[450px] h-[450px] border border-orange-200/20 rounded-full animate-pulse delay-75"></div>
              <div className="absolute w-[300px] h-[300px] border border-orange-200/20 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-[500px] h-[300px] relative transform hover:scale-105 transition-all duration-500 mb-8">
              <Image
                src="/assets/eagle-eye-logo-trans.png"
                alt="Eagle Eye Business & Collection Services, Inc."
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-800 mb-2 animate-pulse-subtle">
                <span className="relative">
                  Unified Collection Management System
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-300 transform origin-left animate-expand-line"></span>
                </span>
              </h2>
              <p className="text-sm text-gray-600 max-w-md mb-5 animate-fade-in">
                Streamlined collections, enhanced productivity, and improved customer management in one powerful platform
              </p>
              
              <div className="flex justify-center flex-wrap animate-pop-in">
                <FeatureBadge text="Secure" />
                <FeatureBadge text="Efficient" />
                <FeatureBadge text="Integrated" />
                <FeatureBadge text="Real-time" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ResetPasswordModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        isDarkMode={false}
      />

      <SuccessOverlay show={showSuccess} />

      {/* Add new styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
        
        @keyframes expand-line {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        .animate-expand-line {
          animation: expand-line 1.5s ease-out forwards;
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-pop-in {
          animation: pop-in 0.8s ease-out forwards;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ripple {
          from { opacity: 1; transform: translate(-50%, -50%) scale(0); }
          to { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-30px, 30px) rotate(180deg); }
        }

        @keyframes success {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-ripple {
          animation: ripple 1s linear forwards;
        }
        
        .animate-float-slow {
          animation: float-slow 20s infinite;
        }

        .animate-success {
          animation: success 0.5s ease-out forwards;
        }

        @keyframes wave {
          0% { 
            transform: scale(1); 
            opacity: 0.3; 
          }
          100% { 
            transform: scale(1.5); 
            opacity: 0; 
          }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes draw-check {
          from {
            stroke-dashoffset: 60;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        .animate-wave {
          animation: wave 4s infinite linear;
        }

        .animate-twinkle {
          animation: twinkle var(--duration, 2s) infinite ease-in-out;
        }

        .stroke-dash {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
        }

        @keyframes float-text {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .animate-float-text {
          animation: float-text 3s ease-in-out infinite;
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes success-message {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-success-message {
          animation: success-message 0.6s ease-out forwards;
        }
        
        @keyframes subtle-shift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        
        .animate-subtle-shift {
          animation: subtle-shift 3s ease-in-out infinite;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .letter-spacing-wide {
          letter-spacing: 0.15em;
        }
        
        @keyframes draw-line {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .animate-draw-line {
          animation: draw-line 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}