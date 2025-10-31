import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componentes
import QRScanner from '../components/event/QRScanner';

// Servicios
import { vibrateSuccess, vibrateError } from '../services/vibration';
import { sendVerificationNotification } from '../services/notifications';

export default function ScannerScreen() {
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Solicitar permisos al montar el componente
    return () => {
      // Cleanup si es necesario
    };
  }, []);

  const handleQRScanned = ({ data }) => {
    setScanned(true);
    
    try {
      // Simular procesamiento del QR
      const parsedData = JSON.parse(data);
      
      // Validar estructura del QR
      if (parsedData.eventId && parsedData.type === 'event_verification') {
        vibrateSuccess();
        setResult({
          success: true,
          message: 'Evento verificado exitosamente',
          event: parsedData,
        });
        
        // Enviar notificación de éxito
        sendVerificationNotification(true, parsedData.eventName);
      } else {
        throw new Error('QR inválido');
      }
    } catch (error) {
      vibrateError();
      setResult({
        success: false,
        message: 'Código QR inválido o corrupto',
      });
      
      // Enviar notificación de error
      sendVerificationNotification(false);
    }
    
    setModalVisible(true);
  };

  const handleScanAgain = () => {
    setScanned(false);
    setResult(null);
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // Mantener scanned en true para evitar re-escaneo automático
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="qr-code" size={24} color="#4361EE" />
        <Text style={styles.title}>Escanear Código QR</Text>
      </View>
      
      <Text style={styles.instructions}>
        Apunte la cámara al código QR del evento para verificar su autenticidad
      </Text>

      <View style={styles.scannerContainer}>
        <QRScanner
          onQRScanned={handleQRScanned}
          scanned={scanned}
        />
      </View>

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Consejos:</Text>
        <Text style={styles.tip}>• Asegure buena iluminación</Text>
        <Text style={styles.tip}>• Mantenga estable el dispositivo</Text>
        <Text style={styles.tip}>• Acerque gradualmente la cámara</Text>
      </View>

      {/* Modal de Resultado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalContent,
            result?.success ? styles.successModal : styles.errorModal
          ]}>
            <Ionicons 
              name={result?.success ? "checkmark-circle" : "close-circle"} 
              size={60} 
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
                <Text style={styles.eventId}>ID: {result.event.eventId}</Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleScanAgain}
              >
                <Text style={styles.buttonText}>Escanear Otro</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
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
    marginBottom: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#343A40',
  },
  instructions: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  scannerContainer: {
    flex: 1,
    minHeight: 300,
    marginBottom: 20,
  },
  tips: {
    backgroundColor: '#E7F3FF',
    padding: 16,
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4361EE',
    marginBottom: 8,
  },
  tip: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  modalContainer: {
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
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
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
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
    textAlign: 'center',
  },
  eventId: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#4361EE',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6C757D',
  },
  buttonText: {
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