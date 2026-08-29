import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminNavbar({ onLogout }) {
  const location = useLocation();

  // Helper to highlight the active menu item
  const isActive = (path) => (location.pathname === path ? 'active fw-bold text-warning' : '');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary shadow-sm mb-4">
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold text-white fs-4" to="/inventory">
          Three Threads <span className="badge bg-dark text-warning fs-6">Admin Panel</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#adminNavbarNav"
          aria-controls="adminNavbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="adminNavbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* 1. Inventory Management */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/inventory')}`} to="/inventory">
                📦 Inventory Management
              </Link>
            </li>

            {/* 2. Customer Details & Tracking */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/customers')}`} to="/customers">
                👥 Customer Details & Tracking
              </Link>
            </li>

            {/* 3. Orders Details & Order Management */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/orders')}`} to="/orders">
                🛒 Orders & Management
              </Link>
            </li>
          </ul>

          {/* Logout Action */}
          <button onClick={onLogout} className="btn btn-outline-light btn-sm ms-auto">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;