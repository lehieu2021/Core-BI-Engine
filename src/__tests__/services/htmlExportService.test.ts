import { HtmlExportService } from '../../services/htmlExportService';
import { Report, ChartType, Dataset, ChartConfig } from '../../types';

describe('HtmlExportService', () => {
  // Mock report data cho test
  const createMockReport = (): Report => {
    const dataset: Dataset = {
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

    const chart: ChartConfig = {
      id: 'chart1',
      type: 'line' as ChartType,
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

    return {
      id: 'test-report',
      name: 'Test Report',
      datasets: [dataset],
      charts: [chart],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  };

  describe('exportHtml', () => {
    it('should generate HTML with correct report data', () => {
      const report = createMockReport();
      const html = HtmlExportService.exportHtml(report);
      
      // Kiểm tra HTML có chứa các thành phần cần thiết
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html>');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      
      // Kiểm tra tiêu đề report
      expect(html).toContain('Test Report');
      
      // Kiểm tra meta tag chứa dữ liệu report
      expect(html).toContain('<meta name="report-data"');
      
      // Kiểm tra dữ liệu report được mã hóa đúng
      const metaTagMatch = html.match(/<meta name="report-data" content='([^']+)'>/i);
      expect(metaTagMatch).toBeTruthy();
      
      if (metaTagMatch && metaTagMatch[1]) {
        const reportData = JSON.parse(metaTagMatch[1]);
        expect(reportData.id).toBe('test-report');
        expect(reportData.title).toBe('Test Report');
        expect(reportData.datasets).toHaveLength(1);
        expect(reportData.charts).toHaveLength(1);
      }
      
      // Kiểm tra container cho chart
      expect(html).toContain('chart-container');
      expect(html).toContain('data-chart-id="chart1"');
      expect(html).toContain('Test Line Chart');
    });

    it('should handle report with no charts', () => {
      const report = createMockReport();
      report.charts = [];
      
      const html = HtmlExportService.exportHtml(report);
      
      // Kiểm tra HTML vẫn được tạo đúng
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<meta name="report-data"');
      
      // Kiểm tra không có chart container
      expect(html).not.toContain('chart-container');
    });

    it('should handle report with multiple charts', () => {
      const report = createMockReport();
      
      // Thêm chart thứ hai
      const secondChart: ChartConfig = {
        id: 'chart2',
        type: 'donut' as ChartType,
        name: 'Test Donut Chart',
        datasetId: 'test-dataset',
        dimensions: [
          { id: 'category', name: 'Category', dataType: 'string' }
        ],
        measures: [
          { id: 'value', name: 'Value', dataType: 'number', calculation: 'sum' }
        ],
        position: { x: 4, y: 0, width: 4, height: 3 }
      };
      
      report.charts.push(secondChart);
      
      const html = HtmlExportService.exportHtml(report);
      
      // Kiểm tra có 2 chart container trong body
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      expect(bodyMatch).toBeTruthy();
      if (bodyMatch) {
        const bodyContent = bodyMatch[1];
        expect(bodyContent.match(/chart-container/g)?.length).toBe(2);
      }
      expect(html).toContain('data-chart-id="chart1"');
      expect(html).toContain('data-chart-id="chart2"');
      expect(html).toContain('Test Line Chart');
      expect(html).toContain('Test Donut Chart');
    });
  });

  describe('generateChartHtml', () => {
    it('should generate correct HTML for a chart', () => {
      const chart = createMockReport().charts[0];
      
      // Sử dụng phương thức private thông qua reflection
      const generateChartHtml = (HtmlExportService as any)['generateChartHtml'];
      const chartHtml = generateChartHtml.call(HtmlExportService, chart);
      
      expect(chartHtml).toContain('chart-container');
      expect(chartHtml).toContain('data-chart-id="chart1"');
      expect(chartHtml).toContain('chart-title');
      expect(chartHtml).toContain('Test Line Chart');
      expect(chartHtml).toContain('chart-content');
    });
  });
});