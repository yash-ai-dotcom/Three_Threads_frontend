import React, { useState, useEffect } from 'react';
import { getExpenses, createExpense, updateExpense, deleteExpense } from './api';

const CATEGORIES = {
  COGS: ['Article Production / Raw Material', 'Delivery & Freight-In', 'Packaging Supplies'],
  UTILITIES: ['Electricity', 'Wi-Fi / Internet', 'Water', 'Stationery & Office Supplies'],
  PAYROLL: ['Staff Salary', 'Freelance / Contractor'],
  RENT: ['Warehouse Rent', 'Storefront Rent'],
  TRAVEL: ['Business Trip / Lodging', 'Vendor Meeting / Meals'],
  MARKETING: ['Ad Spend', 'Promotions']
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    category: 'UTILITIES',
    subCategory: 'Electricity',
    amount: '',
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    vendorName: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // READ: Fetch all expenses on load
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpenses();
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setFormData({
      ...formData,
      category: cat,
      subCategory: CATEGORIES[cat][0]
    });
  };

  // CREATE or UPDATE handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, amount: parseFloat(formData.amount) };

    try {
      if (editingId) {
        // UPDATE
        await updateExpense(editingId, payload);
      } else {
        // CREATE
        await createExpense(payload);
      }
      resetForm();
      fetchExpenses();
    } catch (err) {
      console.error("Failed to save expense:", err);
      alert("Error saving expense details.");
    }
  };

  // Populate form for EDITING
  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setFormData({
      category: exp.category,
      subCategory: exp.subCategory,
      amount: exp.amount,
      expenseDate: exp.expenseDate,
      paymentMethod: exp.paymentMethod,
      vendorName: exp.vendorName || '',
      notes: exp.notes || ''
    });
  };

  // DELETE handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense entry?")) return;
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      console.error("Failed to delete expense:", err);
      alert("Error deleting record.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(initialFormState);
  };

  const totalSpent = expenses.reduce((acc, item) => acc + (item.amount || 0), 0);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-secondary fw-bold">💸 Expense Tracker</h2>
          <p className="text-muted mb-0">Record, update, and review shop operational expenses.</p>
        </div>
        <div className="card bg-warning text-dark px-3 py-2 fw-bold shadow-sm">
          Total Spent: ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div className="row g-4">
        {/* Form Column (Create / Update) */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
              <span>{editingId ? '✏️ Edit Expense' : '➕ Log New Expense'}</span>
              {editingId && (
                <button className="btn btn-sm btn-outline-light" onClick={resetForm}>Cancel</button>
              )}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Category</label>
                  <select className="form-select" value={formData.category} onChange={handleCategoryChange}>
                    {Object.keys(CATEGORIES).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Sub-Category</label>
                  <select className="form-select" value={formData.subCategory} onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}>
                    {CATEGORIES[formData.category].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Amount (₹)</label>
                  <input type="number" step="0.01" className="form-control" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Expense Date</label>
                  <input type="date" className="form-control" required value={formData.expenseDate} onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })} />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Payment Method</label>
                  <select className="form-select" value={formData.paymentMethod} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}>
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CASH">Cash</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Vendor / Payee</label>
                  <input type="text" className="form-control" placeholder="e.g. MSEB / Delivery Partner" value={formData.vendorName} onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })} />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Notes / Description</label>
                  <textarea className="form-control" rows="2" placeholder="Optional notes..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                </div>

                <button type="submit" className={`btn w-100 fw-bold ${editingId ? 'btn-success' : 'btn-warning'}`}>
                  {editingId ? 'Update Expense' : 'Save Expense'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Expense History Table Column */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-bold">Expense Records</div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Sub-Category</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp) => (
                      <tr key={exp.id}>
                        <td>{exp.expenseDate}</td>
                        <td><span className="badge bg-secondary">{exp.category}</span></td>
                        <td>{exp.subCategory}</td>
                        <td className="fw-bold">₹{exp.amount.toFixed(2)}</td>
                        <td><small className="text-muted">{exp.paymentMethod}</small></td>
                        <td className="text-end">
                          <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(exp)}>Edit</button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(exp.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {!loading && expenses.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">No expense records found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}