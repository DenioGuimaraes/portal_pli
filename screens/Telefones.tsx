import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import db, { createTables } from '../src/database';

type Telefone = {
  id: number;
  setor: string;
  descricao: string;
  ramal: string;
};

const Telefones: React.FC = () => {
  const [telefones, setTelefones] = useState<Telefone[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [telefoneSelecionado, setTelefoneSelecionado] = useState<Telefone | null>(null);

  useEffect(() => {
    createTables();
    carregarTelefones();
  }, []);

  const carregarTelefones = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM telefones;',
        [],
        (_, result) => {
          const rows: Telefone[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i));
          }
          setTelefones(rows);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar telefones:', error);
          return false;
        }
      );
    });
  };

  // 🔹 Agrupa telefones por setor
  const agruparPorSetor = (lista: Telefone[]) => {
    const setores: { [key: string]: Telefone[] } = {};
    lista.forEach((tel) => {
      if (!setores[tel.setor]) {
        setores[tel.setor] = [];
      }
      setores[tel.setor].push(tel);
    });
    return setores;
  };

  const setores = agruparPorSetor(telefones);

  const abrirDetalhes = (tel: Telefone) => {
    setTelefoneSelecionado(tel);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista Telefônica</Text>

      <FlatList
        data={Object.keys(setores)}
        keyExtractor={(setor) => setor}
        renderItem={({ item: setor }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{setor}</Text>
            {setores[setor].map((tel) => (
              <TouchableOpacity key={tel.id} onPress={() => abrirDetalhes(tel)}>
                <Text style={styles.item}>{tel.descricao}</Text>
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
            <Text style={styles.modalTitle}>Detalhes do Ramal</Text>
            {telefoneSelecionado && (
              <>
                <Text style={styles.modalText}>Descrição: {telefoneSelecionado.descricao}</Text>
                <Text style={styles.modalText}>Setor: {telefoneSelecionado.setor}</Text>
                <Text style={styles.modalText}>Ramal: {telefoneSelecionado.ramal}</Text>
              </>
            )}

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 🔹 Estilos iguais à tela de Pessoal
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

export default Telefones;
