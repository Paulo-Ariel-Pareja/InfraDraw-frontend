import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Button } from "@/components/ui/button";
import { Download, Image } from "lucide-react";
import html2canvas from "html2canvas";

interface MermaidRendererProps {
  code: string;
  onExport?: (format: "png" | "jpeg") => void;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({
  code,
  onExport,
}) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "Inter, system-ui, sans-serif",
    });
  }, []);

  useEffect(() => {
    if (code && mermaidRef.current) {
      renderDiagram();
    }
  }, [code]);

  const renderDiagram = async () => {
    if (!mermaidRef.current || !code.trim()) return;

    setIsRendering(true);
    setError(null);

    try {
      // Clear previous content
      mermaidRef.current.innerHTML = "";

      // Create a unique ID for this diagram
      const id = `mermaid-${Date.now()}`;

      // Validate and render the diagram
      const { svg } = await mermaid.render(id, code);
      mermaidRef.current.innerHTML = svg;
    } catch (err) {
      console.error("Mermaid rendering error:", err);
      setError(
        "Error al renderizar el diagrama. Verifica la sintaxis de Mermaid."
      );
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `
          <div class="flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
            <div class="text-center">
              <div class="text-red-600 font-medium">Error en el diagrama</div>
              <div class="text-red-500 text-sm mt-1">Verifica la sintaxis de Mermaid</div>
            </div>
          </div>
        `;
      }
    } finally {
      setIsRendering(false);
    }
  };

  const exportDiagram = async (format: "png" | "jpeg") => {
    if (!mermaidRef.current) return;

    try {
      const canvas = await html2canvas(mermaidRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `sequence-diagram.${format}`;
      link.href = canvas.toDataURL(`image/${format}`, 0.9);
      link.click();

      if (onExport) {
        onExport(format);
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportDiagram("png")}
          disabled={isRendering || !!error}
        >
          <Download className="w-4 h-4 mr-2" />
          PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportDiagram("jpeg")}
          disabled={isRendering || !!error}
        >
          <Image className="w-4 h-4 mr-2" />
          JPEG
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-white min-h-[450px] flex items-center justify-center relative">
        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">
                Renderizando diagrama...
              </span>
            </div>
          </div>
        )}

        {!code.trim() && !isRendering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-lg font-medium">
                Vista previa del diagrama
              </div>
              <div className="text-sm mt-1">
                Escribe código Mermaid para ver el diagrama
              </div>
            </div>
          </div>
        )}

        {/* Always render the mermaid container to prevent DOM sync issues */}
        <div
          ref={mermaidRef}
          className="w-full"
          style={{ display: !code.trim() || isRendering ? "none" : "block" }}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default MermaidRenderer;
