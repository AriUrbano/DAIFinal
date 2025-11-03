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

// ✅ VERSIÓN COMPLETA CON NOTIFICACIONES REALES
export const requestNotificationPermissions = async () => {
  try {
    console.log('🔔 Solicitando permisos de notificación...');
    
    const { status } = await Notifications.requestPermissionsAsync();
    
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

export const scheduleDemoNotification = async () => {
  try {
    console.log('📲 Programando notificación de prueba...');
    
    // Verificar permisos primero
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      throw new Error('Permisos de notificación no concedidos');
    }

    // Programar notificación
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 ¡Notificación de Prueba!',
        body: 'Esta es una notificación de prueba de EventGuard',
        data: { type: 'demo', screen: 'profile' },
        sound: true,
        vibrate: [0, 250, 250, 250],
      },
      trigger: {
        seconds: 2, // Mostrar después de 2 segundos
      },
    });

    console.log('✅ Notificación programada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error programando notificación:', error);
    throw error;
  }
};

export const sendVerificationNotification = async (success, eventName = '') => {
  try {
    const title = success ? '✅ Verificación Exitosa' : '❌ Error de Verificación';
    const body = success 
      ? `"${eventName}" ha sido verificado correctamente`
      : 'El código QR escaneado no es válido';

    // Mostrar alerta inmediata
    Alert.alert(title, body, [{ text: 'OK' }]);
    
    // Y también programar notificación nativa si hay permisos
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: { 
            type: 'verification', 
            success: success,
            eventName: eventName 
          },
          sound: true,
        },
        trigger: {
          seconds: 1,
        },
      });
    }
    
    console.log('📲 Notificación de verificación enviada');
  } catch (error) {
    console.error('❌ Error en notificación de verificación:', error);
    // Fallback a solo alerta
    Alert.alert(title, body, [{ text: 'OK' }]);
  }
};

export const sendEventNotification = async (title, body) => {
  try {
    // Mostrar alerta inmediata
    Alert.alert(title, body, [{ text: 'OK' }]);
    
    // Y notificación nativa
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: { type: 'event' },
          sound: true,
        },
        trigger: {
          seconds: 1,
        },
      });
    }
  } catch (error) {
    console.error('❌ Error en notificación de evento:', error);
    Alert.alert(title, body, [{ text: 'OK' }]);
  }
};

// Notificación para eventos cercanos
export const sendNearbyEventNotification = async (eventName, distance) => {
  try {
    const title = '📍 Evento Cercano';
    const body = `"${eventName}" está a ${distance}km de ti`;
    
    const hasPermission = await requestNotificationPermissions();
    if (hasPermission) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          data: { 
            type: 'nearby_event',
            eventName: eventName,
            distance: distance
          },
          sound: true,
        },
        trigger: null, // Inmediata
      });
    }
    
    console.log('📍 Notificación de evento cercano enviada');
  } catch (error) {
    console.error('❌ Error en notificación de evento cercano:', error);
  }
};

// Función para cancelar todas las notificaciones
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('🗑️ Todas las notificaciones canceladas');
  } catch (error) {
    console.error('❌ Error cancelando notificaciones:', error);
  }
};

// Obtener token de push (para futuras implementaciones)
export const getPushToken = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
    
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch (error) {
    console.error('❌ Error obteniendo token:', error);
    return null;
  }
};

// Funciones de compatibilidad
export const registerForPushNotificationsAsync = async () => {
  return await getPushToken();
};