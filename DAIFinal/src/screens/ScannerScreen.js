// src/screens/ScannerScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componentes
import QRScanner from '../components/event/QRScanner';

// Servicios simulados
const vibrate = (type = 'light') => {
  console.log(`📳 Vibración: ${type}`);
};

const sendVerificationNotification = (success, eventName) => {
  console.log(`📢 Notificación: ${success ? 'Éxito' : 'Error'} - ${eventName || 'Evento'}`);
};

const ScannerScreen = () => {
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    console.log('📱 ScannerScreen montado');
    return () => {
      console.log('📱 ScannerScreen desmontado');
    };
  }, []);

  const handleQRScanned = (scanResult) => {
    console.log('🔍 QR recibido en ScannerScreen:', scanResult);
    
    // Verificación de seguridad
    if (!scanResult) {
      console.error('❌ ScanResult es undefined');
      showErrorResult('No se recibieron datos del escáner');
      return;
    }
    
    if (typeof scanResult !== 'object') {
      console.error('❌ ScanResult no es un objeto:', typeof scanResult);
      showErrorResult('Formato de datos inválido');
      return;
    }
    
    if (!scanResult.type || !scanResult.data) {
      console.error('❌ ScanResult falta propiedades:', scanResult);
      showErrorResult('Estructura de QR incorrecta');
      return;
    }

    setScanned(true);
    
    try {
      // Procesar datos del QR
      if (scanResult.data === 'invalid_qr_data') {
        throw new Error('Código QR no válido para EventGuard');
      }

      const parsedData = JSON.parse(scanResult.data);
      console.log('📋 Datos parseados:', parsedData);
      
      // Validar estructura del QR
      if (parsedData.eventId && parsedData.type === 'event_verification') {
        showSuccessResult(parsedData);
        
        // Agregar al historial
        setScanHistory(prev => [{
          id: Date.now(),
          success: true,
          eventName: parsedData.eventName,
          timestamp: new Date().toLocaleTimeString(),
          eventId: parsedData.eventId
        }, ...prev.slice(0, 4)]); // Mantener solo los últimos 5
      } else {
        throw new Error('Estructura de QR no reconocida');
      }
    } catch (error) {
      console.error('❌ Error procesando QR:', error);
      showErrorResult(error.message);
      
      // Agregar error al historial
      setScanHistory(prev => [{
        id: Date.now(),
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)]);
    }
  };

  const showSuccessResult = (eventData) => {
    vibrate('success');
    setResult({
      success: true,
      message: '✅ Evento verificado exitosamente',
      event: eventData,
    });
    
    sendVerificationNotification(true, eventData.eventName);
    setModalVisible(true);
  };

  const showErrorResult = (errorMessage) => {
    vibrate('error');
    setResult({
      success: false,
      message: '❌ ' + errorMessage,
      error: errorMessage,
    });
    
    sendVerificationNotification(false);
    setModalVisible(true);
  };

  const handleScanAgain = () => {
    console.log('🔄 Reiniciando escáner...');
    setScanned(false);
    setResult(null);
    setModalVisible(false);
    vibrate('light');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    vibrate('light');
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4361EE" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="qr-code" size={28} color="#4361EE" />
          <Text style={styles.title}>Escanear Código QR</Text>
        </View>
        <Text style={styles.subtitle}>EventGuard Verification</Text>
      </View>
      
      {/* Instrucciones */}
      <View style={styles.instructionsContainer}>
        <Ionicons name="information-circle" size={20} color="#4361EE" />
        <Text style={styles.instructions}>
          Use la interfaz de simulación para probar el escaneo de códigos QR
        </Text>
      </View>

      {/* Contenedor del Scanner */}
      <View style={styles.scannerContainer}>
        <QRScanner
          onQRScanned={handleQRScanned}
          scanned={scanned}
        />
      </View>

      {/* Historial de escaneos */}
      {scanHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Historial Reciente</Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearButton}>Limpiar</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.historyList}>
            {scanHistory.map((item) => (
              <View key={item.id} style={[
                styles.historyItem,
                item.success ? styles.historySuccess : styles.historyError
              ]}>
                <Ionicons 
                  name={item.success ? "checkmark-circle" : "close-circle"} 
                  size={16} 
                  color={item.success ? "#06D6A0" : "#FF6B6B"} 
                />
                <View style={styles.historyContent}>
                  <Text style={styles.historyEvent}>
                    {item.success ? item.eventName : 'Error de verificación'}
                  </Text>
                  <Text style={styles.historyTime}>{item.timestamp}</Text>
                </View>
                {item.success && (
                  <Text style={styles.historyId}>{item.eventId}</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Modal de Resultado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            result?.success ? styles.successModal : styles.errorModal
          ]}>
            <Ionicons 
              name={result?.success ? "checkmark-circle" : "close-circle"} 
              size={80} 
              color={result?.success ? "#06D6A0" : "#FF6B6B"} 
            />
            
            <Text style={styles.modalTitle}>
              {result?.success ? '¡Verificación Exitosa!' : 'Error de Verificación'}
            </Text>
            
            <Text style={styles.modalMessage}>
              {result?.message}
            </Text>

            {result?.success && result?.event && (
              <View style={styles.eventInfo}>
                <Text style={styles.eventName}>{result.event.eventName}</Text>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventDetail}>ID: {result.event.eventId}</Text>
                  <Text style={styles.eventDetail}>Organizador: {result.event.organizer}</Text>
                  <Text style={styles.eventDetail}>
                    Hora: {new Date(result.event.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleScanAgain}
              >
                <Ionicons name="scan" size={20} color="white" />
                <Text style={styles.primaryButtonText}>Escanear Otro QR</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleCloseModal}
              >
                <Text style={styles.secondaryButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#343A40',
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 40,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E7F3FF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    gap: 10,
  },
  instructions: {
    flex: 1,
    fontSize: 14,
    color: '#4361EE',
    lineHeight: 20,
  },
  scannerContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  historyContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    maxHeight: 200,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343A40',
  },
  clearButton: {
    fontSize: 14,
    color: '#4361EE',
    fontWeight: '500',
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    gap: 10,
  },
  historySuccess: {
    backgroundColor: 'rgba(6, 214, 160, 0.1)',
  },
  historyError: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  historyContent: {
    flex: 1,
  },
  historyEvent: {
    fontSize: 14,
    fontWeight: '500',
    color: '#343A40',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  historyId: {
    fontSize: 10,
    color: '#6C757D',
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
  },
  successModal: {
    borderLeftWidth: 6,
    borderLeftColor: '#06D6A0',
  },
  errorModal: {
    borderLeftWidth: 6,
    borderLeftColor: '#FF6B6B',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#343A40',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    color: '#6C757D',
  },
  eventInfo: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4361EE',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
    textAlign: 'center',
    marginBottom: 8,
  },
  eventDetails: {
    gap: 4,
  },
  eventDetail: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#4361EE',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6C757D',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScannerScreen;