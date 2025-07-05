
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, Presentation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRecentBoards } from '@/hooks/useStats';

const RecentBoards: React.FC = () => {
  const { recentBoards, isLoading } = useRecentBoards();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FolderOpen className="w-5 h-5 mr-2" />
          Tableros Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {recentBoards.map((board) => (
                <div
                  key={board.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="font-medium">{board.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Actualizado: {new Date(board.updatedAt).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  <Link to={`/editor/${board.id}`}>
                    <Button variant="outline" size="sm">
                      <Presentation className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </Link>
                </div>
              ))}
              
              <Link to="/boards" className="block">
                <Button variant="outline" className="w-full">
                  Ver Todos los Tableros
                </Button>
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBoards;
