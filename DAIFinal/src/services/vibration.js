// services/vibration.js
import { Vibration, Platform } from 'react-native';

// Patrones de vibración
const VIBRATION_PATTERNS = {
  light: [0, 100],           // Vibración corta
  medium: [0, 200],          // Vibración media
  heavy: [0, 400],           // Vibración larga
  success: [0, 100, 100, 100], // Patrón: corta-pausa-corta-pausa-corta
  error: [0, 500, 200, 500],   // Patrón: larga-pausa-corta-pausa-larga
  warning: [0, 300, 100, 300], // Patrón: media-pausa-corta-pausa-media
  notification: [0, 150, 50, 150], // Patrón para notificaciones
};

/**
 * Ejecuta vibración según el tipo
 * @param {string} type - Tipo de vibración (light, medium, heavy, success, error, warning, notification)
 */
export const vibrate = (type = 'light') => {
  try {
    if (Platform.OS === 'web') {
      console.log('📳 Vibración simulada (web):', type);
      return;
    }

    const pattern = VIBRATION_PATTERNS[type] || VIBRATION_PATTERNS.light;
    
    if (Platform.OS === 'android') {
      // En Android podemos usar patrones complejos
      Vibration.vibrate(pattern);
    } else if (Platform.OS === 'ios') {
      // En iOS solo vibración simple
      Vibration.vibrate(pattern[1]);
    }
    
    console.log('📳 Vibración ejecutada:', type);
  } catch (error) {
    console.error('❌ Error en vibración:', error);
  }
};

/**
 * Vibración simple
 * @param {number} duration - Duración en milisegundos
 */
export const vibrateSimple = (duration = 200) => {
  Vibration.vibrate(duration);
};

/**
 * Vibración con patrón personalizado
 * @param {Array} pattern - Patrón de vibración [wait, vibrate, wait, vibrate, ...]
 * @param {boolean} repeat - Si debe repetirse
 */
export const vibratePattern = (pattern, repeat = false) => {
  Vibration.vibrate(pattern, repeat);
};

/**
 * Cancela la vibración en curso
 */
export const cancelVibration = () => {
  Vibration.cancel();
};

// Alias para compatibilidad
export const vibrateLight = () => vibrate('light');
export const vibrateMedium = () => vibrate('medium');
export const vibrateHeavy = () => vibrate('heavy');
export const vibrateSuccess = () => vibrate('success');
export const vibrateError = () => vibrate('error');
export const vibrateWarning = () => vibrate('warning');

export default {
  vibrate,
  vibrateSimple,
  vibratePattern,
  cancelVibration,
  vibrateLight,
  vibrateMedium,
  vibrateHeavy,
  vibrateSuccess,
  vibrateError,
  vibrateWarning,
};