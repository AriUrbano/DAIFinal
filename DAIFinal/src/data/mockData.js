// Datos de ejemplo para la demostración
export const mockEvents = [
    {
      id: '1',
      title: 'Conferencia de Tecnología 2024',
      description: 'La conferencia más importante de tecnología e innovación del año. Reúne a los mejores expertos del sector.',
      location: 'Centro de Convenciones Principal',
      date: '2024-03-15',
      time: '09:00 - 18:00',
      latitude: -34.6037,
      longitude: -58.3816,
      verified: true,
      organizer: 'TechCorp',
      category: 'Tecnología',
      capacity: 500,
      price: 0,
    },
    {
      id: '2',
      title: 'Festival de Música Indie',
      description: 'Disfruta de las mejores bandas independientes en un festival al aire libre con comida y bebidas.',
      location: 'Parque Central',
      date: '2024-03-20',
      time: '16:00 - 23:00',
      latitude: -34.6118,
      longitude: -58.4173,
      verified: true,
      organizer: 'MusicLive',
      category: 'Música',
      capacity: 2000,
      price: 25,
    },
    {
      id: '3',
      title: 'Workshop de React Native',
      description: 'Aprende React Native desde cero con expertos. Trae tu laptop y construye tu primera app móvil.',
      location: 'Coworking TechHub',
      date: '2024-03-25',
      time: '10:00 - 14:00',
      latitude: -34.5955,
      longitude: -58.3950,
      verified: false,
      organizer: 'DevCommunity',
      category: 'Educación',
      capacity: 50,
      price: 10,
    },
    {
      id: '4',
      title: 'Feria de Emprendedores',
      description: 'Conoce proyectos innovadores y conecta con emprendedores. Oportunidades de networking y inversión.',
      location: 'Palacio de Exposiciones',
      date: '2024-04-05',
      time: '11:00 - 20:00',
      latitude: -34.6083,
      longitude: -58.3712,
      verified: true,
      organizer: 'StartupNetwork',
      category: 'Negocios',
      capacity: 300,
      price: 0,
    },
    {
      id: '5',
      title: 'Maratón Ciudad 2024',
      description: 'Participa en la maratón anual de la ciudad. Distancias de 5k, 10k y 21k. Inscripción previa requerida.',
      location: 'Plaza Mayor',
      date: '2024-04-10',
      time: '07:00 - 12:00',
      latitude: -34.6100,
      longitude: -58.3800,
      verified: true,
      organizer: 'RunCity',
      category: 'Deportes',
      capacity: 5000,
      price: 15,
    },
  ];
  
  export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };
  
  // Generar datos QR de demostración
  export const generateDemoQRData = (eventId = 'demo-123') => {
    const event = mockEvents.find(e => e.id === eventId) || mockEvents[0];
    
    return JSON.stringify({
      eventId: event.id,
      type: 'event_verification',
      eventName: event.title,
      timestamp: new Date().toISOString(),
      organizer: event.organizer,
      location: event.location,
      version: '1.0.0'
    });
  };