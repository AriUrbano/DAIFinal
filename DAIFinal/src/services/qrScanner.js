import { BarCodeScanner } from 'expo-barcode-scanner';

export const requestCameraPermissions = async () => {
  try {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error solicitando permisos de cámara:', error);
    return false;
  }
};

export const validateQRData = (data) => {
  try {
    const parsed = JSON.parse(data);
    
    // Validar estructura básica del QR de evento
    const isValid = (
      parsed.eventId &&
      parsed.type === 'event_verification' &&
      parsed.eventName &&
      parsed.timestamp
    );
    
    return {
      isValid,
      data: isValid ? parsed : null,
      error: isValid ? null : 'Estructura QR inválida'
    };
  } catch (error) {
    return {
      isValid: false,
      data: null,
      error: 'QR no es un JSON válido'
    };
  }
};

export const generateDemoQRData = () => {
  return JSON.stringify({
    eventId: 'demo-' + Date.now(),
    type: 'event_verification',
    eventName: 'Evento de Demostración',
    timestamp: new Date().toISOString(),
    organizer: 'EventGuard Team'
  });
};