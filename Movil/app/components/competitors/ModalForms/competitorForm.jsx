import * as React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import { Modal, Portal, Button, useTheme, Text } from 'react-native-paper';
import MultiSelectInput from '../../inputs/multiSelect';
import { getRequest } from '../../../utils/api';

const CompetitorsForm = ({ competitors, visible, hideModal, handleSubmit }) => {
  const [users, setUsers] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);


  const theme = useTheme();
  const { width, height } = Dimensions.get('window');

  React.useEffect(() => {
    if (visible) {
      getUsers();
    }
  }, [visible]);

  const getUsers = async () => {
    try {
      const response = await getRequest(`/auth`);
      console.log('response', response);
      // Filtrar los usuarios que no estén en la lista de competidores
      const filteredUsers = response.filter((user) => !competitors.some((competitor) => competitor.user.id === user.id));
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  };

  const handleClose = () => {
    hideModal();
    setSelectedItems([]);
    setUsers([]);
  }

  const onSubmit = () => {
    handleSubmit(selectedItems);
    setSelectedItems([]);
    setUsers([]);
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={[
          styles.modal,
          { width: width * 0.95, height: height * 0.6, backgroundColor: theme.colors.background }
        ]}
      >
        <Text style={styles.modalTitle}>Asignar Participantes</Text>
        <MultiSelectInput
          options={users}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
        <View style={styles.buttonsContainer}>
          <Button mode="contained" onPress={onSubmit} style={styles.button}>
            Guardar
          </Button>
          <Button mode="outlined" onPress={handleClose} style={styles.closeButton}>
            Cerrar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    padding: 20,
    alignSelf: 'center', // Asegura que la modal esté centrada horizontalmente
    justifyContent: 'center', // Centra el contenido verticalmente
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'column',
  },
  button: {
    marginTop: 10,
    zIndex: 10,
  },
  closeButton: {
    marginTop: 20,
    borderColor: '#6200ee', // Color de borde que resalta en el tema claro y oscuro
  },
});

export default CompetitorsForm;
