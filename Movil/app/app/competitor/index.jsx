import React from 'react';
import AppScrollView from '@/components/AppScrollView';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Card, Title, Badge, IconButton } from 'react-native-paper';
import ListChallenges from '@/components/competitors/ListChallenges';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { getRequest } from '../../utils/api';

export default function Tournament() {

  const { id } = useLocalSearchParams();
  const [challenges, setChallenges] = React.useState([]);
  const [dataCompetitor, setDataCompetitor] = React.useState({});

  React.useEffect(() => {
    if (id) {
      getTournamentDetail();
    }
  }, [id]);

  const getTournamentDetail = async () => {
    try {
      const response = await getRequest(`/tournament-detail/${id}`);
      setDataCompetitor(response);

      // Agrupar los retos por categoría
      if (response?.challenges?.length) {
        const groupedByCategory = response.challenges.reduce((acc, current) => {
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
            name: current.challenge.name,
            score: current.score,
            evidence: current.evidence,
            completed: current.completed
          });
  
          return acc;
        }, []);
        setChallenges(groupedByCategory);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error al obtener los detalles del torneo',
      });
    }
  }

  const getImageUri = () => {
    return dataCompetitor.character?.image ? dataCompetitor.character.image : 'https://via.placeholder.com/120';
  }

  const getCharacterName = () => {
    return dataCompetitor.character?.name ? dataCompetitor.character.name : 'Sin nombre';
  }

  return (
    <AppScrollView title='Perfil Competidor'>
      <ScrollView style={styles.container}>
        <Avatar.Image size={200} source={{ uri: getImageUri() }} style={styles.avatar} />
        <Title style={styles.name}>{dataCompetitor.user?.name || ''}</Title>

        {/* Card de Torneo */}
        <Card style={styles.tournamentCard}>
          <Card.Content style={styles.tournamentCardContent}>
            <IconButton icon="trophy" size={30} />
            <Title>{getCharacterName()}</Title>
          </Card.Content>
        </Card>

        <View style={styles.cardsRow}>
          {/* Card de KI */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardcontent}>
              <Title>Total de KI</Title>
              <Title style={styles.kiText}>{dataCompetitor.ki_level || 0}</Title>
            </Card.Content>
          </Card>

          {/* Card de Esferas */}
          <Card style={styles.card}>
            <Card.Content style={styles.cardcontent}>
              <Title>Esferas Obtenidas</Title>
              <View style={styles.iconWithBadge}>
                <IconButton icon="star-circle" size={35}/>
                <Badge style={styles.badge}>{dataCompetitor.total_challenges || 0}</Badge>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Lista de Retos */}
        <ListChallenges items={challenges} />

      </ScrollView>

    </AppScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  name: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 28,
  },
  tournamentCard: {
    marginBottom: 20, // Espacio entre el torneo y las dos cards
    padding: 10,
  },
  tournamentCardContent: {
    flexDirection: 'row', // Colocar ícono y texto en una fila
    alignItems: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginBottom: 30,
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
  },
  cardcontent: {
    flex: 1,
  },
  kiText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconWithBadge: {
    position: 'relative',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: '40%',
  },
});
