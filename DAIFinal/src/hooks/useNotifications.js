import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../services/notifications';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
    });

    // Escuchar notificaciones recibidas
    const notificationReceivedSubscription = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Escuchar respuestas a notificaciones
    const notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuario interactuó con notificación:', response);
    });

    // Verificar estado de permisos
    Notifications.getPermissionsAsync().then(status => {
      setPermissionStatus(status);
    });

    return () => {
      notificationReceivedSubscription.remove();
      notificationResponseSubscription.remove();
    };
  }, []);

  return {
    expoPushToken,
    notification,
    permissionStatus,
  };
};