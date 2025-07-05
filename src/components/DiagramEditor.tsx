import React, { useState, useCallback, useEffect } from 'react';
import { NodeTypes, EdgeTypes, Node, Edge } from '@xyflow/react';
import { Component } from '@/types';
import RelationshipConfig from './RelationshipConfig';
import RelationshipEdge from './RelationshipEdge';
import EditableTextBox from './EditableTextBox';
import EditableZone from './EditableZone';
import ComponentNode from './ComponentNode';
import DiagramSidebar from './DiagramSidebar';
import DiagramCanvas from './DiagramCanvas';
import { useDiagramState } from '@/hooks/useDiagramState';
import { useComponentsForEditor } from '@/hooks/useComponents';

const nodeTypes: NodeTypes = {
  component: ComponentNode,
  textBox: EditableTextBox,
  zone: EditableZone,
};

const edgeTypes: EdgeTypes = {
  relationship: RelationshipEdge,
};

interface DiagramEditorProps {
  boardName: string;
  boardDescription?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave: (name: string, description: string, nodes: any[], edges: any[]) => void;
}

const DiagramEditor: React.FC<DiagramEditorProps> = ({ 
  boardName, 
  boardDescription = '',
  initialNodes = [], 
  initialEdges = [], 
  onSave 
}) => {
  const [boardNameState, setBoardNameState] = useState(boardName);
  const [boardDescriptionState, setBoardDescriptionState] = useState(boardDescription);
  const { components: availableComponents, isLoading: isLoadingComponents } = useComponentsForEditor();
  
  // Update boardNameState when boardName prop changes
  useEffect(() => {
    setBoardNameState(boardName);
  }, [boardName]);

  // Update boardDescriptionState when boardDescription prop changes
  useEffect(() => {
    setBoardDescriptionState(boardDescription);
  }, [boardDescription]);
  
  const {
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
    getComponentFromNode,
    addComponentToBoard,
    addTextBox,
    addZone,
    deleteSelectedElements,
    handleRelationshipSave,
  } = useDiagramState(initialNodes, initialEdges);

  const handleEdgeConfig = (edge: any) => {
    const sourceComponent = getComponentFromNode(edge.source);
    const targetComponent = getComponentFromNode(edge.target);
    
    if (sourceComponent && targetComponent) {
      setEditingEdge(edge);
      setPendingConnection({
        source: edge.source,
        target: edge.target,
        sourceComponent,
        targetComponent,
      });
      setIsRelationshipConfigOpen(true);
    }
  };

  const handleToggleManualConnection = () => {
    setIsManualConnectionMode(!isManualConnectionMode);
    setFirstSelectedNode(null);
  };

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      deleteSelectedElements();
    }
    if (event.key === 'Escape') {
      setIsManualConnectionMode(false);
      setFirstSelectedNode(null);
    }
  }, [deleteSelectedElements, setIsManualConnectionMode, setFirstSelectedNode]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSave = () => {
    if (boardNameState.trim()) {
      onSave(boardNameState, boardDescriptionState, nodes, edges);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex gap-4">
      <DiagramSidebar
        boardName={boardNameState}
        boardDescription={boardDescriptionState}
        onBoardNameChange={setBoardNameState}
        onBoardDescriptionChange={setBoardDescriptionState}
        onSave={handleSave}
        isManualConnectionMode={isManualConnectionMode}
        onToggleManualConnection={handleToggleManualConnection}
        firstSelectedNode={firstSelectedNode}
        onAddTextBox={addTextBox}
        onAddZone={addZone}
        onDeleteSelected={deleteSelectedElements}
        availableComponents={availableComponents}
        onAddComponent={addComponentToBoard}
        isLoadingComponents={isLoadingComponents}
      />

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
        onEdgeConfig={handleEdgeConfig}
      />

      <RelationshipConfig
        isOpen={isRelationshipConfigOpen}
        onClose={() => {
          setIsRelationshipConfigOpen(false);
          setPendingConnection(null);
          setEditingEdge(null);
        }}
        onSave={handleRelationshipSave}
        sourceComponent={pendingConnection?.sourceComponent}
        targetComponent={pendingConnection?.targetComponent}
        existingEdge={editingEdge}
      />
    </div>
  );
};

export default DiagramEditor;