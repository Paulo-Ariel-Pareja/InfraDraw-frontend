import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Boxes, Globe, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/editor">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="flex items-center mb-2">
                  <Plus className="w-5 h-5 mr-2" />
                  Nuevo Diagrama
                </div>
                <div className="text-sm text-muted-foreground">
                  Crear un nuevo tablero
                </div>
              </div>
            </Button>
          </Link>

          <Link to="/components">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="flex items-center mb-2">
                  <Boxes className="w-5 h-5 mr-2" />
                  Nuevo Componente
                </div>
                <div className="text-sm text-muted-foreground">
                  Agregar componente
                </div>
              </div>
            </Button>
          </Link>

          <Link to="/public">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="flex items-center mb-2">
                  <Globe className="w-5 h-5 mr-2" />
                  Explorar Público
                </div>
                <div className="text-sm text-muted-foreground">
                  Ver tableros públicos
                </div>
              </div>
            </Button>
          </Link>

          <Link to="/boards">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4"
            >
              <div className="text-left">
                <div className="flex items-center mb-2">
                  <FolderOpen className="w-5 h-5 mr-2" />
                  Mis Proyectos
                </div>
                <div className="text-sm text-muted-foreground">
                  Gestionar tableros
                </div>
              </div>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
