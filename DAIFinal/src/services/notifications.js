// services/notifications.js
import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { vibrate } from './vibration';

// Configurar el manejo de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ✅ VERSIÓN COMPLETA CON NOTIFICACIONES NATIVAS

/**
 * Solicita permisos para notificaciones push
 * @returns {Promise<boolean>} True si los permisos fueron concedidos
 */
export const requestNotificationPermissions = async () => {
  try {
    console.log('🔔 Solicitando permisos de notificación...');
    
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });
    
    if (status !== 'granted') {
      console.log('❌ Permisos de notificación denegados');
      return false;
    }
    
    console.log('✅ Permisos de notificación concedidos');
    return true;
  } catch (error) {
    console.error('❌ Error solicitando permisos:', error);
    return false;
  }
};

/**
 * Programa una notificación de demostración
 * @returns {Promise<boolean>} True si se programó correctamente
 */
export const scheduleDemoNotification = async () => {
  try {
    console.log('📲 Programando notificación de prueba...');
    
    // Verificar permisos primero
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      throw new Error('Permisos de notificación no concedidos');
    }

    // Programar notificación
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 ¡Notificación de Prueba!',
        body: 'Esta es una notificación de prueba de EventGuard',
        data: { 
          type: 'demo', 
          screen: 'profile',
          timestamp: new Date().toISOString()
        },
        sound: true,
        vibrate: [0, 250, 250, 250],
        autoDismiss: true,
        sticky: false,
      },
      trigger: {
        seconds: 1, // Mostrar después de 1 segundo
      },
    });

    console.log('✅ Notificación programada exitosamente. ID:', notificationId);
    
    // Vibración de confirmación
    vibrate('success');
    
    return true;
  } catch (error) {
    console.error('❌ Error programando notificación:', error);
    
    // Fallback a alerta
    Alert.alert(
      '🔔 Notificación de Prueba', 
      'Esta es una simulación. En una app real con permisos, esto aparecería en tu centro de notificaciones.',
      [{ text: 'OK' }]
    );
    
    throw error;
  }
};

/**
 * Envía notificación de verificación de QR
 * @param {boolean} success - Si la verificación fue exitosa
 * @param {string} eventName - Nombre del evento
 * @returns {Promise<void>}
 */
export const sendVerificationNotification = async (success, eventName = '') => {
  try {
    const title = success ? '✅ Verificación Exitosa' : '❌ Error de Verificación';
    const body = success 
      ? `"${eventName}" ha sido verificado correctamente`
      : 'El código QR escaneado no es válido';

    // Programar notificación nativa
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: { 
            type: 'verification', 
            success: success,
            eventName: eventName,
            timestamp: new Date().toISOString()
          },
          sound: true,
          vibrate: success ? [0, 250, 250, 250] : [0, 500, 250, 500],
          autoDismiss: true,
          priority: 'high',
        },
        trigger: {
          seconds: 1,
        },
      });
      
      console.log('📲 Notificación nativa enviada. ID:', notificationId);
      
      // Vibración según el resultado
      if (success) {
        vibrate('success');
      } else {
        vibrate('error');
      }
    } else {
      // Fallback a alerta si no hay permisos
      console.log('📲 Fallback a alerta (sin permisos)');
      Alert.alert(title, body, [{ text: 'OK' }]);
      
      // Vibración de fallback
      if (success) {
        vibrate('light');
      } else {
        vibrate('medium');
      }
    }
    
  } catch (error) {
    console.error('❌ Error en notificación de verificación:', error);
    
    // Fallback a alerta en caso de error
    const title = success ? '✅ Verificación Exitosa' : '❌ Error de Verificación';
    const body = success 
      ? `"${eventName}" ha sido verificado correctamente`
      : 'El código QR escaneado no es válido';
    
    Alert.alert(title, body, [{ text: 'OK' }]);
    vibrate('light');
  }
};

/**
 * Envía notificación personalizada de evento
 * @param {string} title - Título de la notificación
 * @param {string} body - Cuerpo de la notificación
 * @param {Object} data - Datos adicionales
 * @returns {Promise<void>}
 */
export const sendEventNotification = async (title, body, data = {}) => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: {
            type: 'event',
            timestamp: new Date().toISOString(),
            ...data
          },
          sound: true,
          vibrate: [0, 250, 250, 250],
          autoDismiss: true,
        },
        trigger: {
          seconds: 1,
        },
      });
      
      console.log('📅 Notificación de evento enviada. ID:', notificationId);
      vibrate('light');
    } else {
      Alert.alert(title, body, [{ text: 'OK' }]);
      vibrate('light');
    }
  } catch (error) {
    console.error('❌ Error en notificación de evento:', error);
    Alert.alert(title, body, [{ text: 'OK' }]);
  }
};

/**
 * Notificación para eventos cercanos
 * @param {string} eventName - Nombre del evento
 * @param {number} distance - Distancia en km
 * @returns {Promise<void>}
 */
