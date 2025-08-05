import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartConfig } from '../../types';

// Đăng ký các components cần thiết cho ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
  data: any;
  config: ChartConfig;
}

/**
 * Component hiển thị Line Chart
 */
const LineChart: React.FC<LineChartProps> = ({ data, config }) => {
  
  // Cấu hình cho chart
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 0,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0'
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };
  
  // Dữ liệu cho chart
  const chartData = {
    labels: data.labels || [],
    datasets: (data.datasets || []).map((dataset: any, index: number) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: getColor(index, 'border'),
      backgroundColor: getColor(index, 'background'),
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      fill: false
    }))
  };
  
  // Hàm lấy màu cho dataset
  function getColor(index: number, type: 'border' | 'background') {
    const colors = [
      { border: 'rgb(75, 192, 192)', background: 'rgba(75, 192, 192, 0.2)' },
      { border: 'rgb(54, 162, 235)', background: 'rgba(54, 162, 235, 0.2)' },
      { border: 'rgb(255, 99, 132)', background: 'rgba(255, 99, 132, 0.2)' },
      { border: 'rgb(255, 159, 64)', background: 'rgba(255, 159, 64, 0.2)' },
      { border: 'rgb(153, 102, 255)', background: 'rgba(153, 102, 255, 0.2)' },
      { border: 'rgb(255, 205, 86)', background: 'rgba(255, 205, 86, 0.2)' },
      { border: 'rgb(201, 203, 207)', background: 'rgba(201, 203, 207, 0.2)' }
    ];
    
    const colorIndex = index % colors.length;
    return colors[colorIndex][type];
  }
  
  return (
    <div className="line-chart-container" style={{ width: '100%', height: '100%' }}>
      {data.labels && data.labels.length > 0 ? (
        <Line
          data={chartData}
          options={chartOptions}
        />
      ) : (
        <div className="chart-no-data">No data available</div>
      )}
    </div>
  );
};

export default LineChart;