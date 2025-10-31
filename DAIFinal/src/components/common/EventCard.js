import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EventCard = ({ event, onPress }) => {
  const formatDistance = (distance) => {
    if (!distance) return 'Distancia no disponible';
    return `${distance.toFixed(1)} km`;
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (eventDate < now) return 'past';
    if (event.verified) return 'verified';
    return 'upcoming';
  };

  const status = getEventStatus(event);
  
  const statusConfig = {
    past: { color: '#6C757D', icon: 'time-outline', text: 'Finalizado' },
    verified: { color: '#06D6A0', icon: 'checkmark-circle', text: 'Verificado' },
    upcoming: { color: '#FFD166', icon: 'calendar', text: 'Próximo' },
  };

  const config = statusConfig[status];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        <View style={[styles.status, { backgroundColor: config.color + '20' }]}>
          <Ionicons name={config.icon} size={14} color={config.color} />
          <Text style={[styles.statusText, { color: config.color }]}>
            {config.text}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color="#6C757D" />
          <Text style={styles.detailText} numberOfLines={1}>
            {event.location}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="time" size={16} color="#6C757D" />
          <Text style={styles.detailText}>
            {new Date(event.date).toLocaleDateString()} • {event.time}
          </Text>
        </View>
        
        {event.distance && (
          <View style={styles.detailItem}>
            <Ionicons name="navigate" size={16} color="#4361EE" />
            <Text style={[styles.detailText, styles.distance]}>
              {formatDistance(event.distance)}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {event.description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
    flex: 1,
    marginRight: 8,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  details: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 8,
    flex: 1,
  },
  distance: {
    color: '#4361EE',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
});

export default EventCard;