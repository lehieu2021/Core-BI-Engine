import { ChartConfig, Dataset, Dimension, Measure, CalculationType } from '../types';

/**
 * Service xử lý chart
 */
export class ChartService {
  /**
   * Tạo chart mới
   * @param type Loại chart
   * @param name Tên chart
   * @param datasetId ID của dataset
   * @returns Chart config
   */
  public static createChart(type: ChartConfig['type'], name: string, datasetId: string): ChartConfig {
    const id = `chart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return {
      id,
      type,
      name,
      datasetId,
      dimensions: [],
      measures: [],
      options: {},
      position: {
        x: 0,
        y: 0,
        width: 4,
        height: 3
      }
    };
  }
  
  /**
   * Thêm dimension vào chart
   * @param chart Chart config
   * @param field Field
   * @returns Chart config đã cập nhật
   */
  public static addDimension(chart: ChartConfig, field: any): ChartConfig {
    const dimension: Dimension = {
      id: field.id,
      name: field.name,
      dataType: field.dataType,
      displayName: field.displayName || field.name
    };
    
    return {
      ...chart,
      dimensions: [...chart.dimensions, dimension]
    };
  }
  
  /**
   * Thêm measure vào chart
   * @param chart Chart config
   * @param field Field
   * @param calculation Phép tính
   * @returns Chart config đã cập nhật
   */
  public static addMeasure(chart: ChartConfig, field: any, calculation: CalculationType): ChartConfig {
    const measure: Measure = {
      id: field.id,
      name: field.name,
      dataType: field.dataType,
      displayName: field.displayName || field.name,
      calculation
    };
    
    return {
      ...chart,
      measures: [...chart.measures, measure]
    };
  }
  
  /**
   * Xóa dimension khỏi chart
   * @param chart Chart config
   * @param dimensionId ID của dimension
   * @returns Chart config đã cập nhật
   */
  public static removeDimension(chart: ChartConfig, dimensionId: string): ChartConfig {
    if (!chart.dimensions) {
      return chart;
    }
    return {
      ...chart,
      dimensions: chart.dimensions.filter(dim => dim.id !== dimensionId)
    };
  }
  
  /**
   * Xóa measure khỏi chart
   * @param chart Chart config
   * @param measureId ID của measure
   * @returns Chart config đã cập nhật
   */
  public static removeMeasure(chart: ChartConfig, measureId: string): ChartConfig {
    if (!chart.measures) {
      return chart;
    }
    return {
      ...chart,
      measures: chart.measures.filter(mea => mea.id !== measureId)
    };
  }
  
  /**
   * Cập nhật phép tính cho measure
   * @param chart Chart config
   * @param measureId ID của measure
   * @param calculation Phép tính mới
   * @returns Chart config đã cập nhật
   */
  public static updateMeasureCalculation(chart: ChartConfig, measureId: string, calculation: CalculationType): ChartConfig {
    if (!chart.measures) {
      return chart;
    }
    return {
      ...chart,
      measures: chart.measures.map(measure => {
        if (measure.id === measureId) {
          return {
            ...measure,
            calculation
          };
        }
        return measure;
      })
    };
  }
  
  /**
   * Cập nhật vị trí chart
   * @param chart Chart config
   * @param position Vị trí mới
   * @returns Chart config đã cập nhật
   */
  public static updatePosition(chart: ChartConfig, position: ChartConfig['position']): ChartConfig {
    return {
      ...chart,
      position: {
        // Đảm bảo position luôn có giá trị mặc định nếu không tồn tại
        ...(chart.position || { x: 0, y: 0, width: 4, height: 3 }),
        ...position
      }
    };
  }
  
  /**
   * Tính toán dữ liệu cho chart
   * @param chart Chart config với dataset
   * @returns Dữ liệu đã tính toán
   */
  public static calculateChartData(chartWithDataset: { dataset: Dataset } & ChartConfig): any {
    const { dataset, dimensions, measures } = chartWithDataset;
    
    if (!dataset || !dataset.data || dataset.data.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    // Đảm bảo chart config có dataset
    const chartConfig = { ...chartWithDataset };
    
    switch (chartWithDataset.type) {
      case 'line':
      case 'column':
      case 'bar':
        return this.calculateCategoryChartData(chartConfig);
      case 'donut':
        return this.calculateDonutChartData(chartConfig);
      case 'table':
      case 'matrix-table':
        return this.calculateTableData(chartConfig);
      case 'card':
      case 'kpi-card':
        return this.calculateCardData(chartConfig);
      default:
        return { labels: [], datasets: [] };
    }
  }
  
  /**
   * Tính toán dữ liệu cho chart dạng category (line, column, bar)
   * @param chart Chart config với dataset
   * @returns Dữ liệu đã tính toán
   */
  private static calculateCategoryChartData(chart: { dataset: Dataset } & ChartConfig): any {
    const { dataset, dimensions, measures } = chart;
    
    // Kiểm tra dataset, dimensions và measures có tồn tại không
    if (!dataset || !dataset.data || !dimensions || !measures || dimensions.length === 0 || measures.length === 0) {
      return { labels: [], datasets: [] };
    }
    
    // Lấy dimension đầu tiên làm trục x
    const dimension = dimensions[0];
    
    // Lấy các giá trị duy nhất của dimension
    const labels = Array.from(new Set(dataset.data.map(item => item[dimension.id])));
    
    // Tạo dataset cho từng measure
    const chartDatasets = measures.map(measure => {
      // Tính toán giá trị cho từng label
      const data = labels.map(label => {
        // Lọc dữ liệu theo label
        const filteredData = dataset.data.filter(item => item[dimension.id] === label);
        
        // Tính toán giá trị theo phép tính
        return this.calculateAggregateValue(filteredData, measure);
      });
      
      return {
        label: measure.displayName || measure.name,
        data
      };
    });
    
    return {
      labels,
      datasets: chartDatasets
    };
  }
  
  /**
   * Tính toán dữ liệu cho chart dạng donut
   * @param chart Chart config với dataset
   * @returns Dữ liệu đã tính toán
   */
  private static calculateDonutChartData(chart: { dataset: Dataset } & ChartConfig): any {
    const { dataset, dimensions, measures } = chart;
    
    // Kiểm tra dataset, dimensions và measures có tồn tại không
    if (!dataset || !dataset.data || !dimensions || !measures || dimensions.length === 0 || measures.length === 0) {
      return { labels: [], datasets: [{ data: [] }] };
    }
    
    // Lấy dimension đầu tiên làm labels
    const dimension = dimensions[0];
    
    // Lấy measure đầu tiên
    const measure = measures[0];
    
    // Lấy các giá trị duy nhất của dimension
    const labels = Array.from(new Set(dataset.data.map(item => item[dimension.id])));
    
    // Tính toán giá trị cho từng label
    const data = labels.map(label => {
      // Lọc dữ liệu theo label
      const filteredData = dataset.data.filter(item => item[dimension.id] === label);
      
      // Tính toán giá trị theo phép tính
      return this.calculateAggregateValue(filteredData, measure);
    });
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: this.generateColors(labels.length)
      }]
    };
  }
  
  /**
   * Tính toán dữ liệu cho bảng
   * @param chart Chart config với dataset
   * @returns Dữ liệu đã tính toán
   */
  private static calculateTableData(chart: { dataset: Dataset } & ChartConfig): any {
    const { dataset, dimensions, measures } = chart;
    
    // Kiểm tra dimensions và measures có tồn tại không
    if (!dimensions) chart.dimensions = [];
    if (!measures) chart.measures = [];
    
    const dims = dimensions || [];
    const meas = measures || [];
    
    // Kiểm tra dataset có tồn tại không
    if (!dataset || !dataset.data) {
      return { headers: [], rows: [] };
    }
    
    // Cần ít nhất 1 dimension hoặc 1 measure
    if (dims.length === 0 && meas.length === 0) {
      return { headers: [], rows: [] };
    }
    
    // Tạo headers
    const headers = [
      ...dims.map(dim => ({ id: dim.id, label: dim.displayName || dim.name })),
      ...meas.map(mea => ({ id: mea.id, label: mea.displayName || mea.name }))
    ];
    
    // Nếu là matrix table và có ít nhất 2 dimensions
    if (chart.type === 'matrix-table' && dims.length >= 2) {
      return this.calculateMatrixTableData(chart);
    }
    
    // Tạo rows
    const rows = dataset.data.map(item => {
      const row: Record<string, any> = {};
      
      // Thêm giá trị dimensions
      dims.forEach(dim => {
        row[dim.id] = item[dim.id];
      });
      
      // Thêm giá trị measures
      meas.forEach(mea => {
        row[mea.id] = item[mea.id];
      });
      
      return row;
    });
    
    return {
      headers,
      rows
    };
  }
  
  /**
   * Tính toán dữ liệu cho matrix table
   * @param chart Chart config với dataset
   * @returns Dữ liệu đã tính toán
   */
  private static calculateMatrixTableData(chart: { dataset: Dataset } & ChartConfig): any {
    const { dataset, dimensions, measures } = chart;
    
    // Kiểm tra dataset, dimensions và measures có tồn tại không
    if (!dataset || !dataset.data || !dimensions || !measures || dimensions.length < 2 || measures.length === 0) {
      return { headers: [], rows: [] };
    }
    
    // Lấy 2 dimensions đầu tiên
    const rowDimension = dimensions[0];
    const colDimension = dimensions[1];
    
    // Lấy measure đầu tiên
    const measure = measures[0];
    
    // Lấy các giá trị duy nhất của row dimension
    const rowValues = Array.from(new Set(dataset.data.map(item => item[rowDimension.id])));
    
    // Lấy các giá trị duy nhất của column dimension
    const colValues = Array.from(new Set(dataset.data.map(item => item[colDimension.id])));
    
    // Tạo headers
    const headers = [
      { id: rowDimension.id, label: rowDimension.displayName || rowDimension.name },
      ...colValues.map(colValue => ({ id: `${colDimension.id}_${colValue}`, label: colValue }))
    ];
    
    // Tạo rows
    const rows = rowValues.map(rowValue => {
      const row: Record<string, any> = {
        [rowDimension.id]: rowValue
      };
      
      // Tính toán giá trị cho từng column
      colValues.forEach(colValue => {
        // Lọc dữ liệu theo row và column
        const filteredData = dataset.data.filter(
          item => item[rowDimension.id] === rowValue && item[colDimension.id] === colValue
        );
        
        // Tính toán giá trị theo phép tính
        row[`${colDimension.id}_${colValue}`] = this.calculateAggregateValue(filteredData, measure);
      });
      
      return row;
    });
    
    return {
      headers,
      rows
    };
  }
  
  /**
   * Tính toán dữ liệu cho card
   * @param chart Chart config với dataset
   * @returns Dữ liệu đã tính toán
   */
  private static calculateCardData(chart: { dataset: Dataset } & ChartConfig): any {
    const { dataset, measures } = chart;
    
    // Kiểm tra measures và dataset có tồn tại không
    if (!measures || measures.length === 0) {
      return { value: 'N/A', label: '' };
    }
    
    // Kiểm tra dataset có tồn tại không
    if (!dataset || !dataset.data) {
      return { value: 'N/A', label: measures[0].displayName || measures[0].name };
    }
    
    // Lấy measure đầu tiên
    const measure = measures[0];
    
    // Tính toán giá trị
    const value = this.calculateAggregateValue(dataset.data, measure);
    
    return {
      value,
      label: measure.displayName || measure.name
    };
  }

  /**
   * Tính toán dữ liệu cho KPI card
   * @param config Chart config
   * @param dataset Dataset
   * @returns Dữ liệu đã tính toán
   */
  public static calculateKPICardData(config: ChartConfig, dataset: Dataset): any {
    const { measures } = config;
    
    // Kiểm tra measures và dataset có tồn tại không
    if (!measures || measures.length === 0) {
      return { value: 0, comparisonValue: null };
    }
    
    // Kiểm tra dataset có tồn tại không
    if (!dataset || !dataset.data) {
      return { value: 0, comparisonValue: null };
    }
    
    // Lấy measure đầu tiên làm giá trị chính
    const primaryMeasure = measures[0];
    const value = this.calculateAggregateValue(dataset.data, primaryMeasure);
    
    // Lấy measure thứ hai làm giá trị so sánh (nếu có)
    let comparisonValue = null;
    if (measures.length > 1) {
      const comparisonMeasure = measures[1];
      comparisonValue = this.calculateAggregateValue(dataset.data, comparisonMeasure);
    }
    
    return {
      value,
      comparisonValue
    };
  }
  
  /**
   * Tính toán giá trị tổng hợp
   * @param data Dữ liệu
   * @param measure Measure
   * @returns Giá trị tổng hợp
   */
  private static calculateAggregateValue(data: Record<string, any>[], measure: Measure): number {
    if (!data.length) return 0;
    
    const values = data.map(row => {
      const val = row[measure.id];
      return typeof val === 'number' ? val : parseFloat(val) || 0;
    });
    
    switch (measure.calculation) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'max':
        return Math.max(...values);
      case 'min':
        return Math.min(...values);
      case 'count':
        return values.length;
      case 'count-distinct':
        return new Set(values).size;
      case 'average':
        return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
      default:
        return values.reduce((sum, val) => sum + val, 0);
    }
  }
  
  /**
   * Tạo màu ngẫu nhiên
   * @param count Số lượng màu cần tạo
   * @returns Mảng màu
   */
  private static generateColors(count: number): string[] {
    const colors = [
      '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f',
      '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
    ];
    
    // Nếu cần nhiều màu hơn, tạo thêm màu ngẫu nhiên
    if (count > colors.length) {
      for (let i = colors.length; i < count; i++) {
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        colors.push(`rgb(${r}, ${g}, ${b})`);
      }
    }
    
    return colors.slice(0, count);
  }
}