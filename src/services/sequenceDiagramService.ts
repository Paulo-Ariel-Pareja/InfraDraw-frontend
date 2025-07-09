import { SequenceDiagram } from "@/types";

const baseUrl = import.meta.env.VITE_API_URL;
const useMock = false;
const API_DELAY = 1000;

const mockSequenceDiagrams: SequenceDiagram[] = [
  {
    id: "1",
    name: "Flujo de Autenticación",
    description: "Proceso de login de usuario",
    mermaidCode: `sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API Gateway
    participant S as Auth Service
    participant D as Database
    
    U->>F: Ingresa credenciales
    F->>A: POST /auth/login
    A->>S: Validar credenciales
    S->>D: Consultar usuario
    D-->>S: Datos del usuario
    S-->>A: Token JWT
    A-->>F: Respuesta con token
    F-->>U: Redirigir al dashboard`,
    isPublic: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
    createdBy: "admin",
  },
  {
    id: "2",
    name: "Proceso de Pago",
    description: "Flujo completo de procesamiento de pagos",
    mermaidCode: `sequenceDiagram
    participant C as Cliente
    participant E as E-commerce
    participant P as Payment Gateway
    participant B as Banco
    
    C->>E: Seleccionar productos
    C->>E: Proceder al pago
    E->>P: Procesar pago
    P->>B: Validar tarjeta
    B-->>P: Confirmación
    P-->>E: Resultado del pago
    E-->>C: Confirmación de compra`,
    isPublic: false,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
    createdBy: "admin",
  },
  {
    id: "3",
    name: "API REST Workflow",
    description: "Flujo típico de una API REST",
    mermaidCode: `sequenceDiagram
    participant C as Cliente
    participant G as API Gateway
    participant S as Servicio
    participant DB as Base de Datos
    
    C->>G: GET /api/users
    G->>S: Reenviar solicitud
    S->>DB: SELECT * FROM users
    DB-->>S: Resultados
    S-->>G: JSON Response
    G-->>C: Lista de usuarios`,
    isPublic: true,
    createdAt: "2024-01-05T11:30:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    createdBy: "admin",
  },
];

export interface SequenceDiagramsResponse {
  diagrams: SequenceDiagram[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SequenceDiagramsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const sequenceDiagramService = {
  async getAllSequenceDiagrams(
    params: SequenceDiagramsParams = {},
    token: string
  ): Promise<SequenceDiagramsResponse> {
    const { page = 1, limit = 10, search = "" } = params;

    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));

      // Filtrar por búsqueda
      let filteredDiagrams = [...mockSequenceDiagrams];
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredDiagrams = mockSequenceDiagrams.filter(
          (diagram) =>
            diagram.name.toLowerCase().includes(searchLower) ||
            (diagram.description &&
              diagram.description.toLowerCase().includes(searchLower))
        );
      }

      // Calcular paginación
      const total = filteredDiagrams.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const diagrams = filteredDiagrams.slice(startIndex, endIndex);

      return {
        diagrams,
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

    const response = await fetch(`${baseUrl}/sequence-diagram?${queryParams}`, {
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

  async getPublicSequenceDiagrams(
    params: SequenceDiagramsParams = {}
  ): Promise<SequenceDiagramsResponse> {
    const { page = 1, limit = 10, search = "" } = params;

    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));

      // Filtrar por búsqueda
      let filteredDiagrams = mockSequenceDiagrams.filter(
        (diagram) => diagram.isPublic
      );
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredDiagrams = mockSequenceDiagrams.filter(
          (diagram) =>
            diagram.name.toLowerCase().includes(searchLower) ||
            (diagram.description &&
              diagram.description.toLowerCase().includes(searchLower))
        );
      }

      // Calcular paginación
      const total = filteredDiagrams.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const diagrams = filteredDiagrams.slice(startIndex, endIndex);

      return {
        diagrams,
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

    const response = await fetch(
      `${baseUrl}/sequence-diagram/public?${queryParams}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    const data = await response.json();
    return data;
  },

  async getSequenceDiagramById(id: string): Promise<SequenceDiagram | null> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      return mockSequenceDiagrams.find((diagram) => diagram.id === id) || null;
    }

    const response = await fetch(`${baseUrl}/sequence-diagram/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(response.status.toString());
    }
    const data = await response.json();
    return data;
  },

  async createSequenceDiagram(
    diagramData: Omit<SequenceDiagram, "id" | "createdAt" | "updatedAt">,
    token: string
  ): Promise<SequenceDiagram> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const newDiagram: SequenceDiagram = {
        ...diagramData,
        id: `diagram-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockSequenceDiagrams.push(newDiagram);
      return newDiagram;
    }

    const response = await fetch(`${baseUrl}/sequence-diagram`, {
      method: "POST",
      body: JSON.stringify(diagramData),
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

  async updateSequenceDiagram(
    id: string,
    updates: Partial<SequenceDiagram>,
    token: string
  ): Promise<SequenceDiagram | null> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const index = mockSequenceDiagrams.findIndex(
        (diagram) => diagram.id === id
      );
      if (index === -1) return null;

      mockSequenceDiagrams[index] = {
        ...mockSequenceDiagrams[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return mockSequenceDiagrams[index];
    }

    const response = await fetch(`${baseUrl}/sequence-diagram/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
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

  async deleteSequenceDiagram(id: string, token: string): Promise<boolean> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const index = mockSequenceDiagrams.findIndex(
        (diagram) => diagram.id === id
      );
      if (index === -1) return false;

      mockSequenceDiagrams.splice(index, 1);
      return true;
    }

    const response = await fetch(`${baseUrl}/sequence-diagram/${id}`, {
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

  async toggleSequenceDiagramVisibility(
    id: string,
    token: string
  ): Promise<SequenceDiagram | null> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      const index = mockSequenceDiagrams.findIndex(
        (diagram) => diagram.id === id
      );
      if (index === -1) return null;

      mockSequenceDiagrams[index] = {
        ...mockSequenceDiagrams[index],
        isPublic: !mockSequenceDiagrams[index].isPublic,
        updatedAt: new Date().toISOString(),
      };
      return mockSequenceDiagrams[index];
    }
    const response = await fetch(`${baseUrl}/sequence-diagram/${id}/toggle`, {
      method: "PATCH",
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
};
