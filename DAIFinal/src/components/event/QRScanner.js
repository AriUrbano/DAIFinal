// src/components/event/QRScanner.js
import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const scannerSize = width * 0.7;

// Servicio de vibración simulado
const vibrate = (type = 'light') => {
  console.log(`📳 Vibración simulada: ${type}`);
};

const QRScanner = ({ onQRScanned, scanned }) => {
  const handleValidQRScan = () => {
    if (scanned) return;
    
    console.log('✅ Simulando QR válido');
    vibrate('success');
    
    const qrData = {
      eventId: `event-${Date.now()}`,
      type: 'event_verification',
      eventName: 'Conferencia de Tecnología 2024',
      timestamp: new Date().toISOString(),
      organizer: 'TechCorp'
    };
    
    if (onQRScanned && typeof onQRScanned === 'function') {
      const scanResult = {
        type: 'qr',
        data: JSON.stringify(qrData)
      };
      console.log('📤 Enviando datos QR válido:', scanResult);
      onQRScanned(scanResult);
    } else {
      console.error('❌ onQRScanned no es una función válida');
    }
  };

  const handleInvalidQRScan = () => {
    if (scanned) return;
    
    console.log('❌ Simulando QR inválido');
    vibrate('error');
    
    if (onQRScanned && typeof onQRScanned === 'function') {
      const scanResult = {
        type: 'qr',
        data: 'invalid_qr_data'
      };
      console.log('📤 Enviando QR inválido:', scanResult);
      onQRScanned(scanResult);
    }
  };

  return (
    <View style={styles.container}>
      {/* Vista de cámara simulada */}
      <View style={styles.cameraPlaceholder}>
        <View style={styles.scannerArea}>
          <View style={styles.scannerFrame}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
            
            {/* Línea de escaneo animada */}
            <View style={styles.scanLine} />
          </View>
        </View>
        
        <Ionicons name="qr-code-outline" size={60} color="#4361EE" style={styles.qrIcon} />
        <Text style={styles.placeholderTitle}>Modo Simulación QR</Text>
        <Text style={styles.placeholderText}>
          Use los botones inferiores para simular el escaneo de códigos QR
        </Text>
      </View>

      {/* Botones de simulación */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.validButton]}
          onPress={handleValidQRScan}
          disabled={scanned}
        >
          <Ionicons name="checkmark-circle" size={24} color="white" />
          <Text style={styles.buttonText}>Simular QR Válido</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.invalidButton]}
          onPress={handleInvalidQRScan}
          disabled={scanned}
        >
          <Ionicons name="close-circle" size={24} color="white" />
          <Text style={styles.buttonText}>Simular QR Inválido</Text>
        </TouchableOpacity>
      </View>

      {/* Estado del escáner */}
      <View style={styles.statusContainer}>
        <View style={styles.statusIndicator}>
          <Ionicons 
            name={scanned ? "checkmark-done-circle" : "scan-circle"} 
            size={28} 
            color={scanned ? "#06D6A0" : "#4361EE"} 
          />
          <Text style={[
            styles.statusText,
            scanned && styles.statusScanned
          ]}>
            {scanned ? 'QR Escaneado ✓' : 'Listo para escanear'}
          </Text>
        </View>
        
        {scanned && (
          <Text style={styles.instruction}>
            Toque "Escanear Otro" en el modal para continuar
          </Text>
        )}
      </View>

      {/* Información de ayuda */}
      <View style={styles.helpContainer}>
        <Text style={styles.helpTitle}>Consejos para escaneo real:</Text>
        <View style={styles.tipItem}>
          <Ionicons name="sunny-outline" size={16} color="#FFD166" />
          <Text style={styles.tipText}>Buena iluminación</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="hand-right-outline" size={16} color="#4361EE" />
          <Text style={styles.tipText}>Mantenga estable el dispositivo</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="move-outline" size={16} color="#06D6A0" />
          <Text style={styles.tipText}>Acerque gradualmente la cámara</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 20,
  },
  scannerArea: {
    width: scannerSize,
    height: scannerSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scannerFrame: {
    width: scannerSize - 20,
    height: scannerSize - 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4361EE',
    width: 30,
    height: 30,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4361EE',
    width: 30,
    height: 30,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4361EE',
    width: 30,
    height: 30,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4361EE',
    width: 30,
    height: 30,
  },
  scanLine: {
    position: 'absolute',
    top: '30%',
    width: '100%',
    height: 2,
    backgroundColor: '#4361EE',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  qrIcon: {
    marginBottom: 15,
    opacity: 0.7,
  },
  placeholderTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  placeholderText: {
    color: '#CCCCCC',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    gap: 15,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 8,
    maxWidth: 160,
  },
  validButton: {
    backgroundColor: '#06D6A0',
  },
  invalidButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusContainer: {
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    color: '#4361EE',
    fontSize: 16,
    fontWeight: '600',
  },
  statusScanned: {
    color: '#06D6A0',
  },
  instruction: {
    color: '#888888',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  helpContainer: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  helpTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'center',
    gap: 8,
  },
  tipText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
});

export default QRScanner;