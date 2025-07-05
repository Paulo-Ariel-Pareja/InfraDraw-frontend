
import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, X, Move } from 'lucide-react';
import { Component } from '@/types';
import { getRelationshipColor, relationshipTypeLabels } from '@/utils/relationshipUtils';

interface RelationshipEdgeLabelProps {
  id: string;
  labelX: number;
  labelY: number;
  labelOffset: { x: number; y: number };
  isDragging: boolean;
  data?: any;
  onMouseDown: (e: React.MouseEvent) => void;
  onConfigClick?: () => void;
}

const RelationshipEdgeLabel: React.FC<RelationshipEdgeLabelProps> = ({
  id,
  labelX,
  labelY,
  labelOffset,
  isDragging,
  data,
  onMouseDown,
  onConfigClick,
}) => {
  const { setEdges, getNodes } = useReactFlow();

  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const handleConfigClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfigClick?.();
  };

  const getEndpointInfo = () => {
    if (data?.endpointId) {
      const nodes = getNodes();
      const targetNode = nodes.find(n => n.id === data.targetNodeId);
      
      const targetComponent = targetNode?.data?.component as Component;
      if (targetComponent?.endpoints) {
        const endpoint = targetComponent.endpoints.find((ep: any) => ep.id === data.endpointId);
        if (endpoint) {
          return {
            method: endpoint.method,
            url: endpoint.url,
            description: endpoint.description
          };
        }
      }
    }
    return null;
  };

  const relationshipColor = data?.relationshipType ? getRelationshipColor(data.relationshipType) : '#6b7280';
  const endpointInfo = getEndpointInfo();

  return (
    <div
      className={`absolute pointer-events-auto select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        transform: `translate(-50%, -50%) translate(${labelX + labelOffset.x}px,${labelY + labelOffset.y}px)`,
      }}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center gap-2 bg-white border rounded-lg shadow-lg px-3 py-2 max-w-xs">
        <div className="flex items-center gap-1 text-gray-400" title="Arrastra para reposicionar">
          <Move className="h-3 w-3" />
        </div>
        
        <div className="flex flex-col items-start gap-1 flex-1">
          {data?.label && (
            <span className="text-sm font-medium text-gray-900">
              {data.label}
            </span>
          )}
          
          {data?.relationshipType && (
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{ 
                backgroundColor: `${relationshipColor}20`, 
                color: relationshipColor,
                border: `1px solid ${relationshipColor}40`
              }}
            >
              {relationshipTypeLabels[data.relationshipType as keyof typeof relationshipTypeLabels] || data.relationshipType}
            </Badge>
          )}
          
          {endpointInfo && (
            <div className="text-xs font-mono bg-gray-50 px-2 py-1 rounded border">
              <div className="font-semibold text-blue-600">
                {endpointInfo.method} {endpointInfo.url}
              </div>
              {endpointInfo.description && (
                <div className="text-gray-600 mt-1">
                  {endpointInfo.description}
                </div>
              )}
            </div>
          )}

          {data?.description && (
            <span className="text-xs text-gray-500 italic">
              {data.description}
            </span>
          )}
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-blue-100"
            onClick={handleConfigClick}
            title="Configurar relación"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-red-100"
            onClick={onDeleteClick}
            title="Eliminar relación"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RelationshipEdgeLabel;
