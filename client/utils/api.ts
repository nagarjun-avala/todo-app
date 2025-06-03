// frontend/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // change if backend runs elsewhere
});

export default api;