export const sendNearbyEventNotification = async (eventName, distance) => {
  try {
    const title = '📍 Evento Cercano';
    const body = `"${eventName}" está a ${distance.toFixed(1)}km de ti`;
    
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: { 
            type: 'nearby_event',
            eventName: eventName,
            distance: distance,
            timestamp: new Date().toISOString()
          },
          sound: true,
          vibrate: [0, 250, 250, 250],
          autoDismiss: false, // Permite que permanezca en el centro de notificaciones
        },
        trigger: null, // Inmediata
      });
      
      console.log('📍 Notificación de evento cercano enviada. ID:', notificationId);
      vibrate('warning');
    } else {
      Alert.alert(title, body, [{ text: 'OK' }]);
    }
  } catch (error) {
    console.error('❌ Error en notificación de evento cercano:', error);
  }
};

/**
 * Notificación de recordatorio de evento
 * @param {string} eventName - Nombre del evento
 * @param {Date} startTime - Hora de inicio del evento
 * @param {number} minutesBefore - Minutos antes del evento
 * @returns {Promise<void>}
 */
export const sendEventReminder = async (eventName, startTime, minutesBefore = 30) => {
  try {
    const title = '⏰ Recordatorio de Evento';
    const body = `"${eventName}" comienza en ${minutesBefore} minutos`;
    
    const triggerDate = new Date(startTime);
    triggerDate.setMinutes(triggerDate.getMinutes() - minutesBefore);
    
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: { 
            type: 'reminder',
            eventName: eventName,
            startTime: startTime.toISOString(),
            minutesBefore: minutesBefore,
            timestamp: new Date().toISOString()
          },
          sound: true,
          vibrate: [0, 500, 250, 500],
        },
        trigger: {
          date: triggerDate, // Programar para fecha específica
        },
      });
      
      console.log('⏰ Recordatorio programado. ID:', notificationId);
    }
  } catch (error) {
    console.error('❌ Error programando recordatorio:', error);
  }
};

/**
 * Cancela una notificación específica
 * @param {string} notificationId - ID de la notificación a cancelar
 * @returns {Promise<void>}
 */
export const cancelNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('🗑️ Notificación cancelada:', notificationId);
  } catch (error) {
    console.error('❌ Error cancelando notificación:', error);
  }
};

/**
 * Cancela todas las notificaciones programadas
 * @returns {Promise<void>}
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('🗑️ Todas las notificaciones canceladas');
    
    // Vibración de confirmación
    vibrate('light');
  } catch (error) {
    console.error('❌ Error cancelando notificaciones:', error);
  }
};

/**
 * Obtiene todas las notificaciones programadas
 * @returns {Promise<Array>} Lista de notificaciones programadas
 */
export const getScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`📋 ${notifications.length} notificaciones programadas`);
    return notifications;
  } catch (error) {
    console.error('❌ Error obteniendo notificaciones:', error);
    return [];
  }
};

/**
 * Obtiene token de push notifications
 * @returns {Promise<string|null>} Token de push o null si hay error
 */
export const getPushToken = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
    
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Reemplaza con tu projectId de Expo
    })).data;
    
    console.log('🔑 Push Token obtenido:', token);
    return token;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    return null;
  }
};

/**
 * Maneja notificaciones recibidas en primer plano
 * @param {Function} callback - Función a ejecutar cuando llega notificación
 * @returns {Function} Función para remover el listener
 */
export const setNotificationReceivedListener = (callback) => {
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('📲 Notificación recibida en primer plano:', notification);
    if (callback) {
      callback(notification);
    }
  });
  
  return () => subscription.remove();
};

/**
 * Maneja respuestas a notificaciones (cuando el usuario toca la notificación)
 * @param {Function} callback - Función a ejecutar cuando se responde notificación
 * @returns {Function} Función para remover el listener
 */
export const setNotificationResponseListener = (callback) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('👆 Notificación tocada por usuario:', response);
    if (callback) {
      callback(response);
    }
  });
  
  return () => subscription.remove();
};

/**
 * Configuración inicial de notificaciones
 * @returns {Promise<void>}
 */
export const setupNotifications = async () => {
  try {
    console.log('⚙️ Configurando notificaciones...');
    
    // Solicitar permisos
    await requestNotificationPermissions();
    
    // Configurar canal de notificaciones (Android)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4361EE',
        sound: true,
      });
    }
    
    console.log('✅ Notificaciones configuradas correctamente');
  } catch (error) {
    console.error('❌ Error configurando notificaciones:', error);
  }
};

/**
 * Limpia todos los badges (números rojos)
 * @returns {Promise<void>}
 */
export const clearBadges = async () => {
  try {
    await Notifications.setBadgeCountAsync(0);
    console.log('🔴 Badges limpiados');
  } catch (error) {
    console.error('❌ Error limpiando badges:', error);
  }
};

// Funciones de compatibilidad (para mantener consistencia con código existente)
export const registerForPushNotificationsAsync = async () => {
  return await getPushToken();
};

// Exportar objeto Notifications para uso avanzado
export { Notifications };

export default {
  requestNotificationPermissions,
  scheduleDemoNotification,
  sendVerificationNotification,
  sendEventNotification,
  sendNearbyEventNotification,
  sendEventReminder,
  cancelNotification,
  cancelAllNotifications,
  getScheduledNotifications,
  getPushToken,
  setNotificationReceivedListener,
  setNotificationResponseListener,
  setupNotifications,
  clearBadges,
  registerForPushNotificationsAsync,
};