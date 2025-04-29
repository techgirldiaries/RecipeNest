import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AccountPage.css';

const AccountPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountDetails, setAccountDetails] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccountData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your account');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch account data: ${text}`);
        }

        const data = await response.json();
        setAccountDetails({
          email: data.email || '',
          password: ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [navigate]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleAccountChange = (e) => {
    setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value });
  };

  const saveAccountEdit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to save changes');
      return;
    }

    try {
      const payload = {};
      if (accountDetails.email) payload.email = accountDetails.email;
      if (accountDetails.password) payload.password = accountDetails.password;

      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update account: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log(data.message);
      setAccountDetails({ ...accountDetails, password: '' }); // Clear password field
      setIsEditingAccount(false);
      setError(''); // Clear any previous error
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelAccountEdit = () => {
    setIsEditingAccount(false);
    setAccountDetails({ ...accountDetails, password: '' });
    setError('');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to delete your account');
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete account: ${text}`);
      }

      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className={`account-page-container ${menuOpen ? 'sidebar-open' : ''}`}>
      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/welcome">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/portfolio">Portfolio</Link></li>
          <li><Link to="/" onClick={handleLogout}>Log out</Link></li>
          <li className="contact-support">Contact Support:<br />recipenest.support@gmail.com<br />Tel: +233 123456789</li>
        </ul>
      </div>

      <div className="account-container">
        <div className="menu-button" onClick={toggleMenu}>☰</div>

        <h1 className="account-title">Account Settings</h1>

        <div className="account-card">
          {isEditingAccount ? (
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={accountDetails.email}
                  onChange={handleAccountChange}
                  className="edit-input"
                  placeholder="Enter new email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={accountDetails.password}
                  onChange={handleAccountChange}
                  className="edit-input"
                  placeholder="Enter new password"
                />
              </div>
              <div className="edit-actions">
                <button className="save-btn" onClick={saveAccountEdit}>Save Changes</button>
                <button className="cancel-btn" onClick={cancelAccountEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="account-details">
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{accountDetails.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">Password:</span>
                <span className="value">********</span>
              </div>
              <div className="account-actions">
                <button className="edit-account-btn" onClick={() => setIsEditingAccount(true)}>
                  Edit Account
                </button>
                <button className="delete-account-btn" onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>© Developers Kwasi & Kemi • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default AccountPage;