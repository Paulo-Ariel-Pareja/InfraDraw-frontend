import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Component } from "@/types";
import { dataService, ComponentsParams } from "@/services/dataService";
import { useAuth } from "@/contexts/AuthContext";

export const useComponents = (params: ComponentsParams = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["components", params],
    queryFn: async () => {
      try {
        return await dataService.getComponents(params, user.token);
      } catch (err: any) {
        if (err.message === "401" || err.message === "403") {
          logout();
          navigate("/");
        }
        throw err;
      }
    },
  });

  const createComponentMutation = useMutation({
    mutationFn: (
      componentData: Omit<Component, "id" | "createdAt" | "updatedAt">
    ) => dataService.createComponent(componentData, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] });
    },
    onError: (error) => {
      if (error.message === "401" || error.message === "403") {
        logout();
        navigate("/");
      }
    },
  });

  const updateComponentMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Component>;
    }) => dataService.updateComponent(id, updates, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] });
    },
    onError: (error) => {
      if (error.message === "401" || error.message === "403") {
        logout();
        navigate("/");
      }
    },
  });

  const deleteComponentMutation = useMutation({
    mutationFn: (id: string) => dataService.deleteComponent(id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] });
    },
    onError: (error) => {
      if (error.message === "401" || error.message === "403") {
        logout();
        navigate("/");
      }
    },
  });

  return {
    components: data?.components || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    refetch,
    createComponent: createComponentMutation.mutate,
    updateComponent: updateComponentMutation.mutate,
    deleteComponent: deleteComponentMutation.mutate,
    isCreating: createComponentMutation.isPending,
    isUpdating: updateComponentMutation.isPending,
    isDeleting: deleteComponentMutation.isPending,
  };
};

export const useComponentsForEditor = (search: string = "") => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    data: components = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["components-editor", search],
    queryFn: async () => {
      try {
        return await dataService.getComponentsForEditor(search, user.token);
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
    components,
    isLoading,
    error,
  };
};

export const useComponent = (id: string) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    data: component,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["component", id],
    queryFn: async () => {
      try {
        return await dataService.getComponentById(id, user.token);
      } catch (err: any) {
        if (err.message === "401" || err.message === "403") {
          logout();
          navigate("/");
        }
        throw err;
      }
    },
    enabled: !!id,
  });

  return {
    component,
    isLoading,
    error,
  };
};
