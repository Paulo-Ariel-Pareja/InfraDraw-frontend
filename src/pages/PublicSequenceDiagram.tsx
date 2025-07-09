import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSequenceDiagram } from "@/hooks/useSequenceDiagrams";
import MermaidRenderer from "@/components/sequence/MermaidRenderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, User, Calendar, Eye } from "lucide-react";

const PublicSequenceDiagram: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { diagram, isLoading } = useSequenceDiagram(id || "");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold text-primary">InfraDraw</h1>
                <h1 className="font-bold text-gray-600">
                  Cargando diagrama...
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!diagram) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold text-primary">InfraDraw</h1>
                <h1 className="font-bold text-gray-600">
                  Diagrama no encontrado
                </h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Diagrama no encontrado
            </h2>
            <p className="text-gray-600">
              El diagrama que buscas no existe o no es público.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if diagram is public
  if (!diagram.isPublic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <h1 className="text-xl font-bold text-primary">InfraDraw</h1>
                <h1 className="font-bold text-gray-600">Acceso denegado</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Diagrama privado
            </h2>
            <p className="text-gray-600">
              Este diagrama no es público y no puede ser visualizado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-primary">InfraDraw</h1>
              <div className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5 text-gray-600" />
                <h1 className="font-bold text-gray-600">{diagram.name}</h1>
              </div>
            </div>
            <Badge variant="default">
              <Eye className="w-3 h-3 mr-1" />
              Público
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Información del diagrama */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <GitBranch className="w-6 h-6 mr-2" />
                  {diagram.name}
                </CardTitle>
                {diagram.description && (
                  <p className="text-muted-foreground mt-2">
                    {diagram.description}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                Creado por:{" "}
                <span className="font-medium ml-1">{diagram.createdBy}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Creado: {formatDate(diagram.createdAt)}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Actualizado: {formatDate(diagram.updatedAt)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Renderizado del diagrama */}
        <Card>
          <CardHeader>
            <CardTitle>Diagrama de Secuencia</CardTitle>
          </CardHeader>
          <CardContent>
            <MermaidRenderer
              code={diagram.mermaidCode}
              onExport={(format) => {
                console.log(`Diagram exported as ${format}`);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicSequenceDiagram;
