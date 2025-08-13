import { GraviGrid, Horizontal, Vertical } from '@gravitate-js/excalibrr';
import React, { useEffect } from 'react';

function ThemedDataGrid() {
  // Ensure fonts are loaded
  useEffect(() => {
    // Force font loading
    const style = document.createElement('style');
    style.textContent = `
      /* Critical Font Fix for ag-Grid Components */
  
/* 1. Font-face declarations - MUST come first */
@font-face {
  font-family: 'Lato';
  src: url('/assets/fonts/Lato-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('/assets/fonts/Lato-Bold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lato';
  src: url('/assets/fonts/Lato-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* 2. Global font application */
* {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}

/* 3. ag-Grid specific font overrides - matching production */
.ag-theme-alpine,
.ag-theme-alpine-dark,
.ag-theme-material,
.ag-theme-balham {
  /* Set the font family at the theme level */
  font-family: 'Lato', sans-serif !important;
  
  /* ag-Grid CSS variables for fonts */
  --ag-font-family: 'Lato', sans-serif !important;
  --ag-font-size: 12px !important;
  --ag-header-font-family: 'Lato', sans-serif !important;
  --ag-header-font-size: 12px !important;
  --ag-header-font-weight: 600 !important;
}

/* 4. Header cells - matching your production styling */
.ag-header-cell,
.ag-header-group-cell {
  font-family: 'Lato', sans-serif !important;
}

.ag-header-cell-label,
.ag-header-cell-text {
  font-family: 'Lato', sans-serif !important;
  text-transform: uppercase !important;
  font-weight: 600 !important;
  font-size: 11px !important;
  letter-spacing: 0.5px !important;
}

/* 5. Grid cells */
.ag-cell {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
  font-weight: 400 !important;
}

/* 6. Cell values and text */
.ag-cell-value,
.ag-group-value {
  font-family: 'Lato', sans-serif !important;
}

/* 7. Filter and menu fonts */
.ag-filter,
.ag-menu,
.ag-menu-list,
.ag-filter-body-wrapper,
.ag-filter-condition {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
}

/* 8. Pagination */
.ag-paging-panel,
.ag-paging-page-summary,
.ag-paging-description {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
}

/* 9. Status bar */
.ag-status-bar {
  font-family: 'Lato', sans-serif !important;
  font-size: 12px !important;
}

/* 10. Overlay text (loading, no rows) */
.ag-overlay-loading-center,
.ag-overlay-no-rows-center {
  font-family: 'Lato', sans-serif !important;
}

/* 11. Force inheritance for all ag-Grid child elements */
.ag-root-wrapper,
.ag-root-wrapper * {
  font-family: inherit !important;
}

/* 12. GraviGrid specific overrides */
.gravi-grid-container {
  font-family: 'Lato', sans-serif !important;
}

.gravi-grid-container .ag-root-wrapper {
  font-family: 'Lato', sans-serif !important;
}

/* 13. Debug helper - add red border if font is not Lato */
@supports (font-family: 'Lato') {
  .ag-header-cell-text:not([style*="Lato"]) {
    /* This will help identify cells not using Lato */
    /* Remove this in production */
    /* border: 1px solid red !important; */
  }
}
    `;
    document.head.appendChild(style);
    
    // Validate fonts after grid renders
    setTimeout(() => {
      const elements = document.querySelectorAll('.ag-header-cell-text, .ag-cell');
      elements.forEach(el => {
        el.style.fontFamily = "'Lato', sans-serif";
      });
    }, 100);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const columnDefs = [
    
    {
      headerName: 'ID',
      field: 'id',
      type: "numericColumn",
      
      sortable: true,
      filter: true,
      resizable: true
    },
    {
      headerName: 'Contract Number',
      field: 'contractNumber',
      
      
      sortable: true,
      filter: true,
      resizable: true
    },
    {
      headerName: 'Customer Name',
      field: 'customerName',
      
      
      sortable: true,
      filter: true,
      resizable: true
    },
    {
      headerName: 'Status',
      field: 'status',
      
      
      sortable: true,
      filter: true,
      resizable: true
    }
  ];
  
  const rowData = [
  {
    "id": 1,
    "contractNumber": "CNT-2024-001",
    "customerName": "Acme Corp",
    "status": "Active"
  },
  {
    "id": 2,
    "contractNumber": "CNT-2024-002",
    "customerName": "Global Energy",
    "status": "Pending"
  }
];
  
  return (
    <Vertical gap={16} className="themed-grid-container">
      {/* Grid Control Bar */}
      <Horizontal justify="space-between" align="center" className="grid-header">
        <h2 className="grid-title">Font Test Grid</h2>
        <Horizontal gap={8}>
          {/* Add your action buttons here using real Excalibrr components */}
        </Horizontal>
      </Horizontal>
      
      {/* Main Data Grid */}
      <GraviGrid
        columnDefs={columnDefs}
        rowData={rowData}
        theme="OSP"
        pagination={true}
        paginationPageSize={50}
        enableRangeSelection={true}
        enableCellSelection={true}
        animateRows={true}
        getRowId={(params) => params.data.id}
        className="theme-osp-grid ag-theme-alpine"
        domLayout="autoHeight"
        headerHeight={40}
        rowHeight={35}
        controlBarProps={{
          title: 'Font Test Grid',
          showSearch: true,
          showExport: true,
          showFilters: true,
          theme: 'OSP'
        }}
        sideBar={{
          toolPanels: ['filters', 'columns'],
          defaultToolPanel: 'filters'
        }}
      />
      
      <style jsx>{`
        .themed-grid-container {
          padding: 24px;
          background: var(--bg-primary);
          border-radius: 8px;
          border: 1px solid var(--color-secondary);
        }
        
        .grid-title {
          color: var(--text-primary);
          margin: 0;
          font-weight: 600;
        }
        
        .grid-header {
          margin-bottom: 16px;
        }
        
        /* Critical font fix for ag-Grid */
        .theme-osp-grid {
          font-family: 'Lato', sans-serif !important;
          --ag-font-family: 'Lato', sans-serif !important;
          --ag-font-size: 12px !important;
          --ag-header-font-weight: 600 !important;
          
          /* Grid-specific theme styling */
          --ag-background-color: var(--bg-primary);
          --ag-header-background-color: var(--bg-secondary);
          --ag-odd-row-background-color: var(--bg-tertiary);
          --ag-border-color: var(--color-secondary);
          --ag-selected-row-background-color: var(--color-accent);
          --ag-row-hover-color: var(--bg-secondary);
        }
        
        .theme-osp-grid .ag-header-cell-text {
          font-family: 'Lato', sans-serif !important;
          text-transform: uppercase !important;
          font-weight: 600 !important;
          font-size: 11px !important;
        }
        
        .theme-osp-grid .ag-cell {
          font-family: 'Lato', sans-serif !important;
          font-size: 12px !important;
        }
      `}</style>
    </Vertical>
  );
}

export default ThemedDataGrid;