import React, { useMemo, useCallback, useRef, MutableRefObject } from 'react';
import { GraviGrid, Texto, Horizontal, BBDTag } from '@gravitate-js/excalibrr';
import { Button, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { GridApi, RowClickedEvent } from 'ag-grid-community';
import { BulkEditControls, BulkChangeAction } from './BulkChangeBar';
import { OfferPricingTabProps, PricingRow, AnalyticsRow } from '../IndexOfferManagement.types';
import {
  COLORS,
  MONOSPACE_CELL_STYLE,
  RIGHT_ALIGNED_MONOSPACE_STYLE,
  SELECTED_ROW_STYLE,
  getSelectedRowCellStyle,
  getPriceChangeCellStyle,
  getProposedPriceCellStyle,
  formatCurrency,
  formatDecimal,
} from '../IndexOfferManagement.constants';
import { generatePricingData, generateAnalyticsData } from '../../../shared/data';

// =============================================================================
// Sample Data - Generated from shared data
// =============================================================================

const INITIAL_PRICING_DATA: PricingRow[] = generatePricingData(10);

const ANALYTICS_DATA: AnalyticsRow[] = generateAnalyticsData(7);

// =============================================================================
// Component
// =============================================================================

/**
 * OfferPricingTab - Price offers grid with bulk change functionality
 *
 * Features:
 * - Pricing grid with current/proposed price columns
 * - Competitive analysis grid shown when a row is selected
 * - Range selection for bulk editing (select cells by click-drag)
 * - BulkEditControls in control bar for applying changes to selected range
 *
 * Follows production pattern from AvailabilityMaintenance:
 * - Uses range selection instead of checkbox selection
 * - Always-available bulk edit controls (no mode toggle)
 * - Uses externalRef for grid API access
 * - Uses applyTransaction for efficient updates
 */
export function OfferPricingTab({
  rowData,
  onRowDataChange,
  selectedPricingRow,
  setSelectedPricingRow,
  isFutureMode,
  viewMode,
  analyticsRowData,
}: OfferPricingTabProps) {
  // Grid API reference using externalRef pattern
  const gridRef = useRef() as MutableRefObject<GridApi>;

  // Handle bulk apply using range selection
  const handleBulkApply = useCallback((property: string, value: number, action: BulkChangeAction) => {
    if (!gridRef.current) return;

    const ranges = gridRef.current.getCellRanges();
    if (!ranges || ranges.length === 0) {
      message.warning('Please select cells to update (click and drag to select rows)');
      return;
    }

    const transactions: PricingRow[] = [];
    const processedIds = new Set<number>();

    ranges.forEach((range) => {
      const startRow = Math.min(range.startRow!.rowIndex, range.endRow!.rowIndex);
      const endRow = Math.max(range.startRow!.rowIndex, range.endRow!.rowIndex);

      for (let i = startRow; i <= endRow; i++) {
        const node = gridRef.current.getDisplayedRowAtIndex(i);
        if (!node?.data || processedIds.has(node.data.id)) continue;

        processedIds.add(node.data.id);
        const row = { ...node.data };

        if (property === 'proposedDiff') {
          if (action === 'set') {
            row.proposedDiff = value;
          } else if (action === 'add') {
            row.proposedDiff = (row.proposedDiff || 0) + value;
          } else if (action === 'subtract') {
            row.proposedDiff = (row.proposedDiff || 0) - value;
          }
          row.proposedPrice = row.currentPrice + row.proposedDiff;
        } else if (property === 'proposedPrice') {
          if (action === 'set') {
            row.proposedPrice = value;
          } else if (action === 'add') {
            row.proposedPrice = (row.proposedPrice || 0) + value;
          } else if (action === 'subtract') {
            row.proposedPrice = (row.proposedPrice || 0) - value;
          }
        }

        transactions.push(row);
      }
    });

    if (transactions.length > 0) {
      gridRef.current.applyTransaction({ update: transactions });
      onRowDataChange(rowData.map(row => {
        const updated = transactions.find(t => t.id === row.id);
        return updated || row;
      }));

      const actionLabel = action === 'set' ? 'Set' : action === 'add' ? 'Added' : 'Subtracted';
      const propertyLabel = property === 'proposedDiff' ? 'Proposed Diff' : 'Proposed Price';
      message.success(`${actionLabel} ${propertyLabel} for ${transactions.length} row(s)`);
    }

    // Clear range selection after apply
    gridRef.current.clearRangeSelection();
  }, [rowData, onRowDataChange]);

  // Pricing column definitions (no checkbox selection needed)
  const pricingColumnDefs = useMemo(() => [
    {
      field: 'location',
      headerName: 'LOCATION',
      width: 160,
      sortable: true,
      filter: true
    },
    {
      field: 'product',
      headerName: 'PRODUCT',
      width: 130,
      sortable: true,
      filter: true
    },
    {
      field: 'type',
      headerName: 'TYPE',
      width: 100,
      sortable: true,
      filter: true
    },
    {
      field: 'formula',
      headerName: 'FORMULA',
      width: 400,
      sortable: true,
      filter: true,
      cellStyle: MONOSPACE_CELL_STYLE
    },
    {
      field: 'currentDiff',
      headerName: 'CURRENT DIFF',
      width: 130,
      sortable: true,
      filter: true,
      type: 'numericColumn',
      valueFormatter: (params: { value: number | null }) => formatDecimal(params.value),
      cellStyle: RIGHT_ALIGNED_MONOSPACE_STYLE
    },
    {
      field: 'currentPrice',
      headerName: 'CURRENT PRICE',
      width: 140,
      sortable: true,
      filter: true,
      type: 'numericColumn',
      valueFormatter: (params: { value: number | null }) => formatCurrency(params.value),
      cellStyle: RIGHT_ALIGNED_MONOSPACE_STYLE
    },
    {
      field: 'proposedDiff',
      headerName: 'PROPOSED DIFF',
      width: 140,
      sortable: true,
      filter: true,
      type: 'numericColumn',
      valueFormatter: (params: { value: number | null }) => formatDecimal(params.value),
      cellStyle: RIGHT_ALIGNED_MONOSPACE_STYLE
    },
    {
      field: 'proposedPrice',
      headerName: 'PROPOSED PRICE',
      width: 150,
      sortable: true,
      filter: true,
      type: 'numericColumn',
      valueFormatter: (params: { value: number | null }) => formatCurrency(params.value),
      cellStyle: (params: { data?: PricingRow }) => getProposedPriceCellStyle(params.data?.proposedPrice, params.data?.currentPrice)
    }
  ], []);

  // Pricing grid configuration with range selection enabled
  const pricingGridAgProps = useMemo(() => ({
    getRowId: (params: { data: PricingRow }) => String(params.data.id),
    domLayout: 'normal' as const,
    headerHeight: 40,
    rowHeight: 40,
    // Enable range selection for bulk editing
    enableRangeSelection: true,
    suppressMultiRangeSelection: false,
    // Disable row selection (we use range selection instead)
    suppressRowClickSelection: true,
    enableCellTextSelection: true,
    onRowClicked: (event: RowClickedEvent<PricingRow>) => {
      // Handle competitive analysis display
      if (!isFutureMode || viewMode !== 'analytics') return;
      setSelectedPricingRow(event.data || null);
    }
  }), [isFutureMode, viewMode, setSelectedPricingRow]);

  // Analytics column definitions
  const analyticsColumnDefs = useMemo(() => [
    {
      field: 'competitor',
      headerName: 'COMPETITOR / SOURCE',
      width: 220,
      sortable: true,
      filter: true,
      cellStyle: (params: { data?: AnalyticsRow }) => getSelectedRowCellStyle(params)
    },
    {
      field: 'currentPrice',
      headerName: 'CURRENT PRICE',
      width: 140,
      sortable: true,
      filter: true,
      cellStyle: (params: { data?: AnalyticsRow }) => {
        if (params.data?.isSelected) {
          return { ...SELECTED_ROW_STYLE, textAlign: 'right' };
        }
        return { textAlign: 'right' };
      }
    },
    {
      field: 'rank',
      headerName: 'RANK',
      width: 120,
      sortable: true,
      filter: true,
      cellStyle: (params: { data?: AnalyticsRow }) => getSelectedRowCellStyle(params)
    },
    {
      field: 'trendIndicator',
      headerName: 'TREND',
      width: 100,
      sortable: true,
      filter: true,
      cellRenderer: (params: { data?: AnalyticsRow; value: string }) => {
        if (params.data?.isSelected) {
          return (
            <BBDTag style={{ backgroundColor: COLORS.SELECTED_ROW_BG, color: COLORS.SELECTED_ROW_TEXT, border: 'none', width: 'fit-content' }}>
              Current
            </BBDTag>
          );
        }
        if (params.value === 'above') {
          return <BBDTag error style={{ width: 'fit-content' }}>Above</BBDTag>;
        }
        if (params.value === 'below') {
          return <BBDTag success style={{ width: 'fit-content' }}>Below</BBDTag>;
        }
        return <BBDTag style={{ width: 'fit-content' }}>Normal</BBDTag>;
      },
      cellStyle: (params: { data?: AnalyticsRow }) => {
        if (params.data?.isSelected) {
          return SELECTED_ROW_STYLE;
        }
        return {};
      }
    },
    {
      field: 'lastRevalueDate',
      headerName: 'LAST REVALUE',
      width: 140,
      sortable: true,
      filter: true,
      cellStyle: (params: { data?: AnalyticsRow }) => getSelectedRowCellStyle(params)
    },
    {
      field: 'changeFromPrevious',
      headerName: 'CHANGE',
      width: 120,
      sortable: true,
      filter: true,
      cellStyle: (params: { data?: AnalyticsRow; value: string }) => {
        if (params.data?.isSelected) {
          return { ...SELECTED_ROW_STYLE, textAlign: 'right' };
        }
        return { ...getPriceChangeCellStyle(params.value), textAlign: 'right', fontWeight: 600 };
      }
    },
    {
      field: 'differenceToSelected',
      headerName: 'DIFF TO SELECTED',
      width: 160,
      sortable: true,
      filter: true,
      cellStyle: (params: { data?: AnalyticsRow; value: string }) => {
        if (params.data?.isSelected) {
          return { ...SELECTED_ROW_STYLE, textAlign: 'right' };
        }
        return { ...getPriceChangeCellStyle(params.value), textAlign: 'right', fontWeight: 600 };
      }
    }
  ], []);

  // Analytics grid configuration
  const analyticsGridAgProps = useMemo(() => ({
    getRowId: (params: { data: AnalyticsRow }) => String(params.data.id),
    domLayout: 'normal' as const,
    headerHeight: 40,
    rowHeight: 48,
    suppressRowClickSelection: true,
    enableCellTextSelection: true,
    rowGroupPanelShow: 'never' as const,
    suppressDragLeaveHidesColumns: true
  }), []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* Competitive Analysis Grid - Collapses when empty */}
      {selectedPricingRow ? (
        <div style={{ height: '400px' }}>
          <GraviGrid
            storageKey="offer-pricing-competitive-grid"
            rowData={analyticsRowData}
            columnDefs={analyticsColumnDefs}
            agPropOverrides={analyticsGridAgProps}
            controlBarProps={{
              title: (
                <Horizontal style={{ gap: '16px', alignItems: 'baseline' }}>
                  <Texto category="h6" weight="600">
                    Competitive Analysis
                  </Texto>
                  <Texto category="p1" appearance="medium">
                    Selected: {selectedPricingRow?.product} - {selectedPricingRow?.location}
                  </Texto>
                </Horizontal>
              ),
              hideActiveFilters: true,
              hideFilterRow: true,
              actionButtons: (
                <Button size="small" onClick={() => setSelectedPricingRow(null)}>
                  Close
                </Button>
              )
            }}
          />
        </div>
      ) : (
        <div style={{
          height: '80px',
          backgroundColor: COLORS.BACKGROUND_GRAY,
          border: `1px dashed ${COLORS.BORDER_GRAY}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <Horizontal style={{ gap: '12px', alignItems: 'center' }}>
            <EyeOutlined style={{ fontSize: '24px', color: '#bfbfbf' }} />
            <Texto category="p2" appearance="medium">
              Click any row in the Price Offers table below to view competitive analysis
            </Texto>
          </Horizontal>
        </div>
      )}

      {/* Price Offers Grid with Range Selection */}
      <div style={{ flex: 1, minHeight: '300px' }}>
        <GraviGrid
          externalRef={gridRef}
          rowData={rowData}
          columnDefs={pricingColumnDefs}
          agPropOverrides={pricingGridAgProps}
          controlBarProps={{
            title: 'Price Offers',
            hideActiveFilters: false,
            actionButtons: <BulkEditControls onApply={handleBulkApply} />
          }}
        />
      </div>
    </div>
  );
}

export default OfferPricingTab;
