import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegistrationPage.css';
import { Link } from 'react-router-dom';
import Mylogo from '../assets/Mylogo.png';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Registration failed');
      }
  
      const result = await response.json();
      console.log(result.message);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page-container">
      {/* Logo on top of the registration container */}
      <img src={Mylogo} className="registration-logo" alt="Recipe Nest Logo" />
      
      <div className="registration-container">
        <h2 className="registration-header">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="Name" // Corrected name
            placeholder="First Name"
            value={formData.Name} // Corrected value binding
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Surname" // Corrected name
            placeholder="Last Name"
            value={formData.Surname} // Corrected value binding
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="register-btn">Register</button>
        </form>
        
        <div className="login-link">
          <p className="account-link">Already have an account?</p>
          <Link to="/login">Login</Link>
        </div>
        
        <div className="back-link">
          <Link to="/">Home</Link>
        </div>

        <div className="footer">
          <p>&copy; developers Kemi & Kwasi</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
