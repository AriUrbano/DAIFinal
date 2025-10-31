import * as Location from 'expo-location';
import { sendEventNotification } from './notifications';

// Cache de ubicación para evitar solicitudes repetidas
let currentLocation = null;
let watchId = null;

export const requestLocationPermissions = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permiso de ubicación denegado');
    }
    
    return true;
  } catch (error) {
    console.error('Error solicitando permisos de ubicación:', error);
    return false;
  }
};

export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermissions();
    
    if (!hasPermission) {
      throw new Error('Sin permisos de ubicación');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    currentLocation = location;
    return location;
  } catch (error) {
    console.error('Error obteniendo ubicación:', error);
    throw error;
  }
};

export const setupLocationTracking = () => {
  // En una aplicación real, aquí configurarías el tracking en background
  console.log('Configurando tracking de ubicación...');
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Fórmula de Haversine para calcular distancia entre dos puntos
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

export { currentLocation };