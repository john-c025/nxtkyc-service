import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let watchId;

    const onSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });
      setError(null);
    };

    const onError = (error) => {
      setError(error.message);
    };

    if (navigator.geolocation) {
      // Start watching position
      watchId = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
          ...options
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }

    // Cleanup: stop watching position
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return { location, error };
}; 