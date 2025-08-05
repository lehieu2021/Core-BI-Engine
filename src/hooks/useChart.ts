import { useState, useCallback } from 'react';
import { ChartConfig, Dataset, Dimension, Measure, CalculationType } from '../types';
import { ChartService } from '../services/chartService';

/**
 * Hook quản lý chart
 */
export const useChart = (initialChart?: ChartConfig) => {
  const [chart, setChart] = useState<ChartConfig | null>(initialChart || null);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Tạo chart mới
   */
  const createChart = useCallback((type: ChartConfig['type'], name: string, datasetId: string) => {
    try {
      const newChart = ChartService.createChart(type, name, datasetId);
      setChart(newChart);
      setError(null);
      return newChart;
    } catch (err) {
      setError('Failed to create chart');
      return null;
    }
  }, []);
  
  /**
   * Thêm dimension vào chart
   */
  const addDimension = useCallback((field: any) => {
    if (!chart) return null;
    
    try {
      const updatedChart = ChartService.addDimension(chart, field);
      setChart(updatedChart);
      setError(null);
      return updatedChart;
    } catch (err) {
      setError('Failed to add dimension');
      return chart;
    }
  }, [chart]);
  
  /**
   * Thêm measure vào chart
   */
  const addMeasure = useCallback((field: any, calculation: CalculationType) => {
    if (!chart) return null;
    
    try {
      const updatedChart = ChartService.addMeasure(chart, field, calculation);
      setChart(updatedChart);
      setError(null);
      return updatedChart;
    } catch (err) {
      setError('Failed to add measure');
      return chart;
    }
  }, [chart]);
  
  /**
   * Xóa dimension khỏi chart
   */
  const removeDimension = useCallback((dimensionId: string) => {
    if (!chart) return null;
    
    try {
      const updatedChart = ChartService.removeDimension(chart, dimensionId);
      setChart(updatedChart);
      setError(null);
      return updatedChart;
    } catch (err) {
      setError('Failed to remove dimension');
      return chart;
    }
  }, [chart]);
  
  /**
   * Xóa measure khỏi chart
   */
  const removeMeasure = useCallback((measureId: string) => {
    if (!chart) return null;
    
    try {
      const updatedChart = ChartService.removeMeasure(chart, measureId);
      setChart(updatedChart);
      setError(null);
      return updatedChart;
    } catch (err) {
      setError('Failed to remove measure');
      return chart;
    }
  }, [chart]);
  
  /**
   * Cập nhật phép tính cho measure
   */
  const updateMeasureCalculation = useCallback((measureId: string, calculation: CalculationType) => {
    if (!chart) return null;
    
    try {
      const updatedChart = ChartService.updateMeasureCalculation(chart, measureId, calculation);
      setChart(updatedChart);
      setError(null);
      return updatedChart;
    } catch (err) {
      setError('Failed to update measure calculation');
      return chart;
    }
  }, [chart]);
  
  /**
   * Cập nhật vị trí chart
   */
  const updatePosition = useCallback((position: ChartConfig['position']) => {
    if (!chart) return null;
    
    try {
      const updatedChart = ChartService.updatePosition(chart, position);
      setChart(updatedChart);
      setError(null);
      return updatedChart;
    } catch (err) {
      setError('Failed to update position');
      return chart;
    }
  }, [chart]);
  
  /**
   * Tính toán dữ liệu cho chart
   */
  const calculateChartData = useCallback((dataset: Dataset) => {
    if (!chart) return null;
    
    try {
      return ChartService.calculateChartData({ ...chart, dataset });
    } catch (err) {
      setError('Failed to calculate chart data');
      return null;
    }
  }, [chart]);
  
  return {
    chart,
    error,
    createChart,
    addDimension,
    addMeasure,
    removeDimension,
    removeMeasure,
    updateMeasureCalculation,
    updatePosition,
    calculateChartData
  };
};