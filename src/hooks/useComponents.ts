import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Component } from '@/types';
import { dataService, ComponentsParams } from '@/services/dataService';

export const useComponents = (params: ComponentsParams = {}) => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['components', params],
    queryFn: () => dataService.getComponents(params),
  });

  const createComponentMutation = useMutation({
    mutationFn: dataService.createComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
    },
  });

  const updateComponentMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Component> }) =>
      dataService.updateComponent(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
    },
  });

  const deleteComponentMutation = useMutation({
    mutationFn: dataService.deleteComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
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

export const useComponentsForEditor = (search: string = '') => {
  const {
    data: components = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['components-editor', search],
    queryFn: () => dataService.getComponentsForEditor(search),
  });

  return {
    components,
    isLoading,
    error
  };
};

export const useComponent = (id: string) => {
  const {
    data: component,
    isLoading,
    error
  } = useQuery({
    queryKey: ['component', id],
    queryFn: () => dataService.getComponentById(id),
    enabled: !!id,
  });

  return {
    component,
    isLoading,
    error
  };
};