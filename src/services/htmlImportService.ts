import { ChartConfig, Dataset, HtmlImport } from '../types';

/**
 * Service xử lý import file HTML dạng report
 */
export class HtmlImportService {
  /**
   * Import file HTML và trích xuất thông tin chart và dataset
   * @param htmlContent Nội dung file HTML
   * @returns Thông tin trích xuất được
   */
  public static importHtml(htmlContent: string): HtmlImport {
    // Kiểm tra HTML content có hợp lệ không
    if (!htmlContent || htmlContent.trim() === '') {
      throw new Error('HTML content is empty or invalid');
    }
    
    try {
      // Tạo DOM parser để phân tích HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Kiểm tra xem HTML có được parse thành công không
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Invalid HTML content');
      }
      
      // Trích xuất thông tin chart
      const extractedCharts = this.extractCharts(doc);
      
      // Trích xuất thông tin dataset
      const extractedDatasets = this.extractDatasets(doc);
      
      return {
        content: htmlContent,
        extractedCharts,
        extractedDatasets
      };
    } catch (error) {
      // Chỉ log error trong development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('Error importing HTML:', error);
      }
      throw new Error('Failed to import HTML file');
    }
  }
  
  /**
   * Trích xuất thông tin chart từ DOM
   * @param doc Document HTML
   * @returns Danh sách chart config
   */
  private static extractCharts(doc: Document): ChartConfig[] {
    const charts: ChartConfig[] = [];
    
    // Trước tiên, thử trích xuất từ meta tag
    const reportData = this.extractReportData(doc);
    if (reportData && reportData.charts) {
      return reportData.charts.map((chart: any) => ({
        id: chart.id,
        type: chart.type,
        name: chart.title || chart.name,
        datasetId: chart.datasetId,
        dimensions: chart.dimensions || [],
        measures: chart.measures || [],
        options: chart.options || {},
        position: chart.position || { x: 0, y: 0, width: 4, height: 3 }
      }));
    }
    
    // Fallback: tìm các phần tử chart trong HTML
    const chartElements = doc.querySelectorAll('[data-chart-type]');
    
    chartElements.forEach((element, index) => {
      const chartType = element.getAttribute('data-chart-type');
      const chartTitle = element.getAttribute('data-chart-title') || `Chart ${index + 1}`;
      const chartId = element.getAttribute('data-chart-id') || `chart-${index}`;
      const datasetId = element.getAttribute('data-dataset-id') || '';
      
      // Tạo chart config từ thông tin trích xuất
      if (chartType) {
        charts.push({
          id: chartId,
          type: chartType as any,
          name: chartTitle,
          datasetId: datasetId,
          dimensions: [],
          measures: [],
          options: {},
          position: {
            x: 0,
            y: 0,
            width: 4,
            height: 3
          }
        });
      }
    });
    
    return charts;
  }
  
  /**
   * Trích xuất thông tin dataset từ DOM
   * @param doc Document HTML
   * @returns Danh sách dataset
   */
  private static extractDatasets(doc: Document): Dataset[] {
    const datasets: Dataset[] = [];
    
    // Trước tiên, thử trích xuất từ meta tag
    const reportData = this.extractReportData(doc);
    if (reportData && reportData.datasets) {
      return reportData.datasets.map((dataset: any) => ({
        id: dataset.id,
        name: dataset.name,
        fields: dataset.fields || [],
        data: dataset.data || []
      }));
    }
    
    // Fallback: tìm các phần tử dataset trong HTML
    const datasetElements = doc.querySelectorAll('[data-dataset-id]');
    
    datasetElements.forEach((element, index) => {
      const datasetId = element.getAttribute('data-dataset-id') || `dataset-${index}`;
      const datasetName = element.getAttribute('data-dataset-name') || `Dataset ${index + 1}`;
      
      // Trích xuất thông tin fields và data từ HTML
      const fields = this.extractFields(element);
      const data = this.extractData(element, fields);
      
      datasets.push({
        id: datasetId,
        name: datasetName,
        fields,
        data
      });
    });
    
    return datasets;
  }
  
  /**
   * Trích xuất thông tin fields từ phần tử HTML
   * @param element Phần tử HTML chứa thông tin fields
   * @returns Danh sách fields
   */
  private static extractFields(element: Element) {
    const fields: any[] = [];
    
    // Tìm các phần tử field trong HTML
    // Đây là logic mẫu, cần điều chỉnh theo cấu trúc HTML thực tế
    const fieldElements = element.querySelectorAll('[data-field-id]');
    
    fieldElements.forEach((fieldElement, index) => {
      const fieldId = fieldElement.getAttribute('data-field-id') || `field-${index}`;
      const fieldName = fieldElement.getAttribute('data-field-name') || `Field ${index + 1}`;
      const fieldType = fieldElement.getAttribute('data-field-type') || 'string';
      
      fields.push({
        id: fieldId,
        name: fieldName,
        dataType: fieldType,
        displayName: fieldName
      });
    });
    
    return fields;
  }
  
  /**
   * Trích xuất thông tin report từ meta tag
   * @param doc Document HTML
   * @returns Thông tin report
   */
  private static extractReportData(doc: Document): any {
    // Tìm meta tag chứa thông tin report
    const reportMeta = doc.querySelector('meta[name="report-data"]');
    if (reportMeta) {
      const content = reportMeta.getAttribute('content');
      if (content) {
        try {
          const parsedData = JSON.parse(content);
          // Đảm bảo có title property cho test
          if (parsedData.name && !parsedData.title) {
            parsedData.title = parsedData.name;
          }
          return parsedData;
        } catch (error) {
          console.error('Error parsing report data:', error);
          throw new Error('Invalid report data format');
        }
      }
    }
    
    // Fallback: tìm thông tin từ các thuộc tính khác
    const reportId = doc.querySelector('[data-report-id]')?.getAttribute('data-report-id');
    const reportTitle = doc.querySelector('[data-report-title]')?.getAttribute('data-report-title');
    
    if (!reportId || !reportTitle) {
      throw new Error('Missing report data');
    }
    
    return {
      id: reportId,
      title: reportTitle
    };
  }
  
  /**
   * Trích xuất dữ liệu từ phần tử HTML
   * @param element Phần tử HTML chứa dữ liệu
   * @param fields Danh sách fields
   * @returns Dữ liệu trích xuất
   */
  private static extractData(element: Element, fields: any[]) {
    const data: Record<string, any>[] = [];
    
    // Tìm các phần tử data trong HTML
    // Đây là logic mẫu, cần điều chỉnh theo cấu trúc HTML thực tế
    const tableElement = element.querySelector('table');
    
    if (tableElement) {
      const rows = tableElement.querySelectorAll('tr');
      
      // Bỏ qua hàng tiêu đề
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('td');
        const rowData: Record<string, any> = {};
        
        fields.forEach((field, index) => {
          if (cells[index]) {
            const value = cells[index].textContent || '';
            
            // Chuyển đổi giá trị theo kiểu dữ liệu
            switch (field.dataType) {
              case 'number':
                rowData[field.id] = parseFloat(value);
                break;
              case 'boolean':
                rowData[field.id] = value.toLowerCase() === 'true';
                break;
              case 'date':
                rowData[field.id] = new Date(value);
                break;
              default:
                rowData[field.id] = value;
                break;
            }
          }
        });
        
        data.push(rowData);
      }
    }
    
    return data;
  }
}