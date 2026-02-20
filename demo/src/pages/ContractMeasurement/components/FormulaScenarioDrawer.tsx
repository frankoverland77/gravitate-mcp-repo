import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { Drawer } from 'antd'
import { GraviGrid, Texto, Horizontal, Vertical, GraviButton } from '@gravitate-js/excalibrr'
import { CheckCircleOutlined, ClockCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import type { ColDef, GridApi, IDetailCellRendererParams, CellContextMenuEvent } from 'ag-grid-community'
import type {
  Scenario,
  DetailFormulaConfig,
  FormulaClipboard,
  ScenarioFormulaComponent,
} from '../types/scenario.types'
import { generateScenarioId } from '../types/scenario.types'
import { SAMPLE_DETAILS } from '../ContractMeasurement.data'
import { FormulaDetailPanel } from './FormulaDetailPanel'
import {
  DrawerHeader,
  ClipboardBar,
  BulkActionBar,
  ScenarioNameInput,
  DrawerFooter,
} from './FormulaScenarioDrawerParts'
import styles from './FormulaScenarioDrawer.module.css'

interface FormulaScenarioDrawerProps {
  visible: boolean
  onClose: () => void
  onSave?: (scenario: Scenario) => void
  editingScenario?: Scenario
  editingDetailId?: string | null // If set, only show this specific detail for editing
}

// Initialize detail formulas from SAMPLE_DETAILS
function initializeDetailFormulas(): DetailFormulaConfig[] {
  return SAMPLE_DETAILS.map((d) => ({
    detailId: d.detailId,
    name: `${d.product} - ${d.location}`,
    product: d.product,
    location: d.location,
    status: 'empty',
    components: [],
  }))
}

// Empty clipboard state
const EMPTY_CLIPBOARD: FormulaClipboard = {
  hasContent: false,
  sourceId: null,
  sourceName: '',
  components: [],
}

// Helper: Create pasted components with new IDs
function createPastedComponents(
  sourceComponents: ScenarioFormulaComponent[],
  existingComponents: ScenarioFormulaComponent[]
): ScenarioFormulaComponent[] {
  const maxId = Math.max(0, ...existingComponents.map((c) => c.id))
  return sourceComponents.map((comp, index) => ({
    ...comp,
    id: maxId + index + 1,
  }))
}

// Helper: Apply formula to a detail
function applyFormulaToDetail(
  detail: DetailFormulaConfig,
  sourceComponents: ScenarioFormulaComponent[]
): DetailFormulaConfig {
  const pastedComponents = createPastedComponents(sourceComponents, detail.components)
  return {
    ...detail,
    components: pastedComponents,
    status: 'in-progress',
  }
}

// Status cell renderer for the grid
function StatusCellRenderer(props: { value: string }) {
  const status = props.value
  if (status === 'confirmed') {
    return (
      <Horizontal alignItems="center" style={{ gap: '6px' }}>
        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '14px' }} />
        <Texto category="p2" style={{ color: '#52c41a' }}>
          Confirmed
        </Texto>
      </Horizontal>
    )
  }
  if (status === 'in-progress') {
    return (
      <Horizontal alignItems="center" style={{ gap: '6px' }}>
        <ClockCircleOutlined style={{ color: '#faad14', fontSize: '14px' }} />
        <Texto category="p2" style={{ color: '#faad14' }}>
          In Progress
        </Texto>
      </Horizontal>
    )
  }
  return (
    <Horizontal alignItems="center" style={{ gap: '6px' }}>
      <MinusCircleOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
      <Texto category="p2" appearance="medium">
        Empty
      </Texto>
    </Horizontal>
  )
}

