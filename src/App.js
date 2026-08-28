import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OwnerNavbar from './OwnerNavbar';
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
    <h2 className="text-secondary fw-bold">Customer Details</h2>
    <p className="text-muted">Manage buyer records and transaction histories.</p>
  </div>
);

const Employees = () => (
  <div className="container py-4">
    <h2 className="text-secondary fw-bold">Employee Management</h2>
    <p className="text-muted">Manage staff records, roles, and attendance.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div>
        <OwnerNavbar />

        <Routes>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;