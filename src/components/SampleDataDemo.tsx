import React, { useState } from 'react';
import { sampleReport, salesDataset, hrDataset } from '../data/sampleData';
import { Report, Dataset, ChartConfig } from '../types';
import Chart from './Chart/Chart';

// CSS cho component demo
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '10px 15px',
    textAlign: 'center' as const,
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '10px 5px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  buttonSecondary: {
    backgroundColor: '#2196F3',
    border: 'none',
    color: 'white',
    padding: '10px 15px',
    textAlign: 'center' as const,
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '10px 5px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  datasetSelector: {
    marginBottom: '20px',
  },
  chartContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginTop: '20px',
  },
  chartItem: {
    flex: '1 1 calc(50% - 20px)',
    minWidth: '400px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  datasetInfo: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left' as const,
    borderBottom: '1px solid #ddd',
  },
  tableCell: {
    padding: '8px',
    borderBottom: '1px solid #ddd',
  },
};

const SampleDataDemo: React.FC = () => {
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [showDataTable, setShowDataTable] = useState<boolean>(false);

  // Tải dữ liệu mẫu
  const loadSampleData = () => {
    setCurrentReport(sampleReport);
    setSelectedDataset(sampleReport.datasets[0]);
  };

  // Chọn dataset để hiển thị
  const handleSelectDataset = (datasetId: string) => {
    if (currentReport) {
      const dataset = currentReport.datasets.find(ds => ds.id === datasetId);
      if (dataset) {
        setSelectedDataset(dataset);
      }
    }
  };

  // Tìm dataset cho chart
  const getDatasetForChart = (chart: ChartConfig): Dataset | undefined => {
    if (!currentReport) return undefined;
    return currentReport.datasets.find(ds => ds.id === chart.datasetId);
  };

  // Hiển thị/ẩn bảng dữ liệu
  const toggleDataTable = () => {
    setShowDataTable(!showDataTable);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Demo Dữ Liệu Mẫu</h1>
        <p style={styles.description}>
          Component này hiển thị cách sử dụng dữ liệu mẫu trong ứng dụng Core BI Engine.
          Bạn có thể xem các biểu đồ mẫu và dữ liệu chi tiết của các dataset.
        </p>
        <button style={styles.button} onClick={loadSampleData}>
          Tải dữ liệu mẫu
        </button>
      </div>

      {currentReport && (
        <>
          <div style={styles.datasetSelector}>
            <h2>Chọn Dataset:</h2>
            <div>
              {currentReport.datasets.map(dataset => (
                <button
                  key={dataset.id}
                  style={{
                    ...styles.buttonSecondary,
                    backgroundColor: selectedDataset?.id === dataset.id ? '#4CAF50' : '#2196F3',
                  }}
                  onClick={() => handleSelectDataset(dataset.id)}
                >
                  {dataset.name}
                </button>
              ))}
              <button style={styles.buttonSecondary} onClick={toggleDataTable}>
                {showDataTable ? 'Ẩn bảng dữ liệu' : 'Hiển thị bảng dữ liệu'}
              </button>
            </div>
          </div>

          <h2>Biểu đồ mẫu:</h2>
          <div style={styles.chartContainer}>
            {currentReport.charts.map(chart => {
              const dataset = getDatasetForChart(chart);
              if (!dataset) return null;
              
              return (
                <div key={chart.id} style={styles.chartItem}>
                  <h3>{chart.title}</h3>
                  <Chart config={chart} dataset={dataset} />
                </div>
              );
            })}
          </div>

          {selectedDataset && showDataTable && (
            <div style={styles.datasetInfo}>
              <h2>Chi tiết Dataset: {selectedDataset.name}</h2>
              <p>Số lượng bản ghi: {selectedDataset.data.length}</p>
              <p>Các trường dữ liệu:</p>
              <ul>
                {selectedDataset.fields.map(field => (
                  <li key={field.id}>
                    {field.displayName || field.name} ({field.dataType})
                  </li>
                ))}
              </ul>
              
              <h3>Dữ liệu:</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.dataTable}>
                  <thead>
                    <tr>
                      {selectedDataset.fields.map(field => (
                        <th key={field.id} style={styles.tableHeader}>
                          {field.displayName || field.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDataset.data.map((row, index) => (
                      <tr key={index}>
                        {selectedDataset.fields.map(field => (
                          <td key={field.id} style={styles.tableCell}>
                            {row[field.id]?.toString()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!currentReport && (
        <div>
          <p>Nhấn nút "Tải dữ liệu mẫu" để xem demo.</p>
        </div>
      )}
    </div>
  );
};

export default SampleDataDemo;