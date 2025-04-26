import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useLogin } from '../../api/authHook';
import FormGroup from '../molecules/FormGroup';
import Button from '../atoms/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string>('');
  
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const { darkMode } = useThemeStore();
  
  // React Query mutation hook
  const loginMutation = useLogin();
  
  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated && checkAuth()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, checkAuth, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Form validation
    if (!email || !password) {
      setLocalError('Fill required fields.');
      return;
    }

    // Execute the login mutation
    loginMutation.mutate({ email, password });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (localError) setLocalError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear error when user starts typing
    if (localError) setLocalError('');
  };

  // Show either local validation error or mutation error
  const error = localError || (loginMutation.isError ? 'Invalid credentials. Please try again.' : '');

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className={`max-w-md w-full p-8 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormGroup
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="academy@gmail.com"
            required
          />
          
          <div className="mb-6">
            <label htmlFor="password" className={`block mb-2 text-sm font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
                value={password}
                onChange={handlePasswordChange}
                placeholder="academy123"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Hide</span>
                ) : (
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Show</span>
                )}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            disabled={loginMutation.isPending}
            fullWidth
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;