import axios from 'axios';

const a = axios.create({
  baseURL: 'https://immense-woodland-13360.herokuapp.com',
});

// https://immense-woodland-13360.herokuapp.com

a.interceptors.request.use(function (config) {
  const token = localStorage.getItem('SOCIO_TOKEN');
  config.headers.Authorization = 'Bearer ' + token;
  return config;
});

export default a;
