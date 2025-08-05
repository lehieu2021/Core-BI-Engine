import { ChartService } from '../../services/chartService';
import { ChartConfig, Dataset, ChartType } from '../../types';

describe('ChartService', () => {
  // Mock dataset cho test
  const mockDataset: Dataset = {
    id: 'test-dataset',
    name: 'Test Dataset',
    fields: [
      { id: 'category', name: 'Category', dataType: 'string' },
      { id: 'value', name: 'Value', dataType: 'number' }
    ],
    data: [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'C', value: 30 },
      { category: 'A', value: 15 }
    ]
  };

  // Mock chart config cho test
  const createMockChartConfig = (type: ChartType): ChartConfig => ({
    id: 'test-chart',
    type,
    name: 'Test Chart',
    datasetId: 'test-dataset',
    dimensions: [
      { id: 'category', name: 'Category', dataType: 'string' }
    ],
    measures: [
      { id: 'value', name: 'Value', dataType: 'number', calculation: 'sum' }
    ],
    position: { x: 0, y: 0, width: 4, height: 3 }
  });

  describe('createChart', () => {
    it('should create a new chart with correct properties', () => {
      const chart = ChartService.createChart('line', 'New Chart', 'test-dataset');
      
      expect(chart).toHaveProperty('id');
      expect(chart.type).toBe('line');
      expect(chart.name).toBe('New Chart');
      expect(chart.datasetId).toBe('test-dataset');
      expect(chart.dimensions).toEqual([]);
      expect(chart.measures).toEqual([]);
      expect(chart).toHaveProperty('position');
    });
  });

  describe('addDimension', () => {
    it('should add a dimension to chart', () => {
      const chart = ChartService.createChart('line', 'New Chart', 'test-dataset');
      const field = { id: 'category', name: 'Category', dataType: 'string' };
      
      const updatedChart = ChartService.addDimension(chart, field);
      
      expect(updatedChart.dimensions).toHaveLength(1);
      expect(updatedChart.dimensions[0].id).toBe('category');
    });
  });

  describe('addMeasure', () => {
    it('should add a measure to chart', () => {
      const chart = ChartService.createChart('line', 'New Chart', 'test-dataset');
      const field = { id: 'value', name: 'Value', dataType: 'number' };
      
      const updatedChart = ChartService.addMeasure(chart, field, 'sum');
      
      expect(updatedChart.measures).toHaveLength(1);
      expect(updatedChart.measures[0].id).toBe('value');
      expect(updatedChart.measures[0].calculation).toBe('sum');
    });
  });

  describe('calculateChartData', () => {
    it('should calculate data for line chart correctly', () => {
      const chartConfig = createMockChartConfig('line');
      const chartData = ChartService.calculateChartData({ ...chartConfig, dataset: mockDataset });
      
      expect(chartData).toHaveProperty('labels');
      expect(chartData).toHaveProperty('datasets');
      expect(chartData.labels).toContain('A');
      expect(chartData.labels).toContain('B');
      expect(chartData.labels).toContain('C');
      
      // Kiểm tra giá trị tính toán
      // A có 2 giá trị: 10 và 15, tổng là 25
      // B có 1 giá trị: 20
      // C có 1 giá trị: 30
      const dataValues = chartData.datasets[0].data;
      expect(dataValues[chartData.labels.indexOf('A')]).toBe(25);
      expect(dataValues[chartData.labels.indexOf('B')]).toBe(20);
      expect(dataValues[chartData.labels.indexOf('C')]).toBe(30);
    });

    it('should calculate data for donut chart correctly', () => {
      const chartConfig = createMockChartConfig('donut');
      const chartData = ChartService.calculateChartData({ ...chartConfig, dataset: mockDataset });
      
      expect(chartData).toHaveProperty('labels');
      expect(chartData).toHaveProperty('datasets');
      expect(chartData.datasets[0]).toHaveProperty('data');
      expect(chartData.datasets[0]).toHaveProperty('backgroundColor');
      
      // Kiểm tra giá trị tính toán
      const dataValues = chartData.datasets[0].data;
      expect(dataValues[chartData.labels.indexOf('A')]).toBe(25);
      expect(dataValues[chartData.labels.indexOf('B')]).toBe(20);
      expect(dataValues[chartData.labels.indexOf('C')]).toBe(30);
    });

    it('should calculate data for table correctly', () => {
      const chartConfig = createMockChartConfig('table');
      const chartData = ChartService.calculateChartData({ ...chartConfig, dataset: mockDataset });
      
      expect(chartData).toHaveProperty('headers');
      expect(chartData).toHaveProperty('rows');
      expect(chartData.headers).toHaveLength(2); // dimension + measure
      expect(chartData.rows).toHaveLength(mockDataset.data.length);
    });

    it('should calculate data for card correctly', () => {
      const chartConfig = createMockChartConfig('card');
      const chartData = ChartService.calculateChartData({ ...chartConfig, dataset: mockDataset });
      
      expect(chartData).toHaveProperty('value');
      expect(chartData).toHaveProperty('label');
      
      // Tổng giá trị của tất cả các dòng dữ liệu
      const totalValue = mockDataset.data.reduce((sum, item) => sum + item.value, 0);
      expect(chartData.value).toBe(totalValue);
    });

    it('should return empty data for invalid input', () => {
      const chartConfig = createMockChartConfig('line');
      const emptyDataset = { ...mockDataset, data: [] };
      const chartData = ChartService.calculateChartData({ ...chartConfig, dataset: emptyDataset });
      
      expect(chartData.labels).toEqual([]);
      expect(chartData.datasets).toEqual([]);
    });
  });

  describe('calculateAggregateValue', () => {
    it('should calculate sum correctly', () => {
      const measure = { id: 'value', name: 'Value', dataType: 'number', calculation: 'sum' };
      const data = [{ value: 10 }, { value: 20 }, { value: 30 }];
      
      // Sử dụng phương thức private thông qua reflection
      const calculateAggregateValue = (ChartService as any)['calculateAggregateValue'];
      const result = calculateAggregateValue.call(ChartService, data, measure);
      
      expect(result).toBe(60);
    });

    it('should calculate max correctly', () => {
      const measure = { id: 'value', name: 'Value', dataType: 'number', calculation: 'max' };
      const data = [{ value: 10 }, { value: 20 }, { value: 30 }];
      
      const calculateAggregateValue = (ChartService as any)['calculateAggregateValue'];
      const result = calculateAggregateValue.call(ChartService, data, measure);
      
      expect(result).toBe(30);
    });

    it('should calculate min correctly', () => {
      const measure = { id: 'value', name: 'Value', dataType: 'number', calculation: 'min' };
      const data = [{ value: 10 }, { value: 20 }, { value: 30 }];
      
      const calculateAggregateValue = (ChartService as any)['calculateAggregateValue'];
      const result = calculateAggregateValue.call(ChartService, data, measure);
      
      expect(result).toBe(10);
    });

    it('should calculate count correctly', () => {
      const measure = { id: 'value', name: 'Value', dataType: 'number', calculation: 'count' };
      const data = [{ value: 10 }, { value: 20 }, { value: 30 }];
      
      const calculateAggregateValue = (ChartService as any)['calculateAggregateValue'];
      const result = calculateAggregateValue.call(ChartService, data, measure);
      
      expect(result).toBe(3);
    });

    it('should calculate count-distinct correctly', () => {
      const measure = { id: 'value', name: 'Value', dataType: 'number', calculation: 'count-distinct' };
      const data = [{ value: 10 }, { value: 10 }, { value: 20 }, { value: 30 }];
      
      const calculateAggregateValue = (ChartService as any)['calculateAggregateValue'];
      const result = calculateAggregateValue.call(ChartService, data, measure);
      
      expect(result).toBe(3);
    });
  });
});