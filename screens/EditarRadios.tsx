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

interface Radio {
  id: number;
  faixa: string;
  canal: string;
  descricao: string;
}

const EditRadios = () => {
  const [radios, setRadios] = useState<Radio[]>([]);
  const [selected, setSelected] = useState<Radio | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    faixa: '',
    canal: '',
    descricao: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [pickerKey, setPickerKey] = useState(0); // 🔹 força re-render dos Pickers

  useEffect(() => {
    fetchRadios();
  }, []);

  const fetchRadios = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM radios ORDER BY faixa ASC, canal ASC;',
        [],
        (_, result) => {
          const rows = result.rows;
          const data: Radio[] = [];
          for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
          setRadios(data);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar rádios', error);
          return false;
        },
      );
    });
  };

  const handleSave = () => {
    if (!formData.faixa || !formData.canal || !formData.descricao) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    if (editMode && selected) {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE radios SET faixa=?, canal=?, descricao=? WHERE id=?;',
          [formData.faixa, formData.canal, formData.descricao, selected.id],
          () => {
            fetchRadios();
            setModalVisible(false);
            setSelected(null);
          },
        );
      });
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO radios (faixa, canal, descricao) VALUES (?, ?, ?);',
          [formData.faixa, formData.canal, formData.descricao],
          () => {
            fetchRadios();
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
      `Excluir o canal ${selected.faixa}-${selected.canal}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM radios WHERE id=?;',
                [selected.id],
                () => {
                  fetchRadios();
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
        faixa: selected.faixa || '',
        canal: selected.canal || '',
        descricao: selected.descricao || '',
      });
      setEditMode(true);
    } else {
      setFormData({ faixa: '', canal: '', descricao: '' });
      setEditMode(false);
    }
    setPickerKey(prev => prev + 1);
    setModalVisible(true);
  };

  // 🔹 Agora restrito a 4 faixas e 5 canais
  const faixas = ['A', 'B', 'C', 'D'];
  const canais = ['1', '2', '3', '4', '5'];

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={radios}
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
                {item.faixa}-{item.canal}
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
              {editMode ? 'Editar Canal' : 'Novo Canal'}
            </Text>

            <Text style={styles.label}>Faixa</Text>
            <Picker
              key={`faixa-${pickerKey}`}
              selectedValue={formData.faixa || ''}
              style={styles.picker}
              dropdownIconColor="#2e7d32"
              onValueChange={value =>
                setFormData({ ...formData, faixa: value })
              }
            >
              <Picker.Item label="Selecione a faixa..." value="" />
              {faixas.map(f => (
                <Picker.Item key={f} label={f} value={f} />
              ))}
            </Picker>

            <Text style={styles.label}>Canal</Text>
            <Picker
              key={`canal-${pickerKey}`}
              selectedValue={formData.canal || ''}
              style={styles.picker}
              dropdownIconColor="#2e7d32"
              onValueChange={value =>
                setFormData({ ...formData, canal: value })
              }
            >
              <Picker.Item label="Selecione o canal..." value="" />
              {canais.map(c => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              placeholder="Ex: Rádio da Sala de Controle"
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

export default EditRadios;

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
