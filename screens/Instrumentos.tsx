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

type Instrumento = {
  id: number;
  tipo: string;
  nome: string;
  descricao: string;
};

const Instrumentos: React.FC = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [instrumentoSelecionado, setInstrumentoSelecionado] =
    useState<Instrumento | null>(null);

  useEffect(() => {
    createTables();
    carregarInstrumentos();
  }, []);

  const carregarInstrumentos = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM instrumentos ORDER BY tipo ASC, nome ASC;',
        [],
        (_, result) => {
          const rows: Instrumento[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i));
          }
          setInstrumentos(rows);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar instrumentos:', error);
          return false;
        },
      );
    });
  };

  // 🔹 Agrupa por tipo (Temperatura, Pressão, etc.)
  const agruparPorTipo = (lista: Instrumento[]) => {
    const tipos: { [key: string]: Instrumento[] } = {};
    lista.forEach(inst => {
      if (!tipos[inst.tipo]) tipos[inst.tipo] = [];
      tipos[inst.tipo].push(inst);
    });
    return tipos;
  };

  const tipos = agruparPorTipo(instrumentos);

  const abrirDetalhes = (inst: Instrumento) => {
    setInstrumentoSelecionado(inst);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instrumentos por Tipo</Text>

      <FlatList
        data={Object.keys(tipos)}
        keyExtractor={tipo => tipo}
        renderItem={({ item: tipo }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{tipo}</Text>
            {tipos[tipo].map(inst => (
              <TouchableOpacity
                key={inst.id}
                onPress={() => abrirDetalhes(inst)}
              >
                <Text style={styles.item}>
                  {inst.nome} - {inst.descricao}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
            <Text style={styles.modalTitle}>Detalhes do Instrumento</Text>
            {instrumentoSelecionado && (
              <>
                <Text style={styles.modalText}>
                  Tipo: {instrumentoSelecionado.tipo}
                </Text>
                <Text style={styles.modalText}>
                  TAG: {instrumentoSelecionado.nome}
                </Text>
                <Text style={styles.modalText}>
                  Descrição: {instrumentoSelecionado.descricao}
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

export default Instrumentos;

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
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1565c0',
  },
  item: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
    color: '#333',
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
