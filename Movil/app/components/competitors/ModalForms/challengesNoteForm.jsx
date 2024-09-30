import * as React from 'react';
import { StyleSheet, Dimensions, View, SectionList } from 'react-native';
import { Modal, Portal, Button, useTheme, Text, Checkbox, List, TextInput, HelperText } from 'react-native-paper';
import { getRequest } from '../../../utils/api';

const ChallengesNoteForm = ({ visible, hideModal, handleSubmit, competitor }) => {
  const theme = useTheme();
  const [challenges, setChallenges] = React.useState([]);
  const [evaluations, setEvaluations] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const { width, height } = Dimensions.get('window');

  React.useEffect(() => {
    if (visible && competitor) {
      setErrors({});
      setEvaluations({});
      setChallenges([]);
      getChallengesAssigned();
    }
  }, [visible, competitor]);

  const filterAndSetEvaluations = (challenges) => {
    const filteredEvaluations = challenges
      .filter(item => item.score !== null) // Filtrar los que tienen `score` no nulo
      .reduce((acc, current) => {
        acc[current.id] = current.score; // Agregar al diccionario
        return acc;
      }, {});
  
    setEvaluations(filteredEvaluations); // Actualizar el estado de `evaluations`
  };

  const getChallengesAssigned = async () => {
    try {
      const response = await getRequest(`/challenge-assign/${competitor.id}`);
      // Agrupar los retos por categoría
      const groupedByCategory = response.reduce((acc, current) => {
        const categoryId = current.challenge.category.id;
        const categoryName = current.challenge.category.name;

        // Buscar si ya existe la categoría en el acumulador
        let category = acc.find(cat => cat.id === categoryId);

        if (!category) {
          // Si no existe, crear una nueva entrada para la categoría
          category = {
            id: categoryId,
            name: categoryName,
            data: []
          };
          acc.push(category);
        }

        // Añadir el reto a la categoría
        category.data.push({
          id: current.id,
          challenge: current.challenge,
          score: current.score,
          evidence: current.evidence
        });

        return acc;
      }, []);
      filterAndSetEvaluations(response);
      setChallenges(groupedByCategory);
    } catch (error) {
      console.error('Error al obtener los retos asignados:', error);
    }
  }

  const handleInputChange = (id, value) => {
    // Permitir que el valor sea una cadena temporalmente (para evitar truncar decimales)
    if (!/^(\d+(\.\d*)?)?$/.test(value)) {
      // Si no es un número válido, no actualizar nada
      return;
    }
  
    let number = parseFloat(value);
  
    if (number < 0 || number > 100 || isNaN(number)) {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: true }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [id]: false }));
    }
  
    // Guardar el valor (ya sea número o una cadena temporal con decimal incompleto)
    setEvaluations((prevEvaluations) => ({
      ...prevEvaluations,
      [id]: value,
    }));
  };
  

  const onSubmit = () => {
    if (Object.values(errors).some(error => error)) {
      return;
    }
    handleSubmit(evaluations);
  }

  const handleClose = () => {
    hideModal();
    setEvaluations({});
    setErrors({});
    setChallenges([]);
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={[
          styles.modal,
          { width: width * 0.95, height: height * 0.8, backgroundColor: theme.colors.background }
        ]}
      >
        <Text style={styles.modalTitle}>Evaluar Retos</Text>
        <SectionList
          sections={challenges}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'column' }}>
              <View style={styles.challengeRow}>
                <Text style={styles.challengeText}>{item.challenge.name}</Text>
                <TextInput
                  label="Nota"
                  value={evaluations[item.id] ? evaluations[item.id].toString() : ''}
                  keyboardType="numeric"
                  onChangeText={(value) => handleInputChange(item.id, value)}
                  style={styles.input}
                />
              </View>
              {errors[item.id] && (
                <HelperText type="error" visible={errors[item.id]}>
                  Ingresa un número entre 0 y 100.
                </HelperText>
              )}
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
    alignSelf: 'center', // Asegura que la modal esté centrada horizontalmente
    justifyContent: 'center', // Centra el contenido verticalmente
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  challengeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  challengeText: {
    flex: 0.7,
    marginRight: 10,
  },
  input: {
    flex: 0.4,
  },
  button: {
    marginTop: 0,
    zIndex: 10,
  },
  closeButton: {
    marginVertical: 20,
    borderColor: '#6200ee', // Color de borde que resalta en el tema claro y oscuro
  },
});

export default ChallengesNoteForm;
