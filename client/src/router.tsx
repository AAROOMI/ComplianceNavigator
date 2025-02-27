
import { ReactNode } from 'react';
import { useLocation } from 'wouter';

// Define your route types
export type Route = {
  path: string;
  component: ReactNode;
  exact?: boolean;
};

// Simple router utility functions
export const useRouter = () => {
  const [location, setLocation] = useLocation();

  return {
    location,
    navigate: setLocation,
    params: {} // You can extend this with param parsing if needed
  };
};

export default {
  useRouter
};
