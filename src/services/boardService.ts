import { Board } from "@/types";

const baseUrl = import.meta.env.VITE_API_URL;
const useMock = false;
const API_DELAY = 1000;

const mockBoards: Board[] = [
  {
    id: "1",
    name: "Arquitectura Microservicios",
    description:
      "Diagrama principal de la arquitectura de microservicios para e-commerce",
    nodes: [
      {
        id: "node-1",
        type: "component",
        position: { x: 100, y: 100 },
        data: { label: "API Gateway" },
      },
      {
        id: "node-2",
        type: "component",
        position: { x: 400, y: 100 },
        data: { label: "User Service" },
      },
    ],
    edges: [
      {
        id: "edge-1",
        source: "node-1",
        target: "node-2",
        type: "relationship",
        data: {
          relationshipType: "api_call",
          label: "Llamada API",
          description: "Conexión entre API Gateway y User Service",
        },
      },
    ],
    isPublic: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
    createdBy: "admin",
  },
  {
    id: "2",
    name: "Sistema de Autenticación",
    description: "Flujo de autenticación y autorización",
    nodes: [],
    edges: [],
    isPublic: false,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
    createdBy: "admin",
  },
  {
    id: "3",
    name: "API Gateway Design",
    description: "Diseño del gateway principal con balanceador de carga",
    nodes: [
      {
        id: "node-3",
        type: "zone",
        position: { x: 50, y: 50 },
        data: {
          label: "Load Balancer Zone",
          style: { backgroundColor: "#e3f2fd" },
        },
      },
    ],
    edges: [],
    isPublic: true,
    createdAt: "2024-01-05T11:30:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    createdBy: "admin",
  },
  {
    id: "4",
    name: "Sistema de Pagos",
    description: "Flujo completo del sistema de pagos con múltiples providers",
    nodes: [],
    edges: [],
    isPublic: true,
    createdAt: "2024-01-08T14:20:00Z",
    updatedAt: "2024-01-25T09:15:00Z",
    createdBy: "usuario1",
  },
  {
    id: "5",
    name: "Arquitectura Serverless",
    description: "Implementación serverless con AWS Lambda y API Gateway",
    nodes: [],
    edges: [],
    isPublic: true,
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-28T11:30:00Z",
    createdBy: "usuario2",
  },
  {
    id: "6",
    name: "Sistema de Monitoreo",
    description: "Arquitectura de monitoreo y observabilidad",
    nodes: [],
    edges: [],
    isPublic: false,
    createdAt: "2024-01-20T08:15:00Z",
    updatedAt: "2024-01-30T12:45:00Z",
    createdBy: "admin",
  },
  {
    id: "7",
    name: "Base de Datos Distribuida",
    description: "Diseño de base de datos distribuida con replicación",
    nodes: [],
    edges: [],
    isPublic: true,
    createdAt: "2024-01-22T14:30:00Z",
    updatedAt: "2024-02-01T10:20:00Z",
    createdBy: "usuario3",
  },
  {
    id: "8",
    name: "Sistema de Cache",
    description: "Implementación de sistema de cache multinivel",
    nodes: [],
    edges: [],
    isPublic: false,
    createdAt: "2024-01-25T16:00:00Z",
    updatedAt: "2024-02-03T09:30:00Z",
    createdBy: "admin",
  },
];

export interface BoardsResponse {
  boards: Board[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BoardsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const boardService = {
  async getAllBoards(
    params: BoardsParams = {},
    token: string
  ): Promise<BoardsResponse> {
    const { page = 1, limit = 10, search = "" } = params;
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));

      // Filtrar por búsqueda
      let filteredBoards = [...mockBoards];
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredBoards = mockBoards.filter(
          (board) =>
            board.name.toLowerCase().includes(searchLower) ||
            (board.description &&
              board.description.toLowerCase().includes(searchLower))
        );
      }

      // Calcular paginación
      const total = filteredBoards.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const boards = filteredBoards.slice(startIndex, endIndex);

      return {
        boards,
        total,
        page,
        limit,
        totalPages,
      };
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());
      if (search) queryParams.append("search", search);

      const response = await fetch(`${baseUrl}/board?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching boards:", error);
      throw error;
    }
  },

  async getPublicBoards(params: BoardsParams = {}): Promise<BoardsResponse> {
    const { page = 1, limit = 10, search = "" } = params;

    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));

      // Filtrar solo tableros públicos
      let filteredBoards = mockBoards.filter((board) => board.isPublic);

      // Filtrar por búsqueda
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredBoards = filteredBoards.filter(
          (board) =>
            board.name.toLowerCase().includes(searchLower) ||
            (board.description &&
              board.description.toLowerCase().includes(searchLower)) ||
            board.createdBy.toLowerCase().includes(searchLower)
        );
      }

      // Calcular paginación
      const total = filteredBoards.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const boards = filteredBoards.slice(startIndex, endIndex);

      return {
        boards,
        total,
        page,
        limit,
        totalPages,
      };
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());
      if (search) queryParams.append("search", search);

      const response = await fetch(`${baseUrl}/board/public?${queryParams}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching public boards:", error);
      throw error;
    }
  },

  async getBoardById(id: string): Promise<Board | null> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      return mockBoards.find((board) => board.id === id) || null;
    }
    try {
      const response = await fetch(`${baseUrl}/board/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching board:", error);
      throw error;
    }
  },

  async createBoard(
    boardData: Omit<Board, "id" | "createdAt" | "updatedAt">,
    token: string
  ): Promise<Board> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const newBoard: Board = {
        ...boardData,
        id: `board-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockBoards.push(newBoard);
      console.log("Board created:", newBoard);
      return newBoard;
    }
    try {
      const response = await fetch(`${baseUrl}/board`, {
        method: "POST",
        body: JSON.stringify(boardData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating board:", error);
      throw error;
    }
  },

  async updateBoard(
    id: string,
    updates: Partial<Board>,
    token: string
  ): Promise<Board | null> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const index = mockBoards.findIndex((board) => board.id === id);
      if (index === -1) return null;

      mockBoards[index] = {
        ...mockBoards[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      console.log("Board updated:", mockBoards[index]);
      return mockBoards[index];
    }
    try {
      const response = await fetch(`${baseUrl}/board/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating board:", error);
      throw error;
    }
  },

  async deleteBoard(id: string, token: string): Promise<boolean> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const index = mockBoards.findIndex((board) => board.id === id);
      if (index === -1) return false;

      mockBoards.splice(index, 1);
      return true;
    }
    try {
      const response = await fetch(`${baseUrl}/board/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error;
    }
  },

  async toggleBoardVisibility(
    id: string,
    token: string
  ): Promise<Board | null> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const index = mockBoards.findIndex((board) => board.id === id);
      if (index === -1) return null;

      mockBoards[index] = {
        ...mockBoards[index],
        isPublic: !mockBoards[index].isPublic,
        updatedAt: new Date().toISOString(),
      };
      return mockBoards[index];
    }
    try {
      const response = await fetch(`${baseUrl}/board/${id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error toggling board visibility:", error);
      throw error;
    }
  },
};
