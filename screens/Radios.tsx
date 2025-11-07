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

type Radio = {
  id: number;
  faixa: string;
  canal: string;
  descricao: string;
};

const Radios: React.FC = () => {
  const [radios, setRadios] = useState<Radio[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [radioSelecionado, setRadioSelecionado] = useState<Radio | null>(null);

  useEffect(() => {
    createTables();
    carregarRadios();
  }, []);

  const carregarRadios = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM radios ORDER BY faixa ASC, canal ASC;',
        [],
        (_, result) => {
          const rows: Radio[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            rows.push(result.rows.item(i));
          }
          setRadios(rows);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar rádios:', error);
          return false;
        },
      );
    });
  };

  // 🔹 Agrupa por faixa (A, B, C, D)
  const agruparPorFaixa = (lista: Radio[]) => {
    const faixas: { [key: string]: Radio[] } = {};
    lista.forEach(r => {
      if (!faixas[r.faixa]) faixas[r.faixa] = [];
      faixas[r.faixa].push(r);
    });
    return faixas;
  };

  const faixas = agruparPorFaixa(radios);

  const abrirDetalhes = (radio: Radio) => {
    setRadioSelecionado(radio);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Canais de Rádio</Text>

      <FlatList
        data={Object.keys(faixas)}
        keyExtractor={faixa => faixa}
        renderItem={({ item: faixa }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Faixa {faixa}</Text>
            {faixas[faixa].map(radio => (
              <TouchableOpacity
                key={radio.id}
                onPress={() => abrirDetalhes(radio)}
              >
                <Text style={styles.item}>
                  Canal {radio.canal} - {radio.descricao}
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
            <Text style={styles.modalTitle}>Detalhes do Canal</Text>
            {radioSelecionado && (
              <>
                <Text style={styles.modalText}>
                  Faixa: {radioSelecionado.faixa}
                </Text>
                <Text style={styles.modalText}>
                  Canal: {radioSelecionado.canal}
                </Text>
                <Text style={styles.modalText}>
                  Descrição: {radioSelecionado.descricao}
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

export default Radios;

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
