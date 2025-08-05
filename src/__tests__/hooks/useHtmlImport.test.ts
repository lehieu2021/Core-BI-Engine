import { renderHook, act } from '@testing-library/react';
import { useHtmlImport } from '../../hooks/useHtmlImport';
import { HtmlImportService } from '../../services/htmlImportService';
import { Report } from '../../types';

// Mock HtmlImportService
jest.mock('../../services/htmlImportService', () => ({
  HtmlImportService: {
    importHtml: jest.fn()
  }
}));

describe('useHtmlImport', () => {
  const mockReport: Report = {
    id: 'test-report',
    name: 'Test Report',
    datasets: [],
    charts: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useHtmlImport());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful import', () => {
    // Mock successful import
    const mockHtmlImport = {
      content: '<html>test</html>',
      extractedCharts: [],
      extractedDatasets: []
    };
    (HtmlImportService.importHtml as jest.Mock).mockReturnValue(mockHtmlImport);
    
    const { result } = renderHook(() => useHtmlImport());
    
    act(() => {
      result.current.importFromHtml('<html>test</html>');
    });
    
    // Kiểm tra sau khi import thành công
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.importResult).toEqual(mockHtmlImport);
    expect(HtmlImportService.importHtml).toHaveBeenCalledWith('<html>test</html>');
  });

  it('should handle import error', () => {
    // Mock import error
    (HtmlImportService.importHtml as jest.Mock).mockImplementation(() => {
      throw new Error('Import failed');
    });
    
    const { result } = renderHook(() => useHtmlImport());
    
    act(() => {
      result.current.importFromHtml('<html>invalid</html>');
    });
    
    // Kiểm tra sau khi import thất bại
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to import HTML');
    expect(result.current.importResult).toBeNull();
  });

  it('should clear import result', () => {
    // Mock successful import first
    const mockHtmlImport = {
      content: '<html>test</html>',
      extractedCharts: [],
      extractedDatasets: []
    };
    (HtmlImportService.importHtml as jest.Mock).mockReturnValue(mockHtmlImport);
    
    const { result } = renderHook(() => useHtmlImport());
    
    // Import first
    act(() => {
      result.current.importFromHtml('<html>test</html>');
    });
    
    expect(result.current.importResult).toEqual(mockHtmlImport);
    
    // Clear result
    act(() => {
      result.current.clearImportResult();
    });
    
    expect(result.current.importResult).toBeNull();
  });
});