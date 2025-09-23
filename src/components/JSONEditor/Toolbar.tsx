import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Code2,
  Minimize2,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onCopy: () => void;
  onClear: () => void;
  isValid: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onFormat,
  onMinify,
  onCopy,
  onClear,
  isValid,
}) => {
  return (
    <div className="border-b border-border bg-card/50 px-4 py-2 flex items-center gap-2">
      {/* Validation Status */}
      <div className="flex items-center gap-2 mr-4">
        {isValid ? (
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Valid JSON</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Invalid JSON</span>
          </div>
        )}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Formatting Actions */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onFormat}
        className="h-8 px-3"
      >
        <Code2 className="w-4 h-4 mr-2" />
        Format
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onMinify}
        className="h-8 px-3"
      >
        <Minimize2 className="w-4 h-4 mr-2" />
        Minify
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Utility Actions */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onCopy}
        className="h-8 px-3"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="h-8 px-3 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </div>
  );
};