export function FormulaScenarioDrawer({
  visible,
  onClose,
  onSave,
  editingScenario,
  editingDetailId,
}: FormulaScenarioDrawerProps) {
  const [name, setName] = useState('')
  const [detailFormulas, setDetailFormulas] = useState<DetailFormulaConfig[]>(initializeDetailFormulas)
  const [clipboard, setClipboard] = useState<FormulaClipboard>(EMPTY_CLIPBOARD)
  const gridApiRef = useRef<GridApi | null>(null)

  const isEditMode = !!editingScenario
  const isSingleDetailMode = isEditMode && !!editingDetailId

  useEffect(() => {
    if (visible) {
      if (editingScenario) {
        // Edit mode - load existing scenario data
        setName(editingScenario.name)
        if (editingScenario.detailFormulas) {
          setDetailFormulas(editingScenario.detailFormulas)
        } else {
          setDetailFormulas(initializeDetailFormulas())
        }
      } else {
        // Add mode - fresh start
        setName('')
        setDetailFormulas(initializeDetailFormulas())
      }
      setClipboard(EMPTY_CLIPBOARD)
    }
  }, [visible, editingScenario])

  // Get selected row count from AG Grid
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Custom context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    detailId: string
  } | null>(null)

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null)
    if (contextMenu?.visible) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenu?.visible])

  const progress = useMemo(() => {
    const confirmed = detailFormulas.filter((d) => d.status === 'confirmed').length
    const total = detailFormulas.length
    return { confirmed, total, percentage: total > 0 ? (confirmed / total) * 100 : 0 }
  }, [detailFormulas])

  // Count confirmable rows based on selection context
  const confirmableCount = useMemo(() => {
    if (selectedIds.size > 0) {
      return detailFormulas.filter(
        (d) => selectedIds.has(d.detailId) && d.status === 'in-progress' && d.components.length > 0
      ).length
    }
    return detailFormulas.filter((d) => d.status === 'in-progress' && d.components.length > 0).length
  }, [detailFormulas, selectedIds])

  // Filter grid data for single detail mode
  const gridRowData = useMemo(() => {
    if (isSingleDetailMode && editingDetailId) {
      return detailFormulas.filter((d) => d.detailId === editingDetailId)
    }
    return detailFormulas
  }, [detailFormulas, isSingleDetailMode, editingDetailId])

  const handleUpdateDetail = useCallback((updated: DetailFormulaConfig) => {
    setDetailFormulas((prev) => prev.map((d) => (d.detailId === updated.detailId ? updated : d)))
  }, [])

  const handleCopy = useCallback(
    (detailId: string) => {
      const detail = detailFormulas.find((d) => d.detailId === detailId)
      if (detail && detail.components.length > 0) {
        setClipboard({
          hasContent: true,
          sourceId: detailId,
          sourceName: detail.name,
          components: [...detail.components],
        })
      }
    },
    [detailFormulas]
  )

  const handlePaste = useCallback(
    (detailId: string) => {
      if (!clipboard.hasContent) return
      setDetailFormulas((prev) =>
        prev.map((d) => (d.detailId === detailId ? applyFormulaToDetail(d, clipboard.components) : d))
      )
    },
    [clipboard]
  )

  const handleClearClipboard = useCallback(() => setClipboard(EMPTY_CLIPBOARD), [])

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set())
    gridApiRef.current?.deselectAll()
  }, [])

  const handleBulkPaste = useCallback(() => {
    if (!clipboard.hasContent || selectedIds.size === 0) return
    setDetailFormulas((prev) =>
      prev.map((d) => (selectedIds.has(d.detailId) ? applyFormulaToDetail(d, clipboard.components) : d))
    )
    handleClearSelection()
  }, [clipboard, selectedIds, handleClearSelection])

  const handleApplyToSelected = useCallback(
    (sourceDetailId: string) => {
      const sourceDetail = detailFormulas.find((d) => d.detailId === sourceDetailId)
      if (!sourceDetail || sourceDetail.components.length === 0) return
      const shouldApply = (d: DetailFormulaConfig) =>
        selectedIds.has(d.detailId) && d.detailId !== sourceDetailId
      setDetailFormulas((prev) =>
        prev.map((d) => (shouldApply(d) ? applyFormulaToDetail(d, sourceDetail.components) : d))
      )
      handleClearSelection()
    },
    [detailFormulas, selectedIds, handleClearSelection]
  )

  const handleConfirmAll = useCallback(() => {
    setDetailFormulas((prev) =>
      prev.map((d) => {
        const isConfirmable = d.status === 'in-progress' && d.components.length > 0
        if (!isConfirmable) return d

        if (selectedIds.size > 0) {
          return selectedIds.has(d.detailId) ? { ...d, status: 'confirmed' } : d
        }
        return { ...d, status: 'confirmed' }
      })
    )
    if (selectedIds.size > 0) {
      handleClearSelection()
    }
  }, [selectedIds, handleClearSelection])

  const handleConfirmSingle = useCallback((detailId: string) => {
    setDetailFormulas((prev) =>
      prev.map((d) => {
        if (d.detailId === detailId && d.status === 'in-progress' && d.components.length > 0) {
          return { ...d, status: 'confirmed' }
        }
        return d
      })
    )
  }, [])

  // Row selection handler - defined OUTSIDE agPropOverrides per GraviGrid pattern
  const onRowSelected = useCallback(() => {
    if (gridApiRef.current) {
      const selectedNodes = gridApiRef.current.getSelectedNodes()
      const newSelectedIds = new Set(
        selectedNodes.map((node) => (node.data as DetailFormulaConfig).detailId)
      )
      setSelectedIds(newSelectedIds)
    }
  }, [])

  const handleSave = useCallback(() => {
    const now = new Date().toISOString()
    const scenarioName = name.trim() || `Formula Scenario ${new Date().toLocaleTimeString()}`

    if (isEditMode && editingScenario) {
      // Edit mode - update existing scenario
      let updatedFormulas: DetailFormulaConfig[]

      if (isSingleDetailMode && editingDetailId) {
        // Single detail edit - only update that detail
        const editedDetail = detailFormulas.find((d) => d.detailId === editingDetailId)
        updatedFormulas =
          editingScenario.detailFormulas?.map((d) =>
            d.detailId === editingDetailId && editedDetail ? editedDetail : d
          ) || detailFormulas
      } else {
        // Full scenario edit - use all edited formulas
        updatedFormulas = detailFormulas
      }

      const updatedScenario: Scenario = {
        ...editingScenario,
        name: scenarioName,
        updatedAt: now,
        detailFormulas: updatedFormulas,
      }
      onSave?.(updatedScenario)
    } else {
      // Add mode - create new scenario
      const newScenario: Scenario = {
        id: generateScenarioId(),
        name: scenarioName,
        products: 'all',
        status: 'complete',
        entryMethod: 'formula',
        isReference: false,
        createdAt: now,
        updatedAt: now,
        priceConfig: { formulaId: `formula-${Date.now()}` },
        detailFormulas: detailFormulas,
      }
      onSave?.(newScenario)
    }
    onClose()
  }, [name, detailFormulas, onSave, onClose, isEditMode, editingScenario, isSingleDetailMode, editingDetailId])

  // Column definitions for the grid
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 50,
        pinned: 'left',
      },
      {
        headerName: '',
        cellRenderer: 'agGroupCellRenderer',
        width: 40,
        pinned: 'left',
      },
      {
        field: 'product',
        headerName: 'PRODUCT',
        flex: 1,
        minWidth: 150,
        filter: true,
        sortable: true,
      },
      {
        field: 'location',
        headerName: 'LOCATION',
        flex: 1,
        minWidth: 150,
        filter: true,
        sortable: true,
      },
      {
        field: 'status',
        headerName: 'STATUS',
        width: 140,
        filter: true,
        sortable: true,
        cellRenderer: StatusCellRenderer,
      },
    ],
    []
  )

  // AG Grid props for master-detail
  const agPropOverrides = useMemo(
    () => ({
      domLayout: 'normal' as const,
      headerHeight: 40,
      rowHeight: 48,
      rowSelection: 'multiple' as const,
      suppressRowClickSelection: true,
      masterDetail: true,
      detailRowAutoHeight: true,
      isRowMaster: () => true, // All rows can be expanded
      detailCellRenderer: (params: IDetailCellRendererParams) => {
        const data = params.data as DetailFormulaConfig
        return (
          <FormulaDetailPanel
            data={data}
            clipboard={clipboard}
            selectedCount={selectedIds.size}
            onUpdateDetail={handleUpdateDetail}
            onCopy={() => handleCopy(data.detailId)}
            onPaste={() => handlePaste(data.detailId)}
            onApplyToSelected={() => handleApplyToSelected(data.detailId)}
          />
        )
      },
      onRowSelected, // Pass callback by reference - must be defined outside useMemo
      getRowId: (params: { data: DetailFormulaConfig }) => params.data.detailId,
      onCellContextMenu: (params: CellContextMenuEvent) => {
        params.event?.preventDefault()
        const data = params.node?.data as DetailFormulaConfig
        if (data) {
          const mouseEvent = params.event as MouseEvent
          setContextMenu({
            visible: true,
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
            detailId: data.detailId,
          })
        }
      },
    }),
    [clipboard, selectedIds, handleUpdateDetail, handleCopy, handlePaste, handleApplyToSelected, onRowSelected]
  )

  // Control bar props for the grid
  const controlBarProps = useMemo(
    () => ({
      title: 'Product Details',
      showSearch: true,
      searchPlaceholder: 'Search products or locations...',
      hideActiveFilters: true,
    }),
    []
  )

  return (
    <Drawer
      placement="bottom"
      height="85%"
      visible={visible}
      onClose={onClose}
      closable={false}
      title={null}
      headerStyle={{ display: 'none' }}
      bodyStyle={{
        backgroundColor: '#f5f5f5',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      zIndex={2000}
      destroyOnClose
    >
      <DrawerHeader onClose={onClose} isEditMode={isEditMode} isSingleDetailMode={isSingleDetailMode} />
      <ClipboardBar clipboard={clipboard} onClear={handleClearClipboard} />
      <BulkActionBar
        selectedCount={selectedIds.size}
        hasClipboard={clipboard.hasContent}
        onBulkPaste={handleBulkPaste}
        onClearSelection={handleClearSelection}
      />

      <div className={styles.content}>
        <ScenarioNameInput value={name} onChange={setName} disabled={isSingleDetailMode} />

        {/* GraviGrid with master-detail */}
        <div className={styles.gridContainer}>
          <GraviGrid
            externalRef={gridApiRef as React.MutableRefObject<GridApi>}
            rowData={gridRowData}
            columnDefs={columnDefs}
            agPropOverrides={agPropOverrides}
            controlBarProps={controlBarProps}
            storageKey="FormulaScenarioDetailsGrid"
          />
        </div>
      </div>

      <DrawerFooter
        progress={progress}
        confirmableCount={confirmableCount}
        hasSelection={selectedIds.size > 0}
        isEditMode={isEditMode}
        onConfirmAll={handleConfirmAll}
        onCancel={onClose}
        onSave={handleSave}
      />

      {/* Custom Context Menu */}
      {contextMenu?.visible && (() => {
        const detail = detailFormulas.find((d) => d.detailId === contextMenu.detailId)
        const hasComponents = detail ? detail.components.length > 0 : false
        const canPaste = clipboard.hasContent && clipboard.sourceId !== contextMenu.detailId
        const canConfirm = detail?.status === 'in-progress' && hasComponents

        return (
          <div
            className={styles.contextMenu}
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <div
              className={`${styles.contextMenuItem} ${!hasComponents ? styles.disabled : ''}`}
              onClick={() => {
                if (hasComponents) {
                  handleCopy(contextMenu.detailId)
                  setContextMenu(null)
                }
              }}
            >
              Copy Formula
            </div>
            <div
              className={`${styles.contextMenuItem} ${!canPaste ? styles.disabled : ''}`}
              onClick={() => {
                if (canPaste) {
                  handlePaste(contextMenu.detailId)
                  setContextMenu(null)
                }
              }}
            >
              Paste Formula
            </div>
            <div className={styles.contextMenuDivider} />
            <div
              className={`${styles.contextMenuItem} ${!canConfirm ? styles.disabled : ''}`}
              onClick={() => {
                if (canConfirm) {
                  handleConfirmSingle(contextMenu.detailId)
                  setContextMenu(null)
                }
              }}
            >
              Confirm
            </div>
          </div>
        )
      })()}
    </Drawer>
  )
}
