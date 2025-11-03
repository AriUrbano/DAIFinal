import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componentes
import EventCard from '../components/common/EventCard';
import Loading from '../components/common/Loading';

// Servicios y Hooks
import { useLocation } from '../hooks/useLocation';
import { vibrateLight } from '../services/vibration'; // ✅ AGREGAR ESTA IMPORTACIÓN

// Datos
import { mockEvents, calculateDistance } from '../data/mockData';

export default function HomeScreen() {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { location, error: locationError } = useLocation();

  useEffect(() => {
    console.log('🏠 HomeScreen: Iniciando carga de eventos');
    loadEvents();
  }, [location]);

  const loadEvents = async () => {
    console.log('🔄 Cargando eventos...');
    setRefreshing(true);
    
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let processedEvents = [...mockEvents]; // Crear copia del array
      
      console.log(`📊 ${processedEvents.length} eventos encontrados`);
      
      // Calcular distancias si tenemos ubicación
      if (location && location.coords) {
        console.log('📍 Calculando distancias con ubicación disponible');
        processedEvents = processedEvents.map(event => {
          const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            event.latitude,
            event.longitude
          );
          return {
            ...event,
            distance: distance
          };
        }).sort((a, b) => a.distance - b.distance);
        
        console.log('📏 Distancias calculadas y ordenadas');
      } else {
        console.log('📍 Sin ubicación, mostrando eventos sin distancias');
      }
      
      setEvents(processedEvents);
      console.log('✅ Eventos cargados exitosamente');
      
    } catch (error) {
      console.error('❌ Error cargando eventos:', error);
      Alert.alert('Error', 'No se pudieron cargar los eventos');
    } finally {
      setRefreshing(false);
    }
  };

  const handleEventPress = (event) => {
    // ✅ AGREGAR VIBRACIÓN AQUÍ
    vibrateLight(); // Vibración suave al tocar cualquier evento
    
    Alert.alert(
      event.title,
      `📍 ${event.location}\n📅 ${new Date(event.date).toLocaleDateString()}\n⏰ ${event.time}\n\n${event.description}`,
      [
        { text: 'OK', style: 'default' },
        { 
          text: 'Ver en Mapa', 
          onPress: () => {
            console.log('Navegar al mapa con evento:', event.id);
            // Opcional: agregar vibración diferente para "Ver en Mapa"
            vibrateLight();
          }
        }
      ]
    );
  };

  const renderEventItem = ({ item }) => (
    <EventCard 
      event={item} 
      onPress={() => handleEventPress(item)}
    />
  );

  if (refreshing && events.length === 0) {
    return <Loading message="Cargando eventos..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="calendar" size={24} color="#4361EE" />
        <Text style={styles.title}>Eventos Disponibles</Text>
      </View>
      
      {locationError && (
  <View style={styles.warning}>
    <Ionicons name="warning" size={20} color="#FF6B6B" />
    <Text style={styles.warningText}>
      {locationError}
    </Text>
    <TouchableOpacity 
      style={styles.retryButton}
      onPress={() => refetchLocation()}
    >
      <Text style={styles.retryButtonText}>Reintentar</Text>
    </TouchableOpacity>
  </View>
)}
      {events.length === 0 && !refreshing ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={60} color="#6C757D" />
          <Text style={styles.emptyStateTitle}>No hay eventos</Text>
          <Text style={styles.emptyStateText}>
            No se encontraron eventos disponibles en este momento.
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadEvents}
              colors={['#4361EE']}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#343A40',
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: '#DC3545',
    marginLeft: 8,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343A40',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
  backgroundColor: '#4361EE',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
  marginLeft: 10,
},
retryButtonText: {
  color: 'white',
  fontSize: 12,
  fontWeight: '500',
},
});