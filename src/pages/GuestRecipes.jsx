import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/WelcomePage.css';

const GuestRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guestInteractions, setGuestInteractions] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const guestEmail = sessionStorage.getItem('guestEmail');
        if (!guestEmail) throw new Error('Guest not identified. Please log in.');

        const response = await fetch('/api/auth/recipes/all', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch recipes');
        const data = await response.json();
        setRecipes(data);
        setLoading(false);

        const initialInteractions = {};
        const initialDescriptions = {};
        data.forEach(recipe => {
          initialInteractions[recipe.id] = null; // No action yet
          initialDescriptions[recipe.id] = false; // Collapsed by default
        });
        setGuestInteractions(initialInteractions);
        setExpandedDescriptions(initialDescriptions);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleInteraction = async (recipeId, action) => {
    const guestEmail = sessionStorage.getItem('guestEmail');
    if (!guestEmail) {
      setError('Please log in to like or dislike recipes.');
      return;
    }
  
    const currentAction = guestInteractions[recipeId];
    const isTogglingOff = currentAction === action; // True if unliking/undisliking
  
    // Optimistic UI update
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? {
              ...recipe,
              likes:
                action === 'like'
                  ? isTogglingOff
                    ? recipe.likes - 1 // Unlike
                    : recipe.likes + 1 // Like
                  : recipe.likes,
              dislikes:
                action === 'dislike'
                  ? isTogglingOff
                    ? recipe.dislikes - 1 // Undislike
                    : recipe.dislikes + 1 // Dislike
                  : recipe.dislikes,
            }
          : recipe
      )
    );
    setGuestInteractions(prev => ({
      ...prev,
      [recipeId]: isTogglingOff ? null : action,
    }));
  
    // Sync with backend
    try {
      const response = await fetch(`/api/recipes/${recipeId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Guest-Email': guestEmail,
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to ${action} recipe: ${errorText}`);
      }
  
      // Fetch the updated recipe to ensure sync
      console.log('Fetching updated recipe for ID:', recipeId);
      const updatedResponse = await fetch(`/api/recipes/${recipeId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (updatedResponse.status === 404) {
        console.warn(`Recipe with ID ${recipeId} not found. Removing from state.`);
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
        return;
      }
  
      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated recipe data');
      }
  
      const updatedRecipe = await updatedResponse.json();
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe.id === recipeId ? updatedRecipe : recipe
        )
      );
    } catch (err) {
      setError(err.message);
  
      // Rollback on failure
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe.id === recipeId
            ? {
                ...recipe,
                likes:
                  action === 'like'
                    ? isTogglingOff
                      ? recipe.likes + 1 // Revert unlike
                      : recipe.likes - 1 // Revert like
                    : recipe.likes,
                dislikes:
                  action === 'dislike'
                    ? isTogglingOff
                      ? recipe.dislikes + 1 // Revert undislike
                      : recipe.dislikes - 1 // Revert dislike
                    : recipe.dislikes,
              }
            : recipe
        )
      );
      setGuestInteractions(prev => ({ ...prev, [recipeId]: currentAction }));
    }
  };

  const toggleDescription = (recipeId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId],
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error} <button onClick={() => setError('')}>Dismiss</button></div>;

  return (
    <div className="welcome-page">
      <nav className="guest-navbar">
        <ul className="guest-nav-list">
          <li><Link to="/guest-welcome" className="guest-nav-link">Home</Link></li>
          <li><Link to="/guest-recipes" className="guest-nav-link">Recipes</Link></li>
          <li><Link to="/guest-about" className="guest-nav-link">About</Link></li>
          <li><Link to="/" onClick={() => sessionStorage.removeItem('guestEmail')}>Log Out</Link></li>
        </ul>
      </nav>
      <main>
        <section className="recipes-section">
          <h1>All Recipes</h1>
          <div className="recipes-grid">
            {recipes.length > 0 ? (
              recipes.map(recipe => (
                <div key={recipe.id} className="recipe-card chef-style">
                  <div className="recipe-image-container">
                    <img
                      src={
                        recipe.image && recipe.image.startsWith('data:image')
                          ? recipe.image
                          : 'https://via.placeholder.com/100'
                      }
                      alt={recipe.title}
                      className="recipe-image"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                    />
                  </div>
                  <div className="recipe-details">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    <p className="recipe-description">
                      {expandedDescriptions[recipe.id]
                        ? recipe.description
                        : `${recipe.description.slice(0, 80)}...`}
                      <span
                        className="read-more-link"
                        onClick={() => toggleDescription(recipe.id)}
                      >
                        {expandedDescriptions[recipe.id] ? ' read less' : ' read more'}
                      </span>
                    </p>
                    <div className="recipe-likes">
                      <button
                        className={`like-btn ${guestInteractions[recipe.id] === 'like' ? 'active' : ''}`}
                        onClick={() => handleInteraction(recipe.id, 'like')}
                      >
                        ♥ ({recipe.likes})
                      </button>
                      <button
                        className={`dislike-btn ${guestInteractions[recipe.id] === 'dislike' ? 'active' : ''}`}
                        onClick={() => handleInteraction(recipe.id, 'dislike')}
                      >
                        👎 ({recipe.dislikes})
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-recipes">No recipes available.</p>
            )}
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>© 2025 • RecipeNest Group 3</p>
      </footer>
    </div>
  );
};

export default GuestRecipes;