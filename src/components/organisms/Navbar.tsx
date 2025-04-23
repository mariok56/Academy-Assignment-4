import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import Button from '../atoms/Button';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { darkMode, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          User Management
        </Link>
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/dashboard/new')}
          >
            Add User
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
          <button 
            onClick={toggleTheme}
            className="bg-primary text-white font-semibold py-2 px-4 rounded hover:bg-primary-dark transition"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;