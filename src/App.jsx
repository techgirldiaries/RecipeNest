import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import GuestWelcomePage from './pages/GuestWelcomePage';
import ProfilePage from "./pages/ProfilePage"; 
import PortfolioPage from "./pages/PortfolioPage"; 
import AccountPage from "./pages/AccountPage";
import DashboardPage from "./pages/DashboardPage";
import GuestChefProfileView from "./pages/GuestChefProfileView";
import ChefProfileView from "./pages/ChefProfileView"; 
import GuestRecipes from "./pages/GuestRecipes"; 
import GuestAbout from "./pages/GuestAbout"; 



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/guest-welcome" element={<GuestWelcomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/guest/chef/:id/view" element={<GuestChefProfileView />} />
        <Route path="/chef/:id/view" element={<ChefProfileView />} />
        <Route path="/guest-recipes" element={<GuestRecipes />} /> 
        <Route path="/guest-about" element={<GuestAbout />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;