import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiagramEditor from "@/components/DiagramEditor";
import { toast } from "@/hooks/use-toast";
import { Node, Edge } from "@xyflow/react";
import { useBoard, useBoards } from "@/hooks/useBoards";
import { Component } from "@/types";
import DiagramViewer from "@/components/DiagramViewer";

const PublicDiagram: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { board, isLoading: isLoadingBoard } = useBoard(id || "");
  const { updateBoard, createBoard } = useBoards();
  const [boardName, setBoardName] = useState("Nuevo Tablero");
  const [initialNodes, setInitialNodes] = useState<Node[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (board) {
      setBoardName(board.name);
      // Convert DiagramNode[] to Node[] for ReactFlow compatibility
      const convertedNodes: Node[] = board.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data.label,
          component: node.data.component,
          style: node.data.style,
          ...node.data,
        },
      }));

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

      console.log("Loading board data with handles:", {
        nodes: convertedNodes,
        edges: convertedEdges,
        edgeHandles: convertedEdges.map((e) => ({
          id: e.id,
          sourceHandle: e.sourceHandle,
          targetHandle: e.targetHandle,
        })),
      });

      setInitialNodes(convertedNodes);
      setInitialEdges(convertedEdges);
    }
  }, [board]);

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
          <h1 className="text-3xl font-bold">Visualizador de Diagramas</h1>
          <p className="text-muted-foreground">Tablero no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-primary">InfraDraw</h1>
              <h1 className="font-bold text-gray-600">
                Visualizando: {boardName}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-6 m-6 mt-2">
        <DiagramViewer
          initialNodes={initialNodes}
          initialEdges={initialEdges}
        />
      </div>
    </div>
  );
};

export default PublicDiagram;
