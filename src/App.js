import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OwnerNavbar from './OwnerNavbar';
import AdminNavbar from './AdminNavbar';
import Inventory from './Inventory';
import Home from './Home';
import ProtectedRoute from './ProtectedRoute';
import Employees from './Employees';
import Orders from './Orders';
import Expenses from './Expenses'; // Replaces inline Expenses placeholder component

const Dashboard = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">📈 Profit & Loss Overview</h2>
    <p className="text-muted">High-level financial overview and revenue metrics.</p>
  </div>
);

const Expenses = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">💸 Expense Tracker</h2>
    <p className="text-muted">Log and track daily shop operational expenses.</p>
  </div>
);

const Customers = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">👥 Customer Details & Tracking</h2>
    <p className="text-muted">Manage buyer records, contact info, and transaction histories.</p>
  </div>
);

function App() {
  // Initialize state from localStorage to maintain active session across refreshes
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || null);

  const handleLogin = (userData) => {
    const role = userData.role;
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', userData.username);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    setUserRole(null);
  };

  return (
    <Router>
      <div>
        {/* Dynamic Navbar based strictly on active authenticated role */}
        {userRole === 'OWNER' && <OwnerNavbar onLogout={handleLogout} />}
        {userRole === 'ADMIN' && <AdminNavbar onLogout={handleLogout} />}

        <Routes>
          {/* Base Route */}
          <Route 
            path="/" 
            element={userRole ? <Navigate to="/inventory" replace /> : <Home onLogin={handleLogin} />} 
          />

          {/* Shared Protected Routes */}
          <Route
            path="/add-inventory"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={['OWNER', 'ADMIN']}>
                <Inventory viewMode="FORM_ONLY" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={['OWNER', 'ADMIN']}>
                <Inventory viewMode="TABLE_ONLY" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={['OWNER', 'ADMIN']}>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={['OWNER', 'ADMIN']}>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Owner-Only Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={['OWNER']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={['OWNER']}>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute userRole={userRole} allowedRoles={['OWNER']}>
                <Employees />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to={userRole ? "/inventory" : "/"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;