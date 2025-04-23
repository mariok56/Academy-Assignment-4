import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, UserFormValues } from '../../schemas/userSchema';
import { useThemeStore } from '../../store/themeStore';
import Button from '../atoms/Button';
import { UserStatus } from '../../api/types';

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  onSubmit: (data: UserFormValues) => void;
  isSubmitting: boolean;
  submitText: string;
  onCancel: () => void;
}

const FORM_AUTOSAVE_KEY = 'userFormAutoSave';

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  submitText,
  onCancel,
}) => {
  const { darkMode } = useThemeStore();
  
  const defaultValues: Partial<UserFormValues> = {
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: new Date().toISOString().split('T')[0],
    status: UserStatus.ACTIVE,
    ...initialValues,
  };

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isDirty, touchedFields },
    reset,
    watch,
    trigger,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
    mode: 'onChange', // Validate on change for immediate feedback
  });

  // Watch form for autosave
  const watchedValues = watch();
  
  // Set up autosave
  useEffect(() => {
    if (isDirty) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(FORM_AUTOSAVE_KEY, JSON.stringify(watchedValues));
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [watchedValues, isDirty]);
  
  // Reset form when initialValues change
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);
  
  // Handle validation on blur for better UX
  const handleBlur = (field: keyof UserFormValues) => {
    if (touchedFields[field]) {
      trigger(field);
    }
  };

  const inputClassName = (fieldName: keyof UserFormValues) => `
    w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary 
    ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}
    ${errors[fieldName] ? 'border-red-500 focus:ring-red-500' : ''}
    transition duration-150
  `;

  const errorMessage = (message?: string) => 
    message ? (
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
        {message}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstName" className={`block mb-2 text-sm font-medium ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            className={inputClassName('firstName')}
            {...register('firstName', {
              onBlur: () => handleBlur('firstName')
            })}
          />
          {errorMessage(errors.firstName?.message)}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label htmlFor="lastName" className={`block mb-2 text-sm font-medium ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            className={inputClassName('lastName')}
            {...register('lastName', {
              onBlur: () => handleBlur('lastName')
            })}
          />
          {errorMessage(errors.lastName?.message)}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className={`block mb-2 text-sm font-medium ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={inputClassName('email')}
            {...register('email', {
              onBlur: () => handleBlur('email')
            })}
          />
          {errorMessage(errors.email?.message)}
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label htmlFor="dateOfBirth" className={`block mb-2 text-sm font-medium ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            id="dateOfBirth"
            type="date"
            className={inputClassName('dateOfBirth')}
            {...register('dateOfBirth', {
              onBlur: () => handleBlur('dateOfBirth')
            })}
          />
          {errorMessage(errors.dateOfBirth?.message)}
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className={`block mb-2 text-sm font-medium ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            className={inputClassName('status')}
            {...register('status', {
              onBlur: () => handleBlur('status')
            })}
          >
            <option value={UserStatus.ACTIVE}>Active</option>
            <option value={UserStatus.LOCKED}>Locked</option>
          </select>
          {errorMessage(errors.status?.message)}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : submitText}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;