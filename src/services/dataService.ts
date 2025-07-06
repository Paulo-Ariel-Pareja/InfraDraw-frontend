import { Component } from "@/types";

const baseUrl = import.meta.env.VITE_API_URL;
const useMock = false;
const API_DELAY = 1000;

const mockComponents: Component[] = [
  {
    id: "1",
    name: "API Gateway",
    technology: "Node.js",
    endpoints: [
      {
        id: "1",
        method: "GET",
        url: "/api/users",
        description: "Obtener usuarios",
      },
      {
        id: "2",
        method: "POST",
        url: "/api/auth/login",
        description: "Autenticación",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "User Service",
    technology: "Python",
    endpoints: [
      { id: "3", method: "GET", url: "/users", description: "Listar usuarios" },
      { id: "4", method: "POST", url: "/users", description: "Crear usuario" },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Payment Service",
    technology: "Java",
    endpoints: [
      {
        id: "5",
        method: "POST",
        url: "/payments",
        description: "Procesar pago",
      },
      {
        id: "6",
        method: "GET",
        url: "/payments/:id",
        description: "Obtener pago",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Notification Service",
    technology: "Go",
    endpoints: [
      {
        id: "7",
        method: "POST",
        url: "/notifications/send",
        description: "Enviar notificación",
      },
      {
        id: "8",
        method: "GET",
        url: "/notifications/history",
        description: "Historial de notificaciones",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "5",
    name: "Database Service",
    technology: "PostgreSQL",
    endpoints: [
      {
        id: "9",
        method: "GET",
        url: "/db/health",
        description: "Estado de la base de datos",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "6",
    name: "Cache Service",
    technology: "Redis",
    endpoints: [
      {
        id: "10",
        method: "GET",
        url: "/cache/stats",
        description: "Estadísticas del cache",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "7",
    name: "Email Service",
    technology: "Node.js",
    endpoints: [
      {
        id: "11",
        method: "POST",
        url: "/email/send",
        description: "Enviar email",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "8",
    name: "File Storage",
    technology: "AWS S3",
    endpoints: [
      {
        id: "12",
        method: "POST",
        url: "/files/upload",
        description: "Subir archivo",
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

export interface ComponentsResponse {
  components: Component[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ComponentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const dataService = {
  async getComponents(
    params: ComponentsParams = {},
    token: string
  ): Promise<ComponentsResponse> {
    const { page = 1, limit = 10, search = "" } = params;

    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));

      // Filtrar por búsqueda
      let filteredComponents = [...mockComponents];
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredComponents = mockComponents.filter(
          (component) =>
            component.name.toLowerCase().includes(searchLower) ||
            component.technology.toLowerCase().includes(searchLower)
        );
      }

      // Calcular paginación
      const total = filteredComponents.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const components = filteredComponents.slice(startIndex, endIndex);

      return {
        components,
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

    const response = await fetch(`${baseUrl}/component?${queryParams}`, {
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

  // Get components for editor (first page only, no pagination UI)
  async getComponentsForEditor(
    search: string = "",
    token: string
  ): Promise<Component[]> {
    const response = await this.getComponents(
      { page: 1, limit: 10, search },
      token
    );
    return response.components;
  },

  async getComponentById(id: string, token: string): Promise<Component | null> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      return mockComponents.find((comp) => comp.id === id) || null;
    }
    const response = await fetch(`${baseUrl}/component/${id}`, {
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

  async createComponent(
    componentData: Omit<Component, "id" | "createdAt" | "updatedAt">,
    token: string
  ): Promise<Component> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const newComponent: Component = {
        ...componentData,
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockComponents.push(newComponent);
      return newComponent;
    }
    const response = await fetch(`${baseUrl}/component`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(componentData),
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    const data = await response.json();
    return data;
  },

  async updateComponent(
    id: string,
    updates: Partial<Component>,
    token: string
  ): Promise<Component | null> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const index = mockComponents.findIndex((comp) => comp.id === id);
      if (index === -1) return null;

      mockComponents[index] = {
        ...mockComponents[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return mockComponents[index];
    }
    const response = await fetch(`${baseUrl}/component/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    const data = await response.json();
    return data;
  },

  async deleteComponent(id: string, token: string): Promise<boolean> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const index = mockComponents.findIndex((comp) => comp.id === id);
      if (index === -1) return false;

      mockComponents.splice(index, 1);
      return true;
    }
    const response = await fetch(`${baseUrl}/component/${id}`, {
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
