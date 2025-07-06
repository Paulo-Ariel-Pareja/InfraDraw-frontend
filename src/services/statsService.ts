const baseUrl = import.meta.env.VITE_API_URL;
const useMock = false;
const API_DELAY = 1000;

export interface RecentBoard {
  id: string;
  name: string;
  updatedAt: string;
}

export interface ActivityStats {
  name: string;
  tableros: number;
  componentes: number;
}

export const statsService = {
  async getRecentBoards(token: string): Promise<RecentBoard[]> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      return [
        {
          id: "1",
          name: "Arquitectura Microservicios",
          updatedAt: "2024-01-20T15:30:00Z",
        },
        {
          id: "2",
          name: "Sistema de Autenticación",
          updatedAt: "2024-01-18T14:20:00Z",
        },
        {
          id: "3",
          name: "API Gateway Design",
          updatedAt: "2024-01-15T11:30:00Z",
        },
      ];
    }
    const response = await fetch(`${baseUrl}/board/recent`, {
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

  async getActivityStats(token: string): Promise<ActivityStats[]> {
    if (useMock) {
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
      return [
        { name: "Lun", tableros: 2, componentes: 1 },
        { name: "Mar", tableros: 1, componentes: 3 },
        { name: "Mié", tableros: 3, componentes: 2 },
        { name: "Jue", tableros: 1, componentes: 1 },
        { name: "Vie", tableros: 2, componentes: 4 },
        { name: "Sáb", tableros: 0, componentes: 0 },
        { name: "Dom", tableros: 1, componentes: 1 },
      ];
    }
    const response = await fetch(`${baseUrl}/stats`, {
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
};
