import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/PortfolioPage.css';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const PortfolioPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedRecipes, setExpandedRecipes] = useState({});
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [editedRecipes, setEditedRecipes] = useState({});
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [newRecipe, setNewRecipe] = useState({ title: '', description: '', image: '' });
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your portfolio');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        const response = await fetch('/api/auth/recipes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch recipes: ${text}`);
        }

        const data = await response.json();
        setRecipes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [navigate]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleReadMore = (id) => {
    setExpandedRecipes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEditing = (recipe) => {
    setEditingRecipeId(recipe.id);
    setEditedRecipes({ ...editedRecipes, [recipe.id]: { ...recipe } });
  };

  const handleEditChange = (id, field, value) => {
    setEditedRecipes((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleEditImageChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleEditChange(id, 'image', reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/auth/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editedRecipes[id]),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to update recipe: ${text}`);
      }

      setRecipes(recipes.map(r => (r.id === id ? editedRecipes[id] : r)));
      setEditingRecipeId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => setEditingRecipeId(null);

  const handleDeleteRecipe = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/auth/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete recipe: ${text}`);
      }

      setRecipes(recipes.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddRecipe = () => setIsAddingRecipe(true);

  const handleNewRecipeChange = (e) => {
    setNewRecipe({ ...newRecipe, [e.target.name]: e.target.value });
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewRecipe({ ...newRecipe, image: reader.result }); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const saveNewRecipe = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/auth/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newRecipe),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to add recipe: ${text}`);
      }

      const data = await response.json();
      setRecipes([...recipes, { id: data.id, ...newRecipe }]);
      setIsAddingRecipe(false);
      setNewRecipe({ title: '', description: '', image: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelAddRecipe = () => {
    setIsAddingRecipe(false);
    setNewRecipe({ title: '', description: '', image: '' });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className={`portfolio-page-container ${menuOpen ? 'sidebar-open' : ''}`}>
      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/welcome">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/account">Account</Link></li>
          <li><Link to="/" onClick={handleLogout}>Log out</Link></li>
          <li className="contact-support">Contact Support:<br />recipenest.support@gmail.com<br />Tel: +233 123456789</li>
        </ul>
      </div>

      <div className="portfolio-container">
        <div className="menu-button" onClick={toggleMenu}>☰</div>
        <h1 className="portfolio-title">My Recipe Portfolio</h1>

        <div className="add-recipe-section">
          <button className="add-recipe-btn" onClick={handleAddRecipe}>Add Recipe</button>
        </div>

        {isAddingRecipe && (
          <div className="add-recipe-form">
            <input
              type="text"
              name="title"
              value={newRecipe.title}
              onChange={handleNewRecipeChange}
              className="edit-input"
              placeholder="Recipe Title"
            />
            <textarea
              name="description"
              value={newRecipe.description}
              onChange={handleNewRecipeChange}
              className="edit-textarea"
              rows="2"
              placeholder="Description/Instructions"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleNewImageChange}
              className="edit-input"
            />
            <div className="edit-actions">
              <button className="save-btn" onClick={saveNewRecipe}>Save</button>
              <button className="cancel-btn" onClick={cancelAddRecipe}>Cancel</button>
            </div>
          </div>
        )}

        <div className="recipe-list">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              {editingRecipeId === recipe.id ? (
                <>
                  <input
                    type="text"
                    value={editedRecipes[recipe.id]?.title || recipe.title}
                    onChange={(e) => handleEditChange(recipe.id, 'title', e.target.value)}
                    className="edit-input"
                  />
                  <textarea
                    value={editedRecipes[recipe.id]?.description || recipe.description}
                    onChange={(e) => handleEditChange(recipe.id, 'description', e.target.value)}
                    className="edit-textarea"
                    rows="2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEditImageChange(recipe.id, e)}
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button className="save-btn" onClick={() => saveEdit(recipe.id)}>Save</button>
                    <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <h2>{editedRecipes[recipe.id]?.title || recipe.title}</h2>
                  <p><strong>Description:</strong> {expandedRecipes[recipe.id]
                    ? (editedRecipes[recipe.id]?.description || recipe.description)
                    : `${(editedRecipes[recipe.id]?.description || recipe.description).slice(0, 100)}...`}</p>
                  {recipe.image && <img src={recipe.image} alt={recipe.title} className="recipe-image" />}
                  <button className="read-more-btn" onClick={() => toggleReadMore(recipe.id)}>
                    {expandedRecipes[recipe.id] ? 'Read Less' : 'Read More'}
                  </button>
                  <div className="recipe-actions">
                    <button className="edit-recipe-btn" onClick={() => startEditing(recipe)}>Edit</button>
                    <button className="delete-recipe-btn" onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
                  </div>
                  <div className="social-share">
                    <a href={`https://instagram.com/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="share-icon" />
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check out this recipe: ${encodeURIComponent(recipe.title)}`} target="_blank" rel="noopener noreferrer">
                      <FaTwitter className="share-icon" />
                    </a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer">
                      <FaFacebook className="share-icon" />
                    </a>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>© Developers Kwasi & Kemi</p>
      </footer>
    </div>
  );
};

export default PortfolioPage;