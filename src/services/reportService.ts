import { Report, ChartConfig, Dataset } from '../types';
import { HtmlExportService } from './htmlExportService';

/**
 * Service xử lý report
 */
export class ReportService {
  /**
   * Tạo report mới
   * @param name Tên report
   * @param description Mô tả report
   * @returns Report mới
   */
  public static createReport(name: string, description?: string): Report {
    const id = `report-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date();
    
    return {
      id,
      name,
      description,
      charts: [],
      datasets: [],
      layout: {},
      createdAt: now,
      updatedAt: now
    };
  }
  
  /**
   * Thêm chart vào report
   * @param report Report
   * @param chart Chart cần thêm
   * @returns Report đã cập nhật
   */
  public static addChart(report: Report, chart: ChartConfig): Report {
    return {
      ...report,
      charts: [...report.charts, chart],
      updatedAt: new Date()
    };
  }
  
  /**
   * Xóa chart khỏi report
   * @param report Report
   * @param chartId ID của chart
   * @returns Report đã cập nhật
   */
  public static removeChart(report: Report, chartId: string): Report {
    return {
      ...report,
      charts: report.charts.filter(chart => chart.id !== chartId),
      updatedAt: new Date()
    };
  }
  
  /**
   * Cập nhật chart trong report
   * @param report Report
   * @param updatedChart Chart đã cập nhật
   * @returns Report đã cập nhật
   */
  public static updateChart(report: Report, updatedChart: ChartConfig): Report {
    return {
      ...report,
      charts: report.charts.map(chart => {
        if (chart.id === updatedChart.id) {
          return updatedChart;
        }
        return chart;
      }),
      updatedAt: new Date()
    };
  }
  
  /**
   * Thêm dataset vào report
   * @param report Report
   * @param dataset Dataset cần thêm
   * @returns Report đã cập nhật
   */
  public static addDataset(report: Report, dataset: Dataset): Report {
    // Kiểm tra dataset đã tồn tại chưa
    const existingDataset = report.datasets.find(ds => ds.id === dataset.id);
    
    if (existingDataset) {
      return report;
    }
    
    return {
      ...report,
      datasets: [...report.datasets, dataset],
      updatedAt: new Date()
    };
  }
  
  /**
   * Xóa dataset khỏi report
   * @param report Report
   * @param datasetId ID của dataset
   * @returns Report đã cập nhật
   */
  public static removeDataset(report: Report, datasetId: string): Report {
    return {
      ...report,
      datasets: report.datasets.filter(dataset => dataset.id !== datasetId),
      updatedAt: new Date()
    };
  }
  
  /**
   * Cập nhật dataset trong report
   * @param report Report
   * @param updatedDataset Dataset đã cập nhật
   * @returns Report đã cập nhật
   */
  public static updateDataset(report: Report, updatedDataset: Dataset): Report {
    return {
      ...report,
      datasets: report.datasets.map(dataset => {
        if (dataset.id === updatedDataset.id) {
          return updatedDataset;
        }
        return dataset;
      }),
      updatedAt: new Date()
    };
  }
  
  /**
   * Cập nhật layout của report
   * @param report Report
   * @param layout Layout mới
   * @returns Report đã cập nhật
   */
  public static updateLayout(report: Report, layout: Record<string, any>): Report {
    return {
      ...report,
      layout,
      updatedAt: new Date()
    };
  }
  
  /**
   * Export report ra HTML
   * @param report Report
   * @returns Nội dung HTML
   */
  public static exportToHtml(report: Report): string {
    return HtmlExportService.exportToHtml(report);
  }
  
  /**
   * Lưu report
   * @param report Report
   * @returns Promise<boolean>
   */
  public static async saveReport(report: Report): Promise<boolean> {
    try {
      // Trong thực tế, đây sẽ là logic lưu report vào database hoặc file
      // Ví dụ này chỉ mô phỏng việc lưu report
      console.log('Saving report:', report.name);
      
      // Mô phỏng delay khi lưu
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error saving report:', error);
      return false;
    }
  }
  
  /**
   * Tải report
   * @param reportId ID của report
   * @returns Promise<Report | null>
   */
  public static async loadReport(reportId: string): Promise<Report | null> {
    try {
      // Trong thực tế, đây sẽ là logic tải report từ database hoặc file
      // Ví dụ này chỉ mô phỏng việc tải report
      console.log('Loading report:', reportId);
      
      // Mô phỏng delay khi tải
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mô phỏng report
      const now = new Date();
      
      return {
        id: reportId,
        name: 'Sample Report',
        description: 'This is a sample report',
        charts: [],
        datasets: [],
        layout: {},
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Error loading report:', error);
      return null;
    }
  }
}