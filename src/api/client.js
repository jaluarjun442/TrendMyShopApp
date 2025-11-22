import axios from 'axios';

const API = axios.create({
    baseURL: 'https://trendmyshop.rocklity.shop/api/v1',
    timeout: 10000,
});

export default API;
