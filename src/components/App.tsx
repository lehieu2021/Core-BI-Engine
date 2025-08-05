import React, { useState, useEffect } from 'react';
import { Report, ChartConfig, Dataset, ChartType, Dimension, Measure } from '../types';
import Chart from './Chart/Chart';
import { useReport } from '../hooks/useReport';
import { useHtmlImport } from '../hooks/useHtmlImport';
import { FiBarChart2, FiPieChart, FiDatabase, FiPlus, FiDownload, FiUpload } from 'react-icons/fi';
import { BiLineChart, BiTable, BiCard } from 'react-icons/bi';
import { MdOutlineInsertChart, MdOutlineAnalytics, MdOutlineFilterList } from 'react-icons/md';
import SampleDataDemo from './SampleDataDemo';
import ChartConfigPanel from './ChartConfigPanel';
import { createDemoDataset, chartConfigurations } from '../data/demoData';
import './App.css';

const App: React.FC = () => {
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null);
  const [showSampleData, setShowSampleData] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [configPanelChartId, setConfigPanelChartId] = useState<string | null>(null);
  const [isEditingReportTitle, setIsEditingReportTitle] = useState<boolean>(false);
  const [tempReportTitle, setTempReportTitle] = useState<string>('');
  const [appKey, setAppKey] = useState<number>(0); // Force re-render key
  
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
    setReportDirect,
    clearReport
  } = useReport();

  const {
    importFromHtml,
    importFromFile,
    loading: isLoading,
    error,
    reset: resetImport
  } = useHtmlImport();

  // Auto-create report on component mount
  useEffect(() => {
    if (!report) {
      createReport('New Report', 'A new BI report');
    }
  }, [report, createReport]);

  // Handler for editing report title
  const handleReportTitleDoubleClick = () => {
    if (!report) return;
    setIsEditingReportTitle(true);
    setTempReportTitle(report.name);
  };

  const handleReportTitleSave = () => {
    if (!report || !tempReportTitle.trim() || tempReportTitle === report.name) {
      setIsEditingReportTitle(false);
      return;
    }

    const updatedReport = {
      ...report,
      name: tempReportTitle.trim(),
      updatedAt: new Date()
    };
    
    setReportDirect(updatedReport);
    setIsEditingReportTitle(false);
  };

  const handleReportTitleCancel = () => {
    setTempReportTitle(report?.name || '');
    setIsEditingReportTitle(false);
  };

  const handleReportTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleReportTitleSave();
    } else if (e.key === 'Escape') {
      handleReportTitleCancel();
    }
  };

  // Handler for creating a new report
  const handleCreateReport = () => {
    createReport('New Report', 'A new BI report');
  };

  // Handler for creating new (clear current report and create fresh one)
  const handleCreateNew = () => {
    // Reset all states to initial values
    setSelectedChartId(null);
    setConfigPanelChartId(null);
    setIsEditingReportTitle(false);
    setTempReportTitle('');
    setIsDragOver(false);
    setShowSampleData(false); // Ensure we're not in sample data mode
    resetImport(); // Clear any import errors
    
    // Create a new fresh report
    createReport('New Report', 'A new BI report');
    setAppKey(prev => prev + 1); // Force complete component re-render
  };

  // Handler for adding a new chart
  const handleAddChart = (type: ChartType) => {
    if (!report) {
      return;
    }
    
    // Create or get dataset
    let dataset: Dataset;
    let updatedReport = report;
    
    if (report.datasets.length === 0) {
      dataset = createDemoDataset();
      
      // Add dataset to report immediately
      updatedReport = {
        ...report,
        datasets: [...report.datasets, dataset],
        updatedAt: new Date()
      };
    } else {
      dataset = report.datasets[0];
    }
    
    // Get chart-specific configuration
    const config = chartConfigurations[type];
    
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
    
    // Add chart to report
    const finalReport = {
      ...updatedReport,
      charts: [...updatedReport.charts, newChart],
      updatedAt: new Date()
    };
    
    // Update the report state directly with the final result
    setReportDirect(finalReport);
    setSelectedChartId(newChart.id);
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
        })
        .catch((err) => {
          console.error('Error importing HTML:', err);
        });
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, chartType: ChartType) => {
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
    
    setIsDragOver(false);
    
    // Try multiple data formats
    const chartType = e.dataTransfer.getData('application/chart-type') || 
                     e.dataTransfer.getData('text/plain') ||
                     e.dataTransfer.getData('chartType');
    
    if (chartType && chartType as ChartType) {
      try {
        handleAddChart(chartType as ChartType);
      } catch (error) {
        console.error('Error adding chart:', error);
      }
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
    <div key={appKey} className="app">
      <header className="app-header">
        <h1>Core BI Engine</h1>
        <div className="app-actions">
          {!showSampleData && (
            <>
              <button className="btn btn-danger" onClick={handleCreateNew}>
                <FiPlus className="btn-icon" />
                Tạo Mới
              </button>
              <button className="btn btn-success" onClick={handleExportHtml}>
                <FiDownload className="btn-icon" />
                Export HTML
              </button>
              <label className="btn btn-info import-btn">
                <FiUpload className="btn-icon" />
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
            className={`btn ${showSampleData ? "btn-active" : "btn-secondary"}`}
          >
            <FiDatabase className="btn-icon" />
            {showSampleData ? "Quay lại ứng dụng" : "Xem dữ liệu mẫu"}
          </button>
        </div>
      </header>

      <div className="app-container">
        {!showSampleData && (
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
                <div 
                  className="chart-type-item" 
                  draggable={true}
                  onClick={() => handleAddChart('slicer')} 
                  onDragStart={(e) => handleDragStart(e, 'slicer')}
                  title={`Slicer - ${chartConfigurations.slicer.description}`}
                >
                  <MdOutlineFilterList size={24} />
                  <span>Slicer</span>
                </div>
              </div>
            </div>
          </aside>
        )}
        
        <main className="app-content">
        {showSampleData ? (
          <SampleDataDemo />
        ) : report ? (
          <div className="report-container">
                <div className="report-header">
                  {isEditingReportTitle ? (
                    <input
                      type="text"
                      value={tempReportTitle}
                      onChange={(e) => setTempReportTitle(e.target.value)}
                      onBlur={handleReportTitleSave}
                      onKeyDown={handleReportTitleKeyPress}
                      className="report-title-input"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h2 
                      className="report-title editable-title" 
                      onDoubleClick={handleReportTitleDoubleClick}
                      title="Double-click to edit report title"
                    >
                      {report.name}
                    </h2>
                  )}
                </div>
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
                      const dataset = report.datasets.find(d => d.id === chart.datasetId) || report.datasets[0];
                      
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
        ) : (
          <div className="app-empty">
            <p>Loading...</p>
          </div>
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