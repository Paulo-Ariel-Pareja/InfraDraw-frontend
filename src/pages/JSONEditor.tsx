import { useState, useCallback } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { MonacoEditor } from "../components/JSONEditor/MonacoEditor";
import { FlowJSONViewer } from "../components/JSONEditor/FlowJSONViewer";
import { JSONStats } from "../components/JSONEditor/JSONStats";
import { Toolbar } from "../components/JSONEditor/Toolbar";
import { toast } from "sonner";

export const JSONEditor = () => {
  const [jsonValue, setJsonValue] = useState(`{
  "name": "JSON Editor",
  "version": "1.0.0",
  "features": {
    "editor": {
      "syntax_highlighting": true,
      "validation": true,
      "auto_format": true
    },
    "viewer": {
      "tree_view": true,
      "navigation": true,
      "search": true
    }
  },
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@example.com",
        "active": true,
        "profile": {
          "age": 30,
          "city": "Madrid",
          "preferences": ["javascript", "react", "json"]
        }
      },
      {
        "id": 2,
        "name": "Ana García",
        "email": "ana@example.com", 
        "active": false,
        "profile": {
          "age": 25,
          "city": "Barcelona",
          "preferences": ["python", "data", "visualization"]
        }
      }
    ]
  }
}`);
  
  const [parsedJson, setParsedJson] = useState<any>(null);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string>("");

  const validateAndParseJSON = useCallback((value: string) => {
    try {
      if (value.trim() === "") {
        setParsedJson(null);
        setIsValid(true);
        setError("");
        return;
      }
      
      const parsed = JSON.parse(value);
      setParsedJson(parsed);
      setIsValid(true);
      setError("");
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setParsedJson(null);
    }
  }, []);

  const handleJSONChange = useCallback((value: string) => {
    setJsonValue(value);
    validateAndParseJSON(value);
  }, [validateAndParseJSON]);

  const handleFormat = useCallback(() => {
    try {
      if (jsonValue.trim() === "") {
        toast.error("No JSON to format");
        return;
      }
      
      const parsed = JSON.parse(jsonValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonValue(formatted);
      validateAndParseJSON(formatted);
      toast.success("JSON formatted successfully");
    } catch (err) {
      toast.error("Cannot format invalid JSON");
    }
  }, [jsonValue, validateAndParseJSON]);

  const handleMinify = useCallback(() => {
    try {
      if (jsonValue.trim() === "") {
        toast.error("No JSON to minify");
        return;
      }
      
      const parsed = JSON.parse(jsonValue);
      const minified = JSON.stringify(parsed);
      setJsonValue(minified);
      validateAndParseJSON(minified);
      toast.success("JSON minified successfully");
    } catch (err) {
      toast.error("Cannot minify invalid JSON");
    }
  }, [jsonValue, validateAndParseJSON]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonValue);
      toast.success("JSON copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy JSON");
    }
  }, [jsonValue]);

  const handleClear = useCallback(() => {
    setJsonValue("");
    setParsedJson(null);
    setIsValid(true);
    setError("");
    toast.success("Editor cleared");
  }, []);

  // Parse initial JSON on mount
  useState(() => {
    validateAndParseJSON(jsonValue);
  });

  return (
    <div className="absolute inset-x-0 bottom-0 top-16 bg-background flex flex-col">
      {/* Toolbar */}
      <div className="h-10 flex-none border-b border-border">
        <Toolbar
          onFormat={handleFormat}
          onMinify={handleMinify}
          onCopy={handleCopy}
          onClear={handleClear}
          isValid={isValid}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Editor Panel */}
          <Panel defaultSize={100} minSize={30}>
            <div className="h-full flex flex-col">
              <div className="h-11 flex-none bg-card border-r border-border p-3 border-b">
                <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  JSON Editor
                </h2>
                {!isValid && (
                  <p className="text-sm text-destructive mt-1">{error}</p>
                )}
              </div>
              <div className="flex-1">
                <MonacoEditor
                  value={jsonValue}
                  onChange={handleJSONChange}
                  isValid={isValid}
                />
              </div>
            </div>
          </Panel>

           <PanelResizeHandle className="w-2 bg-border hover:bg-accent transition-colors" /> 

          {/* Viewer Panel */}
           <Panel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col"> 
               <div className="bg-card border-b border-border p-3">
                <h2 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-syntax-key"></div>
                  JSON Flow Visualizer
                </h2>
              </div> 
              
               <div className="flex-1 overflow-hidden flex flex-col">
                {/* Stats */}
                 <JSONStats data={parsedJson} isValid={isValid} />
                
                {/* Flow Viewer */}
                 <div className="flex-1 overflow-auto">
                  <FlowJSONViewer data={parsedJson} isValid={isValid} />
                </div>
               </div>
             </div>
          </Panel> 
        </PanelGroup>
      </div>
    </div>
  );
};