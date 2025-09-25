import React, { useEffect, useRef, useState, useMemo, memo, useCallback, Suspense, lazy } from 'react';
import { Resizable } from 'react-resizable';
import { HiOutlineMenu } from 'react-icons/hi';
import { ChartConfig, Dataset } from '../../types';
import { ChartService } from '../../services/chartService';
import './Chart.css';

// Lazy load chart components for better performance
const LineChart = lazy(() => import('./LineChart'));
const ColumnChart = lazy(() => import('./ColumnChart'));
const BarChart = lazy(() => import('./BarChart'));
const DonutChart = lazy(() => import('./DonutChart'));
const TableChart = lazy(() => import('./TableChart'));
const CardChart = lazy(() => import('./CardChart'));
const SlicerChart = lazy(() => import('./SlicerChart'));

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
const Chart: React.FC<ChartProps> = memo(({
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
  
  // Memoize chart data calculation
  const chartData = useMemo(() => {
    return ChartService.calculateChartData({
      ...config,
      dataset
    });
  }, [config, dataset]);
  
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
        return (
          <Suspense fallback={<div className="chart-loading">Loading Line Chart...</div>}>
            <LineChart {...commonProps} />
          </Suspense>
        );
      case 'column':
        return (
          <Suspense fallback={<div className="chart-loading">Loading Column Chart...</div>}>
            <ColumnChart {...commonProps} />
          </Suspense>
        );
      case 'bar':
        return (
          <Suspense fallback={<div className="chart-loading">Loading Bar Chart...</div>}>
            <BarChart {...commonProps} />
          </Suspense>
        );
      case 'donut':
        return (
          <Suspense fallback={<div className="chart-loading">Loading Donut Chart...</div>}>
            <DonutChart {...commonProps} />
          </Suspense>
        );
      case 'table':
      case 'matrix-table':
        return (
          <Suspense fallback={<div className="chart-loading">Loading Table...</div>}>
            <TableChart {...commonProps} />
          </Suspense>
        );
      case 'card':
      case 'kpi-card':
        return (
          <Suspense fallback={<div className="chart-loading">Loading Card...</div>}>
            <CardChart {...commonProps} />
          </Suspense>
        );
      case 'slicer':
        return (
          <Suspense fallback={<div className="chart-loading">Loading Slicer...</div>}>
            <SlicerChart config={config} dataset={dataset} />
          </Suspense>
        );
      default:
        return <div className="chart-error">Unsupported chart type</div>;
    }
  };
  
  // Xử lý khi người dùng thay đổi vị trí chart
  const handlePositionChange = useCallback((position: ChartConfig['position']) => {
    if (onPositionChange) {
      onPositionChange(config.id, position);
    } else if (onConfigChange) {
      onConfigChange(ChartService.updatePosition(config, position));
    }
  }, [config.id, onPositionChange, onConfigChange, config]);

  // Xử lý khi người dùng resize chart
  const handleResize = useCallback((event: any, { size }: { size: { width: number; height: number } }) => {
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
  }, [config, onUpdate, onConfigChange]);

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
});

Chart.displayName = 'Chart';

export default Chart;