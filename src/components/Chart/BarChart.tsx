import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartConfig } from '../../types';

// Đăng ký các components cần thiết cho ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: any;
  config: ChartConfig;
}

/**
 * Component hiển thị Bar Chart (ngang)
 */
const BarChart: React.FC<BarChartProps> = ({ data, config }) => {
  
  // Cấu hình cho chart
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 0,
    indexAxis: 'y' as const, // Đây là điểm khác biệt chính với Column Chart
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'rect'
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
        beginAtZero: true,
        grid: {
          color: '#f0f0f0'
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'y' as const,
      intersect: false
    },
    barPercentage: 0.8,
    categoryPercentage: 0.7
  };
  
  // Dữ liệu cho chart
  const chartData = {
    labels: data.labels || [],
    datasets: (data.datasets || []).map((dataset: any, index: number) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: getColor(index, 'background'),
      borderColor: getColor(index, 'border'),
      borderWidth: 1,
      borderRadius: 4,
      hoverBackgroundColor: getColor(index, 'hoverBackground')
    }))
  };
  
  // Hàm lấy màu cho dataset
  function getColor(index: number, type: 'background' | 'border' | 'hoverBackground') {
    const colors = [
      { 
        background: 'rgba(75, 192, 192, 0.7)',
        border: 'rgb(75, 192, 192)',
        hoverBackground: 'rgba(75, 192, 192, 0.9)'
      },
      { 
        background: 'rgba(54, 162, 235, 0.7)',
        border: 'rgb(54, 162, 235)',
        hoverBackground: 'rgba(54, 162, 235, 0.9)'
      },
      { 
        background: 'rgba(255, 99, 132, 0.7)',
        border: 'rgb(255, 99, 132)',
        hoverBackground: 'rgba(255, 99, 132, 0.9)'
      },
      { 
        background: 'rgba(255, 159, 64, 0.7)',
        border: 'rgb(255, 159, 64)',
        hoverBackground: 'rgba(255, 159, 64, 0.9)'
      },
      { 
        background: 'rgba(153, 102, 255, 0.7)',
        border: 'rgb(153, 102, 255)',
        hoverBackground: 'rgba(153, 102, 255, 0.9)'
      },
      { 
        background: 'rgba(255, 205, 86, 0.7)',
        border: 'rgb(255, 205, 86)',
        hoverBackground: 'rgba(255, 205, 86, 0.9)'
      },
      { 
        background: 'rgba(201, 203, 207, 0.7)',
        border: 'rgb(201, 203, 207)',
        hoverBackground: 'rgba(201, 203, 207, 0.9)'
      }
    ];
    
    const colorIndex = index % colors.length;
    return colors[colorIndex][type];
  }
  
  return (
    <div className="bar-chart-container" style={{ width: '100%', height: '100%' }}>
      {data.labels && data.labels.length > 0 ? (
        <Bar
          data={chartData}
          options={chartOptions}
        />
      ) : (
        <div className="chart-no-data">No data available</div>
      )}
    </div>
  );
};

export default BarChart;