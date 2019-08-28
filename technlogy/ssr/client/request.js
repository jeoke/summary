import axios from 'axios';
var instance = axios.create({
                 baseURL: '/api/',
                 timeout: 1000
               });
export default instance;