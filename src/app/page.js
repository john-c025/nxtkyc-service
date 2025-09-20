'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import axiosInstance from '../../components/backend/axiosInstance';
import { API_ENDPOINTS } from '../../components/backend/apiHelper';
import Cookies from 'js-cookie';
import ResetPasswordModal from '../../components/Objects/ResetPasswordModal';
import Image from 'next/image'; // Add this import


// Dynamic password toggle component
const PasswordToggleButton = dynamic(() => Promise.resolve(({ isVisible, toggleVisibility }) => (
  <button
    className="focus:outline-none"
    type="button"
    onClick={toggleVisibility}
  >
    {isVisible ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    )}
  </button>
)), { ssr: false });

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <div className="w-8 h-8 border-2 border-blue-200 rounded-full"></div>
      <div className="w-8 h-8 border-2 border-t-blue-600 animate-spin rounded-full absolute left-0 top-0"></div>
    </div>
    <span className="ml-3 text-slate-700 font-medium">Authenticating...</span>
  </div>
);

// Error modal
const ErrorModal = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
    <div className="bg-white p-8 rounded-2xl shadow-2xl z-40 max-w-md w-full mx-4 transform transition-all border border-slate-200">
      <div className="flex items-center justify-center mb-4 text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-center mb-4 text-slate-800">Authentication Error</h2>
      <p className="text-slate-600 text-center">{message}</p>
      <div className="flex justify-center mt-6">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

// Success overlay
const SuccessOverlay = ({ show }) => (
  <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <div className="text-center animate-success-message">
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl animate-success">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    </div>
      <p className="text-2xl font-bold text-slate-800 mb-2">Welcome Back!</p>
      <p className="text-slate-600">Accessing CORE HR Management System</p>
      <div className="mt-4 flex justify-center">
        <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Floating particles background
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${15 + Math.random() * 20}s`
        }}
      />
    ))}
  </div>
);

// Geometric background pattern
const GeometricBackground = () => (
  <div className="absolute inset-0">
    {/* Main gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20"></div>
    
    {/* Diagonal stripes */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 35px,
        #3b82f6 35px,
        #3b82f6 36px
      )`
    }}></div>
    
    {/* Dots pattern */}
    <div className="absolute inset-0 opacity-[0.05]" style={{
      backgroundImage: `radial-gradient(circle at 25% 25%, #06b6d4 1px, transparent 1px)`,
      backgroundSize: '50px 50px'
      }}></div>
  </div>
);

// Animated background orbs
const AnimatedOrbs = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
    </div>
);

