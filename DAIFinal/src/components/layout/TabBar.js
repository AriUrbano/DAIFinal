import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TabBar = ({ state, descriptors, navigation }) => {
  const tabConfig = [
    {
      key: 'Home',
      title: 'Eventos',
      icon: 'home',
      iconFocused: 'home',
    },
    {
      key: 'Scanner', 
      title: 'Escanear',
      icon: 'qr-code-outline',
      iconFocused: 'qr-code',
    },
    {
      key: 'Map',
      title: 'Mapa',
      icon: 'map-outline', 
      iconFocused: 'map',
    },
    {
      key: 'Profile',
      title: 'Perfil',
      icon: 'person-outline',
      iconFocused: 'person',
    },
  ];

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const tab = tabConfig.find(t => t.key === route.name) || tabConfig[index];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <View style={[
              styles.tabContent,
              isFocused && styles.tabContentFocused
            ]}>
              <Ionicons
                name={isFocused ? tab.iconFocused : tab.icon}
                size={24}
                color={isFocused ? '#4361EE' : '#6C757D'}
              />
              <Text style={[
                styles.tabLabel,
                isFocused && styles.tabLabelFocused
              ]}>
                {tab.title}
              </Text>
              
              {/* Indicador de pestaña activa */}
              {isFocused && <View style={styles.activeIndicator} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    position: 'relative',
  },
  tabContentFocused: {
    backgroundColor: 'rgba(67, 97, 238, 0.1)',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#6C757D',
    fontWeight: '500',
  },
  tabLabelFocused: {
    color: '#4361EE',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4361EE',
  },
});

export default TabBar;