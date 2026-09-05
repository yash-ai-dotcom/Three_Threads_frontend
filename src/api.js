import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://threethreadsbackend.onrender.com';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token from localStorage to every outbound request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Authentication Endpoint
export const loginUser = (credentials) => API.post('/api/auth/login', credentials);

// Employee Endpoints
export const getEmployees = () => API.get('/api/employees');
export const createEmployee = (employeeData) => API.post('/api/employees', employeeData);

// Inventory Endpoints
export const getInventoryList = () => API.get('/api/inventory');
export const getInventoryById = (id) => API.get(`/api/inventory/${id}`);
export const createInventory = (data) => API.post('/api/inventory', data);
export const updateInventory = (id, data) => API.put(`/api/inventory/${id}`, data);
export const deleteInventory = (id) => API.delete(`/api/inventory/${id}`);

// Order Endpoints
export const getOrders = () => API.get('/api/orders');
export const createOrder = (orderData) => API.post('/api/orders', orderData);
export const updateOrderStatus = (id, status) => API.put(`/api/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/api/orders/${id}`);

// Expense Endpoints
export const getExpenses = () => API.get('/api/expenses');
export const createExpense = (expenseData) => API.post('/api/expenses', expenseData);
export const updateExpense = (id, expenseData) => API.put(`/api/expenses/${id}`, expenseData);
export const deleteExpense = (id) => API.delete(`/api/expenses/${id}`);

// Dashboard Endpoints
export const getDashboardMetrics = () => API.get('/api/dashboard/metrics');

// Customer Endpoints
export const getCustomers = () => API.get('/api/customers');
export const createCustomer = (customerData) => API.post('/api/customers', customerData);
export const deleteCustomer = (id) => API.delete(`/api/customers/${id}`);

export default API;