import * as React from 'react';
import { StyleSheet, Dimensions, View, SectionList } from 'react-native';
import { Modal, Portal, Button, useTheme, Text, Checkbox, List } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { getRequest } from '../../../utils/api';

const ChallengesAssignForm = ({ visible, hideModal, handleSubmit, competitor }) => {
  const theme = useTheme();

  const [challenges, setChallenges] = React.useState([]);
  const [selectedItems, setSelectedItems] = React.useState({});
  const { width, height } = Dimensions.get('window');

  React.useEffect(() => {
    if (visible) {
      getChallenges();
    }
  }, [visible]);

  React.useEffect(() => {
    if (competitor) {
      getChallengesAssigned();
    }
  }, [competitor]);

  const getChallenges = async () => {
    try {
      const response = await getRequest('/category/challenges');
      setChallenges(response.map(category => ({...category, data: category.challenges})));
    } catch (error) {
      console.error('Error al obtener los retos:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al obtener los retos',
      });
    }
  };

  const getChallengesAssigned = async () => {
    try {
      const response = await getRequest(`/challenge-assign/${competitor.id}`);
      const selectedChallenges = response.map(challenge => challenge.challenge.id);
      setSelectedItems(selectedChallenges.reduce((acc, id) => ({ ...acc, [id]: true }), {}));
    } catch (error) {
      console.error('Error al obtener los retos asignados:', error);
    }
  }

  const handleSelect = (sectionTitle, itemId) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId], // Toggle selection
    }));
  };

  const handleClose = () => {
    hideModal();
    setSelectedItems({});
  }

  const onSubmit = () => {
    // Obtener las claves de los retos seleccionados
    const selectedChallenges = Object.keys(selectedItems).filter(key => selectedItems[key]);
    console.log('selectedChallenges', selectedChallenges);
    handleSubmit(selectedChallenges);
    setSelectedItems({});
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={[
          styles.modal,
          { width: width * 0.8, height: height * 0.6, backgroundColor: theme.colors.background }
        ]}
      >
        <Text style={styles.modalTitle}>Asignar Retos</Text>
        <SectionList
          sections={challenges}
          keyExtractor={(item) => item.id}
          renderItem={({ item, section }) => (
            <View style={styles.itemContainer}>
              <Checkbox
                status={selectedItems[item.id] ? 'checked' : 'unchecked'}
                onPress={() => handleSelect(section.name, item.id)}
              />
              <Text>{item.name}</Text>
            </View>
          )}
          renderSectionHeader={({ section: { name } }) => (
            <List.Subheader>{name}</List.Subheader>
          )}
        />
        <Button mode="contained" onPress={onSubmit} style={styles.button}>
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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

export default ChallengesAssignForm;
