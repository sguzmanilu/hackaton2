import * as React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Modal, Portal, Button, TextInput, useTheme, Text } from 'react-native-paper';

const TournamentFormModal = ({ item, visible, hideModal, handleSubmit }) => {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const theme = useTheme();
  const { width, height } = Dimensions.get('window');

  React.useEffect(() => {
    console.log('Item:', item);
    if (item) {
      setName(item.name);
      setDescription(item.description);
    }
  }, [item]);

  const handleClose = () => {
    setName('');
    setDescription('');
    hideModal();
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
        <Text style={styles.modalTitle}>{item?.id ? 'Editar Torneo' : 'Crear Torneo'}</Text>
        <TextInput
          label="Nombre"
          value={name}
          onChangeText={text => setName(text)}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Descripción"
          value={description}
          onChangeText={text => setDescription(text)}
          multiline
          numberOfLines={4}
          style={styles.input}
          mode="outlined"
        />
        <Button mode="contained" onPress={() => handleSubmit(name, description)} style={styles.button}>
          Guardar
        </Button>
        <Button mode="outlined" onPress={handleClose} style={styles.closeButton}>
          Cerrar
        </Button>
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
  button: {
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
    borderColor: '#6200ee', // Color de borde que resalta en el tema claro y oscuro
  },
});

export default TournamentFormModal;
