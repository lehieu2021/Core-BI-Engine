import React from 'react';
import { ChartConfig, Dataset } from '../../types';
import { ChartService } from '../../services/chartService';

interface CardChartProps {
  config: ChartConfig;
  dataset: Dataset;
}

const CardChart: React.FC<CardChartProps> = ({ config, dataset }) => {
  // Calculate the data for the card
  const data = ChartService.calculateChartData({
    ...config,
    dataset
  });
  
  // Get the measure to display
  const measure = config.measures[0];
  
  if (!measure) {
    return <div className="card-chart-empty">Please add a measure</div>;
  }

  // Format the value based on the measure's data type
  const formatValue = (value: number): string => {
    if (measure.format === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    } else if (measure.format === 'percent') {
      return new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(value / 100);
    } else {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
    }
  };

  // Kiểm tra cấu trúc dữ liệu trả về từ calculateChartData
  const value = data && data.value !== undefined ? data.value : 0;
  
  return (
    <div className="card-chart" data-testid="card-chart">
      <div className="card-value">{formatValue(value)}</div>
      <div className="card-label">{measure.displayName || measure.name}</div>
    </div>
  );
};

export default CardChart;