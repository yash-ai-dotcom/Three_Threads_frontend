import axios from 'axios';

// Set up the Axios Instance
// Change this BASE_URL when moving from local to production
const BASE_URL = 'http://localhost:8080/api/inventory';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. GET: Fetch all inventory items
export const getInventoryList = () => {
  return api.get('');
};

// 2. GET: Fetch single inventory item by ID
export const getInventoryById = (id) => {
  return api.get(`/${id}`);
};

// 3. GET: Fetch item by Article Number
export const getInventoryByArticleNo = (articleNo) => {
  return api.get(`/article/${articleNo}`);
};

// 4. POST: Create a new inventory item
export const createInventory = (inventoryData) => {
  return api.post('', inventoryData);
};

// 5. PUT: Update an existing inventory item by ID
export const updateInventory = (id, inventoryData) => {
  return api.put(`/${id}`, inventoryData);
};

// 6. DELETE: Delete an item by ID
export const deleteInventory = (id) => {
  return api.delete(`/${id}`);
};

export default api;