import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // cambiar cuando definan endpoints
});

export default api;
