import React, { useEffect, useRef, useState } from 'react';
import { Resizable } from 'react-resizable';
import { HiOutlineMenu } from 'react-icons/hi';
import { ChartConfig, Dataset } from '../../types';
import { ChartService } from '../../services/chartService';
import LineChart from './LineChart';
import ColumnChart from './ColumnChart';
import BarChart from './BarChart';
import DonutChart from './DonutChart';
import TableChart from './TableChart';
import CardChart from './CardChart';
import './Chart.css';

interface ChartProps {
  config: ChartConfig;
  dataset?: Dataset;
  onConfigChange?: (updatedConfig: ChartConfig) => void;
  draggable?: boolean;
  resizable?: boolean;
  isSelected?: boolean;
  onSelect?: (chartId: string) => void;
  onRemove?: (chartId: string) => void;
  onUpdate?: (updatedConfig: ChartConfig) => void;
  onPositionChange?: (chartId: string, position: ChartConfig['position']) => void;
  onConfig?: () => void;
}

/**
 * Component hiển thị chart
 */
const Chart: React.FC<ChartProps> = ({
  config,
  dataset,
  onConfigChange,
  draggable = false,
  resizable = false,
  isSelected,
  onSelect,
  onRemove,
  onUpdate,
  onPositionChange,
  onConfig
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(config.name);
  // Sử dụng dataset từ props
  if (!dataset) {
    console.error('Dataset is required for chart:', config.id);
    return <div className="chart-error">Dataset not found</div>;
  }
  const chartDataset = dataset;
  
  // Tính toán dữ liệu cho chart
  const chartData = ChartService.calculateChartData({
    ...config,
    dataset: chartDataset
  });
  
  // Render chart theo loại
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      config
    };
    
    // Kiểm tra nếu không có data
    const hasNoData = !chartData || 
      (chartData.labels && chartData.labels.length === 0) ||
      (chartData.datasets && chartData.datasets.length === 0);
    
    // Kiểm tra nếu không có dimensions/measures CHỈ cho chart types cần thiết
    const needsDimensionsAndMeasures = ['line', 'column', 'bar', 'donut'].includes(config.type);
    const missingDimensionsOrMeasures = needsDimensionsAndMeasures && (
      (!config.dimensions || config.dimensions.length === 0) ||
      (!config.measures || config.measures.length === 0)
    );
    
    if (hasNoData || missingDimensionsOrMeasures) {
      return (
        <div className="chart-placeholder">
          <p>No data to display</p>
          <small>Add dimensions and measures to this chart</small>
        </div>
      );
    }
    
    switch (config.type) {
      case 'line':
        return <LineChart {...commonProps} />;
      case 'column':
        return <ColumnChart {...commonProps} />;
      case 'bar':
        return <BarChart {...commonProps} />;
      case 'donut':
        return <DonutChart {...commonProps} />;
      case 'table':
      case 'matrix-table':
        return <TableChart {...commonProps} />;
      case 'card':
      case 'kpi-card':
        return <CardChart {...commonProps} />;
      default:
        return <div className="chart-error">Unsupported chart type</div>;
    }
  };
  
  // Xử lý khi người dùng thay đổi vị trí chart
  const handlePositionChange = (position: ChartConfig['position']) => {
    if (onPositionChange) {
      onPositionChange(config.id, position);
    } else if (onConfigChange) {
      onConfigChange(ChartService.updatePosition(config, position));
    }
  };

  // Xử lý khi người dùng resize chart
  const handleResize = (event: any, { size }: { size: { width: number; height: number } }) => {
    const newPosition = {
      ...config.position,
      width: size.width,
      height: size.height
    };
    
    const updatedConfig = {
      ...config,
      position: newPosition
    };
    
    if (onUpdate) {
      onUpdate(updatedConfig);
    } else if (onConfigChange) {
      onConfigChange(updatedConfig);
    }
  };

  // Xử lý khi double click vào title để edit
  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
    setTempName(config.name);
  };

  // Xử lý khi save tên mới
  const handleNameSave = () => {
    if (tempName.trim() && tempName !== config.name) {
      const updatedConfig = {
        ...config,
        name: tempName.trim()
      };
      
      if (onUpdate) {
        onUpdate(updatedConfig);
      } else if (onConfigChange) {
        onConfigChange(updatedConfig);
      }
    }
    setIsEditingName(false);
  };

  // Xử lý khi cancel edit
  const handleNameCancel = () => {
    setTempName(config.name);
    setIsEditingName(false);
  };

  // Xử lý keypress trong input
  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };
  
  const chartWidth = config.position?.width || 500;
  const chartHeight = config.position?.height || 350;

  return (
    <Resizable
      width={chartWidth}
      height={chartHeight}
      onResize={handleResize}
      minConstraints={[300, 250]}
      maxConstraints={[1200, 800]}
      resizeHandles={['se', 'e', 's']}
    >
      <div 
        className={`chart-container ${draggable ? 'draggable' : ''} ${resizable ? 'resizable' : ''} ${isSelected ? 'selected' : ''}`}
        data-chart-id={config.id}
        data-chart-type={config.type}
        data-testid="chart-container"
        onClick={() => onSelect && onSelect(config.id)}
        style={{ width: chartWidth, height: chartHeight }}
      >
        <div className={`chart-header ${isEditingName ? 'editing-name' : ''}`}>
          {isEditingName ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleNameKeyPress}
              className="chart-title-input"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3 
              className="chart-title editable-title" 
              onDoubleClick={handleTitleDoubleClick}
              title="Double-click to edit"
            >
              {config.name}
            </h3>
          )}
          <div className="chart-actions">
            {onConfig && (
              <button className="chart-action-button" title="Configure Chart" onClick={(e) => {
                e.stopPropagation();
                onConfig();
              }}>
                <HiOutlineMenu size={16} />
              </button>
            )}
            {onRemove && (
              <button className="chart-action-button" data-testid="remove-chart-button" onClick={(e) => {
                e.stopPropagation();
                onRemove && onRemove(config.id);
              }}>
                <span>×</span>
              </button>
            )}
          </div>
        </div>
        <div className="chart-content">
          {renderChart()}
        </div>
      </div>
    </Resizable>
  );
};

export default Chart;