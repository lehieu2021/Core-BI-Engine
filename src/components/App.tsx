import React, { useState } from 'react';
import { Report, ChartConfig, Dataset, ChartType, Dimension, Measure } from '../types';
import Chart from './Chart/Chart';
import { useReport } from '../hooks/useReport';
import { useHtmlImport } from '../hooks/useHtmlImport';
import { FiBarChart2, FiPieChart, FiDatabase } from 'react-icons/fi';
import { BiLineChart, BiTable, BiCard } from 'react-icons/bi';
import { MdOutlineInsertChart, MdOutlineAnalytics } from 'react-icons/md';
import SampleDataDemo from './SampleDataDemo';
import ChartConfigPanel from './ChartConfigPanel';
import { createDemoDataset, chartConfigurations } from '../data/demoData';
import './App.css';

const App: React.FC = () => {
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  const [showSampleData, setShowSampleData] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [configPanelChartId, setConfigPanelChartId] = useState<string | null>(null);
  
  const {
    report,
    createReport,
    addChart,
    removeChart,
    updateChart,
    addDataset,
    updateDataset,
    updateLayout,
    saveReport,
    loadReport,
    exportToHtml,
    setReportDirect
  } = useReport();

  const {
    importFromHtml,
    importFromFile,
    loading: isLoading,
    error,
    reset: resetImport
  } = useHtmlImport();

  // Handler for creating a new report
  const handleCreateReport = () => {
    createReport('New Report', 'A new BI report');
  };

  // Handler for adding a new chart
  const handleAddChart = (type: ChartType) => {
    console.log('handleAddChart called with type:', type);
    console.log('Current report:', report);
    
    if (!report) {
      console.error('No report found');
      return;
    }
    
    // Create or get dataset
    let dataset: Dataset;
    let updatedReport = report;
    
    if (report.datasets.length === 0) {
      console.log('Creating new demo dataset');
      dataset = createDemoDataset();
      console.log('Dataset created:', dataset);
      
      // Add dataset to report immediately
      updatedReport = {
        ...report,
        datasets: [...report.datasets, dataset],
        updatedAt: new Date()
      };
      console.log('Updated report with dataset:', updatedReport);
    } else {
      dataset = report.datasets[0];
      console.log('Using existing dataset:', dataset);
    }
    
    // Get chart-specific configuration
    const config = chartConfigurations[type];
    console.log('Chart config:', config);
    
    // Configure dimensions based on chart type
    const dimensions = config.defaultDimensions.map((fieldId: string) => {
      const field = dataset.fields.find(f => f.id === fieldId);
      return field ? { ...field } : null;
    }).filter((dim): dim is Dimension => dim !== null);
    
    // Configure measures based on chart type
    const measures = config.defaultMeasures.map((measureConfig: { field: string; calculation: any }) => {
      const field = dataset.fields.find(f => f.id === measureConfig.field);
      return field ? {
        ...field,
        calculation: measureConfig.calculation
      } : null;
    }).filter((measure): measure is Measure => measure !== null);
    
    console.log('Configured dimensions:', dimensions);
    console.log('Configured measures:', measures);
    
    // Create chart with configuration
    const chartName = `New ${type} Chart`;
    const newChart: ChartConfig = {
      id: `chart-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: type,
      name: chartName,
      datasetId: dataset.id,
      dimensions,
      measures,
      options: {},
      position: {
        x: Math.random() * 200,
        y: Math.random() * 200,
        width: 350,
        height: 300
      }
    };
    
    console.log('Created chart:', newChart);
    
    // Add chart to report
    const finalReport = {
      ...updatedReport,
      charts: [...updatedReport.charts, newChart],
      updatedAt: new Date()
    };
    
    console.log('Final report with new chart:', finalReport);
    
    // Update the report state directly with the final result
    console.log('Setting report directly to:', finalReport);
    setReportDirect(finalReport);
    
    setSelectedChartId(newChart.id);
    console.log('Selected chart ID set to:', newChart.id);
  };

  // Handler for removing a chart
  const handleRemoveChart = (chartId: string) => {
    removeChart(chartId);
    if (selectedChartId === chartId) {
      setSelectedChartId(null);
    }
  };

  // Handler for exporting the report to HTML
  const handleExportHtml = () => {
    if (!report) return;
    
    const htmlContent = exportToHtml();
    
    if (!htmlContent) return;
    
    // Create a download link
    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${report.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handler for importing HTML
  const handleImportHtml = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      importFromFile(files[0])
        .then((importedReport) => {
          // The useHtmlImport hook will handle updating the report state
          console.log('Imported report:', importedReport);
        })
        .catch((err) => {
          console.error('Error importing HTML:', err);
        });
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, chartType: ChartType) => {
    console.log('Drag started:', chartType);
    e.dataTransfer.setData('application/chart-type', chartType);
    e.dataTransfer.setData('text/plain', chartType); // Fallback for compatibility
    e.dataTransfer.effectAllowed = 'copy';
    
    // Add visual feedback
    const target = e.currentTarget as HTMLElement;
    target.classList.add('dragging');
    
    // Remove visual feedback after drag
    setTimeout(() => {
      target.classList.remove('dragging');
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set drag over to false if we're leaving the actual drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Drop event triggered');
    
    setIsDragOver(false);
    
    // Try multiple data formats
    const chartType = e.dataTransfer.getData('application/chart-type') || 
                     e.dataTransfer.getData('text/plain') ||
                     e.dataTransfer.getData('chartType');
    
    console.log('Retrieved chart type:', chartType);
    
    if (chartType && chartType as ChartType) {
      console.log('Adding chart:', chartType);
      try {
        handleAddChart(chartType as ChartType);
        console.log('Chart added successfully');
      } catch (error) {
        console.error('Error adding chart:', error);
      }
    } else {
      console.log('No valid chart type found in drop data');
    }
  };

  // Handler for chart configuration
  const handleChartConfig = (chartId: string) => {
    setConfigPanelChartId(chartId);
  };

  const handleConfigPanelClose = () => {
    setConfigPanelChartId(null);
  };

  const handleConfigChange = (updatedConfig: ChartConfig) => {
    updateChart(updatedConfig);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Core BI Engine</h1>
        <div className="app-actions">
          {!report && !showSampleData && (
            <button onClick={handleCreateReport}>Create New Report</button>
          )}
          {report && !showSampleData && (
            <>
              <button onClick={handleExportHtml}>Export to HTML</button>
              <label className="import-label">
                Import HTML
                <input 
                  type="file" 
                  accept=".html" 
                  onChange={handleImportHtml} 
                  style={{ display: 'none' }} 
                />
              </label>
            </>
          )}
          <button 
            onClick={() => setShowSampleData(!showSampleData)}
            className={showSampleData ? "active-button" : ""}
          >
            <FiDatabase style={{ marginRight: '5px' }} />
            {showSampleData ? "Quay lại ứng dụng" : "Xem dữ liệu mẫu"}
          </button>
        </div>
      </header>

      <div className="app-container">
        {report && (
          <aside className="chart-sidebar">
            <div className="sidebar-section">
              <h3>Chart Types</h3>
              <p className="sidebar-hint">Click or drag chart types to add them</p>
              <div className="chart-type-icons">
                <div 
                  className="chart-type-item" 
                  draggable={true}
                  onClick={() => handleAddChart('line')} 
                  onDragStart={(e) => handleDragStart(e, 'line')}
                  title={`Line Chart - ${chartConfigurations.line.description}`}
                >
                  <BiLineChart size={24} />
                  <span>Line</span>
                </div>
                <div 
                  className="chart-type-item" 
                  draggable={true}
                  onClick={() => handleAddChart('column')} 
                  onDragStart={(e) => handleDragStart(e, 'column')}
                  title={`Column Chart - ${chartConfigurations.column.description}`}
                >
                  <MdOutlineInsertChart size={24} />
                  <span>Column</span>
                </div>
                <div 
                  className="chart-type-item" 
                  draggable={true}
                  onClick={() => handleAddChart('bar')} 
                  onDragStart={(e) => handleDragStart(e, 'bar')}
                  title={`Bar Chart - ${chartConfigurations.bar.description}`}
                >
                  <FiBarChart2 size={24} />
                  <span>Bar</span>
                </div>
                <div 
                  className="chart-type-item" 
                  draggable={true}
                  onClick={() => handleAddChart('donut')} 
                  onDragStart={(e) => handleDragStart(e, 'donut')}
                  title={`Donut Chart - ${chartConfigurations.donut.description}`}
                >
                  <FiPieChart size={24} />
                  <span>Donut</span>
                </div>
                <div 
                  className="chart-type-item" 
                  draggable={true}
                  onClick={() => handleAddChart('table')} 
                  onDragStart={(e) => handleDragStart(e, 'table')}
                  title={`Table - ${chartConfigurations.table.description}`}
                >
                  <BiTable size={24} />
                  <span>Table</span>
                </div>
                <div 
                  className="chart-type-item" 
                  draggable={true}
                  onClick={() => handleAddChart('card')} 
                  onDragStart={(e) => handleDragStart(e, 'card')}
                  title={`Card - ${chartConfigurations.card.description}`}
                >
                  <BiCard size={24} />
                  <span>Card</span>
                </div>
                <div 
                  className="chart-type-item" 
                  draggable={true}
                  onClick={() => handleAddChart('kpi-card')} 
                  onDragStart={(e) => handleDragStart(e, 'kpi-card')}
                  title={`KPI Card - ${chartConfigurations['kpi-card'].description}`}
                >
                  <MdOutlineAnalytics size={24} />
                  <span>KPI Card</span>
                </div>
              </div>
            </div>
          </aside>
        )}
        
        <main className="app-content">
        {showSampleData ? (
          <SampleDataDemo />
        ) : (
          <>
            {!report && (
              <div className="app-empty">
                <p>No report created yet. Click "Create New Report" to get started.</p>
              </div>
            )}

            {report && (
              <div className="report-container">
                <h2>{report.name}</h2>
                <p>{report.description}</p>
                

                
                <div 
                  className={`charts-container ${isDragOver ? 'drag-over' : ''}`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {report.charts.length === 0 ? (
                    <div className="drop-zone-empty">
                      <div className="drop-zone-content">
                        <FiBarChart2 size={48} />
                        <h3>Drag chart types here</h3>
                        <p>Drag and drop chart types from the sidebar or click them to add to your report</p>
                      </div>
                    </div>
                  ) : (
                    report.charts.map((chart) => {
                      console.log('Rendering chart:', chart);
                      const dataset = report.datasets.find(d => d.id === chart.datasetId) || report.datasets[0];
                      console.log('Chart dataset:', dataset);
                      
                      return (
                        <Chart
                          key={chart.id}
                          config={chart}
                          dataset={dataset}
                          isSelected={selectedChartId === chart.id}
                          onSelect={() => setSelectedChartId(chart.id)}
                          onRemove={() => handleRemoveChart(chart.id)}
                          onUpdate={(updatedConfig) => updateChart(updatedConfig)}
                          onPositionChange={(chartId, position) => {
                            updateChart({
                              ...chart,
                              position
                            });
                          }}
                          onConfig={() => handleChartConfig(chart.id)}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {isLoading && <div className="loading-overlay">Importing HTML...</div>}
        
        {error && (
          <div className="error-message">
            <p>Error importing HTML: {error}</p>
            <button onClick={resetImport}>Dismiss</button>
          </div>
        )}
      </main>
      </div>

      {/* Chart Configuration Panel */}
      {configPanelChartId && report && (
        <>
          <div className="modal-backdrop" onClick={handleConfigPanelClose}></div>
          <ChartConfigPanel
            config={report.charts.find(c => c.id === configPanelChartId)!}
            dataset={report.datasets.find(d => d.id === report.charts.find(c => c.id === configPanelChartId)?.datasetId) || report.datasets[0]}
            onConfigChange={handleConfigChange}
            onClose={handleConfigPanelClose}
          />
        </>
      )}
    </div>
  );
};

export default App;