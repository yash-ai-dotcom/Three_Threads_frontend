import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OwnerNavbar from './OwnerNavbar';
import Inventory from './Inventory'; // Existing Inventory component[cite: 1]

// Placeholder components for screens to build next
const Dashboard = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">Profit & Loss / Expense Tracker</h2>
    <p className="text-muted">Track store expenses, revenue, and daily net margins here.</p>
  </div>
);

const Customers = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">Customer Details</h2>
    <p className="text-muted">Manage buyer records and transaction histories here.</p>
  </div>
);

const Employees = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">Employee Management</h2>
    <p className="text-muted">Manage staff records, roles, and attendance here.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div>
        {/* Persistent Owner Navbar across all routes */}
        <OwnerNavbar />

        {/* Page Content Routes */}
        <Routes>
          {/* Default entry point redirects to Inventory */}
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;