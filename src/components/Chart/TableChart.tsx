import React, { useState } from 'react';
import { ChartConfig } from '../../types';
import './TableChart.css';

interface TableChartProps {
  data: any;
  config: ChartConfig;
}

/**
 * Component hiển thị Table Chart
 */
const TableChart: React.FC<TableChartProps> = ({ data, config }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Dữ liệu bảng
  const { headers, rows } = data;
  
  // Xử lý sắp xếp
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Sắp xếp dữ liệu
  const sortedRows = React.useMemo(() => {
    if (!sortConfig) return rows;
    
    return [...rows].sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      
      // Xử lý giá trị null/undefined
      if (valueA === undefined || valueA === null) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      
      if (valueB === undefined || valueB === null) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      
      // So sánh theo kiểu dữ liệu
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortConfig.direction === 'asc' ? 
          valueA.localeCompare(valueB) : 
          valueB.localeCompare(valueA);
      }
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortConfig.direction === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      if (valueA instanceof Date && valueB instanceof Date) {
        return sortConfig.direction === 'asc' ? 
          valueA.getTime() - valueB.getTime() : 
          valueB.getTime() - valueA.getTime();
      }
      
      // Mặc định chuyển đổi sang string để so sánh
      const strA = String(valueA);
      const strB = String(valueB);
      
      return sortConfig.direction === 'asc' ? 
        strA.localeCompare(strB) : 
        strB.localeCompare(strA);
    });
  }, [rows, sortConfig]);
  
  // Render bảng thông thường
  const renderTable = () => {
    return (
      <table className="table-chart" role="table">
        <thead>
          <tr>
            {headers.map((header: any) => (
              <th 
                key={header.id}
                onClick={() => handleSort(header.id)}
                className={sortConfig?.key === header.id ? `sorted-${sortConfig.direction}` : ''}
              >
                {header.label}
                {sortConfig?.key === header.id && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length > 0 ? (
            sortedRows.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                {headers.map((header: any) => (
                  <td key={`${rowIndex}-${header.id}`}>
                    {formatCellValue(row[header.id])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="no-data-cell">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  
  // Render matrix table
  const renderMatrixTable = () => {
    // Kiểm tra nếu dữ liệu phù hợp với matrix table
    if (!headers || headers.length < 2 || !rows || rows.length === 0) {
      return renderTable();
    }
    
    return (
      <table className="matrix-table-chart" role="table">
        <thead>
          <tr>
            {headers.map((header: any, index: number) => (
              <th 
                key={header.id}
                className={index === 0 ? 'matrix-row-header' : 'matrix-col-header'}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row: any, rowIndex: number) => (
            <tr key={rowIndex}>
              {headers.map((header: any, colIndex: number) => (
                <td 
                  key={`${rowIndex}-${header.id}`}
                  className={colIndex === 0 ? 'matrix-row-header' : 'matrix-data-cell'}
                >
                  {formatCellValue(row[header.id])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  // Format giá trị cell
  const formatCellValue = (value: any): string => {
    if (value === undefined || value === null) {
      return '';
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    return String(value);
  };
  
  return (
    <div className="table-chart-container">
      {config.type === 'matrix-table' ? renderMatrixTable() : renderTable()}
    </div>
  );
};

export default TableChart;