import { ChartConfig, Dataset, Report } from '../types';

/**
 * Service xử lý export report ra file HTML
 */
export class HtmlExportService {
  /**
   * Export report ra nội dung HTML
   * @param report Report cần export
   * @returns Nội dung HTML
   */
  public static exportHtml(report: Report): string {
    try {
      // Tạo cấu trúc HTML cơ bản
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="report-data" content='${JSON.stringify({...report, title: report.name})}'>
  <title>${report.name}</title>
  <style>
    ${this.generateCss(report.charts.length > 0)}
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1>${report.name}</h1>
      ${report.description ? `<p>${report.description}</p>` : ''}
    </div>
    <div class="report-content">
      ${this.generateChartsHtml(report.charts, report.datasets)}
    </div>
    <div class="report-footer">
      <p>Generated on: ${new Date().toLocaleString()}</p>
    </div>
  </div>
  <script>
    ${this.generateJavaScript(report)}
  </script>
</body>
</html>
      `;
      
      return html;
    } catch (error) {
      console.error('Error exporting to HTML:', error);
      throw new Error('Failed to export report to HTML');
    }
  }
  
  /**
   * Tạo CSS cho report
   * @param hasCharts Có charts hay không
   * @returns CSS string
   */
  private static generateCss(hasCharts: boolean = true): string {
    const baseCss = `
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      
      .report-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      
      .report-header {
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      
      .report-header h1 {
        margin: 0 0 10px 0;
        color: #333;
      }
      
      .report-content {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-gap: 20px;
        margin-bottom: 20px;
      }
      
      .report-footer {
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #777;
      }
    `;
    
    const chartCss = hasCharts ? `
      /* Chart specific styles */
      .chart-container {
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        padding: 15px;
        position: relative;
      }
      
      .chart-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #333;
      }
      
      .chart-content {
        width: 100%;
        height: calc(100% - 30px);
      }
      
      .line-chart, .column-chart, .bar-chart, .donut-chart {
        width: 100%;
        height: 100%;
        min-height: 200px;
      }
      
      .table-chart {
        width: 100%;
        border-collapse: collapse;
      }
      
      .table-chart th, .table-chart td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      
      .table-chart th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      
      .card-chart {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        min-height: 100px;
      }
      
      .card-value {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .card-label {
        font-size: 14px;
        color: #777;
      }
      
      .kpi-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 120px;
      }
      
      .kpi-value {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      
      .kpi-label {
        font-size: 14px;
        color: #777;
        margin-bottom: 10px;
      }
      
      .kpi-trend {
        display: flex;
        align-items: center;
        font-size: 12px;
      }
      
      .kpi-trend-up {
        color: #4caf50;
      }
      
      .kpi-trend-down {
        color: #f44336;
      }
    ` : '';
    
    return baseCss + chartCss;
  }
  
  /**
   * Tạo HTML cho các chart
   * @param charts Danh sách chart
   * @param datasets Danh sách dataset
   * @returns HTML string
   */
  private static generateChartsHtml(charts: ChartConfig[], datasets: Dataset[]): string {
    return charts.map(chart => {
      // Tìm dataset tương ứng
      const dataset = datasets.find(ds => ds.id === chart.datasetId) || datasets[0] || { id: '', name: '', fields: [], data: [] };
      
      // Tính toán grid position
      const defaultPosition = { width: 4, height: 3 };
      const gridColumn = chart.position ? 
        `grid-column: span ${chart.position.width || defaultPosition.width};` : 
        `grid-column: span ${defaultPosition.width};`;
      const gridRow = chart.position ? 
        `grid-row: span ${chart.position.height || defaultPosition.height};` : 
        `grid-row: span ${defaultPosition.height};`;
      
      // Tạo HTML cho chart
      return `
        <div class="chart-container" 
             style="${gridColumn} ${gridRow}" 
             data-chart-id="${chart.id}" 
             data-chart-type="${chart.type}" 
             data-dataset-id="${dataset.id}">
          <div class="chart-title">${chart.name}</div>
          <div class="chart-content">
            ${this.generateChartContentHtml(chart, dataset)}
          </div>
        </div>
      `;
    }).join('');
  }
  
  /**
   * Tạo HTML cho nội dung chart
   * @param chart Chart config
   * @param dataset Dataset
   * @returns HTML string
   */
  private static generateChartContentHtml(chart: ChartConfig, dataset: Dataset): string {
    switch (chart.type) {
      case 'table':
      case 'matrix-table':
        return this.generateTableHtml(chart, dataset);
      case 'card':
        return this.generateCardHtml(chart, dataset);
      case 'kpi-card':
        return this.generateKpiCardHtml(chart, dataset);
      default:
        return `<canvas class="${chart.type}-chart" id="chart-canvas-${chart.id}"></canvas>`;
    }
  }
  
  /**
   * Tạo HTML cho bảng
   * @param chart Chart config
   * @param dataset Dataset
   * @returns HTML string
   */
  private static generateTableHtml(chart: ChartConfig, dataset: Dataset): string {
    // Lấy dimensions và measures
    const dimensions = chart.dimensions || [];
    const measures = chart.measures || [];
    
    // Tạo header
    const headers = [...dimensions, ...measures].map(field => {
      return `<th data-field-id="${field.id}" data-field-type="${field.dataType}">${field.displayName || field.name}</th>`;
    }).join('');
    
    // Tạo rows
    const rows = dataset.data.map(row => {
      const cells = [...dimensions, ...measures].map(field => {
        const value = row[field.id];
        return `<td>${value !== undefined ? value : ''}</td>`;
      }).join('');
      
      return `<tr>${cells}</tr>`;
    }).join('');
    
    return `
      <table class="table-chart" data-chart-id="${chart.id}">
        <thead>
          <tr>${headers}</tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }
  
  /**
   * Tạo HTML cho card
   * @param chart Chart config
   * @param dataset Dataset
   * @returns HTML string
   */
  private static generateCardHtml(chart: ChartConfig, dataset: Dataset): string {
    // Lấy measure đầu tiên
    const measure = chart.measures[0];
    
    if (!measure || !dataset.data.length) {
      return '<div class="card-chart"><div class="card-value">N/A</div></div>';
    }
    
    // Tính giá trị
    const value = this.calculateAggregateValue(dataset.data, measure);
    
    return `
      <div class="card-chart">
        <div class="card-value">${value}</div>
        <div class="card-label">${measure.displayName || measure.name}</div>
      </div>
    `;
  }
  
  /**
   * Tạo HTML cho KPI card
   * @param chart Chart config
   * @param dataset Dataset
   * @returns HTML string
   */
  private static generateKpiCardHtml(chart: ChartConfig, dataset: Dataset): string {
    // Lấy measure đầu tiên
    const measure = chart.measures[0];
    
    if (!measure || !dataset.data.length) {
      return '<div class="kpi-card"><div class="kpi-value">N/A</div></div>';
    }
    
    // Tính giá trị
    const value = this.calculateAggregateValue(dataset.data, measure);
    
    // Giả lập trend (trong thực tế sẽ tính toán từ dữ liệu)
    const trendValue = Math.random() > 0.5 ? 5.2 : -3.8;
    const trendClass = trendValue >= 0 ? 'kpi-trend-up' : 'kpi-trend-down';
    const trendIcon = trendValue >= 0 ? '↑' : '↓';
    
    return `
      <div class="kpi-card">
        <div class="kpi-value">${value}</div>
        <div class="kpi-label">${measure.displayName || measure.name}</div>
        <div class="kpi-trend ${trendClass}">
          ${trendIcon} ${Math.abs(trendValue).toFixed(1)}%
        </div>
      </div>
    `;
  }
  
  /**
   * Tính toán giá trị tổng hợp
   * @param data Dữ liệu
   * @param measure Measure
   * @returns Giá trị tổng hợp
   */
  private static calculateAggregateValue(data: Record<string, any>[], measure: any): string {
    if (!data.length) return 'N/A';
    
    let result: number;
    const values = data.map(row => row[measure.id]).filter(val => val !== undefined && val !== null);
    
    switch (measure.calculation) {
      case 'sum':
        result = values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        break;
      case 'max':
        result = Math.max(...values.map(val => parseFloat(val) || 0));
        break;
      case 'min':
        result = Math.min(...values.map(val => parseFloat(val) || 0));
        break;
      case 'count':
        result = values.length;
        break;
      case 'count-distinct':
        result = new Set(values).size;
        break;
      default:
        result = values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
        break;
    }
    
    // Format giá trị
    if (measure.format) {
      // Xử lý format (trong thực tế sẽ dùng thư viện format)
      return result.toLocaleString();
    }
    
    return result.toString();
  }
  
  /**
   * Tạo HTML cho chart
   * @param chart Chart config
   * @returns HTML string
   */
  public static generateChartHtml(chart: ChartConfig): string {
    const defaultPosition = { width: 4, height: 3 };
    const gridColumn = chart.position ? 
      `grid-column: span ${chart.position.width || defaultPosition.width};` : 
      `grid-column: span ${defaultPosition.width};`;
    const gridRow = chart.position ? 
      `grid-row: span ${chart.position.height || defaultPosition.height};` : 
      `grid-row: span ${defaultPosition.height};`;
    
    return `
      <div class="chart-container" 
           style="${gridColumn} ${gridRow}" 
           data-chart-id="${chart.id}" 
           data-chart-type="${chart.type}" 
           data-chart-title="${chart.name}" 
           data-dataset-id="${chart.datasetId}">
        <div class="chart-title">${chart.name}</div>
        <div class="chart-content">
          <canvas class="${chart.type}-chart" id="chart-canvas-${chart.id}"></canvas>
        </div>
      </div>
    `;
  }
  
  /**
   * Tạo JavaScript cho report
   * @param report Report
   * @returns JavaScript string
   */
  private static generateJavaScript(report: Report): string {
    return `
      // JavaScript để render các chart
      document.addEventListener('DOMContentLoaded', function() {
        // Dữ liệu datasets
        const datasets = ${JSON.stringify(report.datasets)};
        
        // Dữ liệu charts
        const charts = ${JSON.stringify(report.charts)};
        
        // Render các chart
        charts.forEach(chart => {
          if (['line', 'column', 'bar', 'donut'].includes(chart.type)) {
            renderChart(chart);
          }
        });
        
        // Hàm render chart
        function renderChart(chart) {
          const canvas = document.getElementById('chart-canvas-' + chart.id);
          if (!canvas) return;
          
          const dataset = datasets.find(ds => ds.id === chart.datasetId);
          if (!dataset) return;
          
          // Trong thực tế sẽ dùng thư viện chart.js để render
          console.log('Rendering chart:', chart.title);
        }
      });
    `;
  }
}