import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable } from 'react-native';
import db, { createTables } from '../src/database';  // ajuste o caminho conforme sua estrutura

type Operador = {
  id: number;
  grupo: string;
  nome: string;
  matricula: string;
};

const Pessoal: React.FC = () => {
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [operadorSelecionado, setOperadorSelecionado] = useState<Operador | null>(null);

  // 🔹 Carrega os dados do banco ao abrir a tela
  useEffect(() => {
    createTables();
    carregarPessoal();
  }, []);

  const carregarPessoal = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pessoal;',
        [],
        (_, result) => {
          const rows: Operador[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i));
          }
          setOperadores(rows);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar pessoal:', error);
          return false;
        }
      );
    });
  };

  // 🔹 Agrupa operadores por grupo (A, B, ...)
  const agruparPorGrupo = (lista: Operador[]) => {
    const grupos: { [key: string]: Operador[] } = {};
    lista.forEach((op) => {
      if (!grupos[op.grupo]) {
        grupos[op.grupo] = [];
      }
      grupos[op.grupo].push(op);
    });
    return grupos;
  };

  const grupos = agruparPorGrupo(operadores);

  const abrirDetalhes = (op: Operador) => {
    setOperadorSelecionado(op);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Operadores por Grupo</Text>

      <FlatList
        data={Object.keys(grupos)}
        keyExtractor={(grupo) => grupo}
        renderItem={({ item: grupo }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Grupo {grupo}</Text>
            {grupos[grupo].map((op) => (
              <TouchableOpacity key={op.id} onPress={() => abrirDetalhes(op)}>
                <Text style={styles.item}>{op.nome}</Text>
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
            <Text style={styles.modalTitle}>Detalhes do Operador</Text>
            {operadorSelecionado && (
              <>
                <Text style={styles.modalText}>Nome: {operadorSelecionado.nome}</Text>
                <Text style={styles.modalText}>Grupo: {operadorSelecionado.grupo}</Text>
                <Text style={styles.modalText}>Matrícula: {operadorSelecionado.matricula}</Text>
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

export default Pessoal;
