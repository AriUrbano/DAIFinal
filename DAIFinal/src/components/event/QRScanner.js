// src/components/event/QRScanner.js
import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const scannerSize = width * 0.7;

const QRScanner = ({ onQRScanned, scanned }) => {
  const [lastAction, setLastAction] = useState(null);

 // En QRScanner.js - función handleValidQRScan
const handleValidQRScan = () => {
  if (scanned) return;
  
  console.log('✅ Simulando QR válido');
  setLastAction('valid');
  
  // ✅ DATOS QUE COINCIDEN CON LA VALIDACIÓN
  const qrData = {
    eventId: "event-" + Date.now(),
    type: "event_verification", 
    eventName: "Conferencia Tech 2024",
    organizer: "Tech Events Inc.",
    timestamp: new Date().toISOString()
  };
  
  const jsonData = JSON.stringify(qrData);
  console.log('📤 JSON a enviar:', jsonData);
  
  if (onQRScanned && typeof onQRScanned === 'function') {
    onQRScanned({
      type: 'qr',
      data: jsonData
    });
  }
};
  const handleInvalidQRScan = () => {
    if (scanned) return;
    
    console.log('❌ Simulando QR inválido');
    setLastAction('invalid');
    
    if (onQRScanned && typeof onQRScanned === 'function') {
      onQRScanned({
        type: 'qr', 
        data: 'invalid_qr_data'
      });
    }
  };

  // ✅ FUNCIÓN HANDLE RESET QUE FALTABA
  const handleReset = () => {
    setLastAction(null);
    if (onQRScanned && typeof onQRScanned === 'function') {
      onQRScanned({ type: 'reset', data: '' });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      {/* SECCIÓN 1: SIMULADOR DE CÁMARA */}
      <View style={styles.cameraSection}>
        <Text style={styles.sectionTitle}>Simulador de Cámara QR</Text>
        
        <View style={styles.cameraPlaceholder}>
          <View style={styles.scannerArea}>
            <View style={styles.scannerFrame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
              <View style={styles.scanLine} />
            </View>
          </View>
          
          <Ionicons name="qr-code-outline" size={60} color="#4361EE" style={styles.qrIcon} />
          
          {/* INDICADOR DE ÚLTIMA ACCIÓN */}
          {lastAction && (
            <View style={[
              styles.actionIndicator,
              lastAction === 'valid' ? styles.validAction : styles.invalidAction
            ]}>
              <Ionicons 
                name={lastAction === 'valid' ? "checkmark" : "close"} 
                size={16} 
                color="white" 
              />
              <Text style={styles.actionText}>
                {lastAction === 'valid' ? 'QR Válido Simulado' : 'QR Inválido Simulado'}
              </Text>
            </View>
          )}
          
          <Text style={styles.placeholderTitle}>
            {scanned ? 'Escaneo Completado' : 'Modo Simulación'}
          </Text>
          <Text style={styles.placeholderText}>
            {scanned 
              ? 'Ver resultado en el modal' 
              : 'Use los botones para simular escaneos'
            }
          </Text>
        </View>
      </View>

      {/* SECCIÓN 2: BOTONES DE SIMULACIÓN */}
      <View style={styles.buttonsSection}>
        <Text style={styles.sectionTitle}>Acciones de Prueba</Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.validButton, scanned && styles.buttonDisabled]}
            onPress={handleValidQRScan}
            disabled={scanned}
          >
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Simular QR Válido</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.invalidButton, scanned && styles.buttonDisabled]}
            onPress={handleInvalidQRScan}
            disabled={scanned}
          >
            <Ionicons name="close-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Simular QR Inválido</Text>
          </TouchableOpacity>
        </View>

        {/* BOTÓN DE RESET */}
        {scanned && (
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={20} color="#4361EE" />
            <Text style={styles.resetButtonText}>Reiniciar Simulación</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* SECCIÓN 3: ESTADO DEL ESCÁNER */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Estado</Text>
        
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
      </View>

      {/* SECCIÓN 4: CONSEJOS */}
      <View style={styles.helpSection}>
        <Text style={styles.sectionTitle}>Consejos para Escaneo Real</Text>
        
        <View style={styles.helpContainer}>
          <View style={styles.tipItem}>
            <Ionicons name="sunny-outline" size={20} color="#FFD166" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Buena Iluminación</Text>
              <Text style={styles.tipText}>Asegúrate de tener suficiente luz para un escaneo rápido</Text>
            </View>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="hand-right-outline" size={20} color="#4361EE" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Mantén Estable</Text>
              <Text style={styles.tipText}>Sostén el dispositivo firme para evitar movimientos bruscos</Text>
            </View>
          </View>
          
          <View style={styles.tipItem}>
            <Ionicons name="move-outline" size={20} color="#06D6A0" />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Acerca Gradualmente</Text>
              <Text style={styles.tipText}>Acerca la cámara al código QR de forma progresiva</Text>
            </View>
          </View>
        </View>
      </View>

    </ScrollView>
  );
};

// ESTILOS (usa el CSS completo que te di antes)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
    marginBottom: 16,
    textAlign: 'center',
  },
  cameraSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  cameraPlaceholder: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  scannerArea: {
    width: scannerSize,
    height: scannerSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 10,
  },
  scannerFrame: {
    width: scannerSize - 30,
    height: scannerSize - 30,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    backgroundColor: 'rgba(67, 97, 238, 0.15)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4361EE',
    width: 35,
    height: 35,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#4361EE',
    width: 35,
    height: 35,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4361EE',
    width: 35,
    height: 35,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#4361EE',
    width: 35,
    height: 35,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    top: '30%',
    width: '100%',
    height: 3,
    backgroundColor: '#4361EE',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 10,
  },
  qrIcon: {
    marginBottom: 15,
    opacity: 0.8,
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 15,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  validAction: {
    backgroundColor: '#06D6A0',
  },
  invalidAction: {
    backgroundColor: '#FF6B6B',
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  placeholderTitle: {
    color: '#343A40',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderText: {
    color: '#6C757D',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 56,
  },
  validButton: {
    backgroundColor: '#06D6A0',
  },
  invalidButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.05,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4361EE',
    paddingVertical: 14,
  },
  resetButtonText: {
    color: '#4361EE',
    fontSize: 15,
    fontWeight: '700',
  },
  statusSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusText: {
    color: '#4361EE',
    fontSize: 17,
    fontWeight: '700',
  },
  statusScanned: {
    color: '#06D6A0',
  },
  instruction: {
    color: '#6C757D',
    fontSize: 14,
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    paddingHorizontal: 10,
  },
  helpSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  helpContainer: {
    gap: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4361EE',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343A40',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
});

export default QRScanner;