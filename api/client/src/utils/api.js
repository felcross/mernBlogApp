import axios from 'axios';
const URL = process.env.REACT_APP_API;
const api = axios.create({
    baseURL: `${URL}/api`,
    timeout: 5000
});

export default api;