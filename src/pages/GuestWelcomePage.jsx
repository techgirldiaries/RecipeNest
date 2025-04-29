import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';

const GuestWelcomePage = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topChefIndex, setTopChefIndex] = useState(0);
  const [showAllChefs, setShowAllChefs] = useState(false);
  const [showTopChefs, setShowTopChefs] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await fetch('/api/auth/chefs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch chefs: ${text}`);
        }

        const data = await response.json();
        const formattedChefs = data.map(chef => ({
          chefId: chef.chefId || chef.id || '',
          name: chef.name || 'Unknown',
          surname: chef.surname || '',
          bio: chef.bio || 'No bio available',
          profilePicture: chef.profilePicture || null,
          totalLikes: typeof chef.totalLikes === 'number' ? chef.totalLikes : 0,
        }));
        setChefs(formattedChefs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChefs();
  }, []);

  const topLikedChefs = chefs
    .filter(chef => chef.totalLikes > 0)
    .sort((a, b) => b.totalLikes - a.totalLikes)
    .slice(0, 3);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? chefs.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === chefs.length - 1 ? 0 : prevIndex + 1));
  };

  const handleTopPrev = () => {
    setTopChefIndex((prevIndex) => (prevIndex === 0 ? topLikedChefs.length - 1 : prevIndex - 1));
  };

  const handleTopNext = () => {
    setTopChefIndex((prevIndex) => (prevIndex === topLikedChefs.length - 1 ? 0 : prevIndex + 1));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('guestEmail');
    navigate('/');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="welcome-page">
      <nav className="guest-navbar">
        <ul className="guest-nav-list">
          <li><Link to="/guest-welcome" className="guest-nav-link">Home</Link></li>
          <li><Link to="/guest-recipes" className="guest-nav-link">Recipes</Link></li>
          <li><Link to="/guest-about" className="guest-nav-link">About</Link></li>
          <li><Link to="/" onClick={handleLogout}>Log out</Link></li>
        </ul>
      </nav>

      <main>
        <section className="about-hero">
          <div className="about-content">
            <h1>Welcome to RecipeNest</h1>
            <p>A sanctuary for chefs and food lovers to share, create, and savor the world’s flavors.</p>
            <div className="about-text">
              <p>At RecipeNest, we blend tradition with innovation, connecting culinary talents globally to inspire delicious stories.</p>
            </div>
          </div>
        </section>

        <div className="chefs-container">
          <section className="chefs-section">
            <h2>Our Culinary Stars</h2>
            <div className="chef-carousel-wrapper">
              <span className="view-all-link" onClick={() => setShowAllChefs(true)}>View All</span>
              <button className="carousel-arrow left" onClick={handlePrev} disabled={chefs.length <= 1}>{'<'}</button>
              <div className="chef-carousel">
                {chefs.length > 0 ? (
                  <Link to={`/guest/chef/${chefs[currentIndex].chefId}/view`} className="chef-link">
                    <div className="chef-item">
                      <img
                        src={chefs[currentIndex].profilePicture ? `data:image/jpeg;base64,${chefs[currentIndex].profilePicture}` : 'https://via.placeholder.com/150'}
                        alt={`${chefs[currentIndex].name} ${chefs[currentIndex].surname}`}
                        className="chef-avatar"
                      />
                      <h3>{chefs[currentIndex].name} {chefs[currentIndex].surname}</h3>
                      <p>{chefs[currentIndex].bio}</p>
                      <p className="chef-likes">Total Likes: {chefs[currentIndex].totalLikes}</p>
                    </div>
                  </Link>
                ) : (
                  <p>No chefs registered yet.</p>
                )}
              </div>
              <button className="carousel-arrow right" onClick={handleNext} disabled={chefs.length <= 1}>{'>'}</button>
            </div>
          </section>

          <section className="our-chefs">
            <h2>Our Top Chefs</h2>
            <div className="chef-carousel-wrapper">
              <span className="view-all-link" onClick={() => setShowTopChefs(true)}>View All</span>
              <button className="carousel-arrow left" onClick={handleTopPrev} disabled={topLikedChefs.length <= 1}>{'<'}</button>
              <div className="chef-carousel">
                {topLikedChefs.length > 0 ? (
                  <Link to={`/guest/chef/${topLikedChefs[topChefIndex].chefId}/view`} className="chef-link">
                    <div className="chef-item">
                      <img
                        src={topLikedChefs[topChefIndex].profilePicture ? `data:image/jpeg;base64,${topLikedChefs[topChefIndex].profilePicture}` : 'https://via.placeholder.com/150'}
                        alt={`${topLikedChefs[topChefIndex].name} ${topLikedChefs[topChefIndex].surname}`}
                        className="chef-avatar"
                      />
                      <h3>{topLikedChefs[topChefIndex].name} {topLikedChefs[topChefIndex].surname}</h3>
                      <p>{topLikedChefs[topChefIndex].bio}</p>
                      <p className="chef-likes">Total Likes: {topLikedChefs[topChefIndex].totalLikes}</p>
                    </div>
                  </Link>
                ) : (
                  <p>No chefs with likes yet.</p>
                )}
              </div>
              <button className="carousel-arrow right" onClick={handleTopNext} disabled={topLikedChefs.length <= 1}>{'>'}</button>
            </div>
          </section>
        </div>

        {showAllChefs && (
          <div className="chef-modal">
            <div className="chef-modal-content">
              <button className="close-modal-btn" onClick={() => setShowAllChefs(false)}>✕</button>
              <h2>All Culinary Stars</h2>
              <div className="chef-grid">
                {chefs.length > 0 ? (
                  chefs.map((chef) => (
                    <Link to={`/guest/chef/${chef.chefId}/view`} className="chef-link" key={chef.chefId}>
                      <div className="chef-item">
                        <img
                          src={chef.profilePicture ? `data:image/jpeg;base64,${chef.profilePicture}` : 'https://via.placeholder.com/150'}
                          alt={`${chef.name} ${chef.surname}`}
                          className="chef-avatar"
                        />
                        <h3>{chef.name} {chef.surname}</h3>
                        <p>{chef.bio}</p>
                        <p className="chef-likes">Total Likes: {chef.totalLikes}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>No chefs registered yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {showTopChefs && (
          <div className="chef-modal">
            <div className="chef-modal-content">
              <button className="close-modal-btn" onClick={() => setShowTopChefs(false)}>✕</button>
              <h2>All Top Chefs</h2>
              <div className="chef-grid">
                {topLikedChefs.length > 0 ? (
                  topLikedChefs.map((chef) => (
                    <Link to={`/guest/chef/${chef.chefId}/view`} className="chef-link" key={chef.chefId}>
                      <div className="chef-item">
                        <img
                          src={chef.profilePicture ? `data:image/jpeg;base64,${chef.profilePicture}` : 'https://via.placeholder.com/150'}
                          alt={`${chef.name} ${chef.surname}`}
                          className="chef-avatar"
                        />
                        <h3>{chef.name} {chef.surname}</h3>
                        <p>{chef.bio}</p>
                        <p className="chef-likes">Total Likes: {chef.totalLikes}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>No chefs with likes yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 • RecipeNest Group 3</p>
      </footer>
    </div>
  );
};

export default GuestWelcomePage;