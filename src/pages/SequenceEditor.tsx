import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, Code, FileText, HelpCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  useSequenceDiagram,
  useSequenceDiagrams,
} from "@/hooks/useSequenceDiagrams";
import MermaidRenderer from "@/components/sequence/MermaidRenderer";

const SequenceEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { diagram, isLoading: isLoadingDiagram } = useSequenceDiagram(id || "");
  const { createSequenceDiagram, updateSequenceDiagram } =
    useSequenceDiagrams();

  const [name, setName] = useState("Nuevo Diagrama de Secuencia");
  const [description, setDescription] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");

  const defaultMermaidCode = `sequenceDiagram
    participant A as Cliente
    participant B as Servidor
    participant C as Base de Datos
    
    A->>B: Solicitud
    B->>C: Consulta
    C-->>B: Respuesta
    B-->>A: Resultado`;

  useEffect(() => {
    if (diagram) {
      setName(diagram.name);
      setDescription(diagram.description || "");
      setMermaidCode(diagram.mermaidCode);
    } else if (!id) {
      setMermaidCode(defaultMermaidCode);
    }
  }, [diagram, id]);

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del diagrama es requerido",
        variant: "destructive",
      });
      return;
    }

    if (!mermaidCode.trim()) {
      toast({
        title: "Error",
        description: "El código del diagrama es requerido",
        variant: "destructive",
      });
      return;
    }

    const diagramData = {
      name,
      description,
      mermaidCode,
      isPublic: false,
      createdBy: "admin",
    };

    if (id && diagram) {
      updateSequenceDiagram({
        id,
        updates: diagramData,
      });
      toast({
        title: "Diagrama actualizado",
        description: `El diagrama "${name}" se actualizó correctamente.`,
      });
    } else {
      createSequenceDiagram(diagramData);
      toast({
        title: "Diagrama guardado",
        description: `El diagrama "${name}" se guardó correctamente.`,
      });
      setTimeout(() => {
        navigate("/sequence-diagrams");
      }, 1500);
    }
  };

  const exampleCode = `sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API
    participant D as Database
    
    U->>F: Hacer login
    F->>A: POST /auth/login
    A->>D: Validar credenciales
    D-->>A: Usuario válido
    A-->>F: Token JWT
    F-->>U: Redirigir al dashboard
    
    Note over U,D: Proceso de autenticación completo`;

  if (id && isLoadingDiagram) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Editor de Diagramas de Secuencia
          </h1>
          <p className="text-muted-foreground">Cargando diagrama...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (id && !diagram && !isLoadingDiagram) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Editor de Diagramas de Secuencia
          </h1>
          <p className="text-muted-foreground">Diagrama no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Editor de Diagramas de Secuencia
          </h1>
          <p className="text-muted-foreground">
            {id
              ? "Edita tu diagrama de secuencia"
              : "Crea diagramas de secuencia con sintaxis Mermaid"}
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Guardar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panel de configuración */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <FileText className="w-5 h-5 mr-2" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del diagrama"
                  className="h-8"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción del diagrama"
                  rows={2}
                  className="text-sm"
                />
              </div>

              <div className="pt-3 border-t">
                <h4 className="font-medium mb-2 flex items-center text-sm">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Ejemplo
                </h4>
                <div className="text-xs bg-muted p-2 rounded font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {exampleCode.split("\n").slice(0, 8).join("\n")}...
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 h-7 text-xs"
                  onClick={() => setMermaidCode(exampleCode)}
                >
                  Usar ejemplo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor y vista previa */}
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Editor */}
          <div className="lg:col-span-1 grid grid-cols-1 lg:grid-cols-1 gap-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Code className="w-4 h-4 mr-2" />
                  Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={mermaidCode}
                  onChange={(e) => setMermaidCode(e.target.value)}
                  placeholder="Escribe tu código Mermaid aquí..."
                  className="font-mono text-sm min-h-[500px] resize-none"
                />
              </CardContent>
            </Card>
          </div>
          {/* Vista previa */}
          <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-1 gap-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-base">
                  <Eye className="w-4 h-4 mr-2" />
                  Vista Previa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MermaidRenderer
                  code={mermaidCode}
                  onExport={(format) => {
                    toast({
                      title: "Diagrama exportado",
                      description: `El diagrama se exportó como ${format.toUpperCase()}`,
                    });
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceEditor;
