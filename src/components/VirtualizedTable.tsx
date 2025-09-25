import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualizedTableProps {
  data: any[];
  headers: Array<{ id: string; label: string }>;
  height?: number;
  itemHeight?: number;
  width?: number;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    items: any[];
    headers: Array<{ id: string; label: string }>;
  };
}

// Memoized row component for better performance
const TableRow = memo<RowProps>(({ index, style, data }) => {
  const { items, headers } = data;
  const item = items[index];

  return (
    <div style={style} className="virtualized-table-row">
      {headers.map((header) => (
        <div key={header.id} className="virtualized-table-cell">
          {item[header.id]}
        </div>
      ))}
    </div>
  );
});

TableRow.displayName = 'TableRow';

// Memoized header component
const TableHeader = memo<{ headers: Array<{ id: string; label: string }> }>(({ headers }) => (
  <div className="virtualized-table-header">
    {headers.map((header) => (
      <div key={header.id} className="virtualized-table-header-cell">
        {header.label}
      </div>
    ))}
  </div>
));

TableHeader.displayName = 'TableHeader';

/**
 * Virtualized table component for handling large datasets efficiently
 */
const VirtualizedTable: React.FC<VirtualizedTableProps> = memo(({
  data,
  headers,
  height = 400,
  itemHeight = 40,
  width = '100%'
}) => {
  // Memoize the item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    items: data,
    headers
  }), [data, headers]);

  // Memoize the row renderer
  const Row = useCallback((props: RowProps) => (
    <TableRow {...props} data={itemData} />
  ), [itemData]);

  if (!data || data.length === 0) {
    return (
      <div className="virtualized-table-container" style={{ height, width }}>
        <TableHeader headers={headers} />
        <div className="virtualized-table-empty">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="virtualized-table-container" style={{ width }}>
      <TableHeader headers={headers} />
      <List
        height={height - 40} // Subtract header height
        itemCount={data.length}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={5} // Render 5 extra items for smooth scrolling
      >
        {Row}
      </List>
    </div>
  );
});

VirtualizedTable.displayName = 'VirtualizedTable';

export default VirtualizedTable;