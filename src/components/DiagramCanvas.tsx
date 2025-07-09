
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface DiagramCanvasProps {
  nodes: Node[];
  edges: Edge[];
  selectedNodes: string[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: any;
  onNodeClick: any;
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;
  onEdgeConfig?: (edge: Edge) => void;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  nodes,
  edges,
  selectedNodes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  nodeTypes,
  edgeTypes,
  onEdgeConfig
}) => {
  // Crear edgeTypes con la función onConfigClick
  const enhancedEdgeTypes = React.useMemo(() => {
    return Object.keys(edgeTypes).reduce((acc, key) => {
      const EdgeComponent = edgeTypes[key];
      acc[key] = (props: any) => <EdgeComponent {...props} onConfigClick={onEdgeConfig} />;
      return acc;
    }, {} as EdgeTypes);
  }, [edgeTypes, onEdgeConfig]);

  return (
    <div className="flex-1 border rounded-lg bg-white">
      <ReactFlow
        nodes={nodes.map(node => ({
          ...node,
          selected: selectedNodes.includes(node.id) || node.selected
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={enhancedEdgeTypes}
        fitView
        defaultEdgeOptions={{
          type: 'default',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default DiagramCanvas;
