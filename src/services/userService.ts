import { UserManagement } from "@/types";

const baseUrl = import.meta.env.VITE_API_URL;
const useMock = false;
const API_DELAY = 1000;

const mockUsers: UserManagement[] = [
  {
    id: "1",
    username: "admin",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    username: "usuario1",
    createdAt: "2024-01-05T14:30:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
  },
  {
    id: "3",
    username: "usuario2",
    createdAt: "2024-01-08T16:45:00Z",
    updatedAt: "2024-01-12T11:20:00Z",
  },
  {
    id: "4",
    username: "usuario3",
    createdAt: "2024-01-12T08:30:00Z",
    updatedAt: "2024-01-15T13:45:00Z",
  },
  {
    id: "5",
    username: "developer1",
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-18T16:30:00Z",
  },
  {
    id: "6",
    username: "developer2",
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-20T14:20:00Z",
  },
  {
    id: "7",
    username: "manager1",
    createdAt: "2024-01-20T15:45:00Z",
    updatedAt: "2024-01-22T10:30:00Z",
  },
  {
    id: "8",
    username: "tester1",
    createdAt: "2024-01-22T11:20:00Z",
    updatedAt: "2024-01-25T08:45:00Z",
  },
];

export interface UsersResponse {
  users: UserManagement[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const userService = {
  async getAllUsers(
    params: UsersParams = {},
    token: string
  ): Promise<UsersResponse> {
    const { page = 1, limit = 10, search = "" } = params;

    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));

      // Filtrar por búsqueda
      let filteredUsers = [...mockUsers];
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredUsers = mockUsers.filter((user) =>
          user.username.toLowerCase().includes(searchLower)
        );
      }

      // Calcular paginación
      const total = filteredUsers.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const users = filteredUsers.slice(startIndex, endIndex);

      return {
        users,
        total,
        page,
        limit,
        totalPages,
      };
    }

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (search) queryParams.append("search", search);

    const response = await fetch(`${baseUrl}/user?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    const data = await response.json();
    return data;
  },

  async createUser(
    userData: Omit<UserManagement, "id" | "createdAt" | "updatedAt">,
    token: string
  ): Promise<UserManagement> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const newUser: UserManagement = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const { password, ...userResponse } = newUser;
      mockUsers.push(userResponse);
      return userResponse;
    }
    const response = await fetch(`${baseUrl}/user`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    const data = await response.json();
    return data;
  },

  async deleteUser(id: string, token: string): Promise<boolean> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const index = mockUsers.findIndex((user) => user.id === id);
      if (index === -1) return false;

      mockUsers.splice(index, 1);
      return true;
    }
    const response = await fetch(`${baseUrl}/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    return true;
  },
};
