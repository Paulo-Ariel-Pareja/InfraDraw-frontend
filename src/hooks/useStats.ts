import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/services/statsService";
import { useAuth } from "@/contexts/AuthContext";

export const useRecentBoards = () => {
  const { user } = useAuth();

  const {
    data: recentBoards = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recentBoards"],
    queryFn: () => statsService.getRecentBoards(user.token),
  });

  return {
    recentBoards,
    isLoading,
    error,
  };
};

export const useActivityStats = () => {
  const { user } = useAuth();
  const {
    data: activityStats = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activityStats"],
    queryFn: () => statsService.getActivityStats(user.token),
  });

  return {
    activityStats,
    isLoading,
    error,
  };
};
