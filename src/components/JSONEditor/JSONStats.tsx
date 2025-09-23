import { useMemo } from "react";
import { Card } from "@/components/ui/card";

interface JSONStatsProps {
  data: any;
  isValid: boolean;
}

interface JSONAnalysis {
  totalKeys: number;
  maxDepth: number;
  totalArrays: number;
  totalObjects: number;
  totalPrimitives: number;
  nullValues: number;
  dataTypes: Record<string, number>;
  size: string;
}

const analyzeJSON = (obj: any): JSONAnalysis => {
  let totalKeys = 0;
  let maxDepth = 0;
  let totalArrays = 0;
  let totalObjects = 0;
  let totalPrimitives = 0;
  let nullValues = 0;
  const dataTypes: Record<string, number> = {};

  const traverse = (node: any, depth: number = 0) => {
    maxDepth = Math.max(maxDepth, depth);
    
    if (node === null) {
      nullValues++;
      dataTypes['null'] = (dataTypes['null'] || 0) + 1;
      return;
    }
    
    const type = typeof node;
    dataTypes[type] = (dataTypes[type] || 0) + 1;
    
    if (Array.isArray(node)) {
      totalArrays++;
      dataTypes['array'] = (dataTypes['array'] || 0) + 1;
      node.forEach(item => traverse(item, depth + 1));
    } else if (type === 'object') {
      totalObjects++;
      const keys = Object.keys(node);
      totalKeys += keys.length;
      keys.forEach(key => traverse(node[key], depth + 1));
    } else {
      totalPrimitives++;
    }
  };

  traverse(obj);
  
  const jsonString = JSON.stringify(obj);
  const sizeInBytes = new Blob([jsonString]).size;
  const sizeFormatted = sizeInBytes < 1024 
    ? `${sizeInBytes} B`
    : sizeInBytes < 1024 * 1024
    ? `${(sizeInBytes / 1024).toFixed(1)} KB`
    : `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;

  return {
    totalKeys,
    maxDepth,
    totalArrays,
    totalObjects,
    totalPrimitives,
    nullValues,
    dataTypes,
    size: sizeFormatted,
  };
};

export const JSONStats: React.FC<JSONStatsProps> = ({ data, isValid }) => {
  const analysis = useMemo(() => {
    if (!isValid || !data) return null;
    return analyzeJSON(data);
  }, [data, isValid]);

  if (!analysis) {
    return (
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="text-sm text-muted-foreground text-center">
          No statistics available
        </div>
      </div>
    );
  }

  const statsItems = [
    { label: "Depth", value: analysis.maxDepth, icon: "📏" },
    { label: "Keys", value: analysis.totalKeys, icon: "🔑" },
    { label: "Objects", value: analysis.totalObjects, icon: "📦" },
    { label: "Arrays", value: analysis.totalArrays, icon: "📋" },
    { label: "Size", value: analysis.size, icon: "📊" },
  ];

  return (
    <div className="p-3 border-b border-border bg-muted/30">
      <div className="grid grid-cols-5 gap-2">
        {statsItems.map((stat, index) => (
          <div
            key={index}
            className="text-center p-2 rounded-md bg-card/50 border border-border/50 hover:bg-card/80 transition-colors"
          >
            <div className="text-lg mb-1">{stat.icon}</div>
            <div className="text-sm font-semibold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {Object.keys(analysis.dataTypes).length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">Data types</h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(analysis.dataTypes).map(([type, count]) => {
              const getTypeColor = (type: string) => {
                switch (type) {
                  case 'string': return 'text-syntax-string bg-syntax-string/10';
                  case 'number': return 'text-syntax-number bg-syntax-number/10';
                  case 'boolean': return 'text-syntax-boolean bg-syntax-boolean/10';
                  case 'object': return 'text-syntax-key bg-syntax-key/10';
                  case 'array': return 'text-syntax-bracket bg-syntax-bracket/10';
                  case 'null': return 'text-syntax-null bg-syntax-null/10';
                  default: return 'text-muted-foreground bg-muted/20';
                }
              };

              return (
                <span
                  key={type}
                  className={`px-2 py-1 rounded-sm text-xs font-mono ${getTypeColor(type)}`}
                >
                  {type}: {count}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};