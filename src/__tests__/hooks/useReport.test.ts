import { renderHook, act } from '@testing-library/react';
import { useReport } from '../../hooks/useReport';
import { ChartType, Field } from '../../types';

describe('useReport', () => {
  it('should initialize with empty report', () => {
    const { result } = renderHook(() => useReport());
    
    expect(result.current.report).toBeNull();
  });

  it('should create a new report', () => {
    const { result } = renderHook(() => useReport());
    
    act(() => {
      result.current.createReport('Test Report');
    });
    
    expect(result.current.report).not.toBeNull();
    expect(result.current.report?.name).toBe('Test Report');
    expect(result.current.report?.datasets).toEqual([]);
    expect(result.current.report?.charts).toEqual([]);
  });

  it('should add a dataset to report', () => {
    const { result } = renderHook(() => useReport());
    
    act(() => {
      result.current.createReport('Test Report');
    });
    
    const dataset = {
      id: 'test-dataset',
      name: 'Test Dataset',
      fields: [
        { id: 'category', name: 'Category', dataType: 'string' },
        { id: 'value', name: 'Value', dataType: 'number' }
      ],
      data: [
        { category: 'A', value: 10 },
        { category: 'B', value: 20 }
      ]
    };
    
    act(() => {
      result.current.addDataset(dataset);
    });
    
    expect(result.current.report?.datasets).toHaveLength(1);
    expect(result.current.report?.datasets[0].id).toBe('test-dataset');
    expect(result.current.report?.datasets[0].data).toHaveLength(2);
  });

  it('should add a chart to report', () => {
    const { result } = renderHook(() => useReport());
    
    act(() => {
      result.current.createReport('Test Report');
    });
    
    act(() => {
      result.current.addChart('line', 'Test Chart', 'test-dataset');
    });
    
    expect(result.current.report?.charts).toHaveLength(1);
    expect(result.current.report?.charts[0].type).toBe('line');
    expect(result.current.report?.charts[0].name).toBe('Test Chart');
    expect(result.current.report?.charts[0].datasetId).toBe('test-dataset');
  });

  it('should remove a chart from report', () => {
    const { result } = renderHook(() => useReport());
    
    act(() => {
      result.current.createReport('Test Report');
    });
    
    let chartId: string;
    
    act(() => {
      const chart = result.current.addChart('line', 'Test Chart', 'test-dataset');
      chartId = chart.id;
    });
    
    expect(result.current.report?.charts).toHaveLength(1);
    
    act(() => {
      result.current.removeChart(chartId);
    });
    
    expect(result.current.report?.charts).toHaveLength(0);
  });

  it('should update a chart in report', () => {
    const { result } = renderHook(() => useReport());
    
    act(() => {
      result.current.createReport('Test Report');
    });
    
    let chart: any;
    
    act(() => {
      chart = result.current.addChart('line', 'Test Chart', 'test-dataset');
    });
    
    const updatedChart = {
      ...chart,
      name: 'Updated Chart Title'
    };

    act(() => {
      result.current.updateChart(updatedChart);
    });

    expect(result.current.report?.charts[0].name).toBe('Updated Chart Title');
  });

  it('should add dimension to chart', () => {
    const { result } = renderHook(() => useReport());
    
    act(() => {
      result.current.createReport('Test Report');
    });
    
    let chart: any;
    
    act(() => {
      chart = result.current.addChart('line', 'Test Chart', 'test-dataset');
    });
    
    const field: Field = { id: 'category', name: 'Category', dataType: 'string' };
    
    act(() => {
      result.current.addDimension(chart.id, field);
    });
    
    expect(result.current.report?.charts[0].dimensions).toHaveLength(1);
    expect(result.current.report?.charts[0].dimensions[0].id).toBe('category');
  });

  it('should add measure to chart', () => {
    const { result } = renderHook(() => useReport());
    
    act(() => {
      result.current.createReport('Test Report');
    });
    
    let chart: any;
    
    act(() => {
      chart = result.current.addChart('line', 'Test Chart', 'test-dataset');
    });
    
    const field: Field = { id: 'value', name: 'Value', dataType: 'number' };
    
    act(() => {
      result.current.addMeasure(chart.id, field, 'sum');
    });
    
    expect(result.current.report?.charts[0].measures).toHaveLength(1);
    expect(result.current.report?.charts[0].measures[0].id).toBe('value');
    expect(result.current.report?.charts[0].measures[0].calculation).toBe('sum');
  });

  it('should update chart position', () => {
    const { result } = renderHook(() => useReport());
    
    act(() => {
      result.current.createReport('Test Report');
    });
    
    let chart: any;
    
    act(() => {
      chart = result.current.addChart('line', 'Test Chart', 'test-dataset');
    });
    
    const newPosition = { x: 2, y: 3, width: 5, height: 4 };
    
    act(() => {
      result.current.updateChartPosition(chart.id, newPosition);
    });
    
    expect(result.current.report?.charts[0].position).toEqual(newPosition);
  });

  it('should set report', () => {
    const { result } = renderHook(() => useReport());
    
    const newReport = {
      id: 'imported-report',
      name: 'Imported Report',
      datasets: [],
      charts: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    act(() => {
      result.current.setReport(newReport);
    });
    
    expect(result.current.report).toEqual(newReport);
  });
});