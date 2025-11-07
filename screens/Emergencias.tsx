import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import db, { createTables } from '../src/database';

type Emergencia = {
  id: number;
  titulo: string;
  passos: string;
};

const Emergencias: React.FC = () => {
  const [emergencias, setEmergencias] = useState<Emergencia[]>([]);
  const [emergenciaSelecionada, setEmergenciaSelecionada] = useState<Emergencia | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    createTables();
    carregarEmergencias();
  }, []);

  const carregarEmergencias = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM emergencias ORDER BY titulo ASC;',
        [],
        (_, result) => {
          const rows: Emergencia[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i));
          }
          setEmergencias(rows);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar emergências:', error);
          return false;
        },
      );
    });
  };

  const abrirDetalhes = (item: Emergencia) => {
    setEmergenciaSelecionada(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Procedimentos de Emergência</Text>

      <FlatList
        data={emergencias}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => abrirDetalhes(item)}
          >
            <Text style={styles.itemTitulo}>{item.titulo}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Modal com detalhes */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {emergenciaSelecionada && (
              <>
                <Text style={styles.modalTitle}>
                  {emergenciaSelecionada.titulo}
                </Text>
                <ScrollView style={styles.scrollArea}>
                  <Text style={styles.modalText}>
                    {emergenciaSelecionada.passos}
                  </Text>
                </ScrollView>
              </>
            )}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Emergencias;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffcdd2', // 🔴 vermelho claro
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#b71c1c', // 🔴 vermelho escuro
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  itemTitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#d32f2f', // 🔴 vermelho médio
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#b71c1c', // 🔴 vermelho escuro
  },
  scrollArea: {
    maxHeight: 350,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
  },
  closeButton: {
    alignSelf: 'center',
    backgroundColor: '#b71c1c', // 🔴 vermelho escuro
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
