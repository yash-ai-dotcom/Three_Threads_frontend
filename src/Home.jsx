import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    // --- Hardcoded Owner Check / Database Admin Check Logic ---
    if (credentials.username === 'owner' && credentials.password === 'owner123') {
      onLogin('OWNER');
      navigate('/dashboard');
    } else if (credentials.username === 'admin' && credentials.password === 'admin123') {
      onLogin('ADMIN');
      navigate('/inventory');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <div className="card shadow-lg p-4 border-0" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary mb-1">Three Threads</h2>
          <p className="text-muted small">Internal Operations & Management Portal</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleLoginSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Enter username"
              value={credentials.username}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;