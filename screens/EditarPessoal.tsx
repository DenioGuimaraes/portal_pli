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

interface Pessoa {
  id: number;
  grupo: string;
  nome: string;
  matricula: string;
}

const EditPessoal = () => {
  const [pessoal, setPessoal] = useState<Pessoa[]>([]);
  const [selected, setSelected] = useState<Pessoa | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    grupo: '',
    nome: '',
    matricula: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [pickerKey, setPickerKey] = useState(0); // 🔹 força re-render do Picker

  useEffect(() => {
    fetchPessoal();
  }, []);

  const fetchPessoal = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pessoal ORDER BY nome ASC;',
        [],
        (_, result) => {
          const rows = result.rows;
          const data: Pessoa[] = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          setPessoal(data);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar pessoal', error);
          return false;
        },
      );
    });
  };

  const handleSave = () => {
    if (!formData.nome || !formData.grupo || !formData.matricula) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    if (editMode && selected) {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE pessoal SET grupo=?, nome=?, matricula=? WHERE id=?;',
          [formData.grupo, formData.nome, formData.matricula, selected.id],
          () => {
            fetchPessoal();
            setModalVisible(false);
            setSelected(null);
          },
        );
      });
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO pessoal (grupo, nome, matricula) VALUES (?, ?, ?);',
          [formData.grupo, formData.nome, formData.matricula],
          () => {
            fetchPessoal();
            setModalVisible(false);
          },
        );
      });
    }
  };

  const handleDelete = () => {
    if (!selected) return;

    Alert.alert('Excluir', `Excluir ${selected.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          db.transaction(tx => {
            tx.executeSql(
              'DELETE FROM pessoal WHERE id=?;',
              [selected.id],
              () => {
                fetchPessoal();
                setSelected(null);
              },
            );
          });
        },
      },
    ]);
  };

  const openModal = (isEdit: boolean) => {
    if (isEdit && selected) {
      setFormData({
        grupo: selected.grupo || '',
        nome: selected.nome || '',
        matricula: selected.matricula || '',
      });
      setEditMode(true);
    } else {
      setFormData({ grupo: '', nome: '', matricula: '' });
      setEditMode(false);
    }
    setPickerKey(prev => prev + 1); // 🔹 força re-render
    setModalVisible(true);
  };

  const grupos = ['A', 'B', 'C', 'D', 'E'];

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={pessoal}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selected?.id === item.id && styles.selectedItem,
              ]}
              onPress={() => setSelected(item)}
            >
              <Text>{item.nome} (Grupo {item.grupo})</Text>
              <Text style={styles.matricula}>Mat: {item.matricula}</Text>
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
              {editMode ? 'Editar Pessoa' : 'Nova Pessoa'}
            </Text>

            <Text style={styles.label}>Grupo</Text>
            <Picker
              key={pickerKey}
              selectedValue={formData.grupo || ''}
              style={styles.picker}
              dropdownIconColor="#2e7d32"
              onValueChange={value =>
                setFormData({ ...formData, grupo: value })
              }
            >
              <Picker.Item label="Selecione um grupo..." value="" />
              {grupos.map(g => (
                <Picker.Item key={g} label={`Grupo ${g}`} value={g} />
              ))}
            </Picker>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              placeholder="Digite o nome completo"
              style={styles.input}
              value={formData.nome}
              onChangeText={text => setFormData({ ...formData, nome: text })}
            />

            <Text style={styles.label}>Matrícula</Text>
            <TextInput
              placeholder="Ex: 1234"
              style={styles.input}
              value={formData.matricula}
              onChangeText={text =>
                setFormData({ ...formData, matricula: text })
              }
              keyboardType="numeric"
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

export default EditPessoal;

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
  matricula: { fontSize: 12, color: '#666' },

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
