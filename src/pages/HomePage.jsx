import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import Mylogo from '../assets/Mylogo.png';

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (guestEmail.trim()) {
      // Store email temporarily in sessionStorage (clears on tab close)
      sessionStorage.setItem('guestEmail', guestEmail);
      setShowModal(false);
      navigate('/guest-welcome');
    } else {
      alert('Please enter a valid email.');
    }
  };

  return (
    <div className="home-container">
      <img src={Mylogo} className="home-logo" alt="Recipe Nest Logo" />
      <h1>Welcome to RecipeNest!</h1>
      <p>A platform where chefs inspire with their recipes and connect with food lovers!</p>

      <div className="navigation">
        <Link to="/registration" className="btn">Register</Link>
        <Link to="/login" className="btn">Login</Link>
      </div>

      <div className="footer recipe-nest">
        <p>© developed by Kwasi & Kemi 2025</p>
      </div>

      <div className="welcome-button-container">
        <button className="go-to-welcome-btn" onClick={handleGuestLogin}>
          Guest Login
        </button>
      </div>

      {/* Guest Login Modal */}
      {showModal && (
        <div className="guest-modal">
          <div className="guest-modal-content">
            <h2>Guest Login</h2>
            <p>Enter your email to explore as a guest.</p>
            <form onSubmit={handleModalSubmit}>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Email"
                required
                className="guest-email-input"
              />
              <div className="modal-buttons">
                <button type="submit" className="modal-submit-btn">Continue</button>
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;