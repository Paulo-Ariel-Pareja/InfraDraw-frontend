import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { statsService } from "@/services/statsService";
import { useAuth } from "@/contexts/AuthContext";

export const useRecentBoards = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    data: recentBoards = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recentBoards"],
    queryFn: async () => {
      try {
        return await statsService.getRecentBoards(user.token);
      } catch (err: any) {
        if (err.message === "401" || err.message === "403") {
          logout();
          navigate("/");
        }
        throw err;
      }
    },
  });

  return {
    recentBoards,
    isLoading,
    error,
  };
};

export const useActivityStats = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    data: activityStats = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activityStats"],
    queryFn: async () => {
      try {
        return await statsService.getActivityStats(user.token);
      } catch (err: any) {
        if (err.message === "401" || err.message === "403") {
          logout();
          navigate("/");
        }
        throw err;
      }
    },
  });

  return {
    activityStats,
    isLoading,
    error,
  };
};
