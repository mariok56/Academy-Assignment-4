import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreateUser } from '../../api/userHooks';
import { UserFormValues } from '../../schemas/userSchema';
import DashboardTemplate from '../templates/DashboardTemplate';
import UserForm from '../organisms/UserForm';

const AddUserPage: React.FC = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();
  
  const handleSubmit = (data: UserFormValues) => {
    createUserMutation.mutate(data, {
      onSuccess: () => {
        navigate('/dashboard');
      }
    });
  };
  
  const handleCancel = () => {
    navigate('/dashboard');
  };
  
  return (
    <DashboardTemplate>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Add New User</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create a new user by filling out the form below
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <UserForm
            onSubmit={handleSubmit}
            isSubmitting={createUserMutation.isPending}
            submitText="Create User"
            onCancel={handleCancel}
          />
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default AddUserPage;