import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { SequenceDiagram } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  sequenceDiagramService,
  SequenceDiagramsParams,
} from "@/services/sequenceDiagramService";

export const useSequenceDiagrams = (params: SequenceDiagramsParams = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["sequenceDiagrams", params],
    queryFn: async () => {
      try {
        return await sequenceDiagramService.getAllSequenceDiagrams(
          params,
          user.token
        );
      } catch (err: any) {
        if (err.message === "401" || err.message === "403") {
          logout();
          navigate("/");
        }
        throw err;
      }
    },
  });

  const createSequenceDiagramMutation = useMutation({
    mutationFn: (
      diagramData: Omit<SequenceDiagram, "id" | "createdAt" | "updatedAt">
    ) => sequenceDiagramService.createSequenceDiagram(diagramData, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequenceDiagrams"] });
    },
    onError: (error) => {
      if (error.message === "401" || error.message === "403") {
        logout();
        navigate("/");
      }
    },
  });

  const updateSequenceDiagramMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<SequenceDiagram>;
    }) => sequenceDiagramService.updateSequenceDiagram(id, updates, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequenceDiagrams"] });
    },
    onError: (error) => {
      if (error.message === "401" || error.message === "403") {
        logout();
        navigate("/");
      }
    },
  });

  const deleteSequenceDiagramMutation = useMutation({
    mutationFn: (id: string) =>
      sequenceDiagramService.deleteSequenceDiagram(id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequenceDiagrams"] });
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
      sequenceDiagramService.toggleSequenceDiagramVisibility(id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequenceDiagrams"] });
    },
    onError: (error) => {
      if (error.message === "401" || error.message === "403") {
        logout();
        navigate("/");
      }
    },
  });

  return {
    diagrams: data?.diagrams || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    refetch,
    createSequenceDiagram: createSequenceDiagramMutation.mutate,
    updateSequenceDiagram: updateSequenceDiagramMutation.mutate,
    deleteSequenceDiagram: deleteSequenceDiagramMutation.mutate,
    toggleVisibility: toggleVisibilityMutation.mutate,
    isCreating: createSequenceDiagramMutation.isPending,
    isUpdating: updateSequenceDiagramMutation.isPending,
    isDeleting: deleteSequenceDiagramMutation.isPending,
    isTogglingVisibility: toggleVisibilityMutation.isPending,
  };
};

export const usePublicSequenceDiagram = (
  params: SequenceDiagramsParams = {}
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["publicBoards", params],
    queryFn: () => sequenceDiagramService.getPublicSequenceDiagrams(params),
  });

  return {
    publicDiagrams: data?.diagrams || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useSequenceDiagram = (id: string) => {
  const {
    data: diagram,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sequenceDiagram", id],
    queryFn: () => sequenceDiagramService.getSequenceDiagramById(id),
    enabled: !!id,
  });

  return {
    diagram,
    isLoading,
    error,
  };
};
