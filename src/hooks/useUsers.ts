import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, UsersParams } from "@/services/userService";
import { useAuth } from "@/contexts/AuthContext";
import { UserManagement } from "@/types";

export const useUsers = (params: UsersParams = {}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getAllUsers(params, user.token),
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: Omit<UserManagement, "id" | "createdAt" | "updatedAt">) =>
      userService.createUser(userData, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id, user.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    users: data?.users || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    refetch,
    createUser: createUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
