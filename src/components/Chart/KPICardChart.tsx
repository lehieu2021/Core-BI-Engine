import React from 'react';
import { ChartConfig, Dataset } from '../../types';
import { ChartService } from '../../services/chartService';

interface KPICardChartProps {
  config: ChartConfig;
  dataset: Dataset;
}

const KPICardChart: React.FC<KPICardChartProps> = ({ config, dataset }) => {
  // Calculate the data for the KPI card
  const data = ChartService.calculateKPICardData(config, dataset);
  
  // Get the primary measure and comparison measure
  const primaryMeasure = config.measures[0];
  const comparisonMeasure = config.measures[1];
  
  if (!primaryMeasure) {
    return <div className="kpi-card-chart-empty">Please add a measure</div>;
  }

  // Format the value based on the measure's data type
  const formatValue = (value: number, measure = primaryMeasure): string => {
    if (measure.format === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    } else if (measure.format === 'percent') {
      return new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(value / 100);
    } else {
      return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
    }
  };

  // Calculate the percentage change if we have a comparison value
  const percentageChange = data.comparisonValue !== null && data.comparisonValue !== 0
    ? ((data.value - data.comparisonValue) / Math.abs(data.comparisonValue)) * 100
    : null;

  // Determine if the change is positive or negative
  const isPositive = percentageChange !== null ? percentageChange > 0 : false;
  const isNegative = percentageChange !== null ? percentageChange < 0 : false;

  return (
    <div className="kpi-card-chart">
      <div className="kpi-primary">
        <div className="kpi-value">{formatValue(data.value)}</div>
        <div className="kpi-label">{primaryMeasure.displayName || primaryMeasure.name}</div>
      </div>
      
      {comparisonMeasure && percentageChange !== null && (
        <div className="kpi-comparison">
          <div className={`kpi-change ${isPositive ? 'positive' : ''} ${isNegative ? 'negative' : ''}`}>
            {isPositive && '+'}{percentageChange.toFixed(2)}%
          </div>
          <div className="kpi-comparison-label">
            {comparisonMeasure.displayName || 'vs. Previous'}
          </div>
        </div>
      )}
    </div>
  );
};

export default KPICardChart;