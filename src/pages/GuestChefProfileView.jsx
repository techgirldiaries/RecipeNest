import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/ChefProfileView.css';
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const GuestChefProfileView = () => {
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
    email: '',
    totalLikes: 0,
    recipes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChefData = async () => {
      try {
        const guestEmail = sessionStorage.getItem('guestEmail');
        const response = await fetch(`/api/auth/chefs/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Guest-Email': guestEmail || '',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch chef data: ${text}`);
        }

        const data = await response.json();
        console.log('Fetched recipes:', data.recipes);
        const guestActions = JSON.parse(sessionStorage.getItem('guestActions') || '{}');
        setChef({
          name: data.name || '',
          surname: data.surname || '',
          bio: data.bio || '',
          description: data.description || '',
          picture: data.profilePicture ? `data:image/jpeg;base64,${data.profilePicture}` : 'https://via.placeholder.com/150',
          instagram: data.instagram || '',
          linkedin: data.linkedin || '',
          email: data.email || '....@gmail.com',
          totalLikes: data.totalLikes || 0,
          recipes: data.recipes.map(recipe => ({
            ...recipe,
            id: recipe.id,
            likes: recipe.likes || 0,
            dislikes: recipe.dislikes || 0,
            userLiked: guestActions[recipe.id]?.liked || false,
            userDisliked: guestActions[recipe.id]?.disliked || false,
            
          })) || [],
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChefData();
  }, [id]);

  const handleLike = async (recipeId) => {
    const guestEmail = sessionStorage.getItem('guestEmail');
    if (!guestEmail) {
      alert('Please log in as a guest to like recipes.');
      return;
    }

    console.log('Liking recipe ID:', recipeId);
    try {
      const response = await fetch(`/api/recipes/${recipeId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Guest-Email': guestEmail,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to like recipe: ${text}`);
      }

      const data = await response.json();
      const guestActions = JSON.parse(sessionStorage.getItem('guestActions') || '{}');
      const recipe = chef.recipes.find(r => r.id === recipeId);
      const wasLiked = recipe.userLiked;
      const wasDisliked = recipe.userDisliked;

      if (!wasLiked && !wasDisliked) {
        guestActions[recipeId] = { liked: true, disliked: false };
      } else if (wasDisliked) {
        guestActions[recipeId] = { liked: true, disliked: false };
      } else {
        delete guestActions[recipeId]; // Undo like
      }

      sessionStorage.setItem('guestActions', JSON.stringify(guestActions));

      setChef(prevChef => {
        const updatedRecipes = prevChef.recipes.map(r =>
          r.id === recipeId
            ? {
                ...r,
                likes: data.likes,
                dislikes: data.dislikes,
                userLiked: !wasLiked && !wasDisliked ? true : false,
                userDisliked: false,
              }
            : r
        );
        const newTotalLikes = updatedRecipes.reduce((sum, r) => sum + r.likes, 0);
        return {
          ...prevChef,
          recipes: updatedRecipes,
          totalLikes: newTotalLikes,
        };
      });
    } catch (err) {
      console.error('Like Error:', err.message, err);
      alert(`Server error: ${err.message}`);
    }
  };

  const handleDislike = async (recipeId) => {
    const guestEmail = sessionStorage.getItem('guestEmail');
    if (!guestEmail) {
      alert('Please log in as a guest to dislike recipes.');
      return;
    }

    console.log('Disliking recipe ID:', recipeId);
    try {
      const response = await fetch(`/api/recipes/${recipeId}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Guest-Email': guestEmail,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to dislike recipe: ${text}`);
      }

      const data = await response.json();
      const guestActions = JSON.parse(sessionStorage.getItem('guestActions') || '{}');
      const recipe = chef.recipes.find(r => r.id === recipeId);
      const wasLiked = recipe.userLiked;
      const wasDisliked = recipe.userDisliked;

      if (!wasLiked && !wasDisliked) {
        guestActions[recipeId] = { liked: false, disliked: true };
      } else if (wasLiked) {
        guestActions[recipeId] = { liked: false, disliked: true };
      } else {
        delete guestActions[recipeId]; // Undo dislike
      }

      sessionStorage.setItem('guestActions', JSON.stringify(guestActions));

      setChef(prevChef => {
        const updatedRecipes = prevChef.recipes.map(r =>
          r.id === recipeId
            ? {
                ...r,
                likes: data.likes,
                dislikes: data.dislikes,
                userLiked: false,
                userDisliked: !wasDisliked && !wasLiked ? true : false,
              }
            : r
        );
        const newTotalLikes = updatedRecipes.reduce((sum, r) => sum + r.likes, 0);
        return {
          ...prevChef,
          recipes: updatedRecipes,
          totalLikes: newTotalLikes,
        };
      });
    } catch (err) {
      console.error('Dislike Error:', err.message, err);
      alert(`Server error: ${err.message}`);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('guestEmail');
    sessionStorage.removeItem('guestActions');
    navigate('/');
  };

  if (loading) return <div className="guest-loading">Loading...</div>;
  if (error) return <div className="guest-error-message">{error}</div>;

  return (
    <div className="guest-viewer-wrapper">
      <nav className="guest-viewer-navbar">
        <ul className="guest-viewer-nav-list">
          <li><Link to="/guest-welcome" className="guest-viewer-nav-link">Home</Link></li>
          <li><Link to="/guest-recipes" className="guest-viewer-nav-link">Recipes</Link></li>
          <li><Link to="/guest-about" className="guest-viewer-nav-link">About</Link></li>
          <li><Link to="/" onClick={handleLogout}>Log Out</Link></li>
        </ul>
      </nav>

      <main className="guest-viewer-content">
        <header className="guest-viewer-header">
          <img src={chef.picture} alt={`${chef.name} ${chef.surname}`} className="guest-viewer-chef-pic" />
          <div className="guest-viewer-chef-info">
            <h1 className="guest-viewer-chef-name">{chef.name} {chef.surname}</h1>
            <p className="guest-viewer-chef-bio">{chef.bio || 'No bio available'}</p>
            <p className="guest-viewer-chef-likes">Total Likes: {chef.totalLikes}</p>
            <div className="guest-viewer-social-links">
            {chef.instagram && (
                <a href={chef.instagram} target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="guest-viewer-social-icon" />
                </a>
              )}
              {chef.linkedin && (
                <a href={chef.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="guest-viewer-social-icon" />
                </a>
              )}
              {chef.email ? (
  <a href={`mailto:${chef.email}`} target="_blank" rel="noopener noreferrer">
    <FaEnvelope className="guest-viewer-social-icon" />
  </a>
) : (
  <span>No email available</span>
)}
            </div>
          </div>
        </header>

        <section className="guest-viewer-description">
          <h2>About</h2>
          <p>{chef.description || 'No description available'}</p>
        </section>

        <section className="guest-viewer-recipes">
          <h2>Recipes</h2>
          {chef.recipes.length > 0 ? (
            <div className="guest-viewer-recipe-grid">
              {chef.recipes.map((recipe) => (
                <div key={recipe.id} className="guest-viewer-recipe-card">
                  <img
                    src={recipe.image || 'https://via.placeholder.com/100'}
                    alt={recipe.title}
                    className="guest-viewer-recipe-image"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                  />
                  <div className="guest-viewer-recipe-details">
                    <h3>{recipe.title}</h3>
                    <p>{recipe.description.slice(0, 80)}...</p>
                    <div className="guest-viewer-recipe-likes">
                      <button
                        className={`guest-viewer-like-button ${recipe.userLiked ? 'filled' : ''}`}
                        onClick={() => handleLike(recipe.id)}
                      >
                        ♥ ({recipe.likes})
                      </button>
                      <button
                        className={`guest-viewer-dislike-button ${recipe.userDisliked ? 'filled' : ''}`}
                        onClick={() => handleDislike(recipe.id)}
                      >
                        👎 ({recipe.dislikes})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="guest-viewer-no-recipes">No recipes available.</p>
          )}
        </section>
      </main>

      <footer className="guest-viewer-footer">
        <p>© Developers Kwasi & Kemi • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default GuestChefProfileView;