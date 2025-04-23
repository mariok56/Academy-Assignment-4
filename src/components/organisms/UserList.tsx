import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useDeleteUser, useUsers } from '../../api/userHooks';
import { UserResponse } from '../../api/types';
import { User } from '../../types/User';
import { useDebounce } from '../../hooks/useDebouce';

import SearchBar from '../molecules/SearchBar';
import UserCard from './UserCard';
import Spinner from '../atoms/Spinner';
import ConfirmationModal from '../molecules/ConfirmationModal';

const UserList: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  
  // Apply debounce to search term
  const debouncedSearchTerm = useDebounce(searchInput, 500);
  
  const navigate = useNavigate();
  
  // Fetch users with React Query (only triggered when debouncedSearchTerm changes)
  const { data: users, isLoading, error } = useUsers(debouncedSearchTerm);
  
  // Delete user mutation
  const deleteUserMutation = useDeleteUser();

  // Transform API response to our User type
  const transformUser = useCallback((user: UserResponse): User => {
    return {
      id: user.id, // Keep as string to preserve UUID format
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
  
  // Edit handler - navigates to edit page
  const handleEditUser = useCallback((userId: string) => {
    navigate(`/dashboard/edit/${userId}`);
  }, [navigate]);
  
  // Delete user handler - opens confirmation modal
  const handleDeleteUser = useCallback((userId: string) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  }, []);
  
  // Confirm deletion handler
  const confirmDelete = useCallback(() => {
    if (deleteUserId) {
      deleteUserMutation.mutate(deleteUserId, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setDeleteUserId(null);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Failed to delete user');
        }
      });
    }
  }, [deleteUserId, deleteUserMutation]);
  
  // Cancel deletion handler
  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteUserId(null);
  }, []);

  // Render the content based on loading, error, and users state
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
          {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      );
    }

    if (!users || users.length === 0) {
      return (
        <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800">
          No users found matching your search criteria.
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
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* SearchBar with input value (not debounced) for immediate UI feedback */}
      <div className="mb-6">
        <SearchBar 
          searchTerm={searchInput}
          setSearchTerm={setSearchInput}
        />
      </div>
      
      {/* Content area changes based on state */}
      {renderContent()}
      
      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default UserList;