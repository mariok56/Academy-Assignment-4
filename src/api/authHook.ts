import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { authApi } from './authApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await authApi.login(credentials);
    },
    onSuccess: (data) => {
      login(data.result.data.accessToken, data.result.data.expiresIn);
      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    },
    onError: (error: any) => {
      const errorMessage = error.message || 'An error occurred. Please try again.';
      toast.error(errorMessage);
    }
  });
};
