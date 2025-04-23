import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useDeleteUser, usePrefetchUser, useUsers } from '../../api/userHooks';
import { UserResponse } from '../../api/types';
import { User } from '../../types/User';
import { useDebounce } from '../../hooks/useDebouce';

import SearchBar from '../molecules/SearchBar';
import UserCard from './UserCard';
import Spinner from '../atoms/Spinner';
import ConfirmationModal from '../molecules/ConfirmationModal';
import Button from '../atoms/Button';

const UserList: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [lastDeleteAttempt, setLastDeleteAttempt] = useState<string | null>(null);
  
  
  const debouncedSearchTerm = useDebounce(searchInput, 500);
  
  const navigate = useNavigate();
  

  const { data: users, isLoading, error, refetch } = useUsers(debouncedSearchTerm);
  
  const deleteUserMutation = useDeleteUser();
  

  const prefetchUser = usePrefetchUser();

  
  const transformUser = useCallback((user: UserResponse): User => {
    return {
      id: user.id, 
      firstName: user.firstName,
      lastName: user.lastName || '',
      initials: getInitials(user.firstName, user.lastName),
      email: user.email,
      status: user.status.toLowerCase() === 'active' ? 'active' : 'locked',
      dob: user.dateOfBirth
    };
  }, []);
  
  // Get user initials for avatar
  const getInitials = (firstName: string, lastName?: string): string => {
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  
  const handleEditUser = useCallback((userId: string) => {
    navigate(`/dashboard/edit/${userId}`);
  }, [navigate]);
  
  
  const handleEditHover = useCallback((userId: string) => {
    prefetchUser(userId);
  }, [prefetchUser]);
  
  
  const handleDeleteUser = useCallback((userId: string) => {
    setDeleteUserId(userId);
    const user = users?.find(u => u.id === userId);
    if (user) {
      setUserToDelete(transformUser(user));
    }
    setShowDeleteModal(true);
  }, [users, transformUser]);
  
  
  const confirmDelete = useCallback(() => {
    if (deleteUserId) {
      setLastDeleteAttempt(deleteUserId);
      deleteUserMutation.mutate(deleteUserId, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setDeleteUserId(null);
          setUserToDelete(null);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Failed to delete user');
          
        }
      });
    }
  }, [deleteUserId, deleteUserMutation]);
  
  
  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteUserId(null);
    setUserToDelete(null);
  }, []);
  

  const retryDelete = useCallback(() => {
    if (lastDeleteAttempt) {
      deleteUserMutation.mutate(lastDeleteAttempt);
    }
  }, [lastDeleteAttempt, deleteUserMutation]);

  
  const clearSearch = useCallback(() => {
    setSearchInput('');
  }, []);

  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <Spinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 rounded-md bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100">
          <p>{error instanceof Error ? error.message : 'An error occurred while fetching users'}</p>
          <Button 
            variant="primary" 
            onClick={() => refetch()} 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (!users || users.length === 0) {
      return (
        <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800 text-center">
          {searchInput ? (
            <>
              <p className="mb-2">No users found matching "{searchInput}"</p>
              <Button variant="secondary" onClick={clearSearch}>
                Clear Search
              </Button>
            </>
          ) : (
            <p>No users found. Add your first user!</p>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map(user => (
          <UserCard 
            key={user.id} 
            user={transformUser(user)} 
            onDelete={handleDeleteUser}
            onEdit={handleEditUser}
            onEditHover={handleEditHover}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Enhanced SearchBar with icon and clear button */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search users..."
            value={searchInput}
            onChange={handleSearchChange}
          />
          {searchInput && (
            <button 
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={clearSearch}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      {renderContent()}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete User"
        message={
          userToDelete ? (
            <>
              <p>Are you sure you want to delete:</p>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                <p className="font-bold">{userToDelete.firstName} {userToDelete.lastName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-300">{userToDelete.email}</p>
              </div>
              <p className="mt-2 text-sm text-red-500">This action cannot be undone.</p>
            </>
          ) : (
            "Are you sure you want to delete this user? This action cannot be undone."
          )
        }
        confirmLabel={deleteUserMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      
      {/* Show error message with retry option */}
      {deleteUserMutation.isError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md">
          <p>Failed to delete user: {deleteUserMutation.error instanceof Error ? deleteUserMutation.error.message : 'Unknown error'}</p>
          <button 
            onClick={retryDelete} 
            className="underline ml-2"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;