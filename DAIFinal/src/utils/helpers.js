import { Platform } from 'react-native';

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (timeString) => {
  return timeString; // En una app real, podrías formatear mejor
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateEventQRData = (eventId, eventName) => {
  return JSON.stringify({
    eventId: eventId,
    type: 'event_verification',
    eventName: eventName,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
};