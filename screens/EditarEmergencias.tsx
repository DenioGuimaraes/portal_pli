import React, { useEffect, useState } from 'react';
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

interface Emergencia {
  id: number;
  titulo: string;
  passos: string;
}

const EditEmergencias = () => {
  const [emergencias, setEmergencias] = useState<Emergencia[]>([]);
  const [selected, setSelected] = useState<Emergencia | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    passos: '',
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchEmergencias();
  }, []);

  const fetchEmergencias = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM emergencias ORDER BY titulo ASC;',
        [],
        (_, result) => {
          const rows = result.rows;
          const data: Emergencia[] = [];
          for (let i = 0; i < rows.length; i++) data.push(rows.item(i));
          setEmergencias(data);
        },
        (_, error) => {
          console.log('❌ Erro ao buscar emergências', error);
          return false;
        },
      );
    });
  };

  const handleSave = () => {
    if (!formData.titulo || !formData.passos) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    if (editMode && selected) {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE emergencias SET titulo=?, passos=? WHERE id=?;',
          [formData.titulo, formData.passos, selected.id],
          () => {
            fetchEmergencias();
            setModalVisible(false);
            setSelected(null);
          },
          (_, error) => {
            console.log('❌ Erro ao atualizar emergência:', error);
            return false;
          },
        );
      });
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO emergencias (titulo, passos) VALUES (?, ?);',
          [formData.titulo, formData.passos],
          () => {
            fetchEmergencias();
            setModalVisible(false);
          },
          (_, error) => {
            console.log('❌ Erro ao inserir emergência:', error);
            return false;
          },
        );
      });
    }
  };

  const handleDelete = () => {
    if (!selected) return;
    Alert.alert(
      'Excluir',
      `Excluir a emergência "${selected.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM emergencias WHERE id=?;',
                [selected.id],
                () => {
                  fetchEmergencias();
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
        titulo: selected.titulo,
        passos: selected.passos,
      });
      setEditMode(true);
    } else {
      setFormData({ titulo: '', passos: '' });
      setEditMode(false);
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={emergencias}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selected?.id === item.id && styles.selectedItem,
              ]}
              onPress={() => setSelected(item)}
            >
              <Text style={{ fontWeight: 'bold' }}>{item.titulo}</Text>
              <Text style={styles.descricao} numberOfLines={2}>
                {item.passos}
              </Text>
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
              {editMode ? 'Editar Emergência' : 'Nova Emergência'}
            </Text>

            <Text style={styles.label}>Título</Text>
            <TextInput
              placeholder="Ex: Vazamento de Hidrogênio"
              style={styles.input}
              value={formData.titulo}
              onChangeText={text =>
                setFormData({ ...formData, titulo: text })
              }
            />

            <Text style={styles.label}>Passos</Text>
            <TextInput
              placeholder="Descreva as etapas..."
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              value={formData.passos}
              multiline
              numberOfLines={4}
              onChangeText={text =>
                setFormData({ ...formData, passos: text })
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

export default EditEmergencias;

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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
