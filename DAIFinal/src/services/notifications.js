import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar el manejo de notificaciones locales
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  try {
    console.log('⚠️ Notificaciones push no disponibles en Expo Go. Usa Development Build.');
    return false;
  } catch (error) {
    console.log('Error en registro de notificaciones:', error);
    return false;
  }
};

export const sendEventNotification = async (title, body) => {
  try {
    // Usar notificaciones locales en lugar de push
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { type: 'event_alert' },
        sound: true,
      },
      trigger: null, // Enviar inmediatamente
    });
    console.log('📲 Notificación local enviada:', title);
  } catch (error) {
    console.error('Error enviando notificación local:', error);
  }
};

export const sendVerificationNotification = async (success, eventName = '') => {
  try {
    const title = success ? '✅ Verificación Exitosa' : '❌ Error de Verificación';
    const body = success 
      ? `El evento "${eventName}" ha sido verificado correctamente`
      : 'El código QR escaneado no es válido';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { 
          type: 'verification_result',
          success: success 
        },
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    console.error('Error enviando notificación de verificación:', error);
  }
};

export const scheduleDemoNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 EventGuard Demo',
        body: '¡Esta es una notificación LOCAL de prueba!',
        data: { type: 'demo' },
        sound: true,
      },
      trigger: { seconds: 2 },
    });
    console.log('📲 Notificación demo programada');
  } catch (error) {
    console.error('Error programando notificación demo:', error);
  }
};

export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log('Estado de permisos:', status);
    return status === 'granted';
  } catch (error) {
    console.error('Error solicitando permisos:', error);
    return false;
  }
};