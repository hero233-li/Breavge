export type Environment = 'DEV' | 'TEST' | 'PROD';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  options?: { label: string; value: string | number }[]; // For select type
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
}

export interface PageConfig {
  title: string;
  description: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  fields: FormField[];
}

export interface ApiRecord {
  id: string;
  status: 'SUCCESS' | 'PENDING' | 'ERROR';
  timestamp: string;
  summary: string;
  requestPayload: any;
  responsePayload: any;
  environment: Environment;
  latencyMs: number;
}

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}
