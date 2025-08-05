import React, { useState } from 'react';
import { ChartConfig, Dataset } from '../../types';

interface SlicerChartProps {
  config: ChartConfig;
  dataset: Dataset;
  onFilterChange?: (dimension: string, selectedValues: string[]) => void;
}

const SlicerChart: React.FC<SlicerChartProps> = ({
  config,
  dataset,
  onFilterChange
}) => {
  const [selectedValues, setSelectedValues] = useState<Record<string, string[]>>({});

  // Lấy dimension đầu tiên để làm slicer
  const slicerDimension = config.dimensions[0];
  
  if (!slicerDimension || !dataset?.data) {
    return (
      <div className="slicer-chart">
        <div className="slicer-empty">
          <p>No data available for slicer</p>
        </div>
      </div>
    );
  }

  // Lấy unique values từ data
  const uniqueValues = Array.from(
    new Set(
      dataset.data
        .map(row => row[slicerDimension.id])
        .filter(value => value != null)
        .map(value => String(value))
    )
  ).sort();

  const handleValueToggle = (value: string) => {
    const currentSelected = selectedValues[slicerDimension.id] || [];
    let newSelected: string[];

    if (currentSelected.includes(value)) {
      // Remove value
      newSelected = currentSelected.filter(v => v !== value);
    } else {
      // Add value
      newSelected = [...currentSelected, value];
    }

    setSelectedValues({
      ...selectedValues,
      [slicerDimension.id]: newSelected
    });

    // Notify parent component
    if (onFilterChange) {
      onFilterChange(slicerDimension.id, newSelected);
    }
  };

  const clearAll = () => {
    setSelectedValues({
      ...selectedValues,
      [slicerDimension.id]: []
    });

    if (onFilterChange) {
      onFilterChange(slicerDimension.id, []);
    }
  };

  const selectAll = () => {
    setSelectedValues({
      ...selectedValues,
      [slicerDimension.id]: uniqueValues
    });

    if (onFilterChange) {
      onFilterChange(slicerDimension.id, uniqueValues);
    }
  };

  const currentSelected = selectedValues[slicerDimension.id] || [];

  return (
    <div className="slicer-chart">
      <div className="slicer-header">
        <h4 className="slicer-title">{slicerDimension.displayName || slicerDimension.name}</h4>
        <div className="slicer-actions">
          <button 
            className="slicer-action-btn"
            onClick={selectAll}
            title="Select All"
          >
            All
          </button>
          <button 
            className="slicer-action-btn"
            onClick={clearAll}
            title="Clear All"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="slicer-content">
        <div className="slicer-items">
          {uniqueValues.map((value, index) => (
            <div
              key={index}
              className={`slicer-item ${currentSelected.includes(value) ? 'selected' : ''}`}
              onClick={() => handleValueToggle(value)}
              title={value}
            >
              <div className="slicer-checkbox">
                {currentSelected.includes(value) && '✓'}
              </div>
              <span className="slicer-text">{value}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="slicer-footer">
        <span className="slicer-count">
          {currentSelected.length} of {uniqueValues.length} selected
        </span>
      </div>
    </div>
  );
};

export default SlicerChart;