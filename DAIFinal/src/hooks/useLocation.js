// hooks/useLocation.js
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('undetermined');

  const requestPermission = async () => {
    try {
      console.log('📍 Solicitando permisos de ubicación...');
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado');
        console.log('❌ Permiso de ubicación denegado');
        return false;
      }
      
      console.log('✅ Permiso de ubicación concedido');
      return true;
    } catch (err) {
      console.error('❌ Error solicitando permisos:', err);
      setError('Error solicitando permisos de ubicación');
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      console.log('📍 Obteniendo ubicación actual...');
      
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });
      
      console.log('✅ Ubicación obtenida:', locationData.coords);
      setLocation(locationData);
      setError(null);
      
    } catch (err) {
      console.error('❌ Error obteniendo ubicación:', err);
      setError('No se pudo obtener la ubicación actual');
    }
  };

  const startLocationUpdates = async () => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      // Escuchar cambios de ubicación en tiempo real
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 100, // metros
          timeInterval: 5000, // milisegundos
        },
        (newLocation) => {
          console.log('📍 Ubicación actualizada');
          setLocation(newLocation);
          setError(null);
        }
      );
    } catch (err) {
      console.error('❌ Error en actualizaciones de ubicación:', err);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    startLocationUpdates();

    // Cleanup
    return () => {
      // Opcional: detener las actualizaciones si es necesario
    };
  }, []);

  const refetchLocation = async () => {
    await getCurrentLocation();
  };

  return {
    location,
    error,
    permissionStatus,
    refetchLocation,
    requestPermission,
  };
};