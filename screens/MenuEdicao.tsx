import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type MenuEdicaoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MenuEdicao'>;

type Props = {
  navigation: MenuEdicaoNavigationProp;
};

const MenuEdicao: React.FC<Props> = ({ navigation }) => {
  const tabelas = [
    { label: 'Pessoal', target: '' },
    { label: 'Telefones', target: '' },
    { label: 'Canais de Rádio', target: '' },
    { label: 'Instrumentos', target: '' },
    { label: 'Válvulas de Controle', target: '' },
    { label: 'Válvulas de Segurança', target: '' },
    { label: 'Emergências', target: '' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edição de Dados</Text>

      {tabelas.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, styles.yellowButton]}
          onPress={() => console.log(`Abrir CRUD de ${item.label}`)}
        >
          <Text style={styles.buttonText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#dff0df',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  yellowButton: {
    backgroundColor: '#fdd835', // amarelo Petrobras
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenuEdicao;
