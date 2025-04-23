import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreateUser } from '../../api/userHooks';
import { UserFormValues } from '../../schemas/userSchema';
import { UserStatus } from '../../api/types';
import DashboardTemplate from '../templates/DashboardTemplate';
import UserForm from '../organisms/UserForm';
import Button from '../atoms/Button';

const FORM_DRAFT_KEY = 'addUserFormDraft';

const AddUserPage: React.FC = () => {
  const navigate = useNavigate();
  const createUserMutation = useCreateUser();
  const [lastAttemptedValues, setLastAttemptedValues] = useState<UserFormValues | null>(null);
  
  
  const getDefaultValues = (): Partial<UserFormValues> => ({
    firstName: '',
    lastName: '',
    email: '',
    
    dateOfBirth: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: UserStatus.ACTIVE,
  });
  
  
  const [initialValues, setInitialValues] = useState<Partial<UserFormValues>>(getDefaultValues());
  
  useEffect(() => {
    
    const savedDraft = localStorage.getItem(FORM_DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setInitialValues(parsedDraft);
      } catch (e) {
        
        console.error('Error parsing saved draft:', e);
        localStorage.removeItem(FORM_DRAFT_KEY);
      }
    }
    
    
    return () => {
      
      if (createUserMutation.isSuccess) {
        localStorage.removeItem(FORM_DRAFT_KEY);
      }
    };
  }, [createUserMutation.isSuccess]);
  
  const handleSubmit = (data: UserFormValues) => {
    setLastAttemptedValues(data);
   
    localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(data));
    
    createUserMutation.mutate(data, {
      onSuccess: () => {
       
        localStorage.removeItem(FORM_DRAFT_KEY);
        navigate('/dashboard');
      }
    });
  };
  
  const handleCancel = () => {
    navigate('/dashboard');
  };
  
  
  const handleRetry = () => {
    if (lastAttemptedValues) {
      createUserMutation.mutate(lastAttemptedValues);
    }
  };
  
  
  const clearDraft = () => {
    localStorage.removeItem(FORM_DRAFT_KEY);
    setInitialValues(getDefaultValues());
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
          {/* Show notice if there's a saved draft */}
          {localStorage.getItem(FORM_DRAFT_KEY) && (
            <div className="mb-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700">
              <p>You have a saved draft. You can continue where you left off or clear the draft.</p>
              <div className="mt-2">
                <button 
                  onClick={clearDraft}
                  className="underline"
                >
                  Clear Draft
                </button>
              </div>
            </div>
          )}
          
          {/* Show error message with retry option */}
          {createUserMutation.isError && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:text-red-200 dark:border-red-700">
              <p>Failed to create user: {createUserMutation.error instanceof Error ? createUserMutation.error.message : 'Unknown error'}</p>
              <div className="mt-2">
                <button 
                  onClick={handleRetry}
                  className="underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          <UserForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isSubmitting={createUserMutation.isPending}
            submitText="Create User"
            onCancel={handleCancel}
          />
          
          {/* Additional footer actions */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <Button
              variant="secondary"
              onClick={clearDraft}
              type="button"
            >
              Clear Form
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default AddUserPage;