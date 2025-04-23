import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import Spinner from '../components/atoms/Spinner';

const AuthLayout: React.FC = () => {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { darkMode } = useThemeStore();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Check if token is valid on component mount
    const isValid = checkAuth();
    if (!isValid) {
      navigate('/login');
    }
    setIsChecking(false);
  }, [checkAuth, navigate]);
  
  // Show loading indicator while checking auth
  if (isChecking) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;