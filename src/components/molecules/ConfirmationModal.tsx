import React from 'react';
import { useThemeStore } from '../../store/themeStore';
import Button from '../atoms/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode; 
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean; 
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmDisabled = false,
  onConfirm,
  onCancel,
}) => {
  const { darkMode } = useThemeStore();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className={`w-full max-w-md rounded-lg shadow-lg p-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {message}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;