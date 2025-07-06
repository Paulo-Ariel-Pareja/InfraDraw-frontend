import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Component } from "@/types";
import { dataService, ComponentsParams } from "@/services/dataService";
import { useAuth } from "@/contexts/AuthContext";

export const useComponents = (params: ComponentsParams = {}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["components", params],
    queryFn: () => dataService.getComponents(params, user.token),
  });

  const createComponentMutation = useMutation({
    mutationFn: (
      componentData: Omit<Component, "id" | "createdAt" | "updatedAt">
    ) => dataService.createComponent(componentData, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] });
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
  });

  const deleteComponentMutation = useMutation({
    mutationFn: (id: string) => dataService.deleteComponent(id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] });
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
  const { user } = useAuth();
  const {
    data: components = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["components-editor", search],
    queryFn: () => dataService.getComponentsForEditor(search, user.token),
  });

  return {
    components,
    isLoading,
    error,
  };
};

export const useComponent = (id: string) => {
  const { user } = useAuth();
  const {
    data: component,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["component", id],
    queryFn: () => dataService.getComponentById(id, user.token),
    enabled: !!id,
  });

  return {
    component,
    isLoading,
    error,
  };
};
