import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type U1820ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'U1820'>;

type Props = {
  navigation: U1820ScreenNavigationProp;
};

const U1820: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Imagem topo */}
      <Image
        source={require('../assets/images/u1820.jpg')} // adicione a imagem correspondente em assets
        style={styles.image}
        resizeMode="contain"
      />

      {/* Botões */}
      <TouchableOpacity
        style={[styles.button, styles.greenButton]}
        onPress={() => navigation.navigate('Instrumentos')}
      >
        <Text style={styles.buttonText}>Instrumentos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.blueButton]}
        onPress={() => navigation.navigate('ValvulasControle')}
      >
        <Text style={styles.buttonText}>Válvulas de Controle</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.yellowButton]}
        onPress={() => navigation.navigate('ValvulasSeguranca')}
      >
        <Text style={styles.buttonText}>Válvulas de Segurança</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#a5d6a7',
  },
  image: {
    width: '100%',
    height: 350,    // altura fixa (ajuste como preferir)
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  greenButton: {
    backgroundColor: '#3cb371',
  },
  blueButton: {
    backgroundColor: '#1565c0',
  },
  yellowButton: {
    backgroundColor: '#fbc02d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default U1820;
