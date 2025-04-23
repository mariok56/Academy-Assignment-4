import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useUpdateUser, useUser } from '../../api/userHooks';
import { UserFormValues } from '../../schemas/userSchema';
import { UserStatus } from '../../api/types';

import DashboardTemplate from '../templates/DashboardTemplate';
import UserForm from '../organisms/UserForm';
import Spinner from '../atoms/Spinner';

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch the user data
  const { data: user, isLoading, error } = useUser(id || '');
  
  // Update user mutation
  const updateUserMutation = useUpdateUser(id || '');
  
  const handleSubmit = (data: UserFormValues) => {
    if (!id) {
      toast.error('User ID is missing');
      return;
    }
    
    updateUserMutation.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard');
      }
    });
  };
  
  const handleCancel = () => {
    navigate('/dashboard');
  };
  
  if (isLoading) {
    return (
      <DashboardTemplate>
        <div className="flex justify-center items-center py-10">
          <Spinner size="lg" />
        </div>
      </DashboardTemplate>
    );
  }
  
  if (error || !user) {
    return (
      <DashboardTemplate>
        <div className="p-4 rounded-md bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100">
          {error instanceof Error ? error.message : 'User not found'}
        </div>
      </DashboardTemplate>
    );
  }
  
  // Map API response to form values
  const initialValues: UserFormValues = {
    firstName: user.firstName,
    lastName: user.lastName || '',
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    status: (user.status.toLowerCase() === 'active' 
      ? UserStatus.ACTIVE 
      : UserStatus.LOCKED),
  };
  
  return (
    <DashboardTemplate>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Edit User</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Update user information
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <UserForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={updateUserMutation.isPending}
            submitText="Update User"
            onCancel={handleCancel}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default EditUserPage;