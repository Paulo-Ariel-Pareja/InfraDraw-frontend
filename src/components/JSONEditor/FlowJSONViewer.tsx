import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { convertJSONToFlow } from './jsonToFlow';

interface FlowJSONViewerProps {
  data: any;
  isValid: boolean;
}

export const FlowJSONViewer: React.FC<FlowJSONViewerProps> = ({ data, isValid }) => {
  const flowData = useMemo(() => {
    if (!isValid || !data) {
      return { nodes: [], edges: [] };
    }
    return convertJSONToFlow(data);
  }, [data, isValid]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowData.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowData.edges);

  // Update nodes and edges when data changes
  useMemo(() => {
    setNodes(flowData.nodes);
    setEdges(flowData.edges);
  }, [flowData, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    console.log('Node clicked:', {
      path: node.data.path,
      type: node.data.type,
      value: node.data.value,
    });
  }, []);

  if (!isValid || !data) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {!isValid ? "Invalid JSON" : "No Data"}
          </h3>
          <p className="text-muted-foreground">
            {!isValid 
              ? "Fix the JSON syntax errors to see the flow visualization"
              : "Enter valid JSON in the editor to see the interactive flow diagram"
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-editor-bg relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.1,
          maxZoom: 2,
        }}
        minZoom={0.05}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Controls 
          className="bg-card border border-border rounded-lg shadow-md"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        <Background 
          color="hsl(var(--border))" 
          gap={20} 
          size={1}
        />
      </ReactFlow>
    </div>
  );
};