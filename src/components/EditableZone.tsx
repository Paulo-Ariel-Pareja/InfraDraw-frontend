
import React, { useState, useRef, useEffect } from 'react';
import { useReactFlow, NodeResizer } from '@xyflow/react';

interface EditableZoneProps {
  id: string;
  data: any;
}

const EditableZone: React.FC<EditableZoneProps> = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || 'Zona');
  const inputRef = useRef<HTMLInputElement>(null);
  const { setNodes } = useReactFlow();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setText(data.label || 'Zona');
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: text } }
          : node
      )
    );
  };

  return (
    <>
      <NodeResizer minWidth={200} minHeight={150} />
      <div 
        className="p-4 border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg w-full h-full cursor-text"
        style={{ 
          backgroundColor: data.style?.backgroundColor || '#f9fafb',
          zIndex: -1,
          position: 'relative'
        }}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyPress}
            className="font-medium text-gray-700 bg-transparent border-none outline-none"
            style={{ zIndex: 1, position: 'relative' }}
          />
        ) : (
          <div 
            className="font-medium text-gray-700"
            style={{ zIndex: 1, position: 'relative' }}
          >
            {text}
          </div>
        )}
      </div>
    </>
  );
};

export default EditableZone;
