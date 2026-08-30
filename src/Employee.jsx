import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    pin: '',
    role: 'ADMIN',
    dob: '',
    age: '',
    aadhaarNo: '',
    mobileNo: '',
    education: '',
    currentAddress: '',
    permanentAddress: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Calculate Age automatically when DOB changes
    if (name === 'dob' && value) {
      const birthDate = new Date(value);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      setFormData({ ...formData, dob: value, age: calculatedAge });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await axios.post('http://localhost:8080/api/employees', formData);
      setMessage({ type: 'success', text: 'Employee Onboarded Successfully!' });
      fetchEmployees();
      
      setFormData({
        fullName: '', username: '', pin: '', role: 'ADMIN',
        dob: '', age: '', aadhaarNo: '', mobileNo: '',
        education: '', currentAddress: '', permanentAddress: ''
      });
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data || 'Failed to save employee details.' 
      });
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-primary fw-bold mb-4">👔 Employee Management</h2>

      {message.text && (
        <div className={`alert alert-${message.type} py-2`}>{message.text}</div>
      )}

      {/* --- ADD EMPLOYEE FORM --- */}
      <div className="card shadow-sm mb-5">
        <div className="card-header bg-light">
          <h4 className="h5 mb-0 text-secondary">Onboard New Employee / Admin</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Section 1: Security & Account */}
            <h6 className="text-primary border-bottom pb-2 mb-3">1. Login & System Access</h6>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Login Username</label>
                <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Assign Login PIN</label>
                <input type="password" maxLength="6" className="form-control" name="pin" placeholder="e.g. 4 or 6 digit PIN" value={formData.pin} onChange={handleChange} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Role</label>
                <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Staff / Operator</option>
                </select>
              </div>
            </div>

            {/* Section 2: Personal Details */}
            <h6 className="text-primary border-bottom pb-2 mb-3">2. Personal Identification</h6>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Full Name</label>
                <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Date of Birth</label>
                <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label fw-semibold">Age</label>
                <input type="number" className="form-control" name="age" value={formData.age} readOnly />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Aadhaar Card No</label>
                <input type="text" maxLength="12" className="form-control" name="aadhaarNo" placeholder="12-digit number" value={formData.aadhaarNo} onChange={handleChange} required />
              </div>
            </div>

            {/* Section 3: Contact & Address */}
            <h6 className="text-primary border-bottom pb-2 mb-3">3. Contact & Address Info</h6>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Mobile Number</label>
                <input type="tel" maxLength="10" className="form-control" name="mobileNo" value={formData.mobileNo} onChange={handleChange} required />
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold">Highest Education</label>
                <input type="text" className="form-control" name="education" placeholder="e.g. B.Com, Higher Secondary" value={formData.education} onChange={handleChange} />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Current Address</label>
                <textarea className="form-control" rows="2" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required></textarea>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Permanent Address</label>
                <textarea className="form-control" rows="2" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} required></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-success fw-semibold px-4">
              + Save & Grant Access
            </button>
          </form>
        </div>
      </div>

      {/* --- EMPLOYEE DIRECTORY TABLE --- */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h4 className="h5 mb-0 text-secondary">Active Employee Directory</h4>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Mobile</th>
                <th>Aadhaar</th>
                <th>Education</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">No employees registered yet.</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>#{emp.id}</td>
                    <td className="fw-semibold">{emp.fullName}</td>
                    <td><span className="badge bg-light text-dark border">{emp.username}</span></td>
                    <td><span className="badge bg-primary">{emp.role}</span></td>
                    <td>{emp.mobileNo}</td>
                    <td>{emp.aadhaarNo}</td>
                    <td>{emp.education || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Employees;