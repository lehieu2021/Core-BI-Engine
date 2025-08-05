import { Dataset } from '../types';

export const createDemoDataset = (): Dataset => {
  return {
    id: 'demo-dataset-' + Date.now(),
    name: 'Sales Analytics Demo',
    fields: [
      // Dimensions (string/categorical data)
      { id: 'region', name: 'Region', dataType: 'string', displayName: 'Sales Region' },
      { id: 'product_category', name: 'Product Category', dataType: 'string', displayName: 'Product Category' },
      { id: 'sales_rep', name: 'Sales Rep', dataType: 'string', displayName: 'Sales Representative' },
      { id: 'customer_segment', name: 'Customer Segment', dataType: 'string', displayName: 'Customer Segment' },
      { id: 'quarter', name: 'Quarter', dataType: 'string', displayName: 'Quarter' },
      { id: 'month', name: 'Month', dataType: 'string', displayName: 'Month' },
      
      // Date dimensions
      { id: 'order_date', name: 'Order Date', dataType: 'date', displayName: 'Order Date' },
      { id: 'ship_date', name: 'Ship Date', dataType: 'date', displayName: 'Ship Date' },
      
      // Measures (numeric data)
      { id: 'sales_amount', name: 'Sales Amount', dataType: 'number', displayName: 'Sales Amount ($)' },
      { id: 'profit', name: 'Profit', dataType: 'number', displayName: 'Profit ($)' },
      { id: 'quantity', name: 'Quantity', dataType: 'number', displayName: 'Quantity Sold' },
      { id: 'discount_rate', name: 'Discount Rate', dataType: 'number', displayName: 'Discount Rate (%)' },
      { id: 'customer_satisfaction', name: 'Customer Satisfaction', dataType: 'number', displayName: 'Customer Satisfaction Score' },
      { id: 'order_count', name: 'Order Count', dataType: 'number', displayName: 'Number of Orders' },
      
      // Boolean data
      { id: 'is_premium', name: 'Is Premium', dataType: 'boolean', displayName: 'Premium Customer' },
      { id: 'is_returned', name: 'Is Returned', dataType: 'boolean', displayName: 'Order Returned' }
    ],
    data: [
      // Q1 Data
      { region: 'North', product_category: 'Electronics', sales_rep: 'John Smith', customer_segment: 'Corporate', quarter: 'Q1 2024', month: 'January', order_date: '2024-01-15', ship_date: '2024-01-18', sales_amount: 15000, profit: 3000, quantity: 50, discount_rate: 10, customer_satisfaction: 4.5, order_count: 5, is_premium: true, is_returned: false },
      { region: 'North', product_category: 'Office Supplies', sales_rep: 'John Smith', customer_segment: 'Small Business', quarter: 'Q1 2024', month: 'January', order_date: '2024-01-20', ship_date: '2024-01-22', sales_amount: 2500, profit: 500, quantity: 100, discount_rate: 5, customer_satisfaction: 4.2, order_count: 3, is_premium: false, is_returned: false },
      { region: 'South', product_category: 'Furniture', sales_rep: 'Sarah Johnson', customer_segment: 'Home Office', quarter: 'Q1 2024', month: 'January', order_date: '2024-01-25', ship_date: '2024-01-28', sales_amount: 8000, profit: 1600, quantity: 20, discount_rate: 15, customer_satisfaction: 4.8, order_count: 2, is_premium: true, is_returned: false },
      { region: 'East', product_category: 'Electronics', sales_rep: 'Mike Wilson', customer_segment: 'Corporate', quarter: 'Q1 2024', month: 'February', order_date: '2024-02-05', ship_date: '2024-02-08', sales_amount: 22000, profit: 4400, quantity: 75, discount_rate: 8, customer_satisfaction: 4.6, order_count: 8, is_premium: true, is_returned: false },
      { region: 'West', product_category: 'Office Supplies', sales_rep: 'Emily Davis', customer_segment: 'Small Business', quarter: 'Q1 2024', month: 'February', order_date: '2024-02-10', ship_date: '2024-02-12', sales_amount: 3200, profit: 640, quantity: 80, discount_rate: 12, customer_satisfaction: 4.0, order_count: 4, is_premium: false, is_returned: true },
      { region: 'North', product_category: 'Furniture', sales_rep: 'John Smith', customer_segment: 'Home Office', quarter: 'Q1 2024', month: 'March', order_date: '2024-03-15', ship_date: '2024-03-18', sales_amount: 12000, profit: 2400, quantity: 30, discount_rate: 20, customer_satisfaction: 4.4, order_count: 3, is_premium: true, is_returned: false },
      
      // Q2 Data
      { region: 'South', product_category: 'Electronics', sales_rep: 'Sarah Johnson', customer_segment: 'Corporate', quarter: 'Q2 2024', month: 'April', order_date: '2024-04-02', ship_date: '2024-04-05', sales_amount: 18000, profit: 3600, quantity: 60, discount_rate: 7, customer_satisfaction: 4.7, order_count: 6, is_premium: true, is_returned: false },
      { region: 'East', product_category: 'Office Supplies', sales_rep: 'Mike Wilson', customer_segment: 'Small Business', quarter: 'Q2 2024', month: 'April', order_date: '2024-04-10', ship_date: '2024-04-13', sales_amount: 2800, profit: 560, quantity: 90, discount_rate: 6, customer_satisfaction: 4.3, order_count: 4, is_premium: false, is_returned: false },
      { region: 'West', product_category: 'Furniture', sales_rep: 'Emily Davis', customer_segment: 'Home Office', quarter: 'Q2 2024', month: 'May', order_date: '2024-05-08', ship_date: '2024-05-11', sales_amount: 9500, profit: 1900, quantity: 25, discount_rate: 18, customer_satisfaction: 4.5, order_count: 2, is_premium: true, is_returned: false },
      { region: 'North', product_category: 'Electronics', sales_rep: 'John Smith', customer_segment: 'Corporate', quarter: 'Q2 2024', month: 'May', order_date: '2024-05-20', ship_date: '2024-05-23', sales_amount: 25000, profit: 5000, quantity: 85, discount_rate: 5, customer_satisfaction: 4.8, order_count: 10, is_premium: true, is_returned: false },
      { region: 'South', product_category: 'Office Supplies', sales_rep: 'Sarah Johnson', customer_segment: 'Small Business', quarter: 'Q2 2024', month: 'June', order_date: '2024-06-05', ship_date: '2024-06-08', sales_amount: 4200, profit: 840, quantity: 120, discount_rate: 10, customer_satisfaction: 4.1, order_count: 5, is_premium: false, is_returned: false },
      { region: 'East', product_category: 'Furniture', sales_rep: 'Mike Wilson', customer_segment: 'Home Office', quarter: 'Q2 2024', month: 'June', order_date: '2024-06-18', ship_date: '2024-06-21', sales_amount: 11000, profit: 2200, quantity: 35, discount_rate: 22, customer_satisfaction: 4.6, order_count: 3, is_premium: true, is_returned: true },
      
      // Q3 Data
      { region: 'West', product_category: 'Electronics', sales_rep: 'Emily Davis', customer_segment: 'Corporate', quarter: 'Q3 2024', month: 'July', order_date: '2024-07-10', ship_date: '2024-07-13', sales_amount: 20000, profit: 4000, quantity: 70, discount_rate: 9, customer_satisfaction: 4.4, order_count: 7, is_premium: true, is_returned: false },
      { region: 'North', product_category: 'Office Supplies', sales_rep: 'John Smith', customer_segment: 'Small Business', quarter: 'Q3 2024', month: 'August', order_date: '2024-08-15', ship_date: '2024-08-18', sales_amount: 3600, profit: 720, quantity: 110, discount_rate: 8, customer_satisfaction: 4.2, order_count: 6, is_premium: false, is_returned: false },
      { region: 'South', product_category: 'Furniture', sales_rep: 'Sarah Johnson', customer_segment: 'Home Office', quarter: 'Q3 2024', month: 'September', order_date: '2024-09-05', ship_date: '2024-09-08', sales_amount: 13500, profit: 2700, quantity: 40, discount_rate: 25, customer_satisfaction: 4.7, order_count: 4, is_premium: true, is_returned: false },
      
      // Q4 Data
      { region: 'East', product_category: 'Electronics', sales_rep: 'Mike Wilson', customer_segment: 'Corporate', quarter: 'Q4 2024', month: 'October', order_date: '2024-10-12', ship_date: '2024-10-15', sales_amount: 28000, profit: 5600, quantity: 95, discount_rate: 6, customer_satisfaction: 4.9, order_count: 12, is_premium: true, is_returned: false },
      { region: 'West', product_category: 'Office Supplies', sales_rep: 'Emily Davis', customer_segment: 'Small Business', quarter: 'Q4 2024', month: 'November', order_date: '2024-11-08', ship_date: '2024-11-11', sales_amount: 4800, profit: 960, quantity: 140, discount_rate: 11, customer_satisfaction: 4.3, order_count: 7, is_premium: false, is_returned: false },
      { region: 'North', product_category: 'Furniture', sales_rep: 'John Smith', customer_segment: 'Home Office', quarter: 'Q4 2024', month: 'December', order_date: '2024-12-03', ship_date: '2024-12-06', sales_amount: 16000, profit: 3200, quantity: 50, discount_rate: 30, customer_satisfaction: 4.8, order_count: 5, is_premium: true, is_returned: false }
    ]
  };
};

