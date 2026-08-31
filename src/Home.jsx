import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
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

      const data = await response.json(); // returns { role, username, fullName }
      onLogin(data);

      // Automatic Redirect based on Role
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
            <label className="form-label fw-semibold">PIN / Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter PIN"
              value={credentials.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;