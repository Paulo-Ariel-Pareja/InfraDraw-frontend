
import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  Edge,
} from '@xyflow/react';
import { getRelationshipColor } from '@/utils/relationshipUtils';
import { useEdgeLabelPosition } from '@/hooks/useEdgeLabelPosition';
import RelationshipEdgeLabel from './RelationshipEdgeLabel';

interface RelationshipEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: any;
  targetPosition: any;
  style?: React.CSSProperties;
  data?: any;
  markerEnd?: string;
  onConfigClick?: (edge: Edge) => void;
}

const RelationshipEdge: React.FC<RelationshipEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  onConfigClick,
}) => {
  const { getEdge } = useReactFlow();
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { labelOffset, isDragging, handleMouseDown } = useEdgeLabelPosition({
    id,
    labelX,
    labelY,
    data,
  });

  const handleConfigClick = () => {
    const edge = getEdge(id);
    if (edge && onConfigClick) {
      onConfigClick(edge);
    }
  };

  const relationshipColor = data?.relationshipType ? getRelationshipColor(data.relationshipType) : '#6b7280';

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          stroke: relationshipColor,
          strokeWidth: 2,
        }} 
      />
      <EdgeLabelRenderer>
        <RelationshipEdgeLabel
          id={id}
          labelX={labelX}
          labelY={labelY}
          labelOffset={labelOffset}
          isDragging={isDragging}
          data={data}
          onMouseDown={handleMouseDown}
          onConfigClick={handleConfigClick}
        />
      </EdgeLabelRenderer>
    </>
  );
};

export default RelationshipEdge;
