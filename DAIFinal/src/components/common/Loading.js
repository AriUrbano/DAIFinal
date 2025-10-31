import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Loading = ({ message = 'Cargando...', size = 'large' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="shield-checkmark" size={48} color="#4361EE" />
        <ActivityIndicator 
          size={size} 
          color="#4361EE" 
          style={styles.spinner}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  spinner: {
    marginVertical: 20,
  },
  message: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Loading;