
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Component } from '@/types';

const ComponentNode: React.FC<NodeProps> = ({ data, selected }) => {
  const component = data?.component as Component;

  if (!component) {
    return (
      <Card className={`min-w-[200px] ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Componente sin datos</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      {/* Handles de entrada (izquierda) - todos target para recibir conexiones */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-top"
        style={{
          background: 'green',
          width: 8,
          height: 8,
          top: '25%',
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-center"
        style={{
          background: 'red',
          width: 8,
          height: 8,
          top: '50%',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-bottom"
        style={{
          background: 'green',
          width: 8,
          height: 8,
          top: '75%',
        }}
      />
      
      {/* Handles de salida (derecha) - todos source para enviar conexiones */}
      <Handle
        type="source"
        //type="target"
        position={Position.Right}
        id="right-top"
        style={{
          background: 'red',
          width: 8,
          height: 8,
          top: '25%',
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-center"
        style={{
          background: 'green',
          width: 8,
          height: 8,
          top: '50%',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-bottom"
        style={{
          background: 'red',
          width: 8,
          height: 8,
          top: '75%',
        }}
      />

      {/* Handles superiores - mixtos para flexibilidad */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-left"
        style={{
          background: 'green',
          width: 8,
          height: 8,
          left: '30%',
        }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-right"
        style={{
          background: 'red',
          width: 8,
          height: 8,
          left: '70%',
        }}
      />

      {/* Handles inferiores - mixtos para flexibilidad */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-left"
        style={{
          background: 'red',
          width: 8,
          height: 8,
          left: '30%',
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-right"
        style={{
          background: 'green',
          width: 8,
          height: 8,
          left: '70%',
        }}
      />

      <Card className={`min-w-[200px] ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{component.name}</CardTitle>
          <Badge variant="secondary" className="text-xs w-fit">
            {component.technology}
          </Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-gray-600">
            {component.endpoints.length} endpoint{component.endpoints.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ComponentNode;
