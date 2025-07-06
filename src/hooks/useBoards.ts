import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Board } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { boardService, BoardsParams } from "@/services/boardService";

export const useBoards = (params: BoardsParams = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["boards", params],
    queryFn: async () => {
      try {
        return await boardService.getAllBoards(params, user.token);
      } catch (err: any) {
        if (err.message === "401" || err.message === "403") {
          logout();
          navigate("/");
        }
        throw err;
      }
    },
  });

  const createBoardMutation = useMutation({
    mutationFn: (boardData: Omit<Board, "id" | "createdAt" | "updatedAt">) =>
      boardService.createBoard(boardData, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (error) => {
      if (error.message === "401" || error.message === "403") {
        logout();
        navigate("/");
      }
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Board> }) =>
      boardService.updateBoard(id, updates, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (error) => {
      if (error.message === "401" || error.message === "403") {
        logout();
        navigate("/");
      }
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: (id: string) => boardService.deleteBoard(id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
    onError: (error) => {
      if (error.message === "401" || error.message === "403") {
        logout();
        navigate("/");
      }
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: (id: string) =>
      boardService.toggleBoardVisibility(id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["publicBoards"] });
    },
    onError: (error) => {
      if (error.message === "401" || error.message === "403") {
        logout();
        navigate("/");
      }
    },
  });

  return {
    boards: data?.boards || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    refetch,
    createBoard: createBoardMutation.mutate,
    updateBoard: updateBoardMutation.mutate,
    deleteBoard: deleteBoardMutation.mutate,
    toggleVisibility: toggleVisibilityMutation.mutate,
    isCreating: createBoardMutation.isPending,
    isUpdating: updateBoardMutation.isPending,
    isDeleting: deleteBoardMutation.isPending,
    isTogglingVisibility: toggleVisibilityMutation.isPending,
  };
};

export const usePublicBoards = (params: BoardsParams = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publicBoards", params],
    queryFn: () => boardService.getPublicBoards(params),
  });

  return {
    publicBoards: data?.boards || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useBoard = (id: string) => {
  const {
    data: board,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["board", id],
    queryFn: () => boardService.getBoardById(id),
    enabled: !!id,
  });

  return {
    board,
    isLoading,
    error,
  };
};
