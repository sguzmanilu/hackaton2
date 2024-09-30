import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { IconButton, List, Text, useTheme } from 'react-native-paper';
import CardCompetitor from './cardCompetitor';

const ListCompetitors = ({ items = [], viewCompetitor, handleChallengesAssign, handleChallengesNote }) => {
  const theme = useTheme();

  const renderItem = ({ item }) => (
    <CardCompetitor
      name={item?.user?.name}
      kiLevel={item.ki_level || 0}
      dragonBalls={item.challenges}
      handleViewPress={() => viewCompetitor(item.id)}
      handleChallengesAssign={() => handleChallengesAssign(item)}
      handleChallengesNote={() => handleChallengesNote(item)}
    />
  )

  return (
    <FlatList
      data={items} // Array de datos
      renderItem={renderItem} // Renderiza una Card por cada ítem
      keyExtractor={item => item.id} // Clave única para cada ítem
    />
  );
}



const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  textCenter: {
    textAlign: 'center',
  },
});

export default ListCompetitors;