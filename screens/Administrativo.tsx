import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type AdministrativoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Administrativo'>;

type Props = {
  navigation: AdministrativoScreenNavigationProp;
};

const Administrativo: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Imagem topo */}
      <Image
        source={require('../assets/images/admin.jpg')} // coloque sua imagem em assets
        style={styles.image}
        resizeMode="contain"
      />

      {/* Botões */}
      <TouchableOpacity
        style={[styles.button, styles.greenButton]}
        onPress={() => navigation.navigate('Pessoal')}
      >
        <Text style={styles.buttonText}>Pessoal</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.blueButton]}
        onPress={() => navigation.navigate('Telefones')}
      >
        <Text style={styles.buttonText}>Telefones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.yellowButton]}
        onPress={() => navigation.navigate('Radios')}
      >
        <Text style={styles.buttonText}>Canais de Rádio</Text>
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
    backgroundColor: 'darkorange',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Administrativo;
