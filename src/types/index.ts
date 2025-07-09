export interface User {
  id: string;
  username: string;
  token: string;
}

export interface UserManagement {
  id: string;
  username: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Component {
  id: string;
  name: string;
  technology: string;
  endpoints: Endpoint[];
  createdAt: string;
  updatedAt: string;
}

export interface Endpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  description?: string;
}

export interface DiagramNode {
  id: string;
  type: "component" | "textBox" | "zone";
  position: { x: number; y: number };
  data: {
    label: string;
    component?: Component;
    style?: Record<string, any>;
  };
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  data?: {
    relationshipType?:
      | "api_call"
      | "data_flow"
      | "dependency"
      | "event"
      | "authentication";
    endpointId?: string;
    label?: string;
    description?: string;
    sourceComponent?: string;
    targetComponent?: string;
  };
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SequenceDiagram {
  id: string;
  name: string;
  description?: string;
  mermaidCode: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
