import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChartEditor from '../../components/ChartEditor/ChartEditor';
import { ChartConfig, Dataset, Field } from '../../types';

describe('ChartEditor Component', () => {
  // Mock dataset cho test
  const mockDataset: Dataset = {
    id: 'test-dataset',
    name: 'Test Dataset',
    fields: [
      { id: 'category', name: 'Category', dataType: 'string' },
      { id: 'subcategory', name: 'Subcategory', dataType: 'string' },
      { id: 'value', name: 'Value', dataType: 'number' },
      { id: 'count', name: 'Count', dataType: 'number' }
    ],
    data: [
      { category: 'A', subcategory: 'A1', value: 10, count: 5 },
      { category: 'B', subcategory: 'B1', value: 20, count: 8 },
      { category: 'C', subcategory: 'C1', value: 30, count: 12 }
    ]
  };

  // Mock chart config cho test
  const mockChart: ChartConfig = {
    id: 'test-chart',
    type: 'line',
    name: 'Test Line Chart',
    datasetId: 'test-dataset',
    dimensions: [
      { id: 'category', name: 'Category', dataType: 'string' }
    ],
    measures: [
      { id: 'value', name: 'Value', dataType: 'number', calculation: 'sum' }
    ],
    position: { x: 0, y: 0, width: 4, height: 3 }
  };

  // Mock handlers
  const mockOnUpdateChart = jest.fn();
  const mockOnAddDimension = jest.fn();
  const mockOnRemoveDimension = jest.fn();
  const mockOnAddMeasure = jest.fn();
  const mockOnRemoveMeasure = jest.fn();
  const mockOnUpdateMeasure = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render chart editor with chart details', () => {
    render(
      <ChartEditor
        config={mockChart}
        dataset={mockDataset}
        onUpdateChart={mockOnUpdateChart}
        onAddDimension={mockOnAddDimension}
        onRemoveDimension={mockOnRemoveDimension}
        onAddMeasure={mockOnAddMeasure}
        onRemoveMeasure={mockOnRemoveMeasure}
        onUpdateMeasure={mockOnUpdateMeasure}
      />
    );
    
    // Kiểm tra tiêu đề
    expect(screen.getByText('Edit Chart')).toBeInTheDocument();
    
    // Kiểm tra thông tin chart
    expect(screen.getByDisplayValue('Test Line Chart')).toBeInTheDocument();
    
    // Kiểm tra dimensions section
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    
    // Kiểm tra measures section
    expect(screen.getByText('Measures')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('sum')).toBeInTheDocument();
  });

  it('should update chart title when input changes', () => {
    render(
      <ChartEditor
        config={mockChart}
        dataset={mockDataset}
        onUpdateChart={mockOnUpdateChart}
        onAddDimension={mockOnAddDimension}
        onRemoveDimension={mockOnRemoveDimension}
        onAddMeasure={mockOnAddMeasure}
        onRemoveMeasure={mockOnRemoveMeasure}
        onUpdateMeasure={mockOnUpdateMeasure}
      />
    );
    
    // Tìm input title
    const titleInput = screen.getByDisplayValue('Test Line Chart');
    
    // Thay đổi giá trị
    fireEvent.change(titleInput, { target: { value: 'Updated Chart Title' } });
    
    // Kiểm tra hàm onUpdateChart được gọi với title mới
    expect(mockOnUpdateChart).toHaveBeenCalledWith({
      ...mockChart,
      name: 'Updated Chart Title'
    });
  });

  it('should show available fields for dimensions', () => {
    render(
      <ChartEditor
        config={mockChart}
        dataset={mockDataset}
        onUpdateChart={mockOnUpdateChart}
        onAddDimension={mockOnAddDimension}
        onRemoveDimension={mockOnRemoveDimension}
        onAddMeasure={mockOnAddMeasure}
        onRemoveMeasure={mockOnRemoveMeasure}
        onUpdateMeasure={mockOnUpdateMeasure}
      />
    );
    
    // Mở dropdown để thêm dimension
    const addDimensionButton = screen.getByTestId('add-dimension-button');
    fireEvent.click(addDimensionButton);
    
    // Kiểm tra các field có sẵn
    expect(screen.getByText('Subcategory')).toBeInTheDocument(); // Category đã được thêm
  });

  it('should add dimension when field is selected', () => {
    render(
      <ChartEditor
        config={mockChart}
        dataset={mockDataset}
        onUpdateChart={mockOnUpdateChart}
        onAddDimension={mockOnAddDimension}
        onRemoveDimension={mockOnRemoveDimension}
        onAddMeasure={mockOnAddMeasure}
        onRemoveMeasure={mockOnRemoveMeasure}
        onUpdateMeasure={mockOnUpdateMeasure}
      />
    );
    
    // Mở dropdown để thêm dimension
    const addDimensionButton = screen.getByTestId('add-dimension-button');
    fireEvent.click(addDimensionButton);
    
    // Chọn field Subcategory
    const subcategoryOption = screen.getByText('Subcategory');
    fireEvent.click(subcategoryOption);
    
    // Kiểm tra hàm onAddDimension được gọi
    const subcategoryField: Field = { id: 'subcategory', name: 'Subcategory', dataType: 'string' };
    expect(mockOnAddDimension).toHaveBeenCalledWith(mockChart.id, subcategoryField);
  });

  it('should remove dimension when remove button is clicked', () => {
    render(
      <ChartEditor
        config={mockChart}
        dataset={mockDataset}
        onUpdateChart={mockOnUpdateChart}
        onAddDimension={mockOnAddDimension}
        onRemoveDimension={mockOnRemoveDimension}
        onAddMeasure={mockOnAddMeasure}
        onRemoveMeasure={mockOnRemoveMeasure}
        onUpdateMeasure={mockOnUpdateMeasure}
      />
    );
    
    // Click vào nút remove dimension
    const removeDimensionButton = screen.getByTestId('remove-dimension-button-category');
    fireEvent.click(removeDimensionButton);
    
    // Kiểm tra hàm onRemoveDimension được gọi
    expect(mockOnRemoveDimension).toHaveBeenCalledWith(mockChart.id, 'category');
  });

  it('should add measure when field is selected', () => {
    render(
      <ChartEditor
        config={mockChart}
        dataset={mockDataset}
        onUpdateChart={mockOnUpdateChart}
        onAddDimension={mockOnAddDimension}
        onRemoveDimension={mockOnRemoveDimension}
        onAddMeasure={mockOnAddMeasure}
        onRemoveMeasure={mockOnRemoveMeasure}
        onUpdateMeasure={mockOnUpdateMeasure}
      />
    );
    
    // Mở dropdown để thêm measure
    const addMeasureButton = screen.getByTestId('add-measure-button');
    fireEvent.click(addMeasureButton);
    
    // Chọn field Count
    const countOption = screen.getByText('Count');
    fireEvent.click(countOption);
    
    // Kiểm tra hàm onAddMeasure được gọi
    const countField: Field = { id: 'count', name: 'Count', dataType: 'number' };
    expect(mockOnAddMeasure).toHaveBeenCalledWith(mockChart.id, countField, 'sum');
  });

  it('should remove measure when remove button is clicked', () => {
    render(
      <ChartEditor
        config={mockChart}
        dataset={mockDataset}
        onUpdateChart={mockOnUpdateChart}
        onAddDimension={mockOnAddDimension}
        onRemoveDimension={mockOnRemoveDimension}
        onAddMeasure={mockOnAddMeasure}
        onRemoveMeasure={mockOnRemoveMeasure}
        onUpdateMeasure={mockOnUpdateMeasure}
      />
    );
    
    // Click vào nút remove measure
    const removeMeasureButton = screen.getByTestId('remove-measure-button-value');
    fireEvent.click(removeMeasureButton);
    
    // Kiểm tra hàm onRemoveMeasure được gọi
    expect(mockOnRemoveMeasure).toHaveBeenCalledWith(mockChart.id, 'value');
  });

  it('should update measure calculation when changed', () => {
    render(
      <ChartEditor
        config={mockChart}
        dataset={mockDataset}
        onUpdateChart={mockOnUpdateChart}
        onAddDimension={mockOnAddDimension}
        onRemoveDimension={mockOnRemoveDimension}
        onAddMeasure={mockOnAddMeasure}
        onRemoveMeasure={mockOnRemoveMeasure}
        onUpdateMeasure={mockOnUpdateMeasure}
      />
    );
    
    // Thay đổi calculation trực tiếp
    const calculationSelect = screen.getByTestId('calculation-select-value');
    fireEvent.change(calculationSelect, { target: { value: 'max' } });
    
    // Kiểm tra hàm onUpdateMeasure được gọi
    expect(mockOnUpdateMeasure).toHaveBeenCalledWith(mockChart.id, 'value', 'max');
  });
});