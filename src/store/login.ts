import axios from 'axios';
import { updateJwtToken } from '../reducers/reducer';
import { API_PREFIX, LOGIN_DATA } from '../utils/utils';

export default function login(store: any) {
  const promise = axios.post(`${API_PREFIX}/login/`, LOGIN_DATA);
  promise.then(response => {
    localStorage.setItem('jwtToken', response.data);
    store.dispatch(updateJwtToken(response.data));
    return response.data;
  });
  return promise; 
};