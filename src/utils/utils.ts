export const API_PREFIX = 'http://0.0.0.0:5000';

export const LOGIN_DATA = { 
  login: 'letscode',
  senha: 'lets@123'
};

export const getRequestConfig = () => ({
  headers: {
    Authorization: "Bearer " + localStorage.getItem('jwtToken')
  }
});
