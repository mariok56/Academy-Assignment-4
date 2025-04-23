import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "./userApi";
import { UserInput } from "./types";

// Query key constants
export const USERS_QUERY_KEY = "users";
export const USER_QUERY_KEY = "user";

/**
 * Hook to fetch users with optional search
 */
export const useUsers = (search?: string) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, { search }],
    queryFn: () => getUsers(search),
  });
};

/**
 * Hook to fetch a single user by ID
 */
export const useUser = (id: string) => {
  return useQuery({
    queryKey: [USER_QUERY_KEY, id],
    queryFn: () => getUser(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: UserInput) => createUser(userData),
    onSuccess: () => {
      // Invalidate the users list query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      toast.success("User created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create user");
    },
  });
};

/**
 * Hook to update an existing user
 */
export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: UserInput) => updateUser(id, userData),
    onSuccess: () => {
      // Invalidate both the users list and the specific user
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, id] });
      toast.success("User updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      // Invalidate the users list query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      toast.success("User deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
};