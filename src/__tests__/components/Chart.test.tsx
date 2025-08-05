import React from 'react';
import { render, screen } from '@testing-library/react';
import Chart from '../../components/Chart/Chart';
import { ChartConfig, Dataset, ChartType } from '../../types';

// Mock các thư viện chart
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
  Doughnut: () => <div data-testid="donut-chart">Donut Chart</div>
}));

// Mock các component chart
jest.mock('../../components/Chart/DonutChart', () => {
  return {
    __esModule: true,
    default: ({ data, config }: { data: any; config: any }) => (
      <div data-testid="donut-chart">Donut Chart Mock</div>
    )
  };
});

describe('Chart Component', () => {
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
      { category: 'C', value: 30 }
    ]
  };

  // Tạo mock chart config
  const createMockChartConfig = (type: ChartType): ChartConfig => ({
    id: 'test-chart',
    type,
    name: `Test ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
    datasetId: 'test-dataset',
    dimensions: [
      { id: 'category', name: 'Category', dataType: 'string' }
    ],
    measures: [
      { id: 'value', name: 'Value', dataType: 'number', calculation: 'sum' }
    ],
    position: { x: 0, y: 0, width: 4, height: 3 }
  });

  it('should render line chart correctly', () => {
    const chartConfig = createMockChartConfig('line');
    
    render(
      <Chart 
        config={chartConfig} 
        dataset={mockDataset}
        isSelected={false}
        onSelect={() => {}}
        onRemove={() => {}}
      />
    );
    
    expect(screen.getByText('Test Line Chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should render bar chart correctly', () => {
    const chartConfig = createMockChartConfig('bar');
    
    render(
      <Chart 
        config={chartConfig} 
        dataset={mockDataset}
        isSelected={false}
        onSelect={() => {}}
        onRemove={() => {}}
      />
    );
    
    expect(screen.getByText('Test Bar Chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should render column chart correctly', () => {
    const chartConfig = createMockChartConfig('column');
    
    render(
      <Chart 
        config={chartConfig} 
        dataset={mockDataset}
        isSelected={false}
        onSelect={() => {}}
        onRemove={() => {}}
      />
    );
    
    expect(screen.getByText('Test Column Chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument(); // Column uses Bar component
  });

  it('should render donut chart correctly', () => {
    const chartConfig = createMockChartConfig('donut');
    
    render(
      <Chart 
        config={chartConfig} 
        dataset={mockDataset}
        isSelected={false}
        onSelect={() => {}}
        onRemove={() => {}}
      />
    );
    
    expect(screen.getByText('Test Donut Chart')).toBeInTheDocument();
    expect(screen.getByTestId('donut-chart')).toBeInTheDocument();
  });

  it('should render table chart correctly', () => {
    const chartConfig = createMockChartConfig('table');
    
    render(
      <Chart 
        config={chartConfig} 
        dataset={mockDataset}
        isSelected={false}
        onSelect={() => {}}
        onRemove={() => {}}
      />
    );
    
    expect(screen.getByText('Test Table Chart')).toBeInTheDocument();
    // Kiểm tra bảng được render
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render card chart correctly', () => {
    const chartConfig = createMockChartConfig('card');
    
    render(
      <Chart 
        config={chartConfig} 
        dataset={mockDataset}
        isSelected={false}
        onSelect={() => {}}
        onRemove={() => {}}
      />
    );
    
    expect(screen.getByText('Test Card Chart')).toBeInTheDocument();
    // Kiểm tra card được render
    expect(screen.getByTestId('card-chart')).toBeInTheDocument();
  });

  it('should apply selected style when isSelected is true', () => {
    const chartConfig = createMockChartConfig('line');
    
    render(
      <Chart 
        config={chartConfig} 
        dataset={mockDataset}
        isSelected={true}
        onSelect={() => {}}
        onRemove={() => {}}
      />
    );
    
    // Kiểm tra class selected được áp dụng
    const chartContainer = screen.getByTestId('chart-container');
    expect(chartContainer).toHaveClass('selected');
  });

  it('should call onSelect when chart is clicked', () => {
    const chartConfig = createMockChartConfig('line');
    const handleSelect = jest.fn();
    
    render(
      <Chart 
        config={chartConfig} 
        dataset={mockDataset}
        isSelected={false}
        onSelect={handleSelect}
        onRemove={() => {}}
      />
    );
    
    // Click vào chart
    const chartContainer = screen.getByTestId('chart-container');
    chartContainer.click();
    
    expect(handleSelect).toHaveBeenCalledWith(chartConfig.id);
  });

  it('should call onRemove when remove button is clicked', () => {
    const chartConfig = createMockChartConfig('line');
    const handleRemove = jest.fn();
    
    render(
      <Chart 
        config={chartConfig} 
        dataset={mockDataset}
        isSelected={false}
        onSelect={() => {}}
        onRemove={handleRemove}
      />
    );
    
    // Click vào nút remove
    const removeButton = screen.getByTestId('remove-chart-button');
    removeButton.click();
    
    expect(handleRemove).toHaveBeenCalledWith(chartConfig.id);
  });
});