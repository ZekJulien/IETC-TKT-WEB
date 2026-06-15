export interface DatatableColumn {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  align?: 'start' | 'center' | 'end';
  flex?: boolean;
}
