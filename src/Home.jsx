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
    <div style={{ backgroundColor: '#FAF9F6', color: '#1A1A1A', minHeight: '100vh', fontFamily: 'Georgia, serif' }}>
      
      {/* Navigation Header */}
      <nav className="navbar navbar-expand-lg border-bottom px-4 py-3" style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            {/* Replace src path with your relative path to the logo file */}
            <img 
              src="/threethreads.png" 
              alt="Three Threads Logo" 
              style={{ height: '80px', objectFit: 'contain' }} 
            />
          </div>
          <button 
            className="btn rounded-0 px-4 py-2 fw-semibold tracking-wide text-uppercase"
            style={{ 
              backgroundColor: '#1A1A1A', 
              color: '#FFFFFF', 
              fontSize: '0.85rem', 
              letterSpacing: '1px',
              border: 'none'
            }}
            onClick={() => setShowModal(true)}
          >
            Staff Portal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container py-5 my-4">
        <div className="row align-items-center gy-5">
          <div className="col-lg-6 pe-lg-5">
            <span 
              className="text-uppercase fw-bold d-inline-block mb-3"
              style={{ 
                color: '#E05A36', 
                fontSize: '0.8rem', 
                letterSpacing: '2px', 
                fontFamily: 'system-ui, -apple-system, sans-serif' 
              }}
            >
              Internal Operations and Management Portal
            </span>
            <h1 className="display-4 fw-normal mb-4 text-dark lh-sm" style={{ letterSpacing: '-0.5px' }}>
              Crafted Quality, <br />
              <i style={{ color: '#E05A36' }}>Seamless Operations.</i>
            </h1>
            <p className="lead text-muted mb-5 fs-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.7' }}>
              Managing stock, tracking garment movement, and unifying operations behind the Three Threads apparel line.
            </p>
            
            <div className="d-flex gap-3">
              <button 
                className="btn btn-lg rounded-0 px-5 py-3 fw-semibold shadow-sm"
                style={{ 
                  backgroundColor: '#E05A36', 
                  color: '#FFFFFF', 
                  fontSize: '0.9rem',
                  letterSpacing: '1px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  border: 'none'
                }}
                onClick={() => setShowModal(true)}
              >
                Access Dashboard
              </button>
            </div>
          </div>

          {/* Editorial Visual Display */}
          <div className="col-lg-6">
            <div className="position-relative p-2 bg-white shadow-sm border" style={{ borderColor: '#E5E7EB' }}>
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000" 
                alt="Apparel Inventory & Management" 
                className="img-fluid w-100"
                style={{ height: '420px', objectFit: 'cover' }}
              />
              <div 
                className="p-4 bg-white border-top d-flex justify-content-between align-items-center"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <div>
                  <div className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>System Status</div>
                  <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>Real-time Stock Synchronization</div>
                </div>
                <span className="badge rounded-0 px-3 py-2 fw-normal" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimal signature */}
      <footer className="border-top py-4 text-center text-muted small" style={{ borderColor: '#E5E7EB', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        &copy; {new Date().getFullYear()} Three Threads. Internal Operations Portal.
      </footer>

      {/* Classic Sign-In Modal Overlay */}
      {showModal && (
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(26, 26, 26, 0.6)', backdropFilter: 'blur(2px)' }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
            <div className="modal-content rounded-0 border-0 shadow-lg text-dark p-3" style={{ backgroundColor: '#FFFFFF' }}>
              
              <div className="modal-header border-0 pb-0">
                <div>
                  <h4 className="modal-title fw-normal" style={{ fontFamily: 'Georgia, serif' }}>Sign In</h4>
                  <p className="text-muted small mb-0" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    Enter credentials to manage stock
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body pt-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {error && <div className="alert alert-danger py-2 small rounded-0 mb-3">{error}</div>}

                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control rounded-0 py-2 border"
                      placeholder="Username"
                      value={credentials.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted small fw-semibold text-uppercase" style={{ letterSpacing: '0.5px' }}>PIN / Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="form-control rounded-0 py-2 border border-end-0"
                        placeholder="PIN"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary rounded-0 bg-light border text-dark px-3"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ fontSize: '0.8rem' }}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn w-100 fw-semibold py-2.5 rounded-0 text-uppercase" 
                    style={{ 
                      backgroundColor: '#1A1A1A', 
                      color: '#FFFFFF', 
                      fontSize: '0.85rem', 
                      letterSpacing: '1px',
                      border: 'none'
                    }}
                    disabled={loading}
                  >
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