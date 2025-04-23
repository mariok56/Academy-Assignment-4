import React, { useCallback } from 'react';
import { useThemeStore } from '../../store/themeStore';
import Avatar from '../atoms/Avatar';
import UserInfo from '../molecules/UserInfo';
import ActionButtons from '../molecules/ActionButtons';
import { User } from '../../types/User';

interface UserCardProps {
  user: User;
  onDelete: (userId: string) => void;
  onEdit: (userId: string) => void;
  onEditHover?: (userId: string) => void; // New prop for prefetching
}

const UserCard: React.FC<UserCardProps> = React.memo(({ 
  user, 
  onDelete, 
  onEdit,
  onEditHover
}) => {
  const { darkMode } = useThemeStore();
  
  const handleDelete = useCallback(() => {
    onDelete(user.id);
  }, [user.id, onDelete]);
  
  const handleEdit = useCallback(() => {
    onEdit(user.id);
  }, [user.id, onEdit]);
  
  // New handler for mouse enter on edit button
  const handleEditMouseEnter = useCallback(() => {
    if (onEditHover) {
      onEditHover(user.id);
    }
  }, [user.id, onEditHover]);

  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    } p-6 flex flex-col hover:shadow-lg transition-shadow duration-200`}>
      {/* Avatar with initials */}
      <div className="flex justify-center mb-4">
        <Avatar initials={user.initials} size="lg" />
      </div>
      
      {/* User information */}
      <UserInfo
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email}
        status={user.status}
        dob={user.dob}
      />

      {/* Action buttons with hover handler for prefetching */}
      <div className="mt-4 flex justify-end space-x-2">
        <button 
          className={`py-2 px-4 font-semibold rounded transition focus:outline-none bg-primary text-white hover:bg-primary-dark`}
          onClick={handleEdit}
          onMouseEnter={handleEditMouseEnter} // Added for prefetching
        >
          Edit
        </button>
        <button 
          className={`py-2 px-4 font-semibold rounded transition focus:outline-none bg-red-500 text-white hover:bg-red-600`}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
});

UserCard.displayName = 'UserCard';

export default UserCard;