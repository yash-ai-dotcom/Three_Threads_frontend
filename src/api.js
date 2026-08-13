import axios from 'axios';

// Fallback to localhost during development, and use Render URL in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://three-threads-backend.onrender.com';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getInventoryList = () => API.get('/api/inventory'); // Replace with your exact endpoint path
export const createInventory = (data) => API.post('/api/inventory', data);
export const deleteInventory = (id) => API.delete(`/api/inventory/${id}`);

export default API;