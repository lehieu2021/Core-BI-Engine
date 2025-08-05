import { HtmlImportService } from '../../services/htmlImportService';
import { Report, ChartType } from '../../types';

describe('HtmlImportService', () => {
  // Mock HTML content cho test
  const createMockHtmlContent = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Report</title>
        <meta name="report-data" content='{"id":"test-report","name":"Test Report","datasets":[{"id":"test-dataset","name":"Test Dataset","fields":[{"id":"category","name":"Category","dataType":"string"},{"id":"value","name":"Value","dataType":"number"}],"data":[{"category":"A","value":10},{"category":"B","value":20},{"category":"C","value":30}]}],"charts":[{"id":"chart1","type":"line","title":"Test Line Chart","datasetId":"test-dataset","dimensions":[{"id":"category","name":"Category","dataType":"string"}],"measures":[{"id":"value","name":"Value","dataType":"number","calculation":"sum"}],"position":{"x":0,"y":0,"width":4,"height":3}}],"createdAt":"2023-01-01T00:00:00.000Z","updatedAt":"2023-01-01T00:00:00.000Z"}'>
      </head>
      <body>
        <div class="report-container">
          <div class="chart-container" data-chart-id="chart1">
            <div class="chart-title">Test Line Chart</div>
            <div class="chart-content"></div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  describe('importHtml', () => {
    it('should parse HTML and extract report data correctly', () => {
      const htmlContent = createMockHtmlContent();
      
      const result = HtmlImportService.importHtml(htmlContent);
      
      // Kiểm tra thông tin import result
      expect(result.content).toBe(htmlContent);
      expect(result.extractedCharts).toHaveLength(1);
      expect(result.extractedDatasets).toHaveLength(1);
        
        // Kiểm tra datasets
        expect(result.extractedDatasets[0].id).toBe('test-dataset');
        expect(result.extractedDatasets[0].fields).toHaveLength(2);
        expect(result.extractedDatasets[0].data).toHaveLength(3);
        
        // Kiểm tra charts
        expect(result.extractedCharts[0].id).toBe('chart1');
        expect(result.extractedCharts[0].type).toBe('line');
        expect(result.extractedCharts[0].datasetId).toBe('test-dataset');
        expect(result.extractedCharts[0].dimensions).toHaveLength(1);
        expect(result.extractedCharts[0].measures).toHaveLength(1);
    });

    it('should handle invalid HTML content', () => {
      const invalidHtml = '<html><body>Invalid report</body></html>';
      
      expect(() => HtmlImportService.importHtml(invalidHtml)).toThrow();
    });

    it('should handle empty HTML content', () => {
      const emptyHtml = '';
      
      expect(() => HtmlImportService.importHtml(emptyHtml)).toThrow();
    });
  });

  describe('extractReportData', () => {
    it('should extract report data from meta tag', () => {
      const htmlContent = createMockHtmlContent();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Sử dụng phương thức private thông qua reflection
      const extractReportData = (HtmlImportService as any)['extractReportData'];
      const reportData = extractReportData.call(HtmlImportService, doc);
      
      expect(reportData).toHaveProperty('id', 'test-report');
      expect(reportData).toHaveProperty('title', 'Test Report');
      expect(reportData).toHaveProperty('datasets');
      expect(reportData).toHaveProperty('charts');
    });

    it('should throw error when meta tag is missing', () => {
      const invalidHtml = '<html><head><title>No Meta</title></head><body></body></html>';
      const parser = new DOMParser();
      const doc = parser.parseFromString(invalidHtml, 'text/html');
      
      const extractReportData = (HtmlImportService as any)['extractReportData'];
      
      expect(() => extractReportData.call(HtmlImportService, doc)).toThrow();
    });
  });
});