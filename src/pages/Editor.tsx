import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiagramEditor from "@/components/DiagramEditor";
import { toast } from "@/hooks/use-toast";
import { Node, Edge } from "@xyflow/react";
import { useBoard, useBoards } from "@/hooks/useBoards";
import { Component } from "@/types";

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { board, isLoading: isLoadingBoard } = useBoard(id || "");
  const { updateBoard, createBoard } = useBoards();
  const [boardName, setBoardName] = useState("Nuevo Tablero");
  const [boardDescription, setBoardDescription] = useState("");
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (board) {
      setBoardName(board.name);
      setBoardDescription(board.description || "");
      // Convert DiagramNode[] to Node[] for ReactFlow compatibility
      const convertedNodes: Node[] = board.nodes.map((node) => {
        if (node.type === "zone") {
          return {
            id: node.id,
            type: node.type,
            position: node.position,
            data: {
              label: node.data.label,
              component: node.data.component,
              style: node.data.style,
              ...node.data,
            },
            style: { width: 150, height: 100 },
            width: node.width,
            height: node.height,
            zIndex: -10
          };
        }

        return {
          id: node.id,
          type: node.type,
          position: node.position,
          data: {
            label: node.data.label,
            component: node.data.component,
            style: node.data.style,
            ...node.data,
          },
        };
      });

      // Convert DiagramEdge[] to Edge[] for ReactFlow compatibility - preservar handles
      const convertedEdges: Edge[] = board.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || "right-center",
        targetHandle: edge.targetHandle || "left-center",
        type: edge.type || "default",
        data: edge.data,
      }));

      setInitialNodes(convertedNodes);
      setInitialEdges(convertedEdges);
    }
  }, [board]);

  const handleSave = (
    name: string,
    description: string,
    nodes: Node[],
    edges: Edge[]
  ) => {
    // Convert back to our types when saving - preservar handles
    const diagramNodes = nodes.map((node) => ({
      id: node.id,
      type: node.type as "component" | "textBox" | "zone",
      position: node.position,
      data: {
        label: (node.data?.label as string) || "Sin etiqueta",
        component: node.data?.component as Component | undefined,
        style: node.data?.style as Record<string, any> | undefined,
        ...node.data,
      },
      width: node.width,
      height: node.height,
    }));

    const diagramEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type,
      data: edge.data,
    }));

    if (id && board) {
      // Actualizar tablero existente
      updateBoard({
        id,
        updates: {
          name,
          description,
          nodes: diagramNodes,
          edges: diagramEdges,
        },
      });
      toast({
        title: "Tablero actualizado",
        description: `El tablero "${name}" se actualizó correctamente.`,
      });
    } else {
      // Crear nuevo tablero
      createBoard({
        name,
        description:
          description ||
          `Diagrama creado el ${new Date().toLocaleDateString()}`,
        nodes: diagramNodes,
        edges: diagramEdges,
        isPublic: false,
        createdBy: "admin",
      });
      toast({
        title: "Tablero guardado",
        description: `El tablero "${name}" se guardó correctamente.`,
      });
      // Navegar a la página de tableros después de guardar
      setTimeout(() => {
        navigate("/boards");
      }, 1500);
    }
  };

  if (id && isLoadingBoard) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Editor de Diagramas</h1>
          <p className="text-muted-foreground">Cargando tablero...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (id && !board && !isLoadingBoard) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Editor de Diagramas</h1>
          <p className="text-muted-foreground">Tablero no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editor de Diagramas</h1>
        <p className="text-muted-foreground">
          {id
            ? "Edita tu diagrama de arquitectura"
            : "Crea y edita diagramas de arquitectura"}
        </p>
      </div>

      <DiagramEditor
        boardName={boardName}
        boardDescription={boardDescription}
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        onSave={handleSave}
      />
    </div>
  );
};

export default Editor;
