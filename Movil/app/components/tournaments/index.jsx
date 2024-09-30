import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, List, MD3Colors, Text, useTheme } from 'react-native-paper';

const EditButton = ({ theme, handlePress }) => (
  <IconButton
    icon="pencil"
    iconColor={theme.colors.secondary}
    onPress={handlePress}
    style={{ marginHorizontal: 2}}
  />
)

const ViewButton = ({ theme, handlePress }) => (
  <IconButton
    icon="eye"
    iconColor={theme.colors.primary}
    onPress={handlePress}
    style={{ marginHorizontal: 2}}
  />
)

const Tournaments = ({ items = [], viewAction, editAction }) => {
  const theme = useTheme();
  return (
    <List.Section style={{ marginBottom: 30 }}>
      <List.Subheader>Torneos Disponibles</List.Subheader>
      {items.length === 0 ? (
        <Text style={styles.textCenter} variant="bodyMedium">Sin torneos disponibles</Text>
      ) : (
        items.map((item) => (
          <List.Item
            key={item.id}
            title={item.name}
            left={() => <List.Icon icon="tournament" />}
            right={() => (
              <View style={styles.actionsContainer}>
                <EditButton theme={theme} handlePress={() => editAction(item)} />
                <ViewButton theme={theme} handlePress={() => viewAction(item.id)} />
              </View>
            )}
          />
        )))}
    </List.Section>
  );
}



const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    width: 60,
  },
  textCenter: {
    textAlign: 'center',
  },
});

export default Tournaments;