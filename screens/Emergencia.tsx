import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Emergencia: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Emergência</Text>
      <Text>Aqui vão os dados da Emergência.</Text>
    </View>
  );
};

export default Emergencia;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a5d6a7',
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});
