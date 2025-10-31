import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Servicios
import { 
  requestNotificationPermissions,
  scheduleDemoNotification 
} from '../services/notifications';
import { vibrate } from '../services/vibration';

export default function ProfileScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: true,
    vibration: true,
    nearbyEvents: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // Feedback táctil
    if (settings.vibration) {
      vibrate('light');
    }
  };

  const handleTestNotification = async () => {
    try {
      await scheduleDemoNotification();
      Alert.alert('Éxito', 'Notificación de prueba programada');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la notificación de prueba');
    }
  };

  const handleTestVibration = () => {
    vibrate('success');
  };

  const handlePermissions = async () => {
    try {
      await requestNotificationPermissions();
      Alert.alert('Éxito', 'Permisos verificados correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron verificar los permisos');
    }
  };

  const menuItems = [
    {
      icon: 'notifications',
      title: 'Notificaciones',
      subtitle: 'Alertas y recordatorios',
      setting: 'notifications',
    },
    {
      icon: 'location',
      title: 'Seguimiento de Ubicación',
      subtitle: 'Eventos cercanos',
      setting: 'locationTracking',
    },
    {
      icon: 'vibrate',
      title: 'Vibración',
      subtitle: 'Feedback táctil',
      setting: 'vibration',
    },
    {
      icon: 'calendar',
      title: 'Eventos Cercanos',
      subtitle: 'Alertas automáticas',
      setting: 'nearbyEvents',
    },
  ];

  const actionItems = [
    {
      icon: 'notifications-outline',
      title: 'Probar Notificación',
      onPress: handleTestNotification,
      color: '#4361EE',
    },
    {
      icon: 'vibrate-outline',
      title: 'Probar Vibración',
      onPress: handleTestVibration,
      color: '#06D6A0',
    },
    {
      icon: 'key-outline',
      title: 'Verificar Permisos',
      onPress: handlePermissions,
      color: '#FFD166',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header del Perfil */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="white" />
        </View>
        <Text style={styles.userName}>Usuario EventGuard</Text>
        <Text style={styles.userEmail}>usuario@eventguard.com</Text>
      </View>

      {/* Configuración */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuración</Text>
        {menuItems.map((item, index) => (
          <View key={item.setting} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={20} color="#4361EE" />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Switch
              value={settings[item.setting]}
              onValueChange={() => toggleSetting(item.setting)}
              trackColor={{ false: '#E9ECEF', true: '#4361EE' }}
              thumbColor={settings[item.setting] ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        ))}
      </View>

      {/* Acciones Rápidas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        {actionItems.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            style={styles.actionItem}
            onPress={item.onPress}
          >
            <View style={styles.actionLeft}>
              <View 
                style={[
                  styles.actionIcon, 
                  { backgroundColor: item.color + '20' }
                ]}
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.actionTitle}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6C757D" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Información de la App */}
      <View style={styles.footer}>
        <View style={styles.appInfo}>
          <Ionicons name="shield-checkmark" size={24} color="#4361EE" />
          <Text style={styles.appName}>EventGuard v1.0.0</Text>
        </View>
        <Text style={styles.appDescription}>
          Verificador de eventos seguros con tecnología de ubicación, QR y notificaciones.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4361EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343A40',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6C757D',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343A40',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343A40',
  },
  footer: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 24,
    alignItems: 'center',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
    marginLeft: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 20,
  },
});