import React from 'react';
import { useRouter } from 'expo-router';
import { FAB } from 'react-native-paper';
import useAuth from '../../hooks/useAuth';
import Toast from 'react-native-toast-message';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import Tournaments from '../../components/tournaments';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { getRequest, postRequest, putRequest } from '../../utils/api';
import TournamentFormModal from '../../components/tournaments/tournamentForm';
import { Image, StyleSheet, Dimensions, View, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {

  const [tournaments, setTournaments] = React.useState([]);
  const [item, setItem] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  
  const router = useRouter();

  React.useEffect(() => {
    getTournaments();
  }, []);

  const getTournaments = async () => {
    try {
      const response = await getRequest('/tournament');
      setTournaments(response);
    } catch (error) {
      console.error('Error al obtener los torneos:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al obtener los torneos',
      });
    }
  }

  const tournamentNavigation = (id) => {
    router.push({ pathname: 'tournament', params: { id } });
  }

  const validateAndSubmit = async(name, description) => {
    if (!name.trim() || !description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Por favor, completa todos los campos',
      });
      return;
    }

    const body = { name, description };
    try {
      if (item) {
        // Editar
        await putRequest(`tournament/${item.id}`, body);
      } else {
        // Crear
        await postRequest('/tournament', body);
      }
      Toast.show({
        type: 'success',
        text1: 'Torneo guardado correctamente',
      });
      setOpenModal(false);
      getTournaments();
    } catch (error) {
      console.error('Error al guardar el torneo:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al guardar el torneo',
        text2: error.response?.data.message || 'Error en el servidor',
      });
      return;
    }
  };

  const showModal = () => setOpenModal(true);
  const showModalEdit = (_item) => { setOpenModal(true); setItem(_item) };
  const hideModal = () => setOpenModal(false);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/DBTournament.png')}
          style={styles.reactLogo}
        />
      }>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Torneo del Poder</ThemedText>
          <HelloWave />
        </View>

        <Tournaments
          items={tournaments}
          viewAction={tournamentNavigation}
          editAction={showModalEdit}
        />
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={showModal}
      />
      <TournamentFormModal
        item={item}
        visible={openModal}
        hideModal={hideModal}
        handleSubmit={validateAndSubmit}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
  },
  scrollContent: {
    padding: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 250,
    width: width,
    resizeMode: 'cover',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
