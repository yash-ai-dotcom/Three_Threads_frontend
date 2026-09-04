import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://threethreadsbackend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username.trim(),
          password: credentials.password.trim(),
          pin: credentials.password.trim(),
        }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || 'Invalid username or PIN.');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      onLogin(data);

      if (data.role === 'OWNER') {
        navigate('/dashboard');
      } else {
        navigate('/inventory');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Navigation */}
      <nav className="navbar navbar-dark bg-transparent px-4 py-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary rounded-pill fs-6 px-3 py-2">TT</span>
          <span className="fw-bold fs-4 tracking-wide text-white">THREE THREADS</span>
        </div>
        <button 
          className="btn btn-outline-light rounded-pill px-4 fw-semibold shadow-sm"
          onClick={() => setShowModal(true)}
        >
          Portal Access
        </button>
      </nav>

      {/* Hero Section */}
      <div className="container py-5">
        <div className="row align-items-center gy-5">
          <div className="col-lg-6">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 mb-3 fw-medium">
              Internal Management Hub
            </span>
            <h1 className="display-3 fw-extrabold mb-3 text-white lh-sm">
              Try it, Wear it, <br />
              <span className="text-primary">Love it.</span>
            </h1>
            <p className="lead text-secondary mb-4 fs-5" style={{ color: '#94a3b8' }}>
              Powering the back-office behind every outfit. Streamline inventory management, track stock real-time, and scale seamless brand operations.
            </p>
            
            <div className="d-flex gap-3">
              <button 
                className="btn btn-primary btn-lg rounded-pill px-4 fw-bold shadow-lg"
                onClick={() => setShowModal(true)}
              >
                Sign In to Portal
              </button>
            </div>
          </div>

          {/* Visual Operations Dashboard Mockup */}
          <div className="col-lg-6">
            <div 
              className="p-4 rounded-4 shadow-lg border border-secondary border-opacity-25"
              style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)' }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="text-uppercase text-secondary fw-semibold mb-0 fs-7">Operations Overview</h6>
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                  Live Sync
                </span>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-10">
                    <div className="text-secondary small mb-1">Efficiency Boost</div>
                    <div className="fs-3 fw-bold text-success">+42%</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-10">
                    <div className="text-secondary small mb-1">Inventory Accuracy</div>
                    <div className="fs-3 fw-bold text-info">99.8%</div>
                  </div>
                </div>
              </div>

              {/* Simulated Flow Graphic */}
              <div className="p-3 rounded-3 bg-dark bg-opacity-25 border border-secondary border-opacity-10">
                <div className="d-flex justify-content-between text-muted small mb-2">
                  <span>Stock Input</span>
                  <span>Order Processing</span>
                  <span>Dispatch</span>
                </div>
                <div className="progress" style={{ height: '8px', backgroundColor: '#334155' }}>
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                    role="progressbar" 
                    style={{ width: '75%' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal Overlay */}
      {showModal && (
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
            <div 
              className="modal-content border-0 shadow-lg text-white rounded-4 p-2"
              style={{ backgroundColor: '#1e293b' }}
            >
              <div className="modal-header border-0 pb-0">
                <div>
                  <h4 className="modal-title fw-bold">Sign In</h4>
                  <p className="text-secondary small mb-0">Three Threads Management Portal</p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body pt-3">
                {error && <div className="alert alert-danger py-2 small rounded-3">{error}</div>}

                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-secondary small fw-semibold">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control bg-dark border-secondary text-white py-2"
                      placeholder="Enter username"
                      value={credentials.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-secondary small fw-semibold">PIN / Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="form-control bg-dark border-secondary text-white border-end-0 py-2"
                        placeholder="Enter PIN"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary border-secondary bg-dark text-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 fw-bold py-2 rounded-3" disabled={loading}>
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;