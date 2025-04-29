// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Re-enable useNavigate
import '../styles/LoginPage.css';
import Mylogo from '../assets/Mylogo.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/login', { // Proxied to http://localhost:5120
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Store JWT
      setSuccess('Login successful! Redirecting to Welcome Page...');
      console.log('Chef logged in:', data.message);
      setTimeout(() => navigate('/welcome'), 2000); // Redirect to WelcomePage (/)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <img src={Mylogo} className="login-logo" alt="Recipe Nest Logo" />
      <div className="login-container">
        <div className="form-container">
          <h2 className="login-header">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="registration-link">
            <p className="login-account-link">Do not have an account?</p>
            <Link to="/registration">Register</Link>
          </div>
          <div className="login-back-link">
            <Link to="/">Home</Link>
          </div>
        </div>
      </div>
      <footer className="footer">
        <p>© developers Kwasi & Kemi</p>
      </footer>
    </div>
  );
};

export default LoginPage;