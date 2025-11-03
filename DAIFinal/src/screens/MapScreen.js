import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

// Servicios y Hooks
import { useLocation } from '../hooks/useLocation';
import { vibrate } from '../services/vibration';

// Datos
import { mockEvents } from '../data/mockData';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { location, error: locationError, permissionStatus, requestPermission, refetchLocation } = useLocation();
  const [region, setRegion] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (location) {
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
    }
  }, [location]);

  const handleRequestPermission = async () => {
    vibrate('medium');
    const granted = await requestPermission();
    
    if (granted) {
      Alert.alert('Éxito', 'Permisos de ubicación concedidos');
    }
  };

  const openSettings = () => {
    vibrate('medium');
    Linking.openSettings();
  };

  const handleEventPress = (event) => {
    vibrate('medium');
    setSelectedEvent(event);
    Alert.alert(
      event.title,
      `📍 ${event.location}\n📅 ${new Date(event.date).toLocaleDateString()}\n⏰ ${event.time}\n\n${event.description}`,
      [
        { text: 'OK', style: 'default' },
        { 
          text: 'Ver Detalles', 
          onPress: () => {
            console.log('Ver detalles del evento:', event.id);
            vibrate('light');
          }
        }
      ]
    );
  };

  const handleUserLocationPress = () => {
    vibrate('light');
    if (location) {
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  const handleMapPress = () => {
    vibrate('light');
  };

  // Pantalla de permisos denegados
  if (permissionStatus === 'denied') {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="location-off" size={80} color="#FF6B6B" />
          <Text style={styles.permissionTitle}>Ubicación Requerida</Text>
          <Text style={styles.permissionText}>
            Esta aplicación necesita acceso a tu ubicación para mostrar eventos cercanos en el mapa.
          </Text>
          
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={openSettings}
          >
            <Ionicons name="settings" size={20} color="white" />
            <Text style={styles.settingsButtonText}>Abrir Configuración</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRequestPermission}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Pantalla de permisos no determinados
  if (permissionStatus === 'undetermined') {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="location" size={80} color="#4361EE" />
          <Text style={styles.permissionTitle}>Permiso de Ubicación</Text>
          <Text style={styles.permissionText}>
            Para una mejor experiencia, necesitamos acceso a tu ubicación para mostrarte eventos cercanos.
          </Text>
          
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={handleRequestPermission}
          >
            <Ionicons name="location" size={20} color="white" />
            <Text style={styles.permissionButtonText}>Permitir Ubicación</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              vibrate('light');
              // Continuar sin ubicación
              setRegion({
                latitude: 40.4168, // Madrid por defecto
                longitude: -3.7038,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            }}
          >
            <Text style={styles.skipButtonText}>Continuar Sin Ubicación</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (locationError && permissionStatus !== 'denied') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="location-off" size={60} color="#FF6B6B" />
          <Text style={styles.errorTitle}>Error de Ubicación</Text>
          <Text style={styles.errorText}>
            {locationError}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={refetchLocation}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!region) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="map" size={60} color="#4361EE" />
          <Text style={styles.loadingText}>Cargando mapa...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="map" size={24} color="#4361EE" />
        <Text style={styles.title}>Mapa de Eventos</Text>
        
        {/* Indicador de estado de ubicación */}
        <View style={styles.locationStatus}>
          <Ionicons 
            name={location ? "location" : "location-outline"} 
            size={16} 
            color={location ? "#06D6A0" : "#6C757D"} 
          />
          <Text style={[
            styles.locationStatusText,
            { color: location ? "#06D6A0" : "#6C757D" }
          ]}>
            {location ? 'Ubicación activa' : 'Buscando ubicación...'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.mapContainer}
        activeOpacity={1}
        onPress={handleMapPress}
      >
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={!!location}
          showsMyLocationButton={false}
          onPress={handleMapPress}
        >
          {/* Radio de 5km alrededor del usuario */}
          {location && (
            <Circle
              center={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              radius={5000}
              strokeColor="#4361EE"
              strokeWidth={1}
              fillColor="rgba(67, 97, 238, 0.1)"
            />
          )}

          {/* Marcadores de eventos */}
          {mockEvents.map((event) => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.latitude,
                longitude: event.longitude,
              }}
              title={event.title}
              description={event.location}
              onPress={() => handleEventPress(event)}
            >
              <View style={styles.eventMarker}>
                <Ionicons name="calendar" size={14} color="white" />
              </View>
            </Marker>
          ))}
        </MapView>
      </TouchableOpacity>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.userColor]} />
          <Text style={styles.legendText}>Tu ubicación</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.eventColor]} />
          <Text style={styles.legendText}>Eventos</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.areaColor]} />
          <Text style={styles.legendText}>Radio 5km</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.vibrationTestButton}
          onPress={() => {
            vibrate('success');
            Alert.alert('Vibración', '✅ Vibración de prueba activada');
          }}
        >
          <Ionicons name="vibrate" size={16} color="#4361EE" />
          <Text style={styles.vibrationTestText}>Probar Vibración</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#343A40',
    flex: 1,
  },
  locationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationStatusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343A40',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4361EE',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4361EE',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  skipButtonText: {
    color: '#6C757D',
    fontSize: 14,
  },
  // ... (mantén el resto de los estilos igual)
  mapContainer: {
    flex: 1,
  },
  map: {
    width: width,
    height: height - 200,
  },
  userMarker: {
    backgroundColor: '#4361EE',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  eventMarker: {
    backgroundColor: '#06D6A0',
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  userColor: {
    backgroundColor: '#4361EE',
  },
  eventColor: {
    backgroundColor: '#06D6A0',
  },
  areaColor: {
    backgroundColor: 'rgba(67, 97, 238, 0.3)',
  },
  legendText: {
    fontSize: 12,
    color: '#6C757D',
  },
  vibrationTestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  vibrationTestText: {
    fontSize: 12,
    color: '#4361EE',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343A40',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4361EE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6C757D',
    marginTop: 16,
  },
});