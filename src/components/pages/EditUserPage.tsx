import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { queryClient } from '../../lib/react-query';
import { useUpdateUser, useUser, USER_QUERY_KEY } from '../../api/userHooks';
import { UserFormValues } from '../../schemas/userSchema';
import { UserStatus } from '../../api/types';
import DashboardTemplate from '../templates/DashboardTemplate';
import UserForm from '../organisms/UserForm';
import Spinner from '../atoms/Spinner';
import Button from '../atoms/Button';

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lastAttemptedValues, setLastAttemptedValues] = useState<UserFormValues | null>(null);
  
  // Fetch the user data
  const { data: user, isLoading, error, refetch } = useUser(id || '');
  
  // Update user mutation
  const updateUserMutation = useUpdateUser(id || '');
  
  const handleSubmit = (data: UserFormValues) => {
    if (!id) {
      toast.error('User ID is missing');
      return;
    }
    
    setLastAttemptedValues(data);
    updateUserMutation.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard');
      }
    });
  };
  
  const handleCancel = () => {
    navigate('/dashboard');
  };
  
  // Handler to retry a failed update
  const handleRetry = () => {
    if (lastAttemptedValues && id) {
      updateUserMutation.mutate(lastAttemptedValues);
    }
  };
  
  // Function to reset form to server state
  const resetForm = () => {
    if (id) {
      // Invalidate the query to force a refetch
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY, id] });
      // Directly refetch
      refetch();
      toast.success('Form reset to original values');
    }
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
          <p>{error instanceof Error ? error.message : 'User not found'}</p>
          <div className="mt-4">
            <Button 
              variant="primary" 
              onClick={() => refetch()} 
            >
              Try Again
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/dashboard')}
              className="ml-2"
            >
              Back to Dashboard
            </Button>
          </div>
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
          {/* Show error message with retry option */}
          {updateUserMutation.isError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <p>Failed to update user: {updateUserMutation.error instanceof Error ? updateUserMutation.error.message : 'Unknown error'}</p>
              <div className="mt-2">
                <button 
                  onClick={handleRetry} 
                  className="underline mr-3"
                >
                  Try Again
                </button>
                <button
                  onClick={resetForm}
                  className="underline"
                >
                  Reset Form
                </button>
              </div>
            </div>
          )}
          
          <UserForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={updateUserMutation.isPending}
            submitText="Update User"
            onCancel={handleCancel}
          />
          
          {/* Form actions footer - REMOVED duplicate Cancel button */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="secondary"
              onClick={resetForm}
              type="button"
            >
              Reset Form
            </Button>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default EditUserPage;