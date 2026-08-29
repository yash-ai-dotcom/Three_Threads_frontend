import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OwnerNavbar from './OwnerNavbar';
import AdminNavbar from './AdminNavbar';
import Inventory from './Inventory'; // Existing Inventory component[cite: 1]

// Placeholder components
const Dashboard = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">Profit & Loss Overview</h2>
    <p className="text-muted">High-level financial overview and revenue metrics.</p>
  </div>
);

const Expenses = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">Expense Tracker</h2>
    <p className="text-muted">Log and track daily shop operational expenses (rent, bills, logistics).</p>
  </div>
);

const Customers = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">Customer Details & Tracking</h2>
    <p className="text-muted">Manage buyer records, contact info, and transaction histories.</p>
  </div>
);

const Orders = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">Orders Details & Order Management</h2>
    <p className="text-muted">Process store sales orders, dispatch statuses, and receipts.</p>
  </div>
);

const Employees = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">Employee Management</h2>
    <p className="text-muted">Manage staff records, roles, and attendance.</p>
  </div>
);

function App() {
  // Change role to 'OWNER' or 'ADMIN' to test different navbar views
  const [userRole, setUserRole] = useState('ADMIN');

  const handleLogout = () => {
    setUserRole(null);
  };

  // Temporary role toggle banner for testing UI switching
  return (
    <Router>
      <div>
        {/* --- DEMO ROLE SWITCHER BANNER --- */}
        <div className="bg-light border-bottom py-2 text-center">
          <span className="me-2 text-muted small">Current Role: <strong>{userRole || 'Logged Out'}</strong></span>
          <button className="btn btn-sm btn-outline-dark me-2" onClick={() => setUserRole('OWNER')}>Switch to Owner View</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setUserRole('ADMIN')}>Switch to Admin View</button>
        </div>

        {/* --- DYNAMIC NAVBAR RENDERING --- */}
        {userRole === 'OWNER' && <OwnerNavbar onLogout={handleLogout} />}
        {userRole === 'ADMIN' && <AdminNavbar onLogout={handleLogout} />}

        {/* --- ROUTE CONFIGURATION --- */}
        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />

          {/* Owner-Specific Routes */}
          {userRole === 'OWNER' ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/employees" element={<Employees />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Navigate to="/inventory" replace />} />
              <Route path="/expenses" element={<Navigate to="/inventory" replace />} />
              <Route path="/employees" element={<Navigate to="/inventory" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;