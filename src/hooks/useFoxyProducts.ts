// Hook for fetching menu products from Webflow

import { useQuery } from '@tanstack/react-query';
import { webflowService } from '../services/webflow/webflowService';
import { useRegion } from '../context/RegionContext';
import type { WebflowMenuItem } from '../types/webflow.types';

export const useMenuItems = (categoryId?: string) => {
  const { region } = useRegion();

  return useQuery<WebflowMenuItem[], Error>({
    queryKey: ['menu-items', region, categoryId],
    queryFn: () => webflowService.getMenuItems(region, categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useMenuItem = (itemId: string) => {
  return useQuery<WebflowMenuItem, Error>({
    queryKey: ['menu-item', itemId],
    queryFn: () => webflowService.getMenuItem(itemId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: !!itemId,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => webflowService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

