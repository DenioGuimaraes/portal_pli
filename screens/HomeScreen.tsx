import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

// Tipagem da navegação
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      {/* Imagem no topo */}
      <Image
        source={require('../assets/images/arco.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Título */}
      <Text style={styles.title}>Bem-vindo ao Portal PL-I</Text>

      {/* Botões */}
      <TouchableOpacity
        style={[styles.button, styles.greenButton]}
        onPress={() => navigation.navigate('Administrativo')}
      >
        <Text style={styles.buttonText}>Administrativo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.blueButton]}
        onPress={() => navigation.navigate('U1820')}
      >
        <Text style={styles.buttonText}>U-1820</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.redButton]}
        onPress={() => navigation.navigate('Emergencia')}
      >
        <Text style={styles.buttonText}>Emergência</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.yellowButton]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Alterar Dados</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a5d6a7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '100%',
    height: 350,    // altura fixa (ajuste como preferir)
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#004d40', // verde escuro Petrobras
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  greenButton: {
    backgroundColor: '#006341', // verde Petrobras
  },
  yellowButton: {
    backgroundColor: 'darkorange', // amarelo Petrobras
  },
  blueButton:{
    backgroundColor: '#004C6D', // amarelo Petrobras
  },
  redButton: {
    backgroundColor: '#d62828', // vermelho para destaque emergencial
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
