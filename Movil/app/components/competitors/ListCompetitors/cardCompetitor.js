import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, IconButton, Badge, Menu } from 'react-native-paper';

const CardCompetitor = ({ name, kiLevel, dragonBalls, handleViewPress, ...props }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const onPressChallengeAssign = () => {
    closeMenu();
    props.handleChallengesAssign();
  }
  
  const onPressChallengeNote = () => {
    closeMenu();
    props.handleChallengesNote();
  }

  return (
    <Card style={styles.cardContainer}>
      <Card.Title
        title={name}
        subtitle={`Nivel de KI: ${kiLevel}`}
        left={(props) => <Avatar.Icon {...props} icon="weight-lifter" />}
        right={(props) => (
          <View style={styles.actionsContainer}>
            <View style={styles.iconWithBadge}>
              <IconButton icon="star-circle" size={40} onPress={handleViewPress} />
              <Badge style={styles.badge}>{dragonBalls}</Badge>
            </View>

            {/* Menu for the dots icon */}
            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={openMenu}
                />
              }
            >
              <Menu.Item onPress={onPressChallengeAssign} title="Asignar Retos" />
              <Menu.Item onPress={onPressChallengeNote} title="Evaluar Retos" />
            </Menu>
          </View>
        )}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWithBadge: {
    position: 'relative', // Para colocar el Badge encima del Icono
  },
  badge: {
    position: 'absolute',
    top: 2,   // Ajustar la posición del Badge
    right: 2, // Ajustar la posición del Badge
  },
});

export default CardCompetitor;