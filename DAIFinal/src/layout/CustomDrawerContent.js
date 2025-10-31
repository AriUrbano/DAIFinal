import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={40} color="#4361EE" />
        <Text style={styles.title}>EventGuard</Text>
        <Text style={styles.subtitle}>Verificador de Eventos</Text>
      </View>
      
      <DrawerItemList {...props} />
      
      <View style={styles.footer}>
        <DrawerItem
          label="Configuración"
          icon={({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          )}
          onPress={() => console.log('Configuración')}
        />
        <DrawerItem
          label="Cerrar Sesión"
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" color={color} size={size} />
          )}
          onPress={() => console.log('Cerrar Sesión')}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4361EE',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 5,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    marginTop: 'auto',
  },
});