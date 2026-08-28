import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function OwnerNavbar() {
  const location = useLocation();

  // Helper to highlight active link
  const isActive = (path) => location.pathname === path ? 'active fw-bold' : '';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-warning" to="/dashboard">
          Three Threads Owner
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#ownerNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="ownerNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">
                Profit & Loss / Expenses
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/inventory')}`} to="/inventory">
                Inventory Management
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/customers')}`} to="/customers">
                Customer Details
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/employees')}`} to="/employees">
                Employee Management
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default OwnerNavbar;