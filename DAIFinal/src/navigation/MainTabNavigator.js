// src/navigation/MainTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importar pantallas
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ScannerScreen from '../screens/ScannerScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4361EE',
        tabBarInactiveTintColor: 'gray',
        headerLeft: () => (
          <Ionicons 
            name="menu" 
            size={28} 
            color="white" 
            style={{ marginLeft: 15 }}
            onPress={() => navigation.toggleDrawer()}
          />
        ),
        headerStyle: {
          backgroundColor: '#4361EE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      {/* ✅ SOLO Tab.Screen como hijos directos - SIN COMENTARIOS ENTRE ELLOS */}
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Inicio' }} 
      />
      
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ title: 'Mapa' }} 
      />
      
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{ title: 'Escaner QR' }} 
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }} 
      />
    </Tab.Navigator>
  );
}