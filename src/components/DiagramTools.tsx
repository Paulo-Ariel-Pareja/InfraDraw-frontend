import React from 'react';
import { Button } from '@/components/ui/button';
import { Type, Square, Trash2 } from 'lucide-react';
import ManualConnectionTool from './ManualConnectionTool';

interface DiagramToolsProps {
  isManualConnectionMode: boolean;
  onToggleManualConnection: () => void;
  firstSelectedNode: string | null;
  onAddTextBox: () => void;
  onAddZone: () => void;
  onDeleteSelected: () => void;
}

const DiagramTools: React.FC<DiagramToolsProps> = ({
  isManualConnectionMode,
  onToggleManualConnection,
  firstSelectedNode,
  onAddTextBox,
  onAddZone,
  onDeleteSelected
}) => {
  return (
    <div className="space-y-2">
      <ManualConnectionTool
        isActive={isManualConnectionMode}
        onToggle={onToggleManualConnection}
      />
      <Button onClick={onAddTextBox} variant="outline" className="w-full justify-start h-8 text-xs">
        <Type className="w-3 h-3 mr-2" />
        Caja de Texto
      </Button>
      <Button onClick={onAddZone} variant="outline" className="w-full justify-start h-8 text-xs">
        <Square className="w-3 h-3 mr-2" />
        Zona
      </Button>
      <Button 
        onClick={onDeleteSelected} 
        variant="outline" 
        className="w-full justify-start h-8 text-xs text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-3 h-3 mr-2" />
        Eliminar Seleccionados
      </Button>
      
      {isManualConnectionMode && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
          {firstSelectedNode ? 
            'Haz clic en el segundo componente para conectar' : 
            'Haz clic en el primer componente'
          }
        </div>
      )}
    </div>
  );
};

export default DiagramTools;