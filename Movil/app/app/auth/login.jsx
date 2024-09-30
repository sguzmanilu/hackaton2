import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Toast from 'react-native-toast-message';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, TextInput, Text, useTheme } from 'react-native-paper';
import { postRequest } from '../../utils/api';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { isAuthenticated, login } = useAuth(false);

  const handleLogin = async () => {
    // Manejar la lógica de inicio de sesión aquí
    try {
      if (!username) {
        Toast.show({
          type: 'error',
          text1: 'Usuario vacío',
          text2: 'Por favor, ingresa tu usuario',
        });
        return;
      }
      if (!password) {
        Toast.show({
          type: 'error',
          text1: 'Contraseña vacía',
          text2: 'Por favor, ingresa tu contraseña',
        });
        return;
      }

      const body = { username, password };

      const response = await postRequest('/auth', body);
      console.log('Respuesta:', response);
      Toast.show({
        type: 'success',
        text1: 'Inicio de sesión exitoso',
      });
      login(response, response.token); // Guardar el token en el dispositivo

    } catch (error) {
      console.error('Error en la petición:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: error.response?.data.message || 'Error desconocido',
      });
    }
  };

  const handleCreateAccount = () => {
    router.push('/auth/register');
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Avatar.Image
        size={200}
        style={styles.avatar}
        source={require('@/assets/images/DragonBall.png')}
      />

      {/* Inputs de Usuario y Contraseña */}
      <TextInput
        label="Usuario"
        value={username}
        onChangeText={text => setUsername(text)}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      {/* Botón de Iniciar Sesión */}
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Iniciar Sesión
      </Button>

      {/* Botón de Crear Cuenta */}
      <Button
        mode="text"
        onPress={handleCreateAccount}
        style={styles.createAccountButton}
      >
        Crear Cuenta
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 50,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    marginBottom: 10,
  },
  buttonContent: {
    paddingVertical: 5,
  },
  createAccountButton: {
    alignSelf: 'center',
  },
});
