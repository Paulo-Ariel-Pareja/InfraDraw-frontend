import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edge } from "@xyflow/react";
import { Component, Endpoint } from "@/types";

interface RelationshipConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (edgeData: any) => void;
  sourceComponent?: Component;
  targetComponent?: Component;
  existingEdge?: Edge;
}

const relationshipTypes = [
  { value: "api_call", label: "Llamada API" },
  { value: "data_flow", label: "Flujo de Datos" },
  { value: "dependency", label: "Dependencia" },
  { value: "event", label: "Evento" },
  { value: "authentication", label: "Autenticación" },
];

const RelationshipConfig: React.FC<RelationshipConfigProps> = ({
  isOpen,
  onClose,
  onSave,
  sourceComponent,
  targetComponent,
  existingEdge,
}) => {
  const [relationshipType, setRelationshipType] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [description, setDescription] = useState("");
  const [label, setLabel] = useState("");

  // Reset form when dialog opens or when components change
  useEffect(() => {
    if (isOpen) {
      if (existingEdge) {
        // Editing existing edge - load existing data
        setRelationshipType(
          (existingEdge.data?.relationshipType as string) || ""
        );
        setSelectedEndpoint((existingEdge.data?.endpointId as string) || "");
        setDescription((existingEdge.data?.description as string) || "");
        setLabel((existingEdge.data?.label as string) || "");
      } else {
        // Creating new edge - reset all fields
        setRelationshipType("");
        setSelectedEndpoint("");
        setDescription("");
        setLabel("");
      }
    }
  }, [isOpen, existingEdge]);

  const handleSave = () => {
    // Para relaciones existentes, preservar la información original de la conexión
    const edgeData = {
      relationshipType,
      endpointId: selectedEndpoint,
      description,
      label:
        label ||
        `${
          relationshipTypes.find((t) => t.value === relationshipType)?.label ||
          "Relación"
        }`,
      // Preservar los nombres de componentes originales si es una edición
      sourceComponent: existingEdge
        ? (existingEdge.data?.sourceComponent as string)
        : sourceComponent?.name,
      targetComponent: existingEdge
        ? (existingEdge.data?.targetComponent as string)
        : targetComponent?.name,
    };

    onSave(edgeData);
    onClose();
  };

  const handleClose = () => {

    // Reset form when closing
    setRelationshipType("");
    setSelectedEndpoint("");
    setDescription("");
    setLabel("");
    onClose();
  };

  // Para edición, usar el componente target de la relación existente, sino usar el de pendingConnection
  const currentTargetComponent = existingEdge
    ? // Si estamos editando, necesitamos encontrar el componente por su nombre
      sourceComponent?.name === (existingEdge.data?.targetComponent as string)
      ? sourceComponent
      : targetComponent
    : targetComponent;

  const availableEndpoints = currentTargetComponent?.endpoints || [];

  // Para mostrar los nombres correctos de los componentes - usar siempre la info original
  const displaySourceName = existingEdge
    ? (existingEdge.data?.sourceComponent as string)
    : sourceComponent?.name || "";
  const displayTargetName = existingEdge
    ? (existingEdge.data?.targetComponent as string)
    : targetComponent?.name || "";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Relación</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Desde: <span className="font-medium">{displaySourceName}</span>
            <br />
            Hacia: <span className="font-medium">{displayTargetName}</span>
          </div>

          <div>
            <Label htmlFor="relationshipType">Tipo de Relación</Label>
            <Select
              value={relationshipType}
              onValueChange={setRelationshipType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de relación" />
              </SelectTrigger>
              <SelectContent>
                {relationshipTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {relationshipType === "api_call" && availableEndpoints.length > 0 && (
            <div>
              <Label htmlFor="endpoint">Endpoint</Label>
              <Select
                value={selectedEndpoint}
                onValueChange={setSelectedEndpoint}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un endpoint" />
                </SelectTrigger>
                <SelectContent>
                  {availableEndpoints.map((endpoint) => (
                    <SelectItem key={endpoint.id} value={endpoint.id}>
                      <span className="font-mono text-sm">
                        <span className="font-semibold">{endpoint.method}</span>{" "}
                        {endpoint.url}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="label">Etiqueta (opcional)</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Etiqueta personalizada para la conexión"
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe esta relación..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!relationshipType}>
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RelationshipConfig;
