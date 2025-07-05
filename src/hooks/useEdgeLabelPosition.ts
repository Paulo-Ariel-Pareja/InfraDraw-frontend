
import { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { parseSize } from '@/utils/relationshipUtils';

interface UseEdgeLabelPositionProps {
  id: string;
  labelX: number;
  labelY: number;
  data?: any;
}

export const useEdgeLabelPosition = ({ id, labelX, labelY, data }: UseEdgeLabelPositionProps) => {
  const { setEdges, getNodes } = useReactFlow();
  const [isDragging, setIsDragging] = useState(false);
  
  const labelOffset = data?.labelOffset || { x: 0, y: 0 };

  // Auto-adjust label position to avoid overlaps only if no manual offset exists
  useEffect(() => {
    if (labelOffset.x === 0 && labelOffset.y === 0) {
      const nodes = getNodes();
      const finalLabelX = labelX;
      const finalLabelY = labelY;
      
      const hasOverlap = nodes.some(node => {
        const nodeX = node.position.x;
        const nodeY = node.position.y;
        const nodeWidth = parseSize(node.style?.width, 200);
        const nodeHeight = parseSize(node.style?.height, 100);
        
        return (
          finalLabelX >= nodeX - 50 &&
          finalLabelX <= nodeX + nodeWidth + 50 &&
          finalLabelY >= nodeY - 25 &&
          finalLabelY <= nodeY + nodeHeight + 25
        );
      });

      if (hasOverlap) {
        const offsetDirection = Math.random() > 0.5 ? 1 : -1;
        const newOffset = { 
          x: offsetDirection * 60, 
          y: offsetDirection * 30 
        };
        
        setEdges((edges) =>
          edges.map((edge) =>
            edge.id === id
              ? { ...edge, data: { ...edge.data, labelOffset: newOffset } }
              : edge
          )
        );
      }
    }
  }, [labelX, labelY, labelOffset, getNodes, id, setEdges]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startOffsetX = labelOffset.x;
    const startOffsetY = labelOffset.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const newOffset = {
        x: startOffsetX + deltaX,
        y: startOffsetY + deltaY,
      };
      
      setEdges((edges) =>
        edges.map((edge) =>
          edge.id === id
            ? { ...edge, data: { ...edge.data, labelOffset: newOffset } }
            : edge
        )
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return {
    labelOffset,
    isDragging,
    handleMouseDown
  };
};
