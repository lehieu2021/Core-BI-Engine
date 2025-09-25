import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
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
import { performanceMonitor } from '../utils/performance';
import './App.css';

// Memoized Chart Type Icons Component
const ChartTypeIcons = memo(({ onAddChart, onDragStart }: {
  onAddChart: (type: ChartType) => void;
  onDragStart: (e: React.DragEvent, type: ChartType) => void;
}) => {
  const chartTypes = useMemo(() => [
    { type: 'line' as ChartType, icon: BiLineChart, label: 'Line' },
    { type: 'column' as ChartType, icon: MdOutlineInsertChart, label: 'Column' },
    { type: 'bar' as ChartType, icon: FiBarChart2, label: 'Bar' },
    { type: 'donut' as ChartType, icon: FiPieChart, label: 'Donut' },
    { type: 'table' as ChartType, icon: BiTable, label: 'Table' },
    { type: 'card' as ChartType, icon: BiCard, label: 'Card' },
    { type: 'kpi-card' as ChartType, icon: MdOutlineAnalytics, label: 'KPI Card' },
    { type: 'slicer' as ChartType, icon: MdOutlineFilterList, label: 'Slicer' }
  ], []);

  return (
    <div className="chart-type-icons">
      {chartTypes.map(({ type, icon: Icon, label }) => (
        <div 
          key={type}
          className="chart-type-item" 
          draggable={true}
          onClick={() => onAddChart(type)} 
          onDragStart={(e) => onDragStart(e, type)}
          title={`${label} Chart - ${chartConfigurations[type].description}`}
        >
          <Icon size={24} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
});

ChartTypeIcons.displayName = 'ChartTypeIcons';

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

  // Performance monitoring
  useEffect(() => {
    performanceMonitor.startMonitoring();
    performanceMonitor.recordLoadTime();
    
    return () => {
      performanceMonitor.logMetrics();
    };
  }, []);

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
  const handleCreateNew = useCallback(() => {
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
  }, [createReport, resetImport]);

  // Handler for adding a new chart
  const handleAddChart = useCallback((type: ChartType) => {
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
  }, [report, setReportDirect]);

  // Handler for removing a chart
  const handleRemoveChart = useCallback((chartId: string) => {
    removeChart(chartId);
    if (selectedChartId === chartId) {
      setSelectedChartId(null);
    }
  }, [removeChart, selectedChartId]);

  // Handler for exporting the report to HTML
  const handleExportHtml = useCallback(() => {
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
  }, [report, exportToHtml]);

  // Handler for importing HTML
  const handleImportHtml = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [importFromFile]);

  // Drag and Drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, chartType: ChartType) => {
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
  }, []);

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
              <ChartTypeIcons 
                onAddChart={handleAddChart}
                onDragStart={handleDragStart}
              />
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