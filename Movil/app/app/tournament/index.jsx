import React from 'react';
import { FAB } from 'react-native-paper';
import { getRequest, postRequest, putRequest } from '../../utils/api';
import Toast from 'react-native-toast-message';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AppScrollView from '@/components/AppScrollView';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ListCompetitors from '@/components/competitors/ListCompetitors';
import CompetitorsForm from '@/components/competitors/ModalForms/competitorForm';
import ChallengesAssignForm from '@/components/competitors/ModalForms/challengesAssignForm';
import ChallengesNoteForm from '@/components/competitors/ModalForms/challengesNoteForm';


export default function Tournament() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [item, setItem] = React.useState(null);
  const [tournament, setTournament] = React.useState({});
  const [competitors, setCompetitors] = React.useState([]);
  const [openModalCompetitors, setOpenModalCompetitors] = React.useState(false);
  const [openModalChallenges, setOpenModalChallenges] = React.useState(false);
  const [openModalChallengesAssign, setOpenModalChallengesAssign] = React.useState(false);

  const showModalCompetitors = () => setOpenModalCompetitors(true);
  const hideModalCompetitors = () => setOpenModalCompetitors(false);
  const showModalChallenges = (competitor) => { setOpenModalChallenges(true); setItem(competitor); };
  const hideModalChallenges = () => { setOpenModalChallenges(false); setItem(null); };
  const showModalChallengesAssign = (competitor) => { setOpenModalChallengesAssign(true); setItem(competitor); };
  const hideModalChallengesAssign = () => { setOpenModalChallengesAssign(false); setItem(null); };

  React.useEffect(() => {
    if (id) {
      getTournament();
      getCompetitors();
    }
  }, [id]);

  const getTournament = async () => {
    try {
      const response = await getRequest(`/tournament/${id}`);
      setTournament(response);
    } catch (error) {
      console.error('Error al obtener el torneo:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al obtener el torneo',
      });
    }
  };

  const getCompetitors = async () => {
    try {
      const response = await getRequest(`/competitor/${id}`);
      setCompetitors(response);
    } catch (error) {
      console.error('Error al obtener los competidores:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al obtener los competidores',
      });
    }
  };

  const competitorNavigation = (idCompetitor) => {
    router.push({ pathname: 'competitor', params: { id: idCompetitor } });
  };

  const validateAndSubmit = async(new_competitors) => {
    try {
      if (new_competitors.length === 0) {
        hideModalCompetitors();
        return
      };
      console.log('new_competitors', new_competitors);
      const body = {
        tournament: parseInt(id),
        users: new_competitors.map(comp => ({user: comp})),
      };
      console.log('body', body);
      await postRequest('/competitor', body);
      Toast.show({
        type: 'success',
        text1: 'Competidores agregados correctamente',
      });
      getCompetitors();
      hideModalCompetitors();
    } catch (error) {
      console.error('Error al agregar los competidores:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al agregar los competidores',
        text2: error.response?.data.message || 'Error en el servidor',
      });
    }
  }

  const submitChallengesAssign = async(selectedChallenges) => {
    try {
      const body = {
        competitor: item.id,
        tournament: parseInt(id),
        challenges: selectedChallenges.map(challenge => ({challenge: parseInt(challenge)})),
      };
      await putRequest('/challenge-assign', body);
      Toast.show({
        type: 'success',
        text1: 'Retos asignados correctamente',
      });
      getCompetitors();
      hideModalChallengesAssign();
    } catch (error) {
      console.error('Error al asignar los retos:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al asignar los retos',
        text2: error.response?.data.message || 'Error en el servidor',
      });
    }
  };

  const submitChallengesNote = async (evaluations) => {
    try {
      // Obtener todas las keys del objeto evaluations
      const keys = Object.keys(evaluations);
  
      // Recorrer las keys y hacer las peticiones secuencialmente con un delay
      for (const challengeId of keys) {
        const body = {
          tournament: parseInt(id),
          competitor: item.id,
          challenge: parseInt(challengeId),
          score: evaluations[challengeId],
        };
  
        console.log('body ', body);
  
        // Realizar la petición (descomentar cuando esté lista)
        await postRequest('/challenge-score', body);
  
        // Agregar un pequeño delay de 500ms entre cada petición
        await new Promise(resolve => setTimeout(resolve, 500));
      }
  
      // Si todas las peticiones se completan con éxito, mostrar el Toast de éxito
      Toast.show({
        type: 'success',
        text1: 'Calificaciones guardadas correctamente',
      });
  
      // Llamar a funciones adicionales después de completar las peticiones
      getCompetitors();
      hideModalChallenges();
    } catch (error) {
      // Si ocurre un error en alguna petición, mostrar el Toast de error
      console.error('Error al guardar las calificaciones:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al guardar las calificaciones',
        text2: error.response?.data.message || 'Error en el servidor',
      });
    }
  };
  

  return (
    <AppScrollView title='Torneo'>
      <ThemedView style={styles.container}>
        <View style={styles.titleContainer}>
          <ThemedText type="title">{tournament?.name || ''}</ThemedText>
          <ThemedText>{tournament?.description || ''}</ThemedText>
        </View>
        <ListCompetitors
          items={competitors}
          viewCompetitor={competitorNavigation}
          handleChallengesAssign={showModalChallengesAssign}
          handleChallengesNote={showModalChallenges}
        />
      </ThemedView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={showModalCompetitors}
      />
      <CompetitorsForm
        visible={openModalCompetitors}
        hideModal={hideModalCompetitors}
        handleSubmit={validateAndSubmit}
        competitors={competitors}
      />
      <ChallengesAssignForm
        visible={openModalChallengesAssign}
        hideModal={hideModalChallengesAssign}
        handleSubmit={submitChallengesAssign}
        competitor={item}
      />
      <ChallengesNoteForm
        visible={openModalChallenges}
        hideModal={hideModalChallenges}
        handleSubmit={submitChallengesNote}
        competitor={item}
      />
    </AppScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
  },
});
