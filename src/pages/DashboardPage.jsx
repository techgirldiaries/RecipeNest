import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/DashboardPage.css';
import { FaUser, FaBook, FaCog, FaChartBar } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChefDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [analyticsBannerOpen, setAnalyticsBannerOpen] = useState(false); // New state for banner
  const [dashboardData, setDashboardData] = useState({
    recipesCount: 0,
    profileViews: 0,
    recentRecipes: [],
    viewAnalytics: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your dashboard');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        const response = await fetch('/api/auth/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        setDashboardData({
          recipesCount: data.recipesCount,
          profileViews: data.profileViews,
          recentRecipes: data.recipesCount > 0 ? data.recentRecipes : [],
          viewAnalytics: data.viewAnalytics
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleActivity = () => setActivityOpen(!activityOpen);
  const toggleAnalyticsBanner = () => setAnalyticsBannerOpen(!analyticsBannerOpen); // Toggle banner

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const chartData = {
    labels: dashboardData.viewAnalytics.map(a => new Date(a.date).toLocaleDateString()),
    datasets: [{
      label: 'Profile Views',
      data: dashboardData.viewAnalytics.map(a => a.views),
      backgroundColor: 'rgba(248, 180, 0, 0.85)',
      borderColor: '#d99a00',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#fff', font: { size: 14 } } },
      title: { display: true, text: 'Profile Views (Last 7 Days)', color: '#fff', font: { size: 20, family: 'Poppins' } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Views', color: '#fff' }, ticks: { color: '#ddd' } },
      x: { title: { display: true, text: 'Date', color: '#fff' }, ticks: { color: '#ddd' } }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className={`dashboard-wrapper ${menuOpen ? 'sidebar-open' : ''}`}>
      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/welcome">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/portfolio">Portfolio</Link></li>
          <li><Link to="/account">Account</Link></li>
          <li><Link to="/" onClick={handleLogout}>Log out</Link></li>
          <li className="contact-support">Contact:<br />recipenest.support@gmail.com<br />+233 123456789</li>
        </ul>
      </div>

      <main className="dashboard-content">
        <div className="menu-button" onClick={toggleMenu}>☰</div>
        <header className="dashboard-header">
          <p className="tip">Dashboard</p>
        </header>

        <section className="stats-grid">
          <div className="stat-box">
            <h3>Recipes</h3>
            <span>{dashboardData.recipesCount}</span>
          </div>
          <div className="stat-box">
            <h3>Profile Views</h3>
            <span>{dashboardData.profileViews}</span>
          </div>
        </section>

        <section className="actions-grid">
          <Link to="/profile" className="action-card">
            <FaUser className="icon" />
            <h3>Edit Profile</h3>
          </Link>
          <Link to="/portfolio" className="action-card">
            <FaBook className="icon" />
            <h3>Manage Recipes</h3>
          </Link>
          <Link to="/account" className="action-card">
            <FaCog className="icon" />
            <h3>Account Settings</h3>
          </Link>
          <div className="action-card" onClick={toggleActivity}>
            <FaChartBar className="icon" />
            <h3>Activity</h3>
          </div>
        </section>

        {activityOpen && (
          <div className="activity-container">
            <h2>Activity Overview</h2>
            <div className="activity-item">
              <h3>Recent User Interactions</h3>
              <p>[Placeholder for likes, comments, shares]</p>
            </div>
            <div className="activity-item">
              <h3>Posting Activity</h3>
              <p>[Placeholder for recent uploads]</p>
            </div>
            <div className="activity-item">
              <h3>Follower Growth</h3>
              <p>[Placeholder for new followers]</p>
            </div>
            <div className="activity-item">
              <h3>Top Active Recipes</h3>
              <p>[Placeholder for trending recipes]</p>
            </div>
            <div className="activity-item">
              <h3>Engagement Highlights</h3>
              <p>[Placeholder for total likes, comments, views]</p>
            </div>
            <button className="close-activity-btn" onClick={toggleActivity}>Close</button>
          </div>
        )}

        <section className="analytics-box">
          <button className="view-link" onClick={toggleAnalyticsBanner}>View</button>
          <Bar data={chartData} options={chartOptions} />
        </section>

        {analyticsBannerOpen && (
          <div className="analytics-banner">
            <div className="analytics-banner-content">
              <button className="close-banner-btn" onClick={toggleAnalyticsBanner}>✕</button>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        )}

        <section className="recent-recipes-box">
          <h2>Recent Recipes</h2>
          <div className="recipes-list">
            {dashboardData.recentRecipes.length > 0 ? (
              dashboardData.recentRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description.slice(0, 60)}...</p>
                </div>
              ))
            ) : (
              <p className="no-recipes">No recent recipes yet.</p>
            )}
          </div>
          <Link to="/portfolio" className="view-all">View All Recipes</Link>
        </section>

        <div className="support-link">
          <p>Need Help? <span>Contact Support</span></p>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>Developers © Kwasi & Kemi</p>
      </footer>
    </div>
  );
};

export default ChefDashboard;