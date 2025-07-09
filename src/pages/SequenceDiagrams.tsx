import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Edit, Trash2, Eye, Plus, Calendar, User, GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSequenceDiagrams } from '@/hooks/useSequenceDiagrams';

const SequenceDiagrams: React.FC = () => {
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
    diagrams, 
    total, 
    totalPages, 
    isLoading, 
    deleteSequenceDiagram, 
    toggleVisibility 
  } = useSequenceDiagrams({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch
  });

  const handleDelete = (id: string) => {
    deleteSequenceDiagram(id);
  };

  const togglePublic = (id: string) => {
    toggleVisibility(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && currentPage === 1 && !debouncedSearch) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Diagramas de Secuencia</h1>
            <p className="text-muted-foreground">Gestiona tus diagramas de secuencia</p>
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
          <h1 className="text-3xl font-bold">Diagramas de Secuencia</h1>
          <p className="text-muted-foreground">Gestiona tus diagramas de secuencia</p>
        </div>
        
        <Link to="/sequence-editor">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Diagrama
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar diagramas..."
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
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {diagrams.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diagrams.map((diagram) => (
                  <Card key={diagram.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center">
                            <GitBranch className="w-5 h-5 mr-2" />
                            {diagram.name}
                          </CardTitle>
                          {diagram.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {diagram.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex space-x-1 ml-2">
                          <Link to={`/sequence-editor/${diagram.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(diagram.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={diagram.isPublic ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => togglePublic(diagram.id)}
                          >
                            {diagram.isPublic ? (
                              <>
                                <Eye className="w-3 h-3 mr-1" />
                                Público
                              </>
                            ) : (
                              'Privado'
                            )}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Creado: {formatDate(diagram.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Actualizado: {formatDate(diagram.updatedAt)}
                          </div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            Por: {diagram.createdBy}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginación */}
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
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <GitBranch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No hay diagramas de secuencia</h3>
              <p className="text-muted-foreground mb-4">
                {debouncedSearch ? 'No se encontraron diagramas con ese criterio' : 'Comienza creando tu primer diagrama de secuencia'}
              </p>
              {!debouncedSearch && (
                <Link to="/sequence-editor">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Diagrama
                  </Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SequenceDiagrams;