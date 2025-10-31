import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

// Servicios
import { setupLocationTracking } from './src/services/location';

// Navegación
import MainTabNavigator from './src/navigation/MainTabNavigator';
import DrawerMenu from './src/components/layout/DrawerMenu';

const Drawer = createDrawerNavigator();

export default function App() {
  useEffect(() => {
    // SOLO configurar location - NO notificaciones push
    setupLocationTracking();
    
    console.log('🚀 EventGuard iniciado - Modo Expo Go');
  }, []);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator 
          drawerContent={(props) => <DrawerMenu {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4361EE',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            drawerStyle: {
              backgroundColor: '#F8F9FA',
            },
          }}
        >
          <Drawer.Screen 
            name="Main" 
            component={MainTabNavigator}
            options={{ 
              title: 'EventGuard',
              headerShown: false 
            }} 
          />
        </Drawer.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});