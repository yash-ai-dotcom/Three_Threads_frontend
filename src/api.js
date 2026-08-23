import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://threethreadsbackend.onrender.com';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inventory endpoints
export const getInventoryList = () => API.get('/api/inventory');
export const getInventoryById = (id) => API.get(`/api/inventory/${id}`);
export const createInventory = (data) => API.post('/api/inventory', data);
export const updateInventory = (id, data) => API.put(`/api/inventory/${id}`, data);
export const deleteInventory = (id) => API.delete(`/api/inventory/${id}`);

export default API;