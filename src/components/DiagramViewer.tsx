import { NodeTypes, EdgeTypes, Node, Edge } from '@xyflow/react';
import RelationshipEdge from './RelationshipEdge';
import EditableTextBox from './EditableTextBox';
import EditableZone from './EditableZone';
import ComponentNode from './ComponentNode';
import DiagramCanvas from './DiagramCanvas';
import { useDiagramState } from '@/hooks/useDiagramState';

const nodeTypes: NodeTypes = {
  component: ComponentNode,
  textBox: EditableTextBox,
  zone: EditableZone,
};

const edgeTypes: EdgeTypes = {
  relationship: RelationshipEdge,
};

interface DiagramViewerProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({
  initialNodes = [], 
  initialEdges = [], 
}) => {

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    selectedNodes,
  } = useDiagramState(initialNodes, initialEdges);

  return (
    <div className="h-[calc(100vh-200px)] flex gap-4">

      <DiagramCanvas
        nodes={nodes}
        edges={edges}
        selectedNodes={selectedNodes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      />
    </div>
  );
};
export default DiagramViewer;
