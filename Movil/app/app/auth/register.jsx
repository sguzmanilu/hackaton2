import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { postRequest } from '../../utils/api';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const router = useRouter();

  const handleRegister = async () => {
    try {
      if (!name) {
        Toast.show({
          type: 'error',
          text1: 'Nombre vacío',
          text2: 'Por favor, ingresa tu nombre',
        });
        return;
      }
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
      if (confirmPassword !== password) {
        Toast.show({
          type: 'error',
          text1: 'Contraseñas no coinciden',
          text2: 'Por favor, verifica tus contraseñas',
        });
        return;
      }

      const body = { name, username, password, type: 2 };

      const response = await postRequest('/register', body);
      console.log('Respuesta:', response);
      Toast.show({
        type: 'success',
        text1: 'Registro exitoso',
        text2: 'Por favor, inicia sesión',
      });
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error en la petición:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al registrarse',
        text2: error.response?.data.message || 'Verifica tus datos',
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Registro de usuario
      </Text>
      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Registrarme
      </Button>
      <Button mode="text" onPress={() => router.replace('/auth/login')}>
        Ya tengo cuenta
      </Button>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
