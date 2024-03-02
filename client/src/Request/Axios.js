import axios from "axios";

const a = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

a.interceptors.request.use(function (config) {
  const token = localStorage.getItem("SOCIO_TOKEN");
  config.headers.Authorization = "Bearer " + token;
  return config;
});

export default a;