// Old Media slideshow component (for debug comparison)
const MediaSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideo, setIsVideo] = useState(false); // Will be true when video is added

  // Using actual images from your public/assets folder
  const slides = [
    { type: 'image', src: '/assets/core1.jpg', alt: 'HR Dashboard Overview' },
    { type: 'image', src: '/assets/core1.png', alt: 'Employee Management' },
    { type: 'image', src: '/assets/core2.jpg', alt: 'Analytics & Reports' },
    { type: 'image', src: '/assets/core4.jpg', alt: 'Team Collaboration' }
  ];

  // Auto-advance slides every 10 seconds
  useEffect(() => {
    if (!isPlaying || isVideo) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    
    return () => clearInterval(timer);
  }, [isPlaying, isVideo, slides.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl border border-white/10 hover:shadow-blue-500/20 transition-all duration-500">
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-400/5 backdrop-blur-[1px] z-10"></div>
      
      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-400/40 rounded-tl-xl z-10"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-400/40 rounded-br-xl z-10"></div>
      
      {/* Slideshow container */}
      <div className="relative w-full h-full">
        {/* Actual images/video display */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slide.type === 'image' ? (
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-contain rounded-2xl"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.style.display = 'none';
                  const fallbackEl = document.createElement('div');
                  fallbackEl.className = "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-indigo-900/50";
                  fallbackEl.innerHTML = `
                    <div class="text-center space-y-4">
                      <div class="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div class="text-white/80">
                        <p class="font-medium">Image not found</p>
                        <p class="text-sm text-white/60">${slide.alt}</p>
                      </div>
                    </div>
                  `;
                  e.target.parentNode.appendChild(fallbackEl);
                }}
              />
            ) : slide.type === 'video' ? (
              <video
                src={slide.src}
                className="w-full h-full object-cover rounded-2xl"
                autoPlay={isPlaying}
                muted
                loop
                onError={(e) => {
                  // Fallback if video fails to load
                  e.target.style.display = 'none';
                  const fallbackEl = document.createElement('div');
                  fallbackEl.className = "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-indigo-900/50";
                  fallbackEl.innerHTML = `
                    <div class="text-center space-y-4">
                      <div class="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div class="text-white/80">
                        <p class="font-medium">Video not found</p>
                        <p class="text-sm text-white/60">${slide.alt}</p>
                      </div>
                    </div>
                  `;
                  e.target.parentNode.appendChild(fallbackEl);
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-indigo-900/50">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-white/80">
                    <p className="font-medium">Media Preview</p>
                    <p className="text-sm text-white/60">Slide {currentSlide + 1} of {slides.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-6' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Media controls */}
      <div className="absolute top-4 right-4 flex space-x-3 z-20">
        {/* Previous button */}
        <button
          onClick={prevSlide}
          className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-blue-900/60 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-cyan-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-lg ${
            isPlaying 
              ? 'bg-blue-600/60 hover:bg-blue-700/60 border border-blue-400/50 hover:shadow-blue-500/30' 
              : 'bg-cyan-600/60 hover:bg-cyan-700/60 border border-cyan-400/50 hover:shadow-cyan-500/30'
          }`}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14l11-7z" />
            </svg>
          )}
          
          {/* Animated ring effect */}
          <span className={`absolute w-full h-full rounded-full border-2 ${isPlaying ? 'border-blue-400/40' : 'border-cyan-400/40'} animate-ping-slow opacity-0`}></span>
        </button>

        {/* Next button */}
        <button
          onClick={nextSlide}
          className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-blue-900/60 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-cyan-500/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Enhanced Status indicator */}
      <div className="absolute top-4 left-4 z-20">
        <div className={`px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md shadow-lg border transition-all duration-300 ${
          isPlaying 
            ? 'bg-green-500/20 text-green-300 border-green-500/30 animate-pulse-gentle' 
            : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
        }`}>
          <div className="flex items-center space-x-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-orange-400'}`}></div>
            <span>{isPlaying ? 'Playing' : 'Paused'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Video Background component for left container
const VideoBackground = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Using actual images/videos from your public/assets folder
  const slides = [
    { type: 'image', src: '/assets/core1.jpg', alt: 'HR Dashboard Overview' },
    { type: 'image', src: '/assets/core1.png', alt: 'Employee Management' },
    { type: 'image', src: '/assets/core2.jpg', alt: 'Analytics & Reports' },
    { type: 'image', src: '/assets/core4.jpg', alt: 'Team Collaboration' }
    // Add video here: { type: 'video', src: '/assets/demo-video.mp4', alt: 'HR System Demo' }
  ];

  // Auto-advance slides every 10 seconds when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* Background slideshow/video */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slide.type === 'image' ? (
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallbackEl = document.createElement('div');
                  fallbackEl.className = "absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900";
                  e.target.parentNode.appendChild(fallbackEl);
                }}
              />
            ) : slide.type === 'video' ? (
              <video
                src={slide.src}
                className="w-full h-full object-cover"
                autoPlay={isPlaying}
                muted
                loop
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallbackEl = document.createElement('div');
                  fallbackEl.className = "absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900";
                  e.target.parentNode.appendChild(fallbackEl);
                }}
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Enhanced semi-opaque overlay with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-indigo-900/80">
        {/* Animated light streaks */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent transform -translate-y-1/2 animate-slide-slow"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transform translate-y-1/2 animate-slide-slow" style={{animationDelay: '5s', animationDirection: 'reverse'}}></div>
          
          {/* Animated particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float-gentle"></div>
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-cyan-400/30 rounded-full animate-float-gentle" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-float-gentle" style={{animationDelay: '4s'}}></div>
        </div>
      </div>

      {/* Enhanced Play/Pause Control */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={togglePlayPause}
          className={`w-14 h-14 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-xl ${
            isPlaying 
              ? 'bg-blue-600/60 hover:bg-blue-700/60 border border-blue-400/50 hover:shadow-blue-500/30' 
              : 'bg-cyan-600/60 hover:bg-cyan-700/60 border border-cyan-400/50 hover:shadow-cyan-500/30'
          }`}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-0.5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14l11-7z" />
            </svg>
          )}
          
          {/* Animated ring effect */}
          <span className={`absolute w-full h-full rounded-full border-2 ${isPlaying ? 'border-blue-400/40' : 'border-cyan-400/40'} animate-ping-slow opacity-0`}></span>
        </button>
      </div>

      {/* Enhanced Slide indicator dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full shadow-lg ${
              index === currentSlide 
                ? 'w-10 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 scale-100' 
                : 'w-3 h-3 bg-white/40 hover:bg-white/60 transform hover:scale-125'
            }`}
          >
            {index === currentSlide && (
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/50 to-cyan-400/50 animate-pulse-gentle"></span>
            )}
          </button>
        ))}
      </div>

      {/* Enhanced Status indicator */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className={`px-4 py-1.5 rounded-full text-xs font-medium backdrop-blur-md shadow-lg border transition-all duration-300 ${
          isPlaying 
            ? 'bg-green-500/20 text-green-300 border-green-500/30 animate-pulse-gentle' 
            : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
        }`}>
          <div className="flex items-center space-x-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-green-400' : 'bg-orange-400'}`}></div>
            <span>{isPlaying ? 'Playing' : 'Paused'}</span>
          </div>
        </div>
      </div>
      
      {/* Animated slide number */}
      <div className="absolute top-6 left-6 z-20">
        <div className="w-10 h-10 flex items-center justify-center">
          <span className="absolute text-4xl font-bold text-white/10">{slides.length}</span>
          <span className="text-2xl font-bold bg-gradient-to-br from-blue-300 to-cyan-300 bg-clip-text text-transparent animate-pulse-gentle">
            {currentSlide + 1}
          </span>
        </div>
      </div>
    </>
  );
};

// Enhanced decorative elements
const DecorativeElements = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Animated lines */}
    <div className="absolute top-20 left-20 w-32 h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent animate-pulse-slow"></div>
    <div className="absolute bottom-32 right-32 w-24 h-0.5 bg-gradient-to-l from-blue-400/50 to-transparent animate-pulse-slow" style={{animationDelay: '1s'}}></div>
    
    {/* Floating geometric shapes */}
    <div className="absolute top-32 right-20 w-3 h-3 bg-cyan-400/30 rounded-full animate-float-gentle"></div>
    <div className="absolute bottom-40 left-32 w-2 h-2 bg-blue-400/40 rounded-full animate-float-gentle" style={{animationDelay: '2s'}}></div>
    <div className="absolute top-1/2 right-16 w-4 h-4 bg-indigo-400/20 rotate-45 animate-float-gentle" style={{animationDelay: '3s'}}></div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Debug toggle for switching between background and slideshow modes
  const [isBackgroundMode, setIsBackgroundMode] = useState(true);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields');
      setShowError(true);
      setLoading(false);
      return;
    }

    try {
      // Check user status
      const statusResponse = await axiosInstance.get(`${API_ENDPOINTS.CHECK_USER_STATUS}?email=${encodeURIComponent(username)}`);

      if (statusResponse.data.status === 200) {
        const userData = statusResponse.data.data;
        
        if (userData.isActive !== "True") {
          setErrorMessage('This account is inactive. Please contact support.');
          setShowError(true);
          setLoading(false);
          return;
        }

        // Proceed with login
        const loginResponse = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
          username,
          password,
        });

        console.log('Login successful:', loginResponse.data);
        Cookies.set('authToken', loginResponse.data.token, { expires: 7 });
        
        setShowSuccess(true);
        setTimeout(() => {
          setLoading(false);
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setLoading(false);

      if (!error.response) {
        setErrorMessage('Unable to connect to the server. Please try again.');
      } else if (error.response.status === 404) {
        setErrorMessage('User not found. Please check your username.');
      } else if (error.response.status === 401) {
        setErrorMessage('Invalid username or password.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }

      setShowError(true);
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layers */}
      <GeometricBackground />
      <AnimatedOrbs />
      <FloatingParticles />

      {/* Enhanced Debug Toggle Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsBackgroundMode(!isBackgroundMode)}
          className={`px-5 py-2.5 backdrop-blur-md text-white text-sm font-medium rounded-xl border transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
            isBackgroundMode 
              ? 'bg-blue-600/70 border-blue-400/50 hover:bg-blue-700/70' 
              : 'bg-cyan-600/70 border-cyan-400/50 hover:bg-cyan-700/70'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">{isBackgroundMode ? '🖼️' : '📺'}</span>
            <span>{isBackgroundMode ? 'Background Mode' : 'Slideshow Mode'}</span>
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40">
          <LoadingSpinner />
        </div>
      )}

      {/* Error modal */}
      {showError && (
        <ErrorModal 
          message={errorMessage} 
          onClose={() => setShowError(false)} 
        />
      )}

      {/* Main container with asymmetric layout */}
      <div className="min-h-screen flex">
        
        {/* Left side - Branding and visual elements with video background */}
        <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
          {/* Conditional Background - Video Background or Traditional Background */}
          {isBackgroundMode ? (
            <>
              {/* Video/Slideshow Background */}
              <VideoBackground />
              {/* Enhanced decorative elements */}
              <DecorativeElements />
            </>
          ) : (
            <>
              {/* Traditional animated background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-slide-slow"></div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-400/5 to-transparent transform skew-x-12 animate-slide-slow" style={{animationDelay: '10s'}}></div>
              </div>
              {/* Enhanced decorative elements */}
              <DecorativeElements />
            </>
          )}
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full">
            
            {/* Top section - Branding */}
            <div className="space-y-8">
              
              {/* Logo and branding */}
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-4">
                  <div className="w-14 h-14  from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12">
                  <Image
                    src="/assets/logo-only.png"
                    alt="Core HR"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                    {/* <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg> */}
                </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">CORE HR</h1>
                    <p className="text-cyan-300 font-medium">Business Solutions, Inc.</p>
                  </div>
                </div>
                {/* <p className="text-sm uppercase tracking-widest text-blue-200 font-medium">
                  Human Resources Management System
                </p> */}
              </div>

              {/* Main headline */}
              <div className="space-y-6">
                <h2 className="text-5xl font-bold leading-tight">
                  A Better Way to Manage
                  <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    HR Operations
                  </span>
                </h2>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Simplify your HR tasks with organized tools, insightful reports, and smooth system integration — no unnecessary complexity.
                </p>
              </div>


              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-8">
                {/* <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-sm font-semibold text-cyan-300">SECURE</span>
              </div>
                  <p className="text-blue-200 text-sm">Bank-level encryption</p>
                </div> */}
                {/* <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-semibold text-green-300">24/7</span>
                  </div>
                  <p className="text-blue-200 text-sm">Always available</p>
                </div> */}
                {/* <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm font-semibold text-purple-300">SMART</span>
                  </div>
                  <p className="text-blue-200 text-sm">AI-powered insights</p>
                </div> */}
                {/* <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm font-semibold text-yellow-300">FAST</span>
                  </div>
                  <p className="text-blue-200 text-sm">Lightning performance</p>
                </div> */}
            </div>

            </div>

            {/* Conditional Middle section - Show slideshow only in slideshow mode */}
            {!isBackgroundMode && (
              <div className="my-8">
                <MediaSlideshow />
              </div>
            )}

            {/* Bottom section - Enhanced features */}
            <div className="space-y-6">
              {/* Enhanced feature highlights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-green-300">24/7</span>
                  </div>
                  <p className="text-blue-200 text-sm">Always available</p>
                </div>
                <div className="space-y-2 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span className="text-sm font-semibold text-yellow-300">FAST</span>
                  </div>
                  <p className="text-blue-200 text-sm">Lightning performance</p>
                </div>
              </div>

              {/* Enhanced decorative elements */}
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-transparent rounded-full animate-pulse-gentle"></div>
                  <div className="w-6 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full animate-pulse-gentle" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-4 h-1 bg-gradient-to-r from-indigo-400 to-transparent rounded-full animate-pulse-gentle" style={{animationDelay: '1s'}}></div>
                </div>
                <div className="text-blue-300/60 text-sm font-medium">
                  Enterprise Ready
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced floating elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 bg-gradient-to-tl from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse-slow" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-xl animate-pulse-slow" style={{animationDelay: '6s'}}></div>
                </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative">
          
          {/* Mobile background for smaller screens */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

          {/* Light blue grid pattern background */}
          <div className="hidden lg:block absolute inset-0 overflow-hidden">
            {/* Base background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50/80"></div>
            
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage: `
                linear-gradient(to right, #3b82f6 1px, transparent 1px),
                linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}></div>
            
            {/* Diagonal accent lines */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                #3b82f6,
                #3b82f6 1px,
                transparent 1px,
                transparent 40px
              )`
            }}></div>
            
            {/* Radial dots */}
            <div className="absolute inset-0 opacity-[0.05]" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #0ea5e9 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          {/* Subtle floating elements for form side */}
          <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-cyan-100/20 rounded-full blur-3xl animate-float-gentle"></div>
            <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-gradient-to-tl from-cyan-100/25 to-blue-100/15 rounded-full blur-2xl animate-float-gentle" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 left-1/6 w-20 h-20 bg-gradient-to-r from-slate-100/20 to-blue-100/10 rounded-full blur-xl animate-float-gentle" style={{animationDelay: '4s'}}></div>
          </div>
          
          {/* Animated corner accents */}
          <div className="hidden lg:block absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-blue-200/30 rounded-tr-3xl"></div>
          <div className="hidden lg:block absolute bottom-8 left-8 w-20 h-20 border-b-2 border-l-2 border-blue-200/30 rounded-bl-3xl"></div>

          {/* Form container */}
          <div className="w-full max-w-md relative z-10">
            
            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-12">
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
            </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-white">CORE HR</h1>
                  <p className="text-cyan-300 text-sm">Business Solutions</p>
          </div>
              </div>
              <p className="text-blue-200 text-sm">Human Resources Management System</p>
      </div>

            {/* Enhanced glass morphism card with improved aesthetics */}
            <div className="backdrop-blur-xl bg-white/10 lg:bg-white/90 rounded-3xl border border-white/20 lg:border-blue-100/50 shadow-2xl lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-8 lg:p-10 hover:shadow-[0_35px_60px_-12px_rgba(59,130,246,0.3)] transition-all duration-500 animate-fade-in-up">
              {/* Card accent elements */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-t-3xl"></div>
              <div className="absolute -top-1 -left-1 w-12 h-12 border-t-2 border-l-2 border-blue-400/30 rounded-tl-3xl"></div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-2 border-r-2 border-blue-400/30 rounded-br-3xl"></div>
              
              {/* Welcome text */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white lg:text-slate-800 mb-3">Welcome Back</h2>
                <p className="text-blue-200 lg:text-slate-600">Sign in to access your dashboard</p>
            </div>

              {/* Login form */}
              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Username field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white lg:text-slate-700">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-white/60 lg:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <Input
                      placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
                      classNames={{
                        base: "max-w-full",
                        input: "text-base bg-transparent pl-10 text-white lg:text-slate-800 placeholder:text-white/50 lg:placeholder:text-slate-400",
                        inputWrapper: "h-12 bg-white/10 lg:bg-white border-2 border-white/20 lg:border-slate-200 shadow-sm hover:border-white/40 lg:hover:border-slate-300 focus-within:border-cyan-400 lg:focus-within:border-blue-500 transition-all duration-200 rounded-xl backdrop-blur-sm",
                      }}
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white lg:text-slate-700">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-white/60 lg:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <Input
                type={isVisible ? "text" : "password"}
                      placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                      endContent={<PasswordToggleButton isVisible={isVisible} toggleVisibility={toggleVisibility} />}
                      classNames={{
                        base: "max-w-full",
                        input: "text-base bg-transparent pl-10 pr-10 text-white lg:text-slate-800 placeholder:text-white/50 lg:placeholder:text-slate-400",
                        inputWrapper: "h-12 bg-white/10 lg:bg-white border-2 border-white/20 lg:border-slate-200 shadow-sm hover:border-white/40 lg:hover:border-slate-300 focus-within:border-cyan-400 lg:focus-within:border-blue-500 transition-all duration-200 rounded-xl backdrop-blur-sm",
                      }}
                    />
                  </div>
                  
                  {/* Forgot password */}
              <div className="text-right">
                <button 
                  type="button"
                      onClick={() => setIsResetModalOpen(true)}
                      className="text-sm text-cyan-300 lg:text-blue-600 hover:text-cyan-200 lg:hover:text-blue-700 transition-colors"
                    >
                      Forgot password?
                </button>
              </div>
            </div>

                {/* Submit button */}
                <button
              type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
          </form>
          
              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-white/20 lg:border-slate-200 text-center space-y-4">
                <button 
                  className="inline-flex items-center text-sm text-white/80 lg:text-slate-600 hover:text-cyan-300 lg:hover:text-blue-600 transition-colors"
                  onClick={() => setIsResetModalOpen(true)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
                  Need help? Contact support
            </button>
                <p className="text-xs text-white/60 lg:text-slate-500">
                  &copy; 2024 CORE HR Business Solutions, Inc.
                </p>
          </div>
        </div>
            </div>
          </div>
            </div>
            
      {/* Modals */}
        <ResetPasswordModal 
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          isDarkMode={false}
        />

        <SuccessOverlay show={showSuccess} />

      {/* Custom styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-20px) scale(1.1); 
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        @keyframes slide-slow {
          0% { 
            transform: translateX(-100%) skewX(-12deg); 
          }
          100% { 
            transform: translateX(200%) skewX(-12deg); 
          }
        }
        
        .animate-slide-slow {
          animation: slide-slow 20s linear infinite;
        }
        
        @keyframes success {
          0% { 
            transform: scale(0.3) rotate(-10deg); 
            opacity: 0; 
          }
          50% { 
            transform: scale(1.1) rotate(5deg); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 1; 
          }
        }

        .animate-success {
          animation: success 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        @keyframes success-message {
          0% { 
            transform: translateY(20px) scale(0.9); 
            opacity: 0; 
          }
          100% { 
            transform: translateY(0) scale(1); 
            opacity: 1; 
          }
        }

        .animate-success-message {
          animation: success-message 0.5s ease-out forwards;
        }

        @keyframes float-gentle {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-10px) scale(1.05); 
            opacity: 1;
          }
        }
        
        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }

        @keyframes pulse-gentle {
          0%, 100% { 
            opacity: 0.4;
          }
          50% { 
            opacity: 0.8;
          }
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }

        @keyframes gradient-text {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 4s ease-in-out infinite;
        }
        
        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          70%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}