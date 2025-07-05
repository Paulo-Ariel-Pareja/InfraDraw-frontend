
import React, { useState, useRef, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

interface EditableTextBoxProps {
  id: string;
  data: any;
}

const EditableTextBox: React.FC<EditableTextBoxProps> = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label || 'Texto');
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
      setText(data.label || 'Texto');
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
    <div 
      className="p-3 bg-yellow-100 border-2 border-yellow-300 rounded-lg min-w-[150px] cursor-text"
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
          className="text-sm bg-transparent border-none outline-none w-full"
        />
      ) : (
        <div className="text-sm">{text}</div>
      )}
    </div>
  );
};

export default EditableTextBox;
