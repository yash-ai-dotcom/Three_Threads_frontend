import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function OwnerNavbar({ onLogout }) {
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? 'active fw-bold text-warning' : '');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
      <div className="container-fluid">
        {/* Brand Header */}
        <Link className="navbar-brand fw-bold text-warning fs-4" to="/inventory">
          Three Threads <span className="badge bg-primary text-white fs-6">Owner</span>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#ownerNavbarNav"
          aria-controls="ownerNavbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items with Emojis */}
        <div className="collapse navbar-collapse" id="ownerNavbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
                📊 Profit & Loss
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/expenses')}`} to="/expenses">
                💸 Expense Tracker
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/inventory')}`} to="/inventory">
                📦 Inventory Management
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/customers')}`} to="/customers">
                👥 Customer Details
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/employees')}`} to="/employees">
                👔 Employee Management
              </Link>
            </li>
          </ul>

          {/* Logout Action */}
          <button onClick={onLogout} className="btn btn-outline-warning btn-sm ms-auto">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default OwnerNavbar;