import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Boxes } from 'lucide-react';
import { Component } from '@/types';
import { useComponentsForEditor } from '@/hooks/useComponents';

interface ComponentLibraryProps {
  onAddComponent: (component: Component) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  onAddComponent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { components, isLoading } = useComponentsForEditor(debouncedSearch);

  return (
    <Card className="p-3 h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-3">
        <Boxes className="w-4 h-4" />
        <h3 className="font-semibold text-sm">Componentes</h3>
      </div>
      
      <div className="relative mb-3">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
        <Input
          placeholder="Buscar componentes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-7 h-8 text-xs"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-2 border rounded-lg animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : components.length > 0 ? (
          components.map((component) => (
            <div
              key={component.id}
              className="p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onAddComponent(component)}
            >
              <div className="font-medium text-xs">{component.name}</div>
              <Badge variant="secondary" className="text-xs mt-1">
                {component.technology}
              </Badge>
              <div className="text-xs text-gray-600 mt-1">
                {component.endpoints.length} endpoint{component.endpoints.length !== 1 ? 's' : ''}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-xs py-4">
            {debouncedSearch ? 'No se encontraron componentes' : 'No hay componentes disponibles'}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ComponentLibrary;