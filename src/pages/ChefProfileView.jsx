import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/ChefProfileView.css';
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const ChefProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chef, setChef] = useState({
    name: '',
    surname: '',
    bio: '',
    description: '',
    picture: 'https://via.placeholder.com/150',
    instagram: '',
    linkedin: '',
    totalLikes: 0,
    recipes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [actionSubmitting, setActionSubmitting] = useState({});
  const [userActions, setUserActions] = useState({});

  useEffect(() => {
    const fetchChefData = async () => {
      try {
        const response = await fetch(`/api/auth/chefs/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch chef data: ${text}`);
        }

        const data = await response.json();
        setChef({
          name: data.name || '',
          surname: data.surname || '',
          bio: data.bio || '',
          description: data.description || '',
          picture: data.profilePicture ? `data:image/jpeg;base64,${data.profilePicture}` : 'https://via.placeholder.com/150',
          instagram: data.instagram || '',
          linkedin: data.linkedin || '',
          email: data.email || '',
          totalLikes: data.totalLikes || 0,
          recipes: data.recipes.map(recipe => ({
            ...recipe,
            likes: recipe.likes || 0,
            dislikes: recipe.dislikes || 0
          })) || []
        });
        setLoading(false);

        const storedActions = JSON.parse(localStorage.getItem('userActions') || '{}');
        setUserActions(storedActions);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChefData();
  }, [id]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userActions');
    navigate('/');
  };

  const handleLike = async (recipeId) => {
    if (actionSubmitting[recipeId]) return;

    const currentAction = userActions[recipeId];
    const isLiked = currentAction === 'liked';
    const isDisliked = currentAction === 'disliked';

    setActionSubmitting(prev => ({ ...prev, [recipeId]: 'like' }));
    try {
      const token = localStorage.getItem('token');
      let url = isLiked ? `/api/auth/${recipeId}/unlike` : `/api/auth/${recipeId}/like`;
      if (isDisliked) url = `/api/auth/${recipeId}/undislike`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to ${isLiked ? 'unlike' : isDisliked ? 'undislike' : 'like'} recipe: ${text}`);
      }

      const updatedRecipe = await response.json();

      if (isDisliked && !isLiked) {
        const likeResponse = await fetch(`/api/auth/${recipeId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!likeResponse.ok) {
          const text = await likeResponse.text();
          throw new Error(`Failed to like recipe after undisliking: ${text}`);
        }
        const likeUpdatedRecipe = await likeResponse.json();
        setChef(prev => ({
          ...prev,
          totalLikes: prev.recipes.reduce((sum, r) => sum + (r.id === recipeId ? likeUpdatedRecipe.likes : r.likes), 0),
          recipes: prev.recipes.map(recipe =>
            recipe.id === recipeId
              ? { ...recipe, likes: likeUpdatedRecipe.likes, dislikes: likeUpdatedRecipe.dislikes }
              : recipe
          )
        }));
        setUserActions(prev => {
          const newActions = { ...prev, [recipeId]: 'liked' };
          localStorage.setItem('userActions', JSON.stringify(newActions));
          return newActions;
        });
      } else {
        setChef(prev => ({
          ...prev,
          totalLikes: prev.recipes.reduce((sum, r) => sum + (r.id === recipeId ? updatedRecipe.likes : r.likes), 0),
          recipes: prev.recipes.map(recipe =>
            recipe.id === recipeId
              ? { ...recipe, likes: updatedRecipe.likes, dislikes: updatedRecipe.dislikes }
              : recipe
          )
        }));
        setUserActions(prev => {
          const newActions = { ...prev };
          if (isLiked) {
            delete newActions[recipeId];
          } else {
            newActions[recipeId] = 'liked';
          }
          localStorage.setItem('userActions', JSON.stringify(newActions));
          return newActions;
        });
      }
    } catch (err) {
      console.error(err.message);
      alert(`Failed to ${isLiked ? 'unlike' : 'like'} recipe. Please try again.`);
    } finally {
      setActionSubmitting(prev => ({ ...prev, [recipeId]: false }));
    }
  };

  const handleDislike = async (recipeId) => {
    if (actionSubmitting[recipeId]) return;

    const currentAction = userActions[recipeId];
    const isLiked = currentAction === 'liked';
    const isDisliked = currentAction === 'disliked';

    setActionSubmitting(prev => ({ ...prev, [recipeId]: 'dislike' }));
    try {
      const token = localStorage.getItem('token');
      let url = isDisliked ? `/api/auth/${recipeId}/undislike` : `/api/auth/${recipeId}/dislike`;
      if (isLiked) url = `/api/auth/${recipeId}/unlike`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to ${isDisliked ? 'undislike' : isLiked ? 'unlike' : 'dislike'} recipe: ${text}`);
      }

      const updatedRecipe = await response.json();

      if (isLiked && !isDisliked) {
        const dislikeResponse = await fetch(`/api/auth/${recipeId}/dislike`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!dislikeResponse.ok) {
          const text = await dislikeResponse.text();
          throw new Error(`Failed to dislike recipe after unliking: ${text}`);
        }
        const dislikeUpdatedRecipe = await dislikeResponse.json();
        setChef(prev => ({
          ...prev,
          totalLikes: prev.recipes.reduce((sum, r) => sum + (r.id === recipeId ? dislikeUpdatedRecipe.likes : r.likes), 0),
          recipes: prev.recipes.map(recipe =>
            recipe.id === recipeId
              ? { ...recipe, likes: dislikeUpdatedRecipe.likes, dislikes: dislikeUpdatedRecipe.dislikes }
              : recipe
          )
        }));
        setUserActions(prev => {
          const newActions = { ...prev, [recipeId]: 'disliked' };
          localStorage.setItem('userActions', JSON.stringify(newActions));
          return newActions;
        });
      } else {
        setChef(prev => ({
          ...prev,
          totalLikes: prev.recipes.reduce((sum, r) => sum + (r.id === recipeId ? updatedRecipe.likes : r.likes), 0),
          recipes: prev.recipes.map(recipe =>
            recipe.id === recipeId
              ? { ...recipe, likes: updatedRecipe.likes, dislikes: updatedRecipe.dislikes }
              : recipe
          )
        }));
        setUserActions(prev => {
          const newActions = { ...prev };
          if (isDisliked) {
            delete newActions[recipeId];
          } else {
            newActions[recipeId] = 'disliked';
          }
          localStorage.setItem('userActions', JSON.stringify(newActions));
          return newActions;
        });
      }
    } catch (err) {
      console.error(err.message);
      alert(`Failed to ${isDisliked ? 'undislike' : 'dislike'} recipe. Please try again.`);
    } finally {
      setActionSubmitting(prev => ({ ...prev, [recipeId]: false }));
    }
  };

  if (loading) return <div className="viewer-loading">Loading...</div>;
  if (error) return <div className="viewer-error-message">{error}</div>;

  return (
    <div className={`viewer-wrapper ${menuOpen ? 'viewer-sidebar-open' : ''}`}>
      <div className={`viewer-side-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/welcome">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/portfolio">Portfolio</Link></li>
          <li><Link to="/account">Account</Link></li>
          <li><Link to="/" onClick={handleLogout}>Log out</Link></li>
          <li className="viewer-contact-support">
            Contact:<br />
            recipenest.support@gmail.com<br />
            +233 123456789
          </li>
        </ul>
      </div>

      <main className="viewer-content">
        <div className="viewer-menu-button" onClick={toggleMenu}>☰</div>
        <header className="viewer-header">
          <img src={chef.picture} alt={`${chef.name} ${chef.surname}`} className="viewer-chef-pic" />
          <div className="viewer-chef-info">
            <h1 className="viewer-chef-name">{chef.name} {chef.surname}</h1>
            <p className="viewer-chef-bio">{chef.bio || 'No bio available'}</p>
            <p className="viewer-chef-likes">Total Likes: {chef.totalLikes}</p>
            <div className="viewer-social-links">
              {chef.instagram && (
                <a href={chef.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="viewer-social-icon" />
                </a>
              )}
              {chef.linkedin && (
                <a href={chef.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="viewer-social-icon" />
                </a>
              )}
                 {chef.email && (
                  <a href={`mailto:${chef.email}`} target="_blank" rel="noopener noreferrer">
                    <FaEnvelope className="guest-viewer-social-icon" />
                  </a>
                 )}
            </div>
          </div>
        </header>

        <section className="viewer-description">
          <h2>About</h2>
          <p>{chef.description || 'No description available'}</p>
        </section>

        <section className="viewer-recipes">
          <h2>Recipes</h2>
          {chef.recipes.length > 0 ? (
            <div className="viewer-recipe-grid">
              {chef.recipes.map((recipe) => (
                <div key={recipe.id} className="viewer-recipe-card">
                  <img
                    src={recipe.image || 'https://via.placeholder.com/100'}
                    alt={recipe.title}
                    className="viewer-recipe-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                  />
                  <div className="viewer-recipe-details">
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description.slice(0, 80)}...</p>
                    <div className="viewer-recipe-likes">
                      <button
                        onClick={() => handleLike(recipe.id)}
                        disabled={actionSubmitting[recipe.id]}
                        className={`viewer-like-button ${userActions[recipe.id] === 'liked' ? 'filled' : ''}`}
                      >
                        ♥ ({recipe.likes})
                      </button>
                      <button
                        onClick={() => handleDislike(recipe.id)}
                        disabled={actionSubmitting[recipe.id]}
                        className={`viewer-dislike-button ${userActions[recipe.id] === 'disliked' ? 'filled' : ''}`}
                      >
                        👎 ({recipe.dislikes})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="viewer-no-recipes">No recipes available.</p>
          )}
        </section>
      </main>

      <footer className="viewer-footer">
        <p>© Developers Kwasi & Kemi • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default ChefProfileView;