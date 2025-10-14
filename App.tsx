import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createTables, getPessoal } from './src/database';

// Import das telas
import HomeScreen from './screens/HomeScreen';
import Administrativo from './screens/Administrativo';
import U1820 from './screens/U1820';
import Emergencia from './screens/Emergencias';
import LoginScreen from './screens/LoginScreen';
import MenuEdicao from './screens/MenuEdicao';
import Instrumentos from './screens/Instrumentos';
import ValvulasControle from './screens/ValvulasControle';
import ValvulasSeguranca from './screens/ValvulasSeguranca';
import Pessoal from './screens/Pessoal';
import Telefones from './screens/Telefones';
import Radios from './screens/Radios';
import EditPessoal from './screens/EditarPessoal';
import EditTelefones from './screens/EditarTelefones';
import EditRadios from './screens/EditarRadios';
import EditInstrumentos from './screens/EditarInstrumentos';
import EditValvulas from './screens/EditarValvulas';
import EditValvulasSeguranca from './screens/EditarValvulasSeguranca';
import EditEmergencias from './screens/EditarEmergencias';

// Tipagem do Stack
export type RootStackParamList = {
  Home: undefined;
  Administrativo: undefined;
  U1820: undefined;
  Emergencia: undefined;
  Login: undefined; // novo
  MenuEdicao: undefined; // novo
  Instrumentos: undefined;
  ValvulasControle: undefined;
  ValvulasSeguranca: undefined;
  Pessoal: undefined;
  Telefones: undefined;
  Radios: undefined;
  EditPessoal: undefined;
  EditTelefones: undefined; // novo
  EditRadios: undefined; // novo
  EditInstrumentos: undefined; // novo
  EditValvulas: undefined; // novo
  EditValvulasSeguranca: undefined; // novo
  EditEmergencias: undefined; // novo
  Emergencias: undefined; // novo
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 🎨 Tema Petrobras
const petrobrasTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#dff0df', // verde claro Petrobras
  },
};

const App: React.FC = () => {
  useEffect(() => {
    // cria as tabelas do banco ao iniciar o app
    createTables();

    // limpando o banco de dados
    //clearPessoal();

    //inserindo dados de pessoas
    //seedPessoal();

    // Listando dados
    getPessoal();
  }, []);

  return (
    <NavigationContainer theme={petrobrasTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#3cb371' }, // cabeçalho verde
          headerTintColor: '#fff', // texto/branco
          headerTitleStyle: { fontWeight: 'bold' }, // título negrito
          headerTitleAlign: 'center', // centraliza título
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Tela Inicial' }}
        />
        <Stack.Screen
          name="Administrativo"
          component={Administrativo}
          options={{ title: 'Administrativo' }}
        />
        <Stack.Screen
          name="U1820"
          component={U1820}
          options={{ title: 'U-1820' }}
        />
        <Stack.Screen
          name="Emergencia"
          component={Emergencia}
          options={{
            title: 'Emergências',
            headerStyle: { backgroundColor: '#b71c1c' }, // 🔴 fundo vermelho escuro
            headerTintColor: '#fff', // 🔤 texto branco
            headerTitleStyle: { fontWeight: 'bold' }, // negrito no título
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />
        <Stack.Screen
          name="MenuEdicao"
          component={MenuEdicao}
          options={{ title: 'Edição de Dados' }}
        />
        <Stack.Screen
          name="Pessoal"
          component={Pessoal}
          options={{ title: 'Pessoal' }}
        />
        <Stack.Screen
          name="Telefones"
          component={Telefones}
          options={{ title: 'Telefones' }}
        />
        <Stack.Screen
          name="Radios"
          component={Radios}
          options={{ title: 'Canais de Rádio' }}
        />

        <Stack.Screen
          name="Instrumentos"
          component={Instrumentos}
          options={{ title: 'Instrumentos - U-1820' }}
        />
        <Stack.Screen
          name="ValvulasControle"
          component={ValvulasControle}
          options={{ title: 'Válvulas de Controle - U-1820' }}
        />
        <Stack.Screen
          name="ValvulasSeguranca"
          component={ValvulasSeguranca}
          options={{ title: 'Válvulas de Segurança - U-1820' }}
        />
        <Stack.Screen
          name="Emergencias"
          component={Emergencia}
          options={{ title: 'Procedimentos de Emergência' }}
        />
        <Stack.Screen
          name="EditPessoal"
          component={EditPessoal}
          options={{ title: 'Editar Pessoal' }}
        />
        <Stack.Screen
          name="EditTelefones"
          component={EditTelefones}
          options={{ title: 'Editar Telefones' }}
        />
        <Stack.Screen
          name="EditRadios"
          component={EditRadios}
          options={{ title: 'Editar Canais de Rádio' }}
        />
        <Stack.Screen
          name="EditInstrumentos"
          component={EditInstrumentos}
          options={{ title: 'Editar Instrumentos' }}
        />
        <Stack.Screen
          name="EditValvulas"
          component={EditValvulas}
          options={{ title: 'Editar Válvulas de Controle' }}
        />
        <Stack.Screen
          name="EditValvulasSeguranca"
          component={EditValvulasSeguranca}
          options={{ title: 'Editar Válvulas de Segurança' }}
        />
        <Stack.Screen
          name="EditEmergencias"
          component={EditEmergencias}
          options={{ title: 'Editar Emergências' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
