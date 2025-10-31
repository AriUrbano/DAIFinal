import { useState, useEffect } from 'react';
import { getCurrentLocation, requestLocationPermissions } from '../services/location';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const hasPermission = await requestLocationPermissions();
      
      if (!hasPermission) {
        throw new Error('Se necesitan permisos de ubicación para esta funcionalidad');
      }

      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
    } catch (err) {
      setError(err.message);
      console.error('Error en useLocation:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = () => {
    loadLocation();
  };

  return {
    location,
    error,
    loading,
    refreshLocation,
  };
};