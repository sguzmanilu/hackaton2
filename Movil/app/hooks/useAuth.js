import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuth = (shouldCheckAuth = false) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para verificar si el usuario tiene un token almacenado
  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token);
      if (token) {
        setIsAuthenticated(true);
        router.dismissAll();
        router.replace('/mainTab'); // Redirige a la pantalla de inicio
      } else {
        setIsAuthenticated(false);
        router.dismissAll();
        router.replace('/auth/login'); // Redirige a la pantalla de login
      }
    } catch (error) {
      console.error('Error verificando el token', error);
      router.replace('/auth/login'); // En caso de error, redirige a login
    } finally {
      setLoading(false);
    }
  };

  const checkIfAuthenticated = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando el token', error);
    }
  };

  // Función para iniciar sesión y guardar el token
  const login = async (userData, token) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('token', token);
      setIsAuthenticated(true);
      router.dismissAll();
      router.replace('/mainTab'); // Redirige a la pantalla de inicio después del login
    } catch (error) {
      console.error('Error guardando el token', error);
    }
  };

  // Función para cerrar sesión y eliminar el token
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userData');
      setIsAuthenticated(false);
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: '/auth/login' }], // your stack screen name
      // });
      router.dismissAll();
      router.replace('/auth/login'); // Redirige a la pantalla de login después del logout
    } catch (error) {
      console.error('Error eliminando el token', error);
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error obteniendo el token', error);
    }
  };

  const getUserData = async () => {
    try {
      const userDataText = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(userDataText);
      return userData;
    } catch (error) {
      console.error('Error obteniendo el userData', error);
    }
  };

  useEffect(() => {
    // checkIfAuthenticated();
    if (shouldCheckAuth) {
      checkAuthStatus(); // Verifica el token solo si `shouldCheckAuth` es true
    }
  }, []);

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    checkAuthStatus,
    checkIfAuthenticated,
    getToken,
    getUserData,
  };
};

export default useAuth;
