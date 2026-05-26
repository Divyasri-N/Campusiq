import axios from "axios";

const API = axios.create({
  baseURL: "https://campusiq-sia1.onrender.com/api",
});

export default API;