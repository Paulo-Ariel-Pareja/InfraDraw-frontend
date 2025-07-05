import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Save, Loader2, ChevronDown, ChevronRight, Settings, Wrench } from 'lucide-react';
import DiagramTools from './DiagramTools';
import ComponentLibrary from './ComponentLibrary';
import { Component } from '@/types';

interface DiagramSidebarProps {
  boardName: string;
  boardDescription: string;
  onBoardNameChange: (name: string) => void;
  onBoardDescriptionChange: (description: string) => void;
  onSave: () => void;
  isManualConnectionMode: boolean;
  onToggleManualConnection: () => void;
  firstSelectedNode: string | null;
  onAddTextBox: () => void;
  onAddZone: () => void;
  onDeleteSelected: () => void;
  availableComponents: Component[];
  onAddComponent: (component: Component) => void;
  isLoadingComponents?: boolean;
}

const DiagramSidebar: React.FC<DiagramSidebarProps> = ({
  boardName,
  boardDescription,
  onBoardNameChange,
  onBoardDescriptionChange,
  onSave,
  isManualConnectionMode,
  onToggleManualConnection,
  firstSelectedNode,
  onAddTextBox,
  onAddZone,
  onDeleteSelected,
  availableComponents,
  onAddComponent,
  isLoadingComponents = false
}) => {
  const [isBoardConfigOpen, setIsBoardConfigOpen] = useState(true);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  return (
    <div className="w-80 space-y-3 h-full flex flex-col">
      {/* Configuración del tablero - Colapsable */}
      <Collapsible open={isBoardConfigOpen} onOpenChange={setIsBoardConfigOpen}>
        <Card className="flex-shrink-0">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <h3 className="font-semibold text-sm">Información del tablero</h3>
              </div>
              {isBoardConfigOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-3 pb-3 space-y-3">
              <div>
                <Label htmlFor="boardName" className="text-xs">Nombre del Tablero</Label>
                <Input
                  id="boardName"
                  value={boardName}
                  onChange={(e) => onBoardNameChange(e.target.value)}
                  placeholder="Nombre del tablero"
                  className="mt-1 h-8"
                />
              </div>
              <div>
                <Label htmlFor="boardDescription" className="text-xs">Descripción</Label>
                <Textarea
                  id="boardDescription"
                  value={boardDescription}
                  onChange={(e) => onBoardDescriptionChange(e.target.value)}
                  placeholder="Descripción del tablero (opcional)"
                  className="mt-1 text-xs"
                  rows={2}
                />
              </div>
              <Button onClick={onSave} className="w-full h-8 text-xs">
                <Save className="w-3 h-3 mr-2" />
                Guardar Tablero
              </Button>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Herramientas - Colapsable */}
      <Collapsible open={isToolsOpen} onOpenChange={setIsToolsOpen}>
        <Card className="flex-shrink-0">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4" />
                <h3 className="font-semibold text-sm">Herramientas</h3>
              </div>
              {isToolsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-3 pb-3">
              <DiagramTools
                isManualConnectionMode={isManualConnectionMode}
                onToggleManualConnection={onToggleManualConnection}
                firstSelectedNode={firstSelectedNode}
                onAddTextBox={onAddTextBox}
                onAddZone={onAddZone}
                onDeleteSelected={onDeleteSelected}
              />
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Componentes - Siempre visible pero más compacto */}
      <div className="flex-1 min-h-0">
        {isLoadingComponents ? (
          <Card className="p-3 h-full">
            <div className="flex items-center justify-center space-x-2 h-full">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs text-muted-foreground">Cargando componentes...</span>
            </div>
          </Card>
        ) : (
          <ComponentLibrary
            onAddComponent={onAddComponent}
          />
        )}
      </div>
    </div>
  );
};

export default DiagramSidebar;