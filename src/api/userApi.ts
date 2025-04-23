import { useAuthStore } from '../store/authStore';
import { ApiResponse, UserInput, UserResponse } from './types';

/**
 * Get authenticated headers for API requests
 */
const getAuthHeaders = () => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) throw new Error('Authentication required');
  
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Handle API response and errors consistently
 */
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      useAuthStore.getState().logout();
      throw new Error('Your session has expired. Please login again.');
    }
    throw new Error(`API Error: ${response.status}`);
  }
  
  return await response.json();
};

/**
 * Fetches users with optional search parameter
 */
export const getUsers = async (search?: string): Promise<UserResponse[]> => {
  const url = search 
    ? `/api/users?search=${encodeURIComponent(search)}` 
    : '/api/users';

  const response = await fetch(url, {
    headers: getAuthHeaders()
  });

  const data: ApiResponse<{ users: UserResponse[] }> = await handleApiResponse(response);
  return data.result.data.users;
};

/**
 * Fetches a single user by ID
 */
export const getUser = async (id: string): Promise<UserResponse> => {
  const response = await fetch(`/api/users/${id}`, {
    headers: getAuthHeaders()
  });

  const data: ApiResponse<{ user: UserResponse }> = await handleApiResponse(response);
  return data.result.data.user;
};

/**
 * Creates a new user
 */
export const createUser = async (userData: UserInput): Promise<UserResponse> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });

  const data: ApiResponse<{ user: UserResponse }> = await handleApiResponse(response);
  return data.result.data.user;
};

/**
 * Updates an existing user
 */
export const updateUser = async (id: string, userData: UserInput): Promise<UserResponse> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });

  const data: ApiResponse<{ user: UserResponse }> = await handleApiResponse(response);
  return data.result.data.user;
};

/**
 * Deletes a user
 */
export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  await handleApiResponse(response);
};