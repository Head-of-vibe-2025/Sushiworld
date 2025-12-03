// Hook for fetching order history from Foxy
// TODO: Implement with React Query when Foxy API integration is ready

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { FoxyTransaction } from '../types/foxy.types';

export const useOrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<FoxyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // TODO: Fetch orders from Foxy API via Supabase Edge Function
    // For now, return empty array
    if (!user?.email) {
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [user]);

  return { orders, loading, error };
};

