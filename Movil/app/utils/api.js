import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración base de Axios
// const API_URL = 'http://10.0.2.2:5000/api'; // LOCAL
const API_URL = 'https://39icq8wg0g.execute-api.us-east-1.amazonaws.com/dev/api'; // DEV

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Middleware para añadir el token a cada petición si existe
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función GET
export const getRequest = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función POST
export const postRequest = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función PUT
export const putRequest = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función DELETE
export const deleteRequest = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Función para manejar errores
const handleError = (error) => {
  console.error('Error en la petición:', error);
  if (error.response) {
    // El servidor respondió con un código de estado diferente de 2xx
    console.error('Datos:', error.response.data);
    console.error('Estado:', error.response.status);
  } else if (error.request) {
    // No se recibió respuesta
    console.error('No se recibió respuesta:', error.request);
  } else {
    // Otro tipo de error
    console.error('Error:', error.message);
  }
  throw error; // Propaga el error para manejarlo fuera de esta función si es necesario
};
