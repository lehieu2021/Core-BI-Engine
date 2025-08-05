import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChartConfig } from '../../types';

// Đăng ký các components cần thiết cho ChartJS
ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  data: any;
  config: ChartConfig;
}

/**
 * Component hiển thị Donut Chart
 */
const DonutChart: React.FC<DonutChartProps> = ({ data, config }) => {
  const chartRef = useRef<ChartJS<'doughnut'>>(null);
  
  // Cấu hình cho chart
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        align: 'center' as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            
            // Kiểm tra datasets có tồn tại không
            if (!context.chart?.data?.datasets?.[0]?.data) {
              return `${label}: ${value}`;
            }
            
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
    radius: '90%'
  };
  
  // Dữ liệu cho chart
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        data: data.datasets?.[0]?.data || [],
        backgroundColor: data.datasets?.[0]?.backgroundColor || generateColors(data.labels?.length || 0),
        borderColor: 'white',
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };
  
  // Hàm tạo màu cho chart
  function generateColors(count: number): string[] {
    const colors = [
      'rgba(75, 192, 192, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(201, 203, 207, 0.8)',
      'rgba(255, 99, 71, 0.8)',
      'rgba(46, 139, 87, 0.8)',
      'rgba(106, 90, 205, 0.8)'
    ];
    
    // Nếu cần nhiều màu hơn, tạo thêm màu ngẫu nhiên
    if (count > colors.length) {
      for (let i = colors.length; i < count; i++) {
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
      }
    }
    
    return colors.slice(0, count);
  }
  
  // Tính tổng giá trị
  const totalValue = (data.datasets?.[0]?.data || []).reduce((sum: number, value: number) => sum + value, 0);
  
  return (
    <div className="donut-chart-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {data.labels && data.labels.length > 0 ? (
        <>
          <Doughnut
            ref={chartRef}
            data={chartData}
            options={chartOptions}
          />
          <div className="donut-chart-center">
            <div className="donut-chart-total">{totalValue}</div>
            <div className="donut-chart-label">Total</div>
          </div>
        </>
      ) : (
        <div className="chart-no-data">No data available</div>
      )}
    </div>
  );
};

export default DonutChart;