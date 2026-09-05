import React, { useState, useEffect } from 'react';
import { getCustomers, createCustomer, deleteCustomer } from './api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    shopName: '',
    phoneNo: '',
    email: '',
    address: '',
    preferredTransport: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error('Failed to load customers', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer(formData);
      alert('Customer created successfully!');
      setFormData({ customerName: '', shopName: '', phoneNo: '', email: '', address: '', preferredTransport: '' });
      loadCustomers();
    } catch (err) {
      alert(err.response?.data || 'Error creating customer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer account?')) {
      await deleteCustomer(id);
      loadCustomers();
    }
  };

  return (
    <div className="container-fluid py-4 px-4">
      <h2 className="fw-bold text-dark mb-4">👥 Customer Master Directory</h2>

      {/* Customer Form */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-dark text-white fw-bold">+ Register New Customer</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Customer Name *</label>
              <input type="text" className="form-control" name="customerName" value={formData.customerName} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Shop / Business Name</label>
              <input type="text" className="form-control" name="shopName" value={formData.shopName} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Phone Number *</label>
              <input type="text" className="form-control" name="phoneNo" value={formData.phoneNo} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Email Address</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Preferred Transport Service</label>
              <input type="text" className="form-control" name="preferredTransport" placeholder="e.g. V-Trans, TCI, Local Freight" value={formData.preferredTransport} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Full Address</label>
              <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary px-4 fw-bold">+ Save Customer</button>
            </div>
          </form>
        </div>
      </div>

      {/* Customer List */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Shop Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Transport Service</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td><span className="badge bg-secondary">{c.customerNo}</span></td>
                  <td className="fw-bold">{c.customerName}</td>
                  <td>{c.shopName || 'N/A'}</td>
                  <td>
                    <div>{c.phoneNo}</div>
                    <small className="text-muted">{c.email}</small>
                  </td>
                  <td>{c.address || 'N/A'}</td>
                  <td><span className="badge bg-info text-dark">{c.preferredTransport || 'Standard Freight'}</span></td>
                  <td className="text-center">
                    <button onClick={() => handleDelete(c.id)} className="btn btn-outline-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}