// Column Definitions (colDefs) Examples for GraviGrid
// This file contains comprehensive examples of various column definition patterns

import type { ComponentExample } from "../../index.js";

export const COLDEFS_EXAMPLES: ComponentExample[] = [
  {
    name: "Basic Column Definitions",
    description: "Simple field mappings with headers and basic formatting",
    category: "data",
    complexity: "basic",
    tags: ["columns", "basic", "fields", "headers"],
    code: `// Basic column definitions with field and headerName
const basicColumns = [
  {
    field: 'id',
    headerName: 'ID',
    maxWidth: 80
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150
  },
  {
    field: 'email',
    headerName: 'Email Address',
    width: 200
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100
  }
];

// Usage in GraviGrid
<GraviGrid
  columnDefs={basicColumns}
  rowData={data}
  getRowId={(row) => row.id}
/>`,
  },

  {
    name: "Formatted Data Columns",
    description:
      "Columns with value formatters for dates, numbers, and currency",
    category: "data",
    complexity: "intermediate",
    tags: ["formatting", "dates", "currency", "numbers"],
    code: `const formattedColumns = [
  {
    field: 'orderId',
    headerName: 'Order #',
    maxWidth: 100
  },
  {
    field: 'customerName',
    headerName: 'Customer',
    width: 180
  },
  {
    field: 'orderDate',
    headerName: 'Order Date',
    width: 120,
    valueFormatter: ({ value }) => {
      return value ? new Date(value).toLocaleDateString() : '';
    }
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 120,
    valueFormatter: ({ value }) => {
      return value ? \`$\${value.toFixed(2)}\` : '$0.00';
    }
  },
  {
    field: 'quantity',
    headerName: 'Qty',
    width: 80,
    valueFormatter: ({ value }) => {
      return value?.toLocaleString() || '0';
    }
  },
  {
    field: 'percentage',
    headerName: 'Completion',
    width: 100,
    valueFormatter: ({ value }) => {
      return value ? \`\${(value * 100).toFixed(1)}%\` : '0%';
    }
  }
];`,
  },

  {
    name: "Filterable Columns",
    description:
      "Columns with different filter types (date, number, text, set)",
    category: "data",
    complexity: "intermediate",
    tags: ["filters", "search", "date-filter", "number-filter"],
    code: `const filterableColumns = [
  {
    field: 'productName',
    headerName: 'Product',
    width: 150,
    filter: 'agTextColumnFilter', // Text search
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true
    }
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 120,
    filter: 'agNumberColumnFilter', // Number range filter
    valueFormatter: ({ value }) => \`$\${value?.toFixed(2) || '0.00'}\`
  },
  {
    field: 'createdDate',
    headerName: 'Created',
    width: 140,
    filter: 'agDateColumnFilter', // Date range filter
    valueFormatter: ({ value }) => {
      return value ? new Date(value).toLocaleDateString() : '';
    }
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 120,
    filter: 'agSetColumnFilter', // Multi-select filter
    filterParams: {
      values: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports']
    }
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    filter: 'agSetColumnFilter',
    filterParams: {
      values: ['Active', 'Inactive', 'Pending', 'Completed']
    }
  }
];`,
  },

  {
    name: "Custom Cell Renderers",
    description:
      "Columns with custom React components for rendering complex content",
    category: "ui",
    complexity: "advanced",
    tags: ["cell-renderer", "components", "badges", "buttons", "custom"],
    code: `import { Badge, Button, Switch, Tag } from 'antd';

const customRendererColumns = [
  {
    field: 'id',
    headerName: 'ID',
    maxWidth: 80
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    cellRenderer: ({ value }) => {
      const color = value === 'Active' ? 'green' : 
                   value === 'Pending' ? 'orange' : 'red';
      return <Tag color={color}>{value}</Tag>;
    }
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 100,
    cellRenderer: ({ value }) => {
      const count = value === 'High' ? 3 : value === 'Medium' ? 2 : 1;
      const color = value === 'High' ? '#ff4d4f' : 
                   value === 'Medium' ? '#faad14' : '#52c41a';
      return <Badge count={count} style={{ backgroundColor: color }} />;
    }
  },
  {
    field: 'isActive',
    headerName: 'Enabled',
    width: 100,
    cellRenderer: ({ value, data, node }) => {
      return (
        <Switch
          checked={value}
          size="small"
          onChange={(checked) => {
            if (node) {
              node.setDataValue('isActive', checked);
            }
          }}
        />
      );
    }
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    cellRenderer: ({ data }) => {
      return (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="small" type="primary">Edit</Button>
          <Button size="small" danger>Delete</Button>
        </div>
      );
    }
  }
];`,
  },

  {
    name: "Selection and Checkbox Columns",
    description: "Columns for row selection with checkboxes and row numbering",
    category: "interactive",
    complexity: "intermediate",
    tags: ["selection", "checkbox", "row-number"],
    code: `const selectionColumns = [
  {
    headerName: '',
    field: 'checkbox',
    maxWidth: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    pinned: 'left',
    sortable: false,
    suppressMenu: true
  },
  {
    headerName: '#',
    valueGetter: (params) => params.node?.rowIndex + 1,
    maxWidth: 60,
    pinned: 'left',
    sortable: false,
    suppressMenu: true
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150
  },
  {
    field: 'department',
    headerName: 'Department',
    width: 120
  },
  {
    field: 'role',
    headerName: 'Role',
    width: 120
  }
];

// Usage with selection handling
<GraviGrid
  columnDefs={selectionColumns}
  rowData={data}
  rowSelection="multiple"
  onSelectionChanged={(event) => {
    const selectedRows = event.api.getSelectedRows();
    console.log('Selected:', selectedRows);
  }}
/>`,
  },

  {
    name: "Pinned Columns",
    description: "Columns pinned to left or right side of the grid",
    category: "layout",
    complexity: "intermediate",
    tags: ["pinned", "fixed", "layout"],
    code: `const pinnedColumns = [
  // Left pinned columns
  {
    field: 'id',
    headerName: 'ID',
    maxWidth: 80,
    pinned: 'left'
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    pinned: 'left'
  },
  
  // Scrollable middle columns
  {
    field: 'description',
    headerName: 'Description',
    width: 300
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 120
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 100,
    valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\`
  },
  {
    field: 'stock',
    headerName: 'Stock',
    width: 100
  },
  
  // Right pinned actions column
  {
    headerName: 'Actions',
    width: 120,
    pinned: 'right',
    cellRenderer: ({ data }) => (
      <Button size="small" type="link">View Details</Button>
    )
  }
];`,
  },

  {
    name: "Sortable and Comparable Columns",
    description: "Columns with custom sorting logic and comparators",
    category: "data",
    complexity: "advanced",
    tags: ["sorting", "comparator", "custom-sort"],
    code: `const sortableColumns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    sortable: true,
    // Case-insensitive string sorting
    comparator: (valueA, valueB) => {
      const a = (valueA || '').toLowerCase();
      const b = (valueB || '').toLowerCase();
      return a.localeCompare(b);
    }
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 100,
    sortable: true,
    // Custom priority order
    comparator: (valueA, valueB) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const a = priorityOrder[valueA] || 0;
      const b = priorityOrder[valueB] || 0;
      return a - b;
    }
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 120,
    sortable: true,
    // Numeric sorting with null handling
    comparator: (valueA, valueB) => {
      const a = valueA || 0;
      const b = valueB || 0;
      return a - b;
    },
    valueFormatter: ({ value }) => \`$\${value?.toFixed(2) || '0.00'}\`
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    sortable: true,
    // Date sorting
    comparator: (valueA, valueB) => {
      const a = valueA ? new Date(valueA).getTime() : 0;
      const b = valueB ? new Date(valueB).getTime() : 0;
      return a - b;
    },
    valueFormatter: ({ value }) => {
      return value ? new Date(value).toLocaleDateString() : '';
    }
  }
];`,
  },

  {
    name: "Editable Columns",
    description: "Columns with inline editing capabilities",
    category: "interactive",
    complexity: "advanced",
    tags: ["editable", "inline-edit", "cell-editor"],
    code: `const editableColumns = [
  {
    field: 'id',
    headerName: 'ID',
    maxWidth: 80,
    editable: false // Read-only
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
    cellEditor: 'agTextCellEditor'
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
    editable: true,
    cellEditor: 'agTextCellEditor',
    cellEditorParams: {
      maxLength: 100
    }
  },
  {
    field: 'age',
    headerName: 'Age',
    width: 80,
    editable: true,
    cellEditor: 'agNumberCellEditor',
    cellEditorParams: {
      min: 18,
      max: 100
    }
  },
  {
    field: 'department',
    headerName: 'Department',
    width: 150,
    editable: true,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance']
    }
  },
  {
    field: 'active',
    headerName: 'Active',
    width: 100,
    editable: true,
    cellRenderer: ({ value }) => value ? 'Yes' : 'No',
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: [true, false],
      valueListGap: 0,
      valueListMaxHeight: 50
    }
  }
];

// Usage with edit handling
<GraviGrid
  columnDefs={editableColumns}
  rowData={data}
  onCellValueChanged={(event) => {
    console.log('Cell changed:', {
      field: event.colDef.field,
      oldValue: event.oldValue,
      newValue: event.newValue,
      data: event.data
    });
  }}
/>`,
  },

  {
    name: "Value Getters and Setters",
    description: "Columns with computed values and custom data transformation",
    category: "data",
    complexity: "advanced",
    tags: ["value-getter", "computed", "transformation"],
    code: `const computedColumns = [
  {
    field: 'firstName',
    headerName: 'First Name',
    width: 120
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    width: 120
  },
  {
    headerName: 'Full Name',
    colId: 'fullName',
    width: 200,
    // Computed from other fields
    valueGetter: ({ data }) => {
      if (!data) return '';
      return \`\${data.firstName || ''} \${data.lastName || ''}\`.trim();
    }
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 100,
    valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\`
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    width: 100
  },
  {
    headerName: 'Total',
    colId: 'total',
    width: 120,
    // Computed total
    valueGetter: ({ data }) => {
      if (!data?.price || !data?.quantity) return 0;
      return data.price * data.quantity;
    },
    valueFormatter: ({ value }) => \`$\${value?.toFixed(2) || '0.00'}\`
  },
  {
    headerName: 'Status Badge',
    colId: 'statusDisplay',
    width: 120,
    // Transform data for display
    valueGetter: ({ data }) => {
      if (!data?.status) return 'Unknown';
      return data.status.charAt(0).toUpperCase() + data.status.slice(1);
    }
  }
];`,
  },

  {
    name: "Conditional Column Styling",
    description: "Columns with conditional styling based on data values",
    category: "ui",
    complexity: "advanced",
    tags: ["styling", "conditional", "cell-style", "highlighting"],
    code: `const styledColumns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 150
  },
  {
    field: 'score',
    headerName: 'Score',
    width: 100,
    cellStyle: (params) => {
      const value = params.value;
      if (value >= 90) {
        return { backgroundColor: '#d4edda', color: '#155724' }; // Green
      } else if (value >= 70) {
        return { backgroundColor: '#fff3cd', color: '#856404' }; // Yellow
      } else {
        return { backgroundColor: '#f8d7da', color: '#721c24' }; // Red
      }
    }
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    cellStyle: (params) => {
      switch (params.value) {
        case 'Completed':
          return { backgroundColor: '#d1ecf1', color: '#0c5460' };
        case 'In Progress':
          return { backgroundColor: '#ffeaa7', color: '#856404' };
        case 'Failed':
          return { backgroundColor: '#f5c6cb', color: '#721c24' };
        default:
          return {};
      }
    }
  },
  {
    field: 'amount',
    headerName: 'Amount',
    width: 120,
    valueFormatter: ({ value }) => \`$\${value?.toFixed(2)}\`,
    cellStyle: (params) => {
      const value = params.value || 0;
      // Highlight high values
      if (value > 1000) {
        return { 
          backgroundColor: '#e7f3ff', 
          color: '#0066cc',
          fontWeight: 'bold'
        };
      }
      return {};
    }
  },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 100,
    cellClass: (params) => {
      // CSS class-based styling
      switch (params.value) {
        case 'High': return 'priority-high';
        case 'Medium': return 'priority-medium';
        case 'Low': return 'priority-low';
        default: return '';
      }
    }
  }
];

// CSS classes for priority styling
const gridStyles = \`
.priority-high {
  background-color: #ffebee !important;
  color: #c62828 !important;
  font-weight: bold;
}

.priority-medium {
  background-color: #fff8e1 !important;
  color: #f57f17 !important;
}

.priority-low {
  background-color: #e8f5e8 !important;
  color: #2e7d32 !important;
}
\`;`,
  },

  {
    name: "Complete Feature Grid Columns",
    description: "Real-world example with all common column patterns combined",
    category: "data",
    complexity: "advanced",
    tags: ["complete", "real-world", "production", "feature"],
    code: `import { Button, Tag, Switch, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

const productManagementColumns = [
  // Selection checkbox
  {
    headerName: '',
    field: 'selection',
    maxWidth: 50,
    checkboxSelection: true,
    headerCheckboxSelection: true,
    pinned: 'left',
    sortable: false,
    suppressMenu: true
  },
  
  // ID column (pinned)
  {
    field: 'id',
    headerName: 'ID',
    maxWidth: 80,
    pinned: 'left',
    sortable: true
  },
  
  // Main data columns
  {
    field: 'name',
    headerName: 'Product Name',
    width: 200,
    sortable: true,
    filter: 'agTextColumnFilter',
    editable: true,
    cellEditor: 'agTextCellEditor'
  },
  
  {
    field: 'category',
    headerName: 'Category',
    width: 120,
    filter: 'agSetColumnFilter',
    filterParams: {
      values: ['Electronics', 'Clothing', 'Books', 'Home']
    }
  },
  
  {
    field: 'price',
    headerName: 'Price',
    width: 100,
    filter: 'agNumberColumnFilter',
    editable: true,
    cellEditor: 'agNumberCellEditor',
    valueFormatter: ({ value }) => \`$\${value?.toFixed(2) || '0.00'}\`,
    cellStyle: (params) => {
      return params.value > 100 ? 
        { backgroundColor: '#e7f3ff', fontWeight: 'bold' } : {};
    }
  },
  
  {
    field: 'stock',
    headerName: 'Stock',
    width: 80,
    filter: 'agNumberColumnFilter',
    editable: true,
    cellStyle: (params) => {
      const value = params.value || 0;
      if (value === 0) {
        return { backgroundColor: '#ffebee', color: '#c62828' };
      } else if (value < 10) {
        return { backgroundColor: '#fff3e0', color: '#e65100' };
      }
      return {};
    }
  },
  
  {
    field: 'isActive',
    headerName: 'Active',
    width: 80,
    cellRenderer: ({ value, data, node }) => (
      <Switch
        checked={value}
        size="small"
        onChange={(checked) => {
          if (node) {
            node.setDataValue('isActive', checked);
          }
        }}
      />
    ),
    filter: 'agSetColumnFilter',
    filterParams: {
      values: [true, false],
      valueFormatter: ({ value }) => value ? 'Active' : 'Inactive'
    }
  },
  
  {
    field: 'createdDate',
    headerName: 'Created',
    width: 120,
    filter: 'agDateColumnFilter',
    valueFormatter: ({ value }) => {
      return value ? new Date(value).toLocaleDateString() : '';
    },
    comparator: (valueA, valueB) => {
      const a = valueA ? new Date(valueA).getTime() : 0;
      const b = valueB ? new Date(valueB).getTime() : 0;
      return a - b;
    }
  },
  
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    cellRenderer: ({ value }) => {
      const color = value === 'Available' ? 'green' : 
                   value === 'Limited' ? 'orange' : 'red';
      return <Tag color={color}>{value}</Tag>;
    },
    filter: 'agSetColumnFilter',
    filterParams: {
      values: ['Available', 'Limited', 'Discontinued']
    }
  },
  
  // Computed column
  {
    headerName: 'Total Value',
    colId: 'totalValue',
    width: 120,
    valueGetter: ({ data }) => {
      if (!data?.price || !data?.stock) return 0;
      return data.price * data.stock;
    },
    valueFormatter: ({ value }) => \`$\${value?.toFixed(2) || '0.00'}\`,
    cellStyle: { fontWeight: 'bold' }
  },
  
  // Actions column (pinned right)
  {
    headerName: 'Actions',
    colId: 'actions',
    width: 100,
    pinned: 'right',
    sortable: false,
    suppressMenu: true,
    cellRenderer: ({ data }) => {
      const menu = (
        <Menu>
          <Menu.Item key="edit">Edit</Menu.Item>
          <Menu.Item key="duplicate">Duplicate</Menu.Item>
          <Menu.Item key="delete" danger>Delete</Menu.Item>
        </Menu>
      );
      
      return (
        <Dropdown overlay={menu} trigger={['click']}>
          <Button 
            size="small" 
            icon={<MoreOutlined />} 
            style={{ border: 'none' }}
          />
        </Dropdown>
      );
    }
  }
];

// Usage in component
function ProductManagementGrid({ data, loading, onDataChanged }) {
  return (
    <GraviGrid
      columnDefs={productManagementColumns}
      rowData={data}
      loading={loading}
      getRowId={(row) => row.id}
      rowSelection="multiple"
      animateRows={true}
      onCellValueChanged={(event) => {
        // Handle cell edits
        onDataChanged?.(event.data);
      }}
      onSelectionChanged={(event) => {
        const selected = event.api.getSelectedRows();
        console.log('Selected products:', selected);
      }}
      agPropOverrides={{
        rowHeight: 45,
        headerHeight: 40,
        suppressCellSelection: true,
        enableRangeSelection: false
      }}
      controlBarProps={{
        title: 'Product Management',
        showSearch: true,
        showExport: true
      }}
    />
  );
}`,
  },
];
