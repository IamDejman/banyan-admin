export type Metric = {
  id: string;
  name: string;
  description: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  unit: string;
  category: string;
  timestamp: string;
};

export type Benchmark = {
  id: string;
  name: string;
  description: string;
  value: number;
  target: number;
  actual: number;
  variance: number;
  status: 'above' | 'below' | 'meeting';
  category: string;
  timestamp: string;
};

export type Prediction = {
  id: string;
  metric: string;
  value: number;
  confidence: number;
  lowerBound: number;
  upperBound: number;
  timestamp: string;
  horizon: 'short' | 'medium' | 'long';
};

export type Report = {
  id: string;
  name: string;
  description: string;
  type: 'custom' | 'standard';
  metrics: string[];
  filters: ReportFilter[];
  layout: ReportLayout;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type ReportFilter = {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
};

export type ReportLayout = {
  id: string;
  type: 'grid' | 'list' | 'chart';
  columns: number;
  widgets: ReportWidget[];
};

export type ReportWidget = {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'text';
  title: string;
  data: any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type TrendData = {
  id: string;
  metric: string;
  values: {
    timestamp: string;
    value: number;
  }[];
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}; 