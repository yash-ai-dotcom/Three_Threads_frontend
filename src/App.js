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

// Placeholder components
const Dashboard = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">📊 Profit & Loss Overview</h2>
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

const Orders = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">🛒 Orders Details & Order Management</h2>
    <p className="text-muted">Process store sales orders, dispatch statuses, and receipts.</p>
  </div>
);

const Employees = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">👔 Employee Management</h2>
    <p className="text-muted">Manage staff records, roles, and attendance.</p>
  </div>
);

function App() {
  const [userRole, setUserRole] = useState(null); // Starts as unauthenticated (null)

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <Router>
      <div>
        {/* --- DEMO ROLE SWITCHER BANNER --- */}
        <div className="bg-light border-bottom py-2 text-center">
          <span className="me-2 text-muted small">Current Role: <strong>{userRole || 'Logged Out'}</strong></span>
          <button className="btn btn-sm btn-outline-dark me-2" onClick={() => setUserRole('OWNER')}>Switch to Owner View</button>
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setUserRole('ADMIN')}>Switch to Admin View</button>
          {userRole && <button className="btn btn-sm btn-danger" onClick={handleLogout}>Log Out</button>}
        </div>

        {/* --- DYNAMIC NAVBAR RENDERING --- */}
        {userRole === 'OWNER' && <OwnerNavbar onLogout={handleLogout} />}
        {userRole === 'ADMIN' && <AdminNavbar onLogout={handleLogout} />}

        {/* --- PROTECTED ROUTE CONFIGURATION --- */}
        <Routes>
          {/* Base route acts strictly as the Login Page */}
          <Route path="/" element={<Home onLogin={handleLogin} />} />

          {/* Shared Protected Operations */}
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

          {/* Catch-all Fallback Route */}
          <Route path="*" element={<Navigate to={userRole ? "/inventory" : "/"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;