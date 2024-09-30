import React from 'react';
import useAuth from '../../hooks/useAuth';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Text, Title } from 'react-native-paper';
import AppScrollView from '@/components/AppScrollView';

export default function Profile() {
  const { logout, getUserData } = useAuth();

  const [userData, setUserData] = React.useState({});

  React.useEffect(() => {
    getUserData().then((data) => {
      setUserData(data);
    });
  }, []);

  const getInitials = () => {
    const names = (userData?.name || 'N D').split(' ');
    const initials = names[0][0] + (names.length > 1 ? names[1][0] : '');
    return initials.toUpperCase(); // Convierte las iniciales a mayúsculas
  };

  return (
    <AppScrollView title='Perfil'>
      <View style={styles.container}>
        {/* <Avatar.Image
          size={120}
          source={{ uri: avatarUrl }}
          style={styles.avatar}
        /> */}
        <Avatar.Text
          size={120}
          label={getInitials()}
          style={styles.avatar}
          // style={{ backgroundColor: '#6200ee' }} // Personaliza el fondo
        />

        <Title style={styles.title}>{userData?.name || ''}</Title>
        <Text style={styles.username}>@{userData?.username || ''}</Text>

        <Button
          mode="contained"
          onPress={logout}
          style={styles.logoutButton}
        >
          Cerrar Sesión
        </Button>
      </View>
    </AppScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    marginBottom: 30,
  },
  logoutButton: {
    marginTop: 20,
    width: '60%',
    borderRadius: 5,
  },
});
