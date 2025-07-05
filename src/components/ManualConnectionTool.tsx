import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';

interface ManualConnectionToolProps {
  isActive: boolean;
  onToggle: () => void;
}

const ManualConnectionTool: React.FC<ManualConnectionToolProps> = ({
  isActive,
  onToggle
}) => {
  return (
    <Button
      onClick={onToggle}
      variant={isActive ? "default" : "outline"}
      className="w-full justify-start h-8 text-xs"
    >
      <Link className="w-3 h-3 mr-2" />
      Conectar Componentes
    </Button>
  );
};

export default ManualConnectionTool;