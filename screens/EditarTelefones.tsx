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

interface Telefone {
  id: number;
  setor: string;
  ramal: string;
  descricao: string;
}

const EditTelefones = () => {
  const [telefones, setTelefones] = useState<Telefone[]>([]);
  const [selected, setSelected] = useState<Telefone | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    setor: '',
    ramal: '',
    descricao: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [pickerKey, setPickerKey] = useState(0); // 🔹 força re-render do Picker

  useEffect(() => {
    fetchTelefones();
  }, []);

  const fetchTelefones = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM telefones ORDER BY setor ASC;',
        [],
        (_, result) => {
          const rows = result.rows;
          const data: Telefone[] = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          setTelefones(data);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar telefones', error);
          return false;
        },
      );
    });
  };

  const handleSave = () => {
    if (!formData.setor || !formData.ramal || !formData.descricao) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    if (editMode && selected) {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE telefones SET setor=?, ramal=?, descricao=? WHERE id=?;',
          [formData.setor, formData.ramal, formData.descricao, selected.id],
          () => {
            fetchTelefones();
            setModalVisible(false);
            setSelected(null);
          },
        );
      });
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO telefones (setor, ramal, descricao) VALUES (?, ?, ?);',
          [formData.setor, formData.ramal, formData.descricao],
          () => {
            fetchTelefones();
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
      `Excluir telefone do setor ${selected.setor}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM telefones WHERE id=?;',
                [selected.id],
                () => {
                  fetchTelefones();
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
        setor: selected.setor || '',
        ramal: selected.ramal || '',
        descricao: selected.descricao || '',
      });
      setEditMode(true);
    } else {
      setFormData({ setor: '', ramal: '', descricao: '' });
      setEditMode(false);
    }
    setPickerKey(prev => prev + 1); // 🔹 força re-render do Picker
    setModalVisible(true);
  };

  const setores = ['Agenda', 'Operacional', 'Administrativo'];

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={telefones}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selected?.id === item.id && styles.selectedItem,
              ]}
              onPress={() => setSelected(item)}
            >
              <Text>
                {item.setor} - Ramal: {item.ramal}
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
              {editMode ? 'Editar Telefone' : 'Novo Telefone'}
            </Text>

            <Text style={styles.label}>Setor</Text>
            <Picker
              key={pickerKey}
              selectedValue={formData.setor || ''}
              style={styles.picker}
              dropdownIconColor="#2e7d32"
              onValueChange={value =>
                setFormData({ ...formData, setor: value })
              }
            >
              <Picker.Item label="Selecione o setor..." value="" />
              {setores.map(s => (
                <Picker.Item key={s} label={s} value={s} />
              ))}
            </Picker>

            <Text style={styles.label}>Ramal</Text>
            <TextInput
              placeholder="Ex: 4321"
              style={styles.input}
              value={formData.ramal}
              onChangeText={text => setFormData({ ...formData, ramal: text })}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              placeholder="Ex: Sala de Controle"
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

export default EditTelefones;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },

  listContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#2e7d32',
    borderRadius: 8,
    marginBottom: 16,
    paddingBottom: 4,
  },

  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedItem: { backgroundColor: '#a5d6a7' },
  descricao: { fontSize: 12, color: '#666' },

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
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

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
