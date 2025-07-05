
import { useQuery } from '@tanstack/react-query';
import { statsService } from '@/services/statsService';

export const useRecentBoards = () => {
  const {
    data: recentBoards = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['recentBoards'],
    queryFn: statsService.getRecentBoards,
  });

  return {
    recentBoards,
    isLoading,
    error
  };
};

export const useActivityStats = () => {
  const {
    data: activityStats = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['activityStats'],
    queryFn: statsService.getActivityStats,
  });

  return {
    activityStats,
    isLoading,
    error
  };
};
