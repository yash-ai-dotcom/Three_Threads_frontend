import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminNavbar({ onLogout }) {
  const location = useLocation();
  const isActive = (path) => (location.pathname === path ? 'active fw-bold text-warning' : '');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary shadow-sm mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white fs-4" to="/inventory">
          Three Threads <span className="badge bg-dark text-warning fs-6">Admin Panel</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/add-inventory')}`} to="/add-inventory">➕ Add Inventory</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/inventory')}`} to="/inventory">📋 Stock Overview</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/customers')}`} to="/customers">👥 Customer Details</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/orders')}`} to="/orders">🛒 Orders & Management</Link>
            </li>
          </ul>

          <button onClick={onLogout} className="btn btn-outline-light btn-sm ms-auto">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;