export interface Field {
  name: string;
  type: 'string' | 'number' | 'boolean';
}

export interface Model {
  id: number;
  name: string;
  fields: Field[];
}

export interface Endpoint {
  id: number;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
}
