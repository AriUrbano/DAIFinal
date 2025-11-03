// src/services/vibration.js
import * as Haptics from 'expo-haptics';

// ✅ VIBRACIÓN REAL con expo-haptics
export const vibrate = (type = 'light') => {
  try {
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    console.log(`📳 Vibración: ${type}`);
  } catch (error) {
    console.log('📳 Vibración no disponible:', error);
  }
};

export const vibrateSuccess = () => vibrate('success');
export const vibrateError = () => vibrate('error');
export const vibrateWarning = () => vibrate('warning');
export const vibrateLight = () => vibrate('light');