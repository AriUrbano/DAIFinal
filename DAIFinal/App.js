import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Servicios
import { setupLocationTracking } from './src/services/location';

// Navegación
import MainTabNavigator from './src/navigation/MainTabNavigator';
import DrawerMenu from './src/components/layout/DrawerMenu';

const Drawer = createDrawerNavigator();

export default function App() {
  useEffect(() => {
    setupLocationTracking();
    console.log('🚀 EventGuard iniciado - Modo Expo Go');
  }, []);

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator 
          drawerContent={(props) => <DrawerMenu {...props} />}
          screenOptions={({ navigation }) => ({
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
            drawerActiveTintColor: '#4361EE',
            drawerInactiveTintColor: '#6C757D',
            // ✅ BOTÓN HAMBURGUESA REAL
            headerLeft: () => (
              <Ionicons 
                name="menu" 
                size={28} 
                color="white" 
                style={{ marginLeft: 15 }}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          })}
        >
          <Drawer.Screen 
            name="EventGuard" 
            component={MainTabNavigator}
            options={{ 
              title: 'EventGuard',
              headerShown: false,
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
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