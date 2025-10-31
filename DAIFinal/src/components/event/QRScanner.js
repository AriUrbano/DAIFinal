// src/components/event/QRScanner.js (VERSIÓN TEMPORAL)
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QRScanner = ({ onQRScanned, scanned }) => {
  const [hasPermission, setHasPermission] = useState(null);

  // Simular permisos de cámara
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPermission(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDemoQR = () => {
    if (!scanned) {
      const demoQRData = JSON.stringify({
        eventId: 'demo-123',
        type: 'event_verification',
        eventName: 'Conferencia de Tecnología 2024',
        timestamp: new Date().toISOString(),
        organizer: 'EventGuard Demo'
      });
      
      onQRScanned({ type: 'qr', data: demoQRData });
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Solicitando permiso para la cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>
          Se necesita acceso a la cámara para escanear códigos QR
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Simulador de cámara */}
      <View style={styles.cameraSimulator}>
        <View style={styles.scannerFrame}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
        
        <View style={styles.demoSection}>
          <Text style={styles.demoText}>
            ⚠️ Módulo de cámara no disponible{'\n'}
            Usando simulador de QR
          </Text>
          
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={handleDemoQR}
            disabled={scanned}
          >
            <Ionicons name="qr-code" size={24} color="white" />
            <Text style={styles.demoButtonText}>
              Escanear QR de Demo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  cameraSimulator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#4361EE',
    borderRadius: 12,
    position: 'relative',
    marginBottom: 40,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4361EE',
    width: 30,
    height: 30,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4361EE',
    width: 30,
    height: 30,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4361EE',
    width: 30,
    height: 30,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4361EE',
    width: 30,
    height: 30,
  },
  demoSection: {
    alignItems: 'center',
  },
  demoText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4361EE',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  errorMessage: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 20,
    padding: 20,
    fontSize: 16,
  },
});

export default QRScanner;