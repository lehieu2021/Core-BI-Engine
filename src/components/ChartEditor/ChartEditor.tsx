import React, { useState } from 'react';
import { ChartConfig, Dataset, Field } from '../../types';
import './ChartEditor.css';

interface ChartEditorProps {
  config: ChartConfig;
  dataset: Dataset;
  onUpdateChart: (chart: ChartConfig) => void;
  onAddDimension: (chartId: string, field: Field) => void;
  onRemoveDimension: (chartId: string, fieldId: string) => void;
  onAddMeasure: (chartId: string, field: Field, calculation: string) => void;
  onRemoveMeasure: (chartId: string, fieldId: string) => void;
  onUpdateMeasure: (chartId: string, fieldId: string, calculation: string) => void;
}

const ChartEditor: React.FC<ChartEditorProps> = ({
  config,
  dataset,
  onUpdateChart,
  onAddDimension,
  onRemoveDimension,
  onAddMeasure,
  onRemoveMeasure,
  onUpdateMeasure
}) => {
  const [showDimensionDropdown, setShowDimensionDropdown] = useState(false);
  const [showMeasureDropdown, setShowMeasureDropdown] = useState(false);

  // Lọc các field có thể thêm vào dimensions (chưa được thêm)
  const availableDimensionFields = dataset.fields.filter(field => 
    !config.dimensions.some(dim => dim.id === field.id)
  );

  // Lọc các field có thể thêm vào measures (chưa được thêm và là số)
  const availableMeasureFields = dataset.fields.filter(field => 
    field.dataType === 'number' && !config.measures.some(measure => measure.id === field.id)
  );

  // Cập nhật tiêu đề chart
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateChart({
      ...config,
      name: e.target.value
    });
  };

  // Thêm dimension
  const handleAddDimension = (field: Field) => {
    onAddDimension(config.id, field);
    setShowDimensionDropdown(false);
  };

  // Xóa dimension
  const handleRemoveDimension = (fieldId: string) => {
    onRemoveDimension(config.id, fieldId);
  };

  // Thêm measure
  const handleAddMeasure = (field: Field) => {
    onAddMeasure(config.id, field, 'sum');
    setShowMeasureDropdown(false);
  };

  // Xóa measure
  const handleRemoveMeasure = (fieldId: string) => {
    onRemoveMeasure(config.id, fieldId);
  };

  // Cập nhật phép tính cho measure
  const handleUpdateMeasure = (fieldId: string, calculation: string) => {
    onUpdateMeasure(config.id, fieldId, calculation);
  };

  return (
    <div className="chart-editor">
      <h3>Edit Chart</h3>
      
      <div className="editor-section">
        <label>Title:</label>
        <input 
          type="text" 
          value={config.name} 
          onChange={handleTitleChange} 
        />
      </div>

      <div className="editor-section">
        <div className="section-header">
          <h4>Dimensions</h4>
          <button 
            data-testid="add-dimension-button"
            onClick={() => setShowDimensionDropdown(!showDimensionDropdown)}
          >
            Add Dimension
          </button>
        </div>
        
        {showDimensionDropdown && (
          <div className="dropdown">
            {availableDimensionFields.length > 0 ? (
              availableDimensionFields.map(field => (
                <div 
                  key={field.id} 
                  className="dropdown-item"
                  onClick={() => handleAddDimension(field)}
                >
                  {field.name}
                </div>
              ))
            ) : (
              <div className="dropdown-item">No available fields</div>
            )}
          </div>
        )}

        <div className="field-list">
          {config.dimensions.map(dimension => (
            <div key={dimension.id} className="field-item">
              <span>{dimension.name}</span>
              <button 
                data-testid={`remove-dimension-button-${dimension.id}`}
                onClick={() => handleRemoveDimension(dimension.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <div className="section-header">
          <h4>Measures</h4>
          <button 
            data-testid="add-measure-button"
            onClick={() => setShowMeasureDropdown(!showMeasureDropdown)}
          >
            Add Measure
          </button>
        </div>
        
        {showMeasureDropdown && (
          <div className="dropdown">
            {availableMeasureFields.length > 0 ? (
              availableMeasureFields.map(field => (
                <div 
                  key={field.id} 
                  className="dropdown-item"
                  onClick={() => handleAddMeasure(field)}
                >
                  {field.name}
                </div>
              ))
            ) : (
              <div className="dropdown-item">No available fields</div>
            )}
          </div>
        )}

        <div className="field-list">
          {config.measures.map(measure => (
            <div key={measure.id} className="field-item">
              <span>{measure.name}</span>
              <select 
                data-testid={`calculation-select-${measure.id}`}
                value={measure.calculation} 
                onChange={(e) => handleUpdateMeasure(measure.id, e.target.value)}
              >
                <option value="sum">sum</option>
                <option value="avg">avg</option>
                <option value="min">min</option>
                <option value="max">max</option>
                <option value="count">count</option>
                <option value="count-distinct">count-distinct</option>
              </select>
              <button 
                data-testid={`remove-measure-button-${measure.id}`}
                onClick={() => handleRemoveMeasure(measure.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartEditor;