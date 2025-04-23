import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { ReactNode } from 'react';

// Create a client with improved configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, 
      gcTime: 5 * 60 * 1000, 
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

interface ReactQueryProviderProps {
  children: ReactNode;
}

export const ReactQueryProvider: React.FC<ReactQueryProviderProps> = ({ 
  children 
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export { queryClient };