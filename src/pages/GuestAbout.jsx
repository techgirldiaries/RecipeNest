import { Link } from 'react-router-dom';
import '../styles/WelcomePage.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const GuestAbout = () => {
  return (
    <div className="welcome-page guest-about-container">
      <nav className="guest-navbar">
        <ul className="guest-nav-list">
          <li><Link to="/guest-welcome" className="guest-nav-link">Home</Link></li>
          <li><Link to="/guest-recipes" className="guest-nav-link">Recipes</Link></li>
          <li><Link to="/guest-about" className="guest-nav-link">About</Link></li>
          <li><Link to="/" onClick={() => sessionStorage.removeItem('guestEmail')}>Log Out</Link></li>
        </ul>
      </nav>
      <main>
        <section className="about-hero">
          <div className="about-content">
            <h1>About RecipeNest</h1>
            <p>RecipeNest is a platform where chefs inspire with their recipes and connect with food lovers.</p>
            <div className="about-text">
              <p>Founded in 2025 by Kwasi & Kemi, we blend tradition with innovation to create a global culinary community.</p>
            </div>
          </div>
        </section>

        {/* Contact Information Container with Original Style */}
        <section className="contact-info">
          <h2>Contact Us</h2>
          <div className="contact-details">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <p>Email: <a href="mailto:recipenest.support@gmail.com">recipenest.support@gmail.com</a></p>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <p>Phone: +233 123456789</p>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <p>Address: 123 Vicarage Street, Luton, UK</p>
            </div>
          </div>
          <div className="social-media-container">
            <p>Follow Us:</p>
            <ul className="social-media-links">
              <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF className="social-icon" /></a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="social-icon" /></a></li>
              <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram className="social-icon" /></a></li>
              <li><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn className="social-icon" /></a></li>
            </ul>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>© 2025 • RecipeNest Group 3</p>
      </footer>
    </div>
  );
};

export default GuestAbout;