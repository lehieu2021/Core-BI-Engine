// Dữ liệu mẫu cho ứng dụng
import { Dataset, ChartConfig, ChartType } from '../types';

// Dữ liệu mẫu cho dataset bán hàng
export const salesDataset: Dataset = {
  id: 'sales-dataset',
  name: 'Dữ liệu bán hàng',
  fields: [
    { id: 'date', name: 'Ngày', dataType: 'date', displayName: 'Ngày bán' },
    { id: 'product', name: 'Sản phẩm', dataType: 'string', displayName: 'Tên sản phẩm' },
    { id: 'category', name: 'Danh mục', dataType: 'string', displayName: 'Danh mục' },
    { id: 'region', name: 'Khu vực', dataType: 'string', displayName: 'Khu vực' },
    { id: 'sales', name: 'Doanh số', dataType: 'number', displayName: 'Doanh số (VND)' },
    { id: 'quantity', name: 'Số lượng', dataType: 'number', displayName: 'Số lượng' },
    { id: 'profit', name: 'Lợi nhuận', dataType: 'number', displayName: 'Lợi nhuận (VND)' },
  ],
  data: [
    { date: '2023-01-01', product: 'Laptop', category: 'Điện tử', region: 'Miền Bắc', sales: 25000000, quantity: 5, profit: 5000000 },
    { date: '2023-01-01', product: 'Điện thoại', category: 'Điện tử', region: 'Miền Bắc', sales: 15000000, quantity: 3, profit: 3000000 },
    { date: '2023-01-02', product: 'Laptop', category: 'Điện tử', region: 'Miền Trung', sales: 20000000, quantity: 4, profit: 4000000 },
    { date: '2023-01-02', product: 'Tủ lạnh', category: 'Gia dụng', region: 'Miền Nam', sales: 18000000, quantity: 3, profit: 3600000 },
    { date: '2023-01-03', product: 'Điện thoại', category: 'Điện tử', region: 'Miền Nam', sales: 25000000, quantity: 5, profit: 5000000 },
    { date: '2023-01-03', product: 'Máy giặt', category: 'Gia dụng', region: 'Miền Bắc', sales: 12000000, quantity: 2, profit: 2400000 },
    { date: '2023-01-04', product: 'Laptop', category: 'Điện tử', region: 'Miền Nam', sales: 30000000, quantity: 6, profit: 6000000 },
    { date: '2023-01-04', product: 'Tivi', category: 'Điện tử', region: 'Miền Trung', sales: 22000000, quantity: 4, profit: 4400000 },
    { date: '2023-01-05', product: 'Điện thoại', category: 'Điện tử', region: 'Miền Bắc', sales: 20000000, quantity: 4, profit: 4000000 },
    { date: '2023-01-05', product: 'Máy lạnh', category: 'Gia dụng', region: 'Miền Nam', sales: 15000000, quantity: 3, profit: 3000000 },
  ],
};

// Dữ liệu mẫu cho dataset nhân sự
export const hrDataset: Dataset = {
  id: 'hr-dataset',
  name: 'Dữ liệu nhân sự',
  fields: [
    { id: 'department', name: 'Phòng ban', dataType: 'string', displayName: 'Phòng ban' },
    { id: 'position', name: 'Chức vụ', dataType: 'string', displayName: 'Chức vụ' },
    { id: 'gender', name: 'Giới tính', dataType: 'string', displayName: 'Giới tính' },
    { id: 'age', name: 'Tuổi', dataType: 'number', displayName: 'Tuổi' },
    { id: 'salary', name: 'Lương', dataType: 'number', displayName: 'Lương (VND)' },
    { id: 'experience', name: 'Kinh nghiệm', dataType: 'number', displayName: 'Năm kinh nghiệm' },
  ],
  data: [
    { department: 'IT', position: 'Developer', gender: 'Nam', age: 28, salary: 25000000, experience: 5 },
    { department: 'IT', position: 'Designer', gender: 'Nữ', age: 26, salary: 20000000, experience: 3 },
    { department: 'IT', position: 'Manager', gender: 'Nam', age: 35, salary: 40000000, experience: 10 },
    { department: 'Marketing', position: 'Specialist', gender: 'Nữ', age: 27, salary: 18000000, experience: 4 },
    { department: 'Marketing', position: 'Manager', gender: 'Nữ', age: 32, salary: 35000000, experience: 8 },
    { department: 'Sales', position: 'Executive', gender: 'Nam', age: 30, salary: 22000000, experience: 6 },
    { department: 'Sales', position: 'Manager', gender: 'Nam', age: 38, salary: 38000000, experience: 12 },
    { department: 'HR', position: 'Specialist', gender: 'Nữ', age: 29, salary: 19000000, experience: 5 },
    { department: 'Finance', position: 'Accountant', gender: 'Nữ', age: 31, salary: 23000000, experience: 7 },
    { department: 'Finance', position: 'Manager', gender: 'Nam', age: 40, salary: 45000000, experience: 15 },
  ],
};

// Mẫu các biểu đồ
export const sampleCharts: ChartConfig[] = [
  {
    id: 'chart-1',
    type: 'column',
    name: 'Doanh số theo danh mục sản phẩm',
    datasetId: 'sales-dataset',
    dimensions: [
      { id: 'category', name: 'Danh mục', dataType: 'string', displayName: 'Danh mục sản phẩm' },
    ],
    measures: [
      { id: 'sales', name: 'Doanh số', dataType: 'number', calculation: 'sum', displayName: 'Tổng doanh số', format: '#,##0 VND' },
    ],
    options: {
      showLegend: true,
      showDataLabels: true,
    },
  },
  {
    id: 'chart-2',
    type: 'line',
    name: 'Doanh số theo ngày',
    datasetId: 'sales-dataset',
    dimensions: [
      { id: 'date', name: 'Ngày', dataType: 'date', displayName: 'Ngày' },
    ],
    measures: [
      { id: 'sales', name: 'Doanh số', dataType: 'number', calculation: 'sum', displayName: 'Tổng doanh số', format: '#,##0 VND' },
    ],
    options: {
      showLegend: true,
      showDataLabels: false,
      lineStyle: 'smooth',
    },
  },
  {
    id: 'chart-3',
    type: 'donut',
    name: 'Doanh số theo khu vực',
    datasetId: 'sales-dataset',
    dimensions: [
      { id: 'region', name: 'Khu vực', dataType: 'string', displayName: 'Khu vực' },
    ],
    measures: [
      { id: 'sales', name: 'Doanh số', dataType: 'number', calculation: 'sum', displayName: 'Tổng doanh số', format: '#,##0 VND' },
    ],
    options: {
      showLegend: true,
      showDataLabels: true,
    },
  },
  {
    id: 'chart-4',
    type: 'bar',
    name: 'Lương trung bình theo phòng ban',
    datasetId: 'hr-dataset',
    dimensions: [
      { id: 'department', name: 'Phòng ban', dataType: 'string', displayName: 'Phòng ban' },
    ],
    measures: [
      { id: 'salary', name: 'Lương', dataType: 'number', calculation: 'sum', displayName: 'Tổng lương', format: '#,##0 VND' },
    ],
    options: {
      showLegend: true,
      showDataLabels: true,
    },
  },
  {
    id: 'chart-5',
    type: 'table',
    name: 'Chi tiết dữ liệu bán hàng',
    datasetId: 'sales-dataset',
    dimensions: [
      { id: 'date', name: 'Ngày', dataType: 'date', displayName: 'Ngày bán' },
      { id: 'product', name: 'Sản phẩm', dataType: 'string', displayName: 'Sản phẩm' },
      { id: 'region', name: 'Khu vực', dataType: 'string', displayName: 'Khu vực' },
    ],
    measures: [
      { id: 'sales', name: 'Doanh số', dataType: 'number', calculation: 'sum', displayName: 'Doanh số', format: '#,##0 VND' },
      { id: 'profit', name: 'Lợi nhuận', dataType: 'number', calculation: 'sum', displayName: 'Lợi nhuận', format: '#,##0 VND' },
    ],
    options: {
      pagination: true,
      pageSize: 5,
    },
  },
];

// Mẫu báo cáo hoàn chỉnh
export const sampleReport = {
  id: 'report-1',
  name: 'Báo cáo bán hàng và nhân sự',
  description: 'Báo cáo tổng hợp về tình hình bán hàng và nhân sự của công ty',
  charts: sampleCharts,
  datasets: [salesDataset, hrDataset],
  createdAt: new Date(),
  updatedAt: new Date(),
};