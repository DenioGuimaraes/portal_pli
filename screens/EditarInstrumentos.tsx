import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import db from '../src/database';

interface Instrumento {
  id: number;
  tipo: string;
  nome: string;
  descricao: string;
}

const EditInstrumentos = () => {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [selected, setSelected] = useState<Instrumento | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    tipo: '',
    nome: '',
    descricao: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchInstrumentos();
  }, []);

  const fetchInstrumentos = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM instrumentos ORDER BY tipo ASC, nome ASC;',
        [],
        (_, result) => {
          const rows = result.rows;
          const data: Instrumento[] = [];
          for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
          setInstrumentos(data);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar instrumentos', error);
          return false;
        },
      );
    });
  };

  const handleSave = () => {
    if (!formData.tipo || !formData.nome || !formData.descricao) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    if (editMode && selected) {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE instrumentos SET tipo=?, nome=?, descricao=? WHERE id=?;',
          [formData.tipo, formData.nome, formData.descricao, selected.id],
          () => {
            fetchInstrumentos();
            setModalVisible(false);
            setSelected(null);
          },
        );
      });
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO instrumentos (tipo, nome, descricao) VALUES (?, ?, ?);',
          [formData.tipo, formData.nome, formData.descricao],
          () => {
            fetchInstrumentos();
            setModalVisible(false);
          },
        );
      });
    }
  };

  const handleDelete = () => {
    if (!selected) return;
    Alert.alert(
      'Excluir',
      `Excluir o instrumento ${selected.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM instrumentos WHERE id=?;',
                [selected.id],
                () => {
                  fetchInstrumentos();
                  setSelected(null);
                },
              );
            });
          },
        },
      ],
    );
  };

  const openModal = (isEdit: boolean) => {
    if (isEdit && selected) {
      setFormData({
        tipo: selected.tipo,
        nome: selected.nome,
        descricao: selected.descricao,
      });
      setEditMode(true);
    } else {
      setFormData({ tipo: '', nome: '', descricao: '' });
      setEditMode(false);
    }
    setModalVisible(true);
  };

  const tipos = ['Temperatura', 'Pressão', 'Vazão', 'Nível'];

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={instrumentos}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selected?.id === item.id && styles.selectedItem,
              ]}
              onPress={() => setSelected(item)}
            >
              <Text style={{ fontWeight: 'bold' }}>
                {item.tipo} - {item.nome}
              </Text>
              <Text style={styles.descricao}>{item.descricao}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.btn, styles.btnFlex]}
          onPress={() => openModal(false)}
        >
          <Text style={styles.btnText}>Novo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnFlex, !selected && styles.disabled]}
          disabled={!selected}
          onPress={() => openModal(true)}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnFlex, !selected && styles.disabled]}
          disabled={!selected}
          onPress={handleDelete}
        >
          <Text style={styles.btnText}>Excluir</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editMode ? 'Editar Instrumento' : 'Novo Instrumento'}
            </Text>

            <Text style={styles.label}>Tipo</Text>
            <Picker
              selectedValue={formData.tipo}
              style={styles.picker}
              onValueChange={value =>
                setFormData({ ...formData, tipo: value })
              }
            >
              <Picker.Item label="Selecione o tipo..." value="" />
              {tipos.map(t => (
                <Picker.Item key={t} label={t} value={t} />
              ))}
            </Picker>

            <Text style={styles.label}>TAG</Text>
            <TextInput
              placeholder="Ex: TI-101"
              style={styles.input}
              value={formData.nome}
              onChangeText={text => setFormData({ ...formData, nome: text })}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              placeholder="Ex: Temperatura do reator principal"
              style={styles.input}
              value={formData.descricao}
              onChangeText={text =>
                setFormData({ ...formData, descricao: text })
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btn} onPress={handleSave}>
                <Text style={styles.btnText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: 'gray' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditInstrumentos;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },

  listContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#2e7d32',
    borderRadius: 8,
    marginBottom: 16,
  },

  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: '#a5d6a7',
  },
  descricao: {
    fontSize: 12,
    color: '#666',
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  btn: {
    backgroundColor: '#004b23',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnFlex: { flex: 1 },
  disabled: { backgroundColor: '#ccc' },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  modalBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#2e7d32',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    marginBottom: 10,
    height: 50,
    color: '#000',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
