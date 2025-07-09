import { useState, useCallback, useEffect } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType,
} from "@xyflow/react";
import { Component } from "@/types";

export const useDiagramState = (
  initialNodes: Node[] = [],
  initialEdges: Edge[] = []
) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isRelationshipConfigOpen, setIsRelationshipConfigOpen] =
    useState(false);
  const [pendingConnection, setPendingConnection] = useState<{
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    sourceComponent?: Component;
    targetComponent?: Component;
  } | null>(null);
  const [editingEdge, setEditingEdge] = useState<Edge | null>(null);
  const [isManualConnectionMode, setIsManualConnectionMode] = useState(false);
  const [firstSelectedNode, setFirstSelectedNode] = useState<string | null>(
    null
  );
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  // Inicializar nodos y aristas cuando se reciben los datos iniciales
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes, setNodes]);

  useEffect(() => {
    if (initialEdges.length > 0) {
      // Asegurar que los edges tienen los handles correctos
      const edgesWithHandles = initialEdges.map((edge) => ({
        ...edge,
        sourceHandle: edge.sourceHandle || "right-center",
        targetHandle: edge.targetHandle || "left-center",
      }));
      setEdges(edgesWithHandles);
    }
  }, [initialEdges, setEdges]);

  const getComponentFromNode = useCallback(
    (nodeId: string): Component | undefined => {
      const node = nodes.find((n) => n.id === nodeId);
      const component = node?.data?.component;
      return component;
    },
    [nodes]
  );

  const addComponentToBoard = useCallback(
    (component: Component) => {
      const newNode: Node = {
        id: `${component.id}-${Date.now()}`,
        type: "component",
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        data: {
          label: component.name,
          component: component,
        },
      };
      setNodes((prev) => [...prev, newNode]);
    },
    [setNodes]
  );

  const addTextBox = useCallback(() => {
    const newNode: Node = {
      id: `text-${Date.now()}`,
      type: "textBox",
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: { label: "Nueva caja de texto" },
    };
    setNodes((prev) => [...prev, newNode]);
  }, [setNodes]);

  const addZone = useCallback(() => {
    const newNode: Node = {
      id: `zone-${Date.now()}`,
      type: "zone",
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      data: {
        label: "Nueva zona",
        style: { backgroundColor: "#f3f4f6" },
      },
      style: { width: 300, height: 200 },
      zIndex: -10,
    };
    setNodes((prev) => [...prev, newNode]);
  }, [setNodes]);

  const deleteSelectedElements = useCallback(() => {
    const selectedNodeIds = nodes
      .filter((node) => node.selected)
      .map((node) => node.id);
    const selectedEdgeIds = edges
      .filter((edge) => edge.selected)
      .map((edge) => edge.id);

    if (selectedNodeIds.length > 0) {
      setNodes((nodes) =>
        nodes.filter((node) => !selectedNodeIds.includes(node.id))
      );
      setEdges((edges) =>
        edges.filter(
          (edge) =>
            !selectedNodeIds.includes(edge.source) &&
            !selectedNodeIds.includes(edge.target)
        )
      );
    }

    if (selectedEdgeIds.length > 0) {
      setEdges((edges) =>
        edges.filter((edge) => !selectedEdgeIds.includes(edge.id))
      );
    }
  }, [nodes, edges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceComponent = getComponentFromNode(params.source);
      const targetComponent = getComponentFromNode(params.target);

      if (sourceComponent && targetComponent) {
        setPendingConnection({
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle || "right-center",
          targetHandle: params.targetHandle || "left-center",
          sourceComponent,
          targetComponent,
        });
        setIsRelationshipConfigOpen(true);
      } else {
        const newEdge: Edge = {
          id: `edge-${Date.now()}`,
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle || "right-center",
          targetHandle: params.targetHandle || "left-center",
          type: "default",
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        };
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [getComponentFromNode, setEdges]
  );

  const handleRelationshipSave = useCallback(
    (edgeData: any) => {
      if (pendingConnection) {
        // Para ediciones, usar los handles originales del edge existente
        const sourceHandle = editingEdge
          ? editingEdge.sourceHandle
          : pendingConnection.sourceHandle;
        const targetHandle = editingEdge
          ? editingEdge.targetHandle
          : pendingConnection.targetHandle;

        const newEdge: Edge = {
          id: editingEdge?.id || `relationship-${Date.now()}`,
          source: pendingConnection.source,
          target: pendingConnection.target,
          sourceHandle: sourceHandle,
          targetHandle: targetHandle,
          type: "relationship",
          data: {
            ...edgeData,
            sourceComponent: pendingConnection.sourceComponent?.name,
            targetComponent: pendingConnection.targetComponent?.name,
            targetNodeId: pendingConnection.target,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        };

        if (editingEdge) {
          setEdges((eds) =>
            eds.map((edge) => (edge.id === editingEdge.id ? newEdge : edge))
          );
        } else {
          setEdges((eds) => {
            const updatedEdges = addEdge(newEdge, eds);
            return updatedEdges;
          });
        }
      }

      setPendingConnection(null);
      setEditingEdge(null);
      setIsRelationshipConfigOpen(false);
    },
    [pendingConnection, editingEdge, setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (isManualConnectionMode && node.type === "component") {
        if (!firstSelectedNode) {
          setFirstSelectedNode(node.id);
          setSelectedNodes([node.id]);
        } else if (firstSelectedNode !== node.id) {
          const sourceComponent = getComponentFromNode(firstSelectedNode);
          const targetComponent = getComponentFromNode(node.id);

          if (sourceComponent && targetComponent) {
            setPendingConnection({
              source: firstSelectedNode,
              target: node.id,
              sourceHandle: "right-center",
              targetHandle: "left-center",
              sourceComponent,
              targetComponent,
            });
            setIsRelationshipConfigOpen(true);
          }

          setFirstSelectedNode(null);
          setSelectedNodes([]);
          setIsManualConnectionMode(false);
        }
      }
    },
    [isManualConnectionMode, firstSelectedNode, getComponentFromNode]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    isRelationshipConfigOpen,
    setIsRelationshipConfigOpen,
    pendingConnection,
    setPendingConnection,
    editingEdge,
    setEditingEdge,
    isManualConnectionMode,
    setIsManualConnectionMode,
    firstSelectedNode,
    setFirstSelectedNode,
    selectedNodes,
    setSelectedNodes,
    getComponentFromNode,
    addComponentToBoard,
    addTextBox,
    addZone,
    deleteSelectedElements,
    handleRelationshipSave,
  };
};
