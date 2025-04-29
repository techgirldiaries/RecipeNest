import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const ProfilePage = () => {
  const [chef, setChef] = useState({
    name: '',
    surname: '',
    title: '',
    bio: '',
    picture: 'https://via.placeholder.com/150',
    instagram: '',
    linkedin: '',
    email: ''
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPictureOptions, setShowPictureOptions] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChefData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile');
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
          throw new Error(`Failed to fetch profile data: ${text}`);
        }

        const data = await response.json();
        const email = data.email ? `mailto:${data.email}` : '';
        setChef({
          name: data.name || '',
          surname: data.surname || '',
          title: data.bio || '',
          bio: data.description || '',
          picture: data.profilePicture ? `data:image/jpeg;base64,${data.profilePicture}` : 'https://via.placeholder.com/150',
          instagram: data.instagram || '',
          linkedin: data.linkedin || '',
          email: email
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChefData();
  }, [navigate]);

  const handleChange = (e) => {
    setChef({ ...chef, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const imageUrl = URL.createObjectURL(file);
      setChef({ ...chef, picture: imageUrl });
      setShowPictureOptions(false);
    }
  };

  const handleRemovePicture = () => {
    setProfilePictureFile(null);
    setChef({ ...chef, picture: 'https://via.placeholder.com/150' });
    setShowPictureOptions(false);
  };

  const handleViewPicture = () => {
    window.open(chef.picture, '_blank');
    setShowPictureOptions(false);
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      const token = localStorage.getItem('token');
      try {
        const formData = new FormData();
        formData.append('name', chef.name || '');
        formData.append('surname', chef.surname || '');
        if (profilePictureFile) {
          formData.append('profilePicture', profilePictureFile);
        }
        formData.append('bio', chef.title || '');
        formData.append('description', chef.bio || '');
        formData.append('instagram', chef.instagram || '');
        formData.append('linkedin', chef.linkedin || '');

        const response = await fetch('/api/auth/me', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to update profile: ${text}`);
        }

        const updatedResponse = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const updatedData = await updatedResponse.json();
        setChef({
          name: updatedData.name || '',
          surname: updatedData.surname || '',
          title: updatedData.bio || '',
          bio: updatedData.description || '',
          picture: updatedData.profilePicture ? `data:image/jpeg;base64,${updatedData.profilePicture}` : 'https://via.placeholder.com/150',
          instagram: updatedData.instagram || '',
          linkedin: updatedData.linkedin || '',
          email: updatedData.email ? `mailto:${updatedData.email}` : ''
        });
        setProfilePictureFile(null);
      } catch (err) {
        setError(err.message);
      }
    }
    setIsEditing(!isEditing);
    setShowPictureOptions(false);
  };

  const togglePictureOptions = () => {
    setShowPictureOptions(!showPictureOptions);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // Split chef.title into location and age
  const [location, age] = chef.title ? chef.title.split(', ') : ['', ''];

  return (
    <div className={`profile-page-container ${menuOpen ? 'sidebar-open' : ''}`}>
      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/welcome">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/portfolio">Portfolio</Link></li>
          <li><Link to="/account">Account</Link></li>
          <li><Link to="/" onClick={handleLogout}>Log out</Link></li>
          <li className="contact-support">Contact Support:<br />recipenest.support@gmail.com<br />Tel: +233 123456789</li>
        </ul>
      </div>

      <div className={`profile-container ${isEditing ? 'editing' : ''}`}>
        <div className="menu-button" onClick={toggleMenu}>☰</div>

        <div className="profile-header">
          <img src={chef.picture} alt={`${chef.name} Profile`} className="profile-pic" />
          {isEditing && (
            <div className="edit-picture-section">
              <label className="edit-label edit-picture-label" onClick={togglePictureOptions}>
                Edit Profile Picture
              </label>
              {showPictureOptions && (
                <div className="picture-options-box">
                  <button type="button" onClick={handleRemovePicture} className="option-btn">
                    Remove Picture
                  </button>
                  <label className="option-btn upload-option">
                    Upload from Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="upload-input"
                    />
                  </label>
                  <button type="button" onClick={handleViewPicture} className="option-btn">
                    View Picture
                  </button>
                </div>
              )}
            </div>
          )}

          {isEditing ? (
            <>
              <label className="edit-label">Edit Name</label>
              <input
                type="text"
                name="name"
                value={chef.name}
                onChange={handleChange}
                className="edit-input"
              />
              <label className="edit-label">Edit Surname</label>
              <input
                type="text"
                name="surname"
                value={chef.surname}
                onChange={handleChange}
                className="edit-input"
              />
              <label className="edit-label">Edit Bio</label>
              <input
                type="text"
                name="title"
                value={chef.title}
                onChange={handleChange}
                className="edit-input"
              />
            </>
          ) : (
            <>
              <h1 className="chef-name">{chef.name} {chef.surname}</h1>
              <h2 className="chef-title">
                <span className="location">{location}</span>
                <span className="age">{age}</span>
              </h2>
            </>
          )}
        </div>

        <div className="profile-bio">
          {isEditing ? (
            <>
              <label className="edit-label">Edit Description</label>
              <textarea
                name="bio"
                value={chef.bio}
                onChange={handleChange}
                className="edit-textarea"
              />
            </>
          ) : (
            <p>{chef.bio}</p>
          )}
        </div>

        <div className="social-links">
          {isEditing ? (
            <>
              <label className="edit-label">Socials</label>
              <input
                type="url"
                name="instagram"
                value={chef.instagram}
                onChange={handleChange}
                className="edit-input"
                placeholder="Instagram URL"
              />
              <input
                type="url"
                name="linkedin"
                value={chef.linkedin}
                onChange={handleChange}
                className="edit-input"
                placeholder="LinkedIn URL"
              />
              <input
                type="email"
                name="email"
                value={chef.email}
                onChange={handleChange}
                className="edit-input"
                placeholder="mailto:email@example.com"
              />
            </>
          ) : (
            <>
              {chef.instagram && (
                <a href={chef.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="social-icon" />
                </a>
              )}
              {chef.linkedin && (
                <a href={chef.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="social-icon" />
                </a>
              )}
              {chef.email && (
                <a href={chef.email}>
                  <FaEnvelope className="social-icon" />
                </a>
              )}
            </>
          )}
        </div>

        <button className="edit-profile-btn" onClick={handleEditToggle}>
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </button>
      </div>

      <footer className="footer">
        <p>© Developers Kwasi & Kemi</p>
      </footer>
    </div>
  );
};

export default ProfilePage;