// Định nghĩa các kiểu dữ liệu cho ứng dụng

// Kiểu dữ liệu cho chart
export type ChartType = 'line' | 'column' | 'bar' | 'donut' | 'table' | 'matrix-table' | 'card' | 'kpi-card';

// Kiểu dữ liệu cho phép tính toán
export type CalculationType = 'sum' | 'max' | 'min' | 'count' | 'count-distinct' | 'average';

// Kiểu dữ liệu cho field
export interface Field {
  id: string;
  name: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  displayName?: string;
}

// Kiểu dữ liệu cho measure (field có phép tính)
export interface Measure extends Field {
  calculation: CalculationType;
  format?: string;
}

// Kiểu dữ liệu cho dimension (field phân loại)
export interface Dimension extends Field {
  hierarchyLevel?: number;
}

// Kiểu dữ liệu cho dataset
export interface Dataset {
  id: string;
  name: string;
  fields: Field[];
  data: Record<string, any>[];
}

// Kiểu dữ liệu cho chart config
export interface ChartConfig {
  id: string;
  type: ChartType;
  name: string;
  datasetId: string;
  dimensions: Dimension[];
  measures: Measure[];
  options?: Record<string, any>;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Kiểu dữ liệu cho report
export interface Report {
  id: string;
  name: string;
  description?: string;
  charts: ChartConfig[];
  datasets: Dataset[];
  layout?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Kiểu dữ liệu cho HTML import
export interface HtmlImport {
  content: string;
  extractedCharts: ChartConfig[];
  extractedDatasets: Dataset[];
}