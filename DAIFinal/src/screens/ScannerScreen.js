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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componentes
import QRScanner from '../components/event/QRScanner';

// Servicios simulados
import { sendVerificationNotification } from '../services/notifications';

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

  // En ScannerScreen.js - actualiza la función handleQRScanned
const handleQRScanned = (scanResult) => {
  console.log('🔍 QR recibido:', scanResult);
  
  // ✅ MANEJAR RESET
  if (scanResult.type === 'reset') {
    console.log('🔄 Reset recibido desde QRScanner');
    setScanned(false);
    setResult(null);
    setModalVisible(false);
    return;
  }
  
  if (!scanResult || !scanResult.data) {
    console.error('❌ ScanResult o data es undefined');
    return;
  }
  
  setScanned(true);
  
  // Resto del código de validación permanece igual...
  if (scanResult.data === 'invalid_qr_data') {
    console.log('❌ QR inválido detectado (SIMULADO)');
    
    Alert.alert(
      '❌ Error de Verificación',
      'El código QR escaneado no es válido',
      [{ text: 'OK' }]
    );
    
    setResult({
      success: false,
      message: 'Código QR inválido o corrupto (Simulación)'
    });
  } else {
    console.log('✅ QR válido detectado (SIMULADO)');
    
    try {
      const parsedData = JSON.parse(scanResult.data);
      console.log('📊 Datos parseados:', parsedData);
      
      const eventName = parsedData.eventName || 'Evento de Demostración';
      
      Alert.alert(
        '✅ Verificación Exitosa',
        `"${eventName}" ha sido verificado correctamente`,
        [{ text: 'OK' }]
      );
      
      setResult({
        success: true,
        message: `Evento "${eventName}" verificado exitosamente (Simulación)`,
        event: parsedData
      });
      
      setScanHistory(prev => [{
        id: Date.now().toString(),
        success: true,
        eventName: eventName,
        eventId: parsedData.eventId,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)]);
      
    } catch (error) {
      console.log('⚠️ QR no es JSON, pero es válido (SIMULADO):', scanResult.data);
      
      Alert.alert(
        '✅ Verificación Exitosa',
        '"Evento Verificado" ha sido verificado correctamente',
        [{ text: 'OK' }]
      );
      
      setResult({
        success: true,
        message: 'Código QR verificado exitosamente (Simulación)',
        event: {
          eventId: 'default-' + Date.now(),
          eventName: 'Evento Verificado',
          organizer: 'Sistema EventGuard',
          timestamp: new Date().toISOString()
        }
      });
      
      setScanHistory(prev => [{
        id: Date.now().toString(),
        success: true,
        eventName: 'Evento Verificado',
        eventId: 'default-id',
        timestamp: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)]);
    }
  }
  
  setModalVisible(true);
};

  const handleScanAgain = () => {
    console.log('🔄 Reiniciando escáner...');
    setScanned(false);
    setResult(null);
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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