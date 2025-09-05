import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Cambia según tu backend
});

export default api;