// Chart-specific configuration templates
export const chartConfigurations = {
  line: {
    defaultDimensions: ['month', 'quarter'],
    defaultMeasures: [
      { field: 'sales_amount', calculation: 'sum' as const },
      { field: 'profit', calculation: 'sum' as const }
    ],
    description: 'Perfect for showing trends over time'
  },
  column: {
    defaultDimensions: ['product_category', 'region'],
    defaultMeasures: [
      { field: 'sales_amount', calculation: 'sum' as const },
      { field: 'quantity', calculation: 'sum' as const }
    ],
    description: 'Great for comparing categories'
  },
  bar: {
    defaultDimensions: ['sales_rep', 'customer_segment'],
    defaultMeasures: [
      { field: 'profit', calculation: 'sum' as const },
      { field: 'order_count', calculation: 'sum' as const }
    ],
    description: 'Ideal for ranking and comparison'
  },
  donut: {
    defaultDimensions: ['product_category'],
    defaultMeasures: [
      { field: 'sales_amount', calculation: 'sum' as const }
    ],
    description: 'Shows parts of a whole'
  },
  table: {
    defaultDimensions: ['region', 'product_category', 'sales_rep'],
    defaultMeasures: [
      { field: 'sales_amount', calculation: 'sum' as const },
      { field: 'profit', calculation: 'sum' as const },
      { field: 'quantity', calculation: 'sum' as const },
      { field: 'customer_satisfaction', calculation: 'average' as const }
    ],
    description: 'Detailed data in rows and columns'
  },
  card: {
    defaultDimensions: [],
    defaultMeasures: [
      { field: 'sales_amount', calculation: 'sum' as const }
    ],
    description: 'Single key metric display'
  },
  'kpi-card': {
    defaultDimensions: [],
    defaultMeasures: [
      { field: 'sales_amount', calculation: 'sum' as const },
      { field: 'profit', calculation: 'sum' as const }
    ],
    description: 'Key performance indicators'
  },
  'matrix-table': {
    defaultDimensions: ['region', 'product_category'],
    defaultMeasures: [
      { field: 'sales_amount', calculation: 'sum' as const },
      { field: 'profit', calculation: 'sum' as const },
      { field: 'quantity', calculation: 'sum' as const }
    ],
    description: 'Matrix view of data with cross-tabulation'
  }
};

// Available calculation functions
export const calculationFunctions = [
  { value: 'sum', label: 'Sum', description: 'Add all values' },
  { value: 'max', label: 'Maximum', description: 'Highest value' },
  { value: 'min', label: 'Minimum', description: 'Lowest value' },
  { value: 'count', label: 'Count', description: 'Count of records' },
  { value: 'count-distinct', label: 'Count Distinct', description: 'Count unique values' },
  { value: 'average', label: 'Average', description: 'Average of values' }
];