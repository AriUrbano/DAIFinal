// src/components/layout/DrawerMenu.js
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { vibrate } from '../../services/vibration';

export default function DrawerMenu(props) {
  // ✅ FUNCIÓN QUE SOLO VIBRA
  const handleConfigPress = () => {
    vibrate('light'); // ✅ VIBRA AL TOCAR
    console.log('Ir a Configuración - Vibrando');
  };

  const handleHelpPress = () => {
    vibrate('light');
    console.log('Ayuda y Soporte');
  };

  const handleLogoutPress = () => {
    vibrate('medium');
    console.log('Cerrar Sesión');
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      {/* Header del Drawer SOLO CON LOGO */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="shield-checkmark" size={40} color="#4361EE" />
        </View>
        <Text style={styles.title}>EventGuard</Text>
        <Text style={styles.subtitle}>Verificador de Eventos</Text>
      </View>

      {/* ✅ "IR A CONFIGURACIÓN" AHORA VIBRA */}
      <DrawerItem
        label="Ir a Configuración"
        icon={({ color, size }) => (
          <Ionicons name="settings-outline" color={color} size={size} />
        )}
        onPress={handleConfigPress} // ✅ AHORA VIBRA
        labelStyle={styles.drawerLabel}
      />

      <DrawerItem
        label="Ayuda y Soporte"
        icon={({ color, size }) => (
          <Ionicons name="help-circle-outline" color={color} size={size} />
        )}
        onPress={handleHelpPress}
        labelStyle={styles.drawerLabel}
      />

      <DrawerItem
        label="Cerrar Sesión"
        icon={({ color, size }) => (
          <Ionicons name="log-out-outline" color={color} size={size} />
        )}
        onPress={handleLogoutPress}
        labelStyle={[styles.drawerLabel, styles.logoutLabel]}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E7F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4361EE',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#343A40',
  },
  logoutLabel: {
    color: '#FF6B6B',
  },
});