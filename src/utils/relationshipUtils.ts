
export const getRelationshipColor = (type: string): string => {
  switch (type) {
    case 'api_call': return '#3b82f6';
    case 'data_flow': return '#10b981';
    case 'dependency': return '#f59e0b';
    case 'event': return '#8b5cf6';
    case 'authentication': return '#ef4444';
    default: return '#6b7280';
  }
};

export const relationshipTypeLabels = {
  'api_call': 'Llamada API',
  'data_flow': 'Flujo de Datos',
  'dependency': 'Dependencia',
  'event': 'Evento',
  'authentication': 'Autenticación'
} as const;

export const parseSize = (size: string | number | undefined, defaultValue: number): number => {
  if (typeof size === 'number') return size;
  if (typeof size === 'string') {
    const parsed = parseInt(size, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
};
