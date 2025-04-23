import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "./userApi";
import { UserInput, UserResponse } from "./types";

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
    staleTime: 30000, // Data remains fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes (renamed from cacheTime)
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
    staleTime: 60000, // 1 minute - individual user data changes less frequently
  });
};

/**
 * Prefetch a user's data
 * Use this when hovering over edit buttons to improve perceived performance
 */
export const usePrefetchUser = () => {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    if (!id) return;
    
    queryClient.prefetchQuery({
      queryKey: [USER_QUERY_KEY, id],
      queryFn: () => getUser(id),
      staleTime: 60000, // 1 minute
    });
  };
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
    // Optimistic update
    onMutate: async (newUserData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [USER_QUERY_KEY, id] });
      await queryClient.cancelQueries({ queryKey: [USERS_QUERY_KEY] });
      
      // Snapshot the previous values
      const previousUserData = queryClient.getQueryData<UserResponse>([USER_QUERY_KEY, id]);
      const previousUsers = queryClient.getQueryData<UserResponse[]>([USERS_QUERY_KEY]);
      
      // Optimistically update the user detail
      if (previousUserData) {
        queryClient.setQueryData<UserResponse>([USER_QUERY_KEY, id], old => ({
          ...old!,
          ...newUserData,
        }));
      }
      
      // Optimistically update the users list
      if (previousUsers) {
        queryClient.setQueryData<UserResponse[]>([USERS_QUERY_KEY], old => 
          old?.map(user => user.id === id ? { ...user, ...newUserData } : user) || []
        );
      }
      
      // Return a context object with the snapshotted values
      return { previousUserData, previousUsers };
    },
    onError: (error, newUserData, context) => {
      // If the mutation fails, roll back to the previous values
      if (context?.previousUserData) {
        queryClient.setQueryData([USER_QUERY_KEY, id], context.previousUserData);
      }
      if (context?.previousUsers) {
        queryClient.setQueryData([USERS_QUERY_KEY], context.previousUsers);
      }
      toast.error(error.message || "Failed to update user");
    },
    onSettled: () => {
      // Always invalidate the queries to ensure they're up to date with the server
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      toast.success("User updated successfully");
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
    // Optimistic update for delete
    onMutate: async (deletedId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [USERS_QUERY_KEY] });
      
      // Snapshot the previous users list
      const previousUsers = queryClient.getQueryData<UserResponse[]>([USERS_QUERY_KEY]);
      
      // Optimistically update the users list
      if (previousUsers) {
        queryClient.setQueryData<UserResponse[]>([USERS_QUERY_KEY], old => 
          old?.filter(user => user.id !== deletedId) || []
        );
      }
      
      // Return the previous users list for potential rollback
      return { previousUsers };
    },
    onError: (error, deletedId, context) => {
      // If the mutation fails, roll back to the previous users list
      if (context?.previousUsers) {
        queryClient.setQueryData([USERS_QUERY_KEY], context.previousUsers);
      }
      toast.error(error.message || "Failed to delete user");
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
    },
    onSettled: () => {
      // Always invalidate the users list query to ensure it's up to date with the server
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
};