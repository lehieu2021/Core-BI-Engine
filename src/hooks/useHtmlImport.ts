import { useState, useCallback } from 'react';
import { HtmlImport } from '../types';
import { HtmlImportService } from '../services/htmlImportService';

/**
 * Hook quản lý import HTML
 */
export const useHtmlImport = () => {
  const [importResult, setImportResult] = useState<HtmlImport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Import HTML từ nội dung
   */
  const importFromHtml = useCallback((htmlContent: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = HtmlImportService.importHtml(htmlContent);
      setImportResult(result);
      
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Failed to import HTML');
      return null;
    }
  }, []);
  
  /**
   * Import HTML từ file
   */
  const importFromFile = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      // Đọc nội dung file
      const content = await readFileAsText(file);
      
      // Import từ nội dung HTML
      const result = HtmlImportService.importHtml(content);
      setImportResult(result);
      
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError('Failed to import HTML file');
      return null;
    }
  }, []);
  
  /**
   * Đọc file dưới dạng text
   */
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };
  
  /**
   * Reset trạng thái
   */
  const reset = useCallback(() => {
    setImportResult(null);
    setLoading(false);
    setError(null);
  }, []);
  
  /**
   * Clear import result
   */
  const clearImportResult = useCallback(() => {
    setImportResult(null);
  }, []);
  
  return {
    importResult,
    loading,
    error,
    importFromHtml,
    importFromFile,
    reset,
    clearImportResult
  };
};