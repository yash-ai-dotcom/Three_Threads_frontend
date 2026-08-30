import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Ensure correct path to your axios instance

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', pin: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Call backend Spring Boot auth endpoint
      const response = await API.post('/api/auth/login', {
        username: credentials.username,
        pin: credentials.pin
      });

      const { role } = response.data;

      if (onLogin) {
        onLogin(role);
      }

      // Navigate based on assigned role
      if (role === 'OWNER') {
        navigate('/dashboard');
      } else {
        navigate('/inventory');
      }
    } catch (err) {
      setError(err.response?.data || 'Invalid username or password/PIN');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-lg p-4 border-0" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Three Threads</h2>
          <p className="text-muted small">Internal Operations Portal</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password / PIN</label>
            <input
              type="password"
              name="pin"
              className="form-control"
              value={credentials.pin}
              onChange={handleChange}
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

export default Login;