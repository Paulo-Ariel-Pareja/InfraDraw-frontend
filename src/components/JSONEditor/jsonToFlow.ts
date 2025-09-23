import { Node, Edge, Position } from '@xyflow/react';

export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  value: any;
  type: string;
  path: string;
  isExpandable: boolean;
}

export const getNodeColor = (type: string): string => {
  switch (type) {
    case 'string': return 'hsl(var(--syntax-string))';
    case 'number': return 'hsl(var(--syntax-number))';
    case 'boolean': return 'hsl(var(--syntax-boolean))';
    case 'null': return 'hsl(var(--syntax-null))';
    case 'object': return 'hsl(var(--syntax-key))';
    case 'array': return 'hsl(var(--syntax-bracket))';
    case 'root': return 'hsl(var(--primary))';
    default: return 'hsl(var(--muted-foreground))';
  }
};

export const getNodeBackgroundColor = (type: string): string => {
  switch (type) {
    case 'string': return 'hsl(var(--syntax-string) / 0.1)';
    case 'number': return 'hsl(var(--syntax-number) / 0.1)';
    case 'boolean': return 'hsl(var(--syntax-boolean) / 0.1)';
    case 'null': return 'hsl(var(--syntax-null) / 0.1)';
    case 'object': return 'hsl(var(--syntax-key) / 0.1)';
    case 'array': return 'hsl(var(--syntax-bracket) / 0.1)';
    case 'root': return 'hsl(var(--primary) / 0.1)';
    default: return 'hsl(var(--muted) / 0.1)';
  }
};

export const convertJSONToFlow = (data: any): { nodes: Node[], edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeId = 0;
  
  // Calculate tree structure to avoid overlaps
  const calculateTreeLayout = (value: any): { width: number; height: number } => {
    if (value === null || typeof value !== 'object') {
      return { width: 150, height: 60 };
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return { width: 150, height: 60 };
      
      let totalHeight = 0;
      let maxWidth = 150;
      
      value.forEach(item => {
        const childLayout = calculateTreeLayout(item);
        totalHeight += childLayout.height + 20; // 20px spacing
        maxWidth = Math.max(maxWidth, childLayout.width);
      });
      
      return { width: maxWidth + 200, height: Math.max(totalHeight, 60) };
    } else {
      const keys = Object.keys(value);
      if (keys.length === 0) return { width: 150, height: 60 };
      
      let totalHeight = 0;
      let maxWidth = 150;
      
      keys.forEach(key => {
        const childLayout = calculateTreeLayout(value[key]);
        totalHeight += childLayout.height + 20; // 20px spacing
        maxWidth = Math.max(maxWidth, childLayout.width);
      });
      
      return { width: maxWidth + 200, height: Math.max(totalHeight, 60) };
    }
  };
  
  const createNode = (
    value: any,
    key: string,
    path: string,
    x: number,
    y: number,
    parentId?: string,
    availableHeight?: number
  ): string => {
    const currentId = `node-${nodeId++}`;
    const valueType = getValueType(value);
    
    // Determine if this node is expandable
    const isExpandable = valueType === 'object' || valueType === 'array';
    
    // Create display label
    let displayValue = '';
    if (valueType === 'string') {
      displayValue = `"${value}"`;
    } else if (valueType === 'object') {
      const keys = Object.keys(value);
      displayValue = `{${keys.length} ${keys.length === 1 ? 'property' : 'properties'}}`;
    } else if (valueType === 'array') {
      displayValue = `[${value.length} ${value.length === 1 ? 'item' : 'items'}]`;
    } else {
      displayValue = String(value);
    }
    
    const label = key ? `${key}: ${displayValue}` : displayValue;
    
    nodes.push({
      id: currentId,
      type: 'default',
      position: { x, y },
      data: {
        label,
        value,
        type: valueType,
        path,
        isExpandable,
      } as FlowNodeData,
      style: {
        background: getNodeBackgroundColor(valueType),
        color: getNodeColor(valueType),
        border: `1px solid ${getNodeColor(valueType)}`,
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '13px',
        fontFamily: 'monospace',
        minWidth: '140px',
        maxWidth: '220px',
        textAlign: 'center',
        wordBreak: 'break-word',
        lineHeight: '1.4',
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });
    
    // Create edge from parent if exists
    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${currentId}`,
        source: parentId,
        target: currentId,
        type: 'smoothstep',
        style: {
          stroke: 'hsl(var(--border))',
          strokeWidth: 2,
        },
      });
    }
    
    // Process children with better spacing
    if (valueType === 'object') {
      const keys = Object.keys(value);
      if (keys.length > 0) {
        const childLayouts = keys.map(key => calculateTreeLayout(value[key]));
        const totalChildrenHeight = childLayouts.reduce((sum, layout) => sum + layout.height, 0);
        const spacingBetweenChildren = Math.max(30, (keys.length - 1) * 20);
        const totalHeight = totalChildrenHeight + spacingBetweenChildren;
        
        let currentY = y - totalHeight / 2;
        
        keys.forEach((childKey, index) => {
          const childPath = path ? `${path}.${childKey}` : childKey;
          const childLayout = childLayouts[index];
          const childX = x + 250; // Increased horizontal spacing
          const childCenterY = currentY + childLayout.height / 2;
          
          createNode(
            value[childKey],
            childKey,
            childPath,
            childX,
            childCenterY,
            currentId,
            childLayout.height
          );
          
          currentY += childLayout.height + Math.max(30, 40); // Dynamic spacing
        });
      }
    } else if (valueType === 'array') {
      if (value.length > 0) {
        const childLayouts = value.map((item: any) => calculateTreeLayout(item));
        const totalChildrenHeight = childLayouts.reduce((sum, layout) => sum + layout.height, 0);
        const spacingBetweenChildren = Math.max(30, (value.length - 1) * 20);
        const totalHeight = totalChildrenHeight + spacingBetweenChildren;
        
        let currentY = y - totalHeight / 2;
        
        value.forEach((item: any, index: number) => {
          const childPath = `${path}[${index}]`;
          const childLayout = childLayouts[index];
          const childX = x + 250; // Increased horizontal spacing
          const childCenterY = currentY + childLayout.height / 2;
          
          createNode(
            item,
            `[${index}]`,
            childPath,
            childX,
            childCenterY,
            currentId,
            childLayout.height
          );
          
          currentY += childLayout.height + Math.max(30, 40); // Dynamic spacing
        });
      }
    }
    
    return currentId;
  };
  
  // Start with root node - calculate initial position based on tree size
  const rootLayout = calculateTreeLayout(data);
  const startY = Math.max(200, rootLayout.height / 2);
  createNode(data, 'root', '', 50, startY);
  
  return { nodes, edges };
};

const getValueType = (value: any): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};