import React from 'react';
import { ChartConfig, Dataset, Field, Measure, CalculationType } from '../types';
import { calculationFunctions } from '../data/demoData';
import './ChartConfigPanel.css';

interface ChartConfigPanelProps {
  config: ChartConfig;
  dataset: Dataset;
  onConfigChange: (updatedConfig: ChartConfig) => void;
  onClose: () => void;
}

interface ChartProperty {
  id: string;
  label: string;
  required: boolean;
  allowedTypes: string[];
  allowMultiple: boolean;
}

const ChartConfigPanel: React.FC<ChartConfigPanelProps> = ({
  config,
  dataset,
  onConfigChange,
  onClose
}) => {
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState(config.name);
  // Định nghĩa properties cho từng loại chart (giống Power BI)
  const getChartProperties = (): ChartProperty[] => {
    switch (config.type) {
      case 'column':
      case 'bar':
        return [
          { id: 'x-axis', label: 'X-Axis', required: true, allowedTypes: ['string', 'date'], allowMultiple: false },
          { id: 'y-axis', label: 'Y-Axis', required: false, allowedTypes: ['string', 'date'], allowMultiple: false },
          { id: 'value', label: 'Values', required: true, allowedTypes: ['number'], allowMultiple: false }
        ];
      case 'line':
        return [
          { id: 'x-axis', label: 'X-Axis', required: true, allowedTypes: ['string', 'date'], allowMultiple: false },
          { id: 'y-axis', label: 'Y-Axis', required: false, allowedTypes: ['string', 'date'], allowMultiple: false },
          { id: 'value', label: 'Values', required: true, allowedTypes: ['number'], allowMultiple: false }
        ];
      case 'donut':
        return [
          { id: 'category', label: 'Category', required: true, allowedTypes: ['string'], allowMultiple: false },
          { id: 'value', label: 'Values', required: true, allowedTypes: ['number'], allowMultiple: false }
        ];
      case 'table':
      case 'matrix-table':
        return [
          { id: 'columns', label: 'Columns', required: true, allowedTypes: ['string', 'number', 'date'], allowMultiple: true }
        ];
      case 'card':
      case 'kpi-card':
        return [
          { id: 'value', label: 'Value', required: true, allowedTypes: ['number'], allowMultiple: false }
        ];
      default:
        return [
          { id: 'category', label: 'Category', required: false, allowedTypes: ['string', 'date'], allowMultiple: false },
          { id: 'value', label: 'Values', required: true, allowedTypes: ['number'], allowMultiple: false }
        ];
    }
  };

  const getAvailableFields = (allowedTypes: string[]): Field[] => {
    return dataset.fields.filter(f => allowedTypes.includes(f.dataType));
  };

  const getCurrentFieldValue = (propertyId: string): string | string[] => {
    switch (propertyId) {
      case 'x-axis':
        return config.dimensions[0]?.id || '';
      case 'y-axis':
        return config.dimensions[1]?.id || '';
      case 'category':
        return config.dimensions[0]?.id || '';
      case 'value':
        return config.measures[0]?.id || '';
      case 'columns':
        return [...config.dimensions.map(d => d.id), ...config.measures.map(m => m.id)];
      default:
        return '';
    }
  };

  const getCurrentCalculation = (propertyId: string): CalculationType => {
    if (propertyId === 'value') {
      return config.measures[0]?.calculation || 'sum';
    }
    return 'sum';
  };

  const handlePropertyChange = (propertyId: string, fieldId: string, calculation: CalculationType = 'sum') => {
    const field = dataset.fields.find(f => f.id === fieldId);
    if (!field) return;

    let newDimensions = [...config.dimensions];
    let newMeasures = [...config.measures];

    switch (propertyId) {
      case 'x-axis':
        newDimensions = [field, ...newDimensions.slice(1)];
        break;
      case 'y-axis':
        if (newDimensions.length === 0) {
          newDimensions = [newDimensions[0] || dataset.fields[0], field];
        } else {
          newDimensions = [newDimensions[0], field];
        }
        break;
      case 'category':
        newDimensions = [field];
        break;
      case 'value':
        newMeasures = [{ ...field, calculation }];
        break;
    }

    onConfigChange({
      ...config,
      dimensions: newDimensions,
      measures: newMeasures
    });
  };

  const handleMultipleColumnsChange = (selectedIds: string[]) => {
    const dimensions: Field[] = [];
    const measures: Measure[] = [];

    selectedIds.forEach(id => {
      const field = dataset.fields.find(f => f.id === id);
      if (field) {
        if (field.dataType === 'number') {
          measures.push({ ...field, calculation: 'sum' });
        } else {
          dimensions.push(field);
        }
      }
    });

    onConfigChange({
      ...config,
      dimensions,
      measures
    });
  };

  const handleCalculationChange = (propertyId: string, calculation: CalculationType) => {
    if (propertyId === 'value' && config.measures[0]) {
      const newMeasures = [{ ...config.measures[0], calculation }];
      onConfigChange({
        ...config,
        measures: newMeasures
      });
    }
  };

  // Xử lý khi double click vào title để edit
  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
    setTempName(config.name);
  };

  // Xử lý khi save tên mới
  const handleNameSave = () => {
    if (tempName.trim() && tempName !== config.name) {
      onConfigChange({
        ...config,
        name: tempName.trim()
      });
    }
    setIsEditingName(false);
  };

  // Xử lý khi cancel edit
  const handleNameCancel = () => {
    setTempName(config.name);
    setIsEditingName(false);
  };

  // Xử lý keypress trong input
  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };

  const chartProperties = getChartProperties();

  return (
    <div className="chart-config-panel">
      <div className="config-header">
        {isEditingName ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleNameKeyPress}
            className="config-title-input"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 
            className="config-title editable-title" 
            onDoubleClick={handleTitleDoubleClick}
            title="Double-click to edit chart name"
          >
            {config.name}
          </h3>
        )}
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="config-content">
        {chartProperties.map(property => {
          const availableFields = getAvailableFields(property.allowedTypes);
          const currentValue = getCurrentFieldValue(property.id);
          const currentCalc = getCurrentCalculation(property.id);
          
          return (
            <div key={property.id} className="config-section">
              <h4>
                {property.label}
                {property.required && <span className="required-asterisk"> *</span>}
              </h4>
              
              {property.allowMultiple ? (
                // Multiple selection for Table columns
                <div className="multi-select-container">
                  {availableFields.map(field => (
                    <label key={field.id} className="field-checkbox">
                      <input
                        type="checkbox"
                        checked={Array.isArray(currentValue) && currentValue.includes(field.id)}
                        onChange={(e) => {
                          const currentSelected = Array.isArray(currentValue) ? currentValue : [];
                          const newSelected = e.target.checked
                            ? [...currentSelected, field.id]
                            : currentSelected.filter(id => id !== field.id);
                          handleMultipleColumnsChange(newSelected);
                        }}
                      />
                      <span className="field-name">{field.displayName || field.name}</span>
                      <span className="field-type">({field.dataType})</span>
                    </label>
                  ))}
                </div>
              ) : (
                // Single selection dropdown
                <div className="property-dropdown-container">
                  <select
                    className="property-dropdown"
                    value={typeof currentValue === 'string' ? currentValue : ''}
                    onChange={(e) => handlePropertyChange(property.id, e.target.value)}
                  >
                    <option value="">-- Select {property.label} --</option>
                    {availableFields.map(field => (
                      <option key={field.id} value={field.id}>
                        {field.displayName || field.name} ({field.dataType})
                      </option>
                    ))}
                  </select>
                  
                  {/* Show calculation dropdown for numeric values */}
                  {property.id === 'value' && typeof currentValue === 'string' && currentValue && (
                    <div className="calculation-selector">
                      <label>Calculation:</label>
                      <select
                        value={currentCalc}
                        onChange={(e) => handleCalculationChange(property.id, e.target.value as CalculationType)}
                      >
                        {calculationFunctions.map(calc => (
                          <option key={calc.value} value={calc.value} title={calc.description}>
                            {calc.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Preview section */}
        <div className="config-section">
          <h4>Current Configuration</h4>
          <div className="current-config">
            {chartProperties.map(property => {
              const currentValue = getCurrentFieldValue(property.id);
              let displayValue = '';
              
              if (Array.isArray(currentValue)) {
                const fieldNames = currentValue.map(id => {
                  const field = dataset.fields.find(f => f.id === id);
                  return field ? (field.displayName || field.name) : id;
                });
                displayValue = fieldNames.join(', ') || 'None';
              } else {
                const field = dataset.fields.find(f => f.id === currentValue);
                displayValue = field ? (field.displayName || field.name) : 'None';
                
                if (property.id === 'value' && field && displayValue !== 'None') {
                  const calc = getCurrentCalculation(property.id);
                  displayValue += ` (${calc.toUpperCase()})`;
                }
              }
              
              return (
                <div key={property.id}>
                  <strong>{property.label}:</strong> {displayValue}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartConfigPanel;