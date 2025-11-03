// src/services/notifications.js
import { Alert } from 'react-native';

// ✅ VERSIÓN DEFINITIVA - SOLO ALERTAS
export const sendVerificationNotification = async (success, eventName = '') => {
  const title = success ? '✅ Verificación Exitosa' : '❌ Error de Verificación';
  const body = success 
    ? `"${eventName}" ha sido verificado correctamente`
    : 'El código QR escaneado no es válido';

  Alert.alert(title, body, [{ text: 'OK' }]);
  console.log('📲 Alerta:', success ? 'ÉXITO' : 'ERROR');
};

export const sendEventNotification = async (title, body) => {
  Alert.alert(title, body, [{ text: 'OK' }]);
};

// Funciones de compatibilidad (si las necesitas)
export const requestNotificationPermissions = async () => true;
export const registerForPushNotificationsAsync = async () => false;