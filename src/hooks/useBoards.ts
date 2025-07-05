import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Board } from '@/types';
import { boardService, BoardsParams } from '@/services/boardService';

export const useBoards = (params: BoardsParams = {}) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['boards', params],
    queryFn: () => boardService.getAllBoards(params),
  });

  const createBoardMutation = useMutation({
    mutationFn: boardService.createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const updateBoardMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Board> }) =>
      boardService.updateBoard(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const deleteBoardMutation = useMutation({
    mutationFn: boardService.deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: boardService.toggleBoardVisibility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['publicBoards'] });
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
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['publicBoards', params],
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
    refetch
  };
};

export const useBoard = (id: string) => {
  const {
    data: board,
    isLoading,
    error
  } = useQuery({
    queryKey: ['board', id],
    queryFn: () => boardService.getBoardById(id),
    enabled: !!id,
  });

  return {
    board,
    isLoading,
    error
  };
};