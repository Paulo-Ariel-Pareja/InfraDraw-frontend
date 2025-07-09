import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Boxes } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardHeader: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Bienvenido a InfraDraw
      </h1>
      <p className="text-xl text-muted-foreground">
        Crea, gestiona y comparte diagramas de arquitectura de software o de
        sequencia de manera profesional, pero simple.
      </p>

      <div className="flex justify-center gap-4 pt-4">
        <Link to="/editor">
          <Button size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Crear Diagrama
          </Button>
        </Link>
        <Link to="/components">
          <Button variant="outline" size="lg">
            <Boxes className="w-5 h-5 mr-2" />
            Gestionar Componentes
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
