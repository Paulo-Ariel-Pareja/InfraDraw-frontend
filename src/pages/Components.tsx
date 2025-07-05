import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { Plus, Edit, Trash2, Search, Code } from 'lucide-react';
import { Component, Endpoint } from '@/types';
import { useComponents } from '@/hooks/useComponents';

const Components: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 6;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { 
    components, 
    total, 
    totalPages, 
    isLoading, 
    createComponent, 
    updateComponent, 
    deleteComponent 
  } = useComponents({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    technology: '',
    endpoints: [] as Endpoint[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingComponent) {
      updateComponent({ id: editingComponent.id, updates: formData });
    } else {
      createComponent(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', technology: '', endpoints: [] });
    setEditingComponent(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (component: Component) => {
    setEditingComponent(component);
    setFormData({
      name: component.name,
      technology: component.technology,
      endpoints: component.endpoints
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteComponent(id);
  };

  const addEndpoint = () => {
    const newEndpoint: Endpoint = {
      id: Date.now().toString(),
      method: 'GET',
      url: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      endpoints: [...prev.endpoints, newEndpoint]
    }));
  };

  const updateEndpoint = (index: number, field: keyof Endpoint, value: string) => {
    setFormData(prev => ({
      ...prev,
      endpoints: prev.endpoints.map((endpoint, i) =>
        i === index ? { ...endpoint, [field]: value } : endpoint
      )
    }));
  };

  const removeEndpoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      endpoints: prev.endpoints.filter((_, i) => i !== index)
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && currentPage === 1 && !debouncedSearch) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Componentes</h1>
            <p className="text-muted-foreground">Gestiona los componentes de tu arquitectura</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Componentes</h1>
          <p className="text-muted-foreground">Gestiona los componentes de tu arquitectura</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Componente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingComponent ? 'Editar Componente' : 'Nuevo Componente'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre del componente"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="technology">Tecnología</Label>
                  <Input
                    id="technology"
                    value={formData.technology}
                    onChange={(e) => setFormData(prev => ({ ...prev, technology: e.target.value }))}
                    placeholder="ej: Node.js, Python, Java"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Endpoints</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addEndpoint}>
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar
                  </Button>
                </div>

                {formData.endpoints.map((endpoint, index) => (
                  <div key={endpoint.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <Select
                          value={endpoint.method}
                          onValueChange={(value) => updateEndpoint(index, 'method', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                            <SelectItem value="PUT">PUT</SelectItem>
                            <SelectItem value="DELETE">DELETE</SelectItem>
                            <SelectItem value="PATCH">PATCH</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Input
                          value={endpoint.url}
                          onChange={(e) => updateEndpoint(index, 'url', e.target.value)}
                          placeholder="/api/endpoint"
                        />
                        
                        <Input
                          value={endpoint.description || ''}
                          onChange={(e) => updateEndpoint(index, 'description', e.target.value)}
                          placeholder="Descripción"
                        />
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEndpoint(index)}
                        className="ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingComponent ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar componentes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <Card key={component.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        {component.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {component.technology}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(component)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(component.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Endpoints ({component.endpoints.length})</p>
                    {component.endpoints.slice(0, 3).map((endpoint) => (
                      <div key={endpoint.id} className="flex items-center space-x-2 text-xs">
                        <Badge 
                          variant={endpoint.method === 'GET' ? 'default' : 
                                   endpoint.method === 'POST' ? 'secondary' : 'outline'}
                          className="text-xs px-2 py-0"
                        >
                          {endpoint.method}
                        </Badge>
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {endpoint.url}
                        </code>
                      </div>
                    ))}
                    {component.endpoints.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{component.endpoints.length - 3} más...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {!isLoading && components.length === 0 && (
        <div className="text-center py-12">
          <Code className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay componentes</h3>
          <p className="text-muted-foreground mb-4">
            {debouncedSearch ? 'No se encontraron componentes con ese criterio' : 'Comienza creando tu primer componente'}
          </p>
          {!debouncedSearch && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Componente
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Components;