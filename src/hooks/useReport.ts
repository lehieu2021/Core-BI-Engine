import { useState, useCallback } from 'react';
import { Report, ChartConfig, Dataset } from '../types';
import { ReportService } from '../services/reportService';

/**
 * Hook quản lý report
 */
export const useReport = (initialReport?: Report) => {
  const [report, setReport] = useState<Report | null>(initialReport || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Tạo report mới
   */
  const createReport = useCallback((name: string, description?: string) => {
    try {
      const newReport = ReportService.createReport(name, description);
      setReport(newReport);
      setError(null);
      return newReport;
    } catch (err) {
      setError('Failed to create report');
      return null;
    }
  }, []);
  
  /**
   * Thêm chart vào report
   */
  const addChart = useCallback((type: string, name: string, datasetId: string) => {
    if (!report) return;
    
    try {
      const chart: ChartConfig = {
        id: `chart-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: type as any,
        name,
        datasetId,
        dimensions: [],
        measures: [],
        options: {},
        position: { x: 0, y: 0, width: 4, height: 3 }
      };
      
      const updatedReport = ReportService.addChart(report, chart);
      setReport(updatedReport);
      setError(null);
      return chart;
    } catch (err) {
      setError('Failed to add chart');
      return null;
    }
  }, [report]);
  
  /**
   * Xóa chart khỏi report
   */
  const removeChart = useCallback((chartId: string) => {
    if (!report) return;
    
    try {
      const updatedReport = ReportService.removeChart(report, chartId);
      setReport(updatedReport);
      setError(null);
      return updatedReport;
    } catch (err) {
      setError('Failed to remove chart');
      return report;
    }
  }, [report]);
  
  /**
   * Cập nhật chart trong report
   */
  const updateChart = useCallback((updatedChart: ChartConfig) => {
    if (!report) return;
    
    try {
      const updatedReport = ReportService.updateChart(report, updatedChart);
      setReport(updatedReport);
      setError(null);
      return updatedReport;
    } catch (err) {
      setError('Failed to update chart');
      return report;
    }
  }, [report]);
  
  /**
   * Thêm dataset vào report
   */
  const addDataset = useCallback((dataset: Dataset) => {
    if (!report) return;
    
    try {
      const updatedReport = ReportService.addDataset(report, dataset);
      setReport(updatedReport);
      setError(null);
      return updatedReport;
    } catch (err) {
      setError('Failed to add dataset');
      return report;
    }
  }, [report]);
  
  /**
   * Cập nhật dataset trong report
   */
  const updateDataset = useCallback((updatedDataset: Dataset) => {
    if (!report) return;
    
    try {
      const updatedReport = ReportService.updateDataset(report, updatedDataset);
      setReport(updatedReport);
      setError(null);
      return updatedReport;
    } catch (err) {
      setError('Failed to update dataset');
      return report;
    }
  }, [report]);
  
  /**
   * Cập nhật layout của report
   */
  const updateLayout = useCallback((layout: Record<string, any>) => {
    if (!report) return;
    
    try {
      const updatedReport = ReportService.updateLayout(report, layout);
      setReport(updatedReport);
      setError(null);
      return updatedReport;
    } catch (err) {
      setError('Failed to update layout');
      return report;
    }
  }, [report]);
  
  /**
   * Lưu report
   */
  const saveReport = useCallback(async () => {
    if (!report) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      const success = await ReportService.saveReport(report);
      
      setLoading(false);
      
      if (!success) {
        setError('Failed to save report');
      }
      
      return success;
    } catch (err) {
      setLoading(false);
      setError('Failed to save report');
      return false;
    }
  }, [report]);
  
  /**
   * Tải report
   */
  const loadReport = useCallback(async (reportId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const loadedReport = await ReportService.loadReport(reportId);
      
      setLoading(false);
      
      if (loadedReport) {
        setReport(loadedReport);
        return loadedReport;
      } else {
        setError('Failed to load report');
        return null;
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to load report');
      return null;
    }
  }, []);
  
  /**
   * Export report ra HTML
   */
  const exportToHtml = useCallback(() => {
    if (!report) return null;
    
    try {
      return ReportService.exportToHtml(report);
    } catch (err) {
      setError('Failed to export report to HTML');
      return null;
    }
  }, [report]);
  
  /**
   * Thêm dimension vào chart
   */
  const addDimension = useCallback((chartId: string, field: any) => {
    if (!report) return;
    
    try {
      const chart = report.charts.find(c => c.id === chartId);
      if (!chart) return;
      
      const updatedChart = {
        ...chart,
        dimensions: [...chart.dimensions, field]
      };
      
      const updatedReport = ReportService.updateChart(report, updatedChart);
      setReport(updatedReport);
      setError(null);
      return updatedReport;
    } catch (err) {
      setError('Failed to add dimension');
      return report;
    }
  }, [report]);
  
  /**
   * Thêm measure vào chart
   */
  const addMeasure = useCallback((chartId: string, field: any, calculation: string) => {
    if (!report) return;
    
    try {
      const chart = report.charts.find(c => c.id === chartId);
      if (!chart) return;
      
      const measure = {
        ...field,
        calculation
      };
      
      const updatedChart = {
        ...chart,
        measures: [...chart.measures, measure]
      };
      
      const updatedReport = ReportService.updateChart(report, updatedChart);
      setReport(updatedReport);
      setError(null);
      return updatedReport;
    } catch (err) {
      setError('Failed to add measure');
      return report;
    }
  }, [report]);
  
  /**
   * Cập nhật vị trí chart
   */
  const updateChartPosition = useCallback((chartId: string, position: any) => {
    if (!report) return;
    
    try {
      const chart = report.charts.find(c => c.id === chartId);
      if (!chart) return;
      
      const updatedChart = {
        ...chart,
        position
      };
      
      const updatedReport = ReportService.updateChart(report, updatedChart);
      setReport(updatedReport);
      setError(null);
      return updatedReport;
    } catch (err) {
      setError('Failed to update chart position');
      return report;
    }
  }, [report]);
  
  /**
   * Set report
   */
  const setReportData = useCallback((newReport: Report) => {
    setReport(newReport);
    setError(null);
  }, []);
  
  /**
   * Clear report completely (set to null)
   */
  const clearReport = useCallback(() => {
    setReport(null);
    setError(null);
  }, []);
  
  return {
    report,
    loading,
    error,
    createReport,
    addChart,
    removeChart,
    updateChart,
    addDataset,
    updateDataset,
    updateLayout,
    saveReport,
    loadReport,
    exportToHtml,
    addDimension,
    addMeasure,
    updateChartPosition,
    setReport: setReportData,
    setReportDirect: setReport,
    clearReport
  };
};