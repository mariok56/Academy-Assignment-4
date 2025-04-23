import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/themeStore';
import { router } from './router/router';
import { ReactQueryProvider } from './lib/react-query';
import './App.css';

const App: React.FC = () => {
  const { darkMode } = useThemeStore();

  return (
    <ReactQueryProvider>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? '#374151' : '#ffffff',
              color: darkMode ? '#f3f4f6' : '#1f2937',
            },
          }}
        />
      </div>
    </ReactQueryProvider>
  );
};

export default App;