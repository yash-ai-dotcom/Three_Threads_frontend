import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function OwnerNavbar({ onLogout }) {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? 'active fw-bold text-warning' : '');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-warning fs-4" to="/inventory">
          Three Threads <span className="badge bg-primary text-white fs-6">Owner</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#ownerNavbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="ownerNavbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">📊 Performance Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/expenses')}`} to="/expenses">💸 Expense Tracker</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/add-inventory')}`} to="/add-inventory">➕ Add Inventory</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/inventory')}`} to="/inventory">📋 Stock Overview</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/customers')}`} to="/customers">👥 Customer Details</Link>
            </li>
            {/* ✅ ADDED ORDER MANAGEMENT LINK */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/orders')}`} to="/orders">🛒 Order Management</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/employees')}`} to="/employees">👔 Employee Management</Link>
            </li>
          </ul>

          <button onClick={onLogout} className="btn btn-outline-warning btn-sm ms-auto">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default OwnerNavbar;