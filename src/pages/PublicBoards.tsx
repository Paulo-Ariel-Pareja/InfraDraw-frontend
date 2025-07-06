import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { Search, Eye, Calendar, User, ExternalLink, Info } from 'lucide-react';
import { Board } from '@/types';
import { usePublicBoards } from '@/hooks/useBoards';

const PublicBoards: React.FC = () => {
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
    publicBoards, 
    total, 
    totalPages, 
    isLoading 
  } = usePublicBoards({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDiagram = (board: Board) => {
    const url = `/public-diagram/${board.id}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && currentPage === 1 && !debouncedSearch) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tableros Públicos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explora diagramas de arquitectura compartidos por la comunidad
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tableros Públicos
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explora diagramas de arquitectura compartidos por la comunidad
        </p>
        
        {/* Información para usuarios no autenticados */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">¡Bienvenido a DiagramArch!</p>
              <p>
                Aquí puedes explorar diagramas de arquitectura compartidos públicamente. 
                Para crear tus propios diagramas y acceder a todas las funcionalidades, 
                <span className="font-medium"> inicia sesión</span> usando el botón en la esquina superior derecha.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar tableros públicos..."
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
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {publicBoards.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicBoards.map((board) => (
                  <Card key={board.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{board.name}</CardTitle>
                          {board.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                              {board.description}
                            </p>
                          )}
                        </div>
                        
                        <Badge variant="default" className="ml-2">
                          <Eye className="w-3 h-3 mr-1" />
                          Público
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            Creado por: <span className="font-medium ml-1">{board.createdBy}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Creado: {formatDate(board.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Actualizado: {formatDate(board.updatedAt)}
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleViewDiagram(board)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver Diagrama
                        </Button>
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
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No hay tableros públicos</h3>
              <p className="text-muted-foreground">
                {debouncedSearch ? 'No se encontraron tableros con ese criterio' : 'No hay tableros públicos disponibles en este momento'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicBoards;