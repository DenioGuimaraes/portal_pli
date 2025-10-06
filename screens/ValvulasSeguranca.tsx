import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import db, { createTables } from '../src/database';

type PSV = {
  id: number;
  nome: string;
  descricao: string;
};

const ValvulasSeguranca: React.FC = () => {
  const [valvulas, setValvulas] = useState<PSV[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [valvulaSelecionada, setValvulaSelecionada] = useState<PSV | null>(null);

  useEffect(() => {
    createTables();
    carregarValvulas();
  }, []);

  const carregarValvulas = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM valvulas_seguranca ORDER BY nome ASC;',
        [],
        (_, result) => {
          const rows: PSV[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i));
          }
          setValvulas(rows);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar válvulas de segurança:', error);
          return false;
        },
      );
    });
  };

  const abrirDetalhes = (v: PSV) => {
    setValvulaSelecionada(v);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Válvulas de Segurança (PSV)</Text>

      <FlatList
        data={valvulas}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => abrirDetalhes(item)}
          >
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemDescricao}>{item.descricao}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 🔹 Modal de detalhes */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes da Válvula</Text>
            {valvulaSelecionada && (
              <>
                <Text style={styles.modalText}>
                  TAG: {valvulaSelecionada.nome}
                </Text>
                <Text style={styles.modalText}>
                  Descrição: {valvulaSelecionada.descricao}
                </Text>
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

export default ValvulasSeguranca;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a5d6a7',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2e7d32',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565c0',
  },
  itemDescricao: {
    fontSize: 15,
    color: '#333',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2e7d32',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#2e7d32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
