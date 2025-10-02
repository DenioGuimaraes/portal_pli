import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ValvulasControle: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Válvulas de Controle - U-1820</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a5d6a7',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
});

export default ValvulasControle;
