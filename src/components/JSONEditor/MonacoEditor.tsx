import { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  isValid,
}) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure JSON language settings
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [],
      enableSchemaRequest: false,
    });

    // Custom theme for JSON editor
    monaco.editor.defineTheme("json-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "string.key.json", foreground: "5DADE2" },
        { token: "string.value.json", foreground: "A8E6CF" },
        { token: "number.json", foreground: "F7DC6F" },
        { token: "keyword.json", foreground: "BB8FCE" },
        { token: "delimiter.bracket.json", foreground: "FFFFFF" },
        { token: "delimiter.array.json", foreground: "FFFFFF" },
        { token: "delimiter.colon.json", foreground: "FFFFFF" },
        { token: "delimiter.comma.json", foreground: "FFFFFF" },
      ],
      colors: {
        "editor.background": "#0A0E1A",
        "editor.foreground": "#FAFAFA",
        "editorLineNumber.foreground": "#6B7280",
        "editor.selectionBackground": "#3B82F625",
        "editor.lineHighlightBackground": "#1F293740",
        "editorCursor.foreground": "#3B82F6",
        "editor.findMatchBackground": "#3B82F650",
        "editor.findMatchHighlightBackground": "#3B82F625",
        "scrollbarSlider.background": "#4B5563",
        "scrollbarSlider.hoverBackground": "#6B7280",
      },
    });

    // Apply the custom theme
    monaco.editor.setTheme("json-dark");
  };

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || "");
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="json"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: "on",
          formatOnPaste: true,
          formatOnType: true,
          folding: true,
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          suggest: {
            showKeywords: false,
          },
          quickSuggestions: false,
          parameterHints: {
            enabled: false,
          },
          hover: {
            enabled: true,
          },
          contextmenu: true,
          selectOnLineNumbers: true,
          glyphMargin: false,
          foldingStrategy: "indentation",
          showFoldingControls: "always",
          unfoldOnClickAfterEndOfLine: false,
          renderLineHighlight: "all",
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          cursorBlinking: "smooth",
        }}
      />
    </div>
  );
};