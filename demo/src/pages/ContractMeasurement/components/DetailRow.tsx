import { useState, useCallback, useRef, useEffect } from 'react'
import { Texto, Horizontal, GraviButton } from '@gravitate-js/excalibrr'
import { Checkbox, Table, Popconfirm, Select, Input } from 'antd'
import {
  RightOutlined,
  PlusOutlined,
  DeleteOutlined,
  CopyOutlined,
  SnippetsOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type {
  DetailFormulaConfig,
  ScenarioFormulaComponent,
  FormulaClipboard,
} from '../types/scenario.types'
import {
  PLACEHOLDER_VALUES,
  isPlaceholder,
  FormulaTemplate,
  TemplateComponent,
} from '../../demos/grids/FormulaTemplates.data'
import { TemplateChooser } from '../../../components/shared/TemplateChooser'
import { useFormulaTemplateContext } from '../../../contexts/FormulaTemplateContext'
import styles from './FormulaScenarioDrawer.module.css'

interface DetailRowProps {
  detail: DetailFormulaConfig
  isExpanded: boolean
  isSelected: boolean
  clipboard: FormulaClipboard
  selectedCount: number
  onToggleExpand: () => void
  onToggleSelect: () => void
  onUpdateDetail: (updated: DetailFormulaConfig) => void
  onCopy: () => void
  onPaste: () => void
  onApplyToSelected: () => void
}

// Helper: Get status pill class based on status
function getStatusPillClass(status: string): string {
  switch (status) {
    case 'confirmed':
      return `${styles.statusPill} ${styles.statusConfirmed}`
    case 'in-progress':
      return `${styles.statusPill} ${styles.statusInProgress}`
    default:
      return `${styles.statusPill} ${styles.statusEmpty}`
  }
}

// Helper: Get status display text
function getStatusText(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'Confirmed'
    case 'in-progress':
      return 'In Progress'
    default:
      return 'Empty'
  }
}

// Field options for dropdowns
const PUBLISHER_OPTIONS = [
  { value: 'Argus', label: 'Argus' },
  { value: 'OPIS', label: 'OPIS' },
  { value: 'Platts', label: 'Platts' },
  { value: 'NYMEX', label: 'NYMEX' },
]

const INSTRUMENT_OPTIONS = [
  { value: 'CBOB USGC', label: 'CBOB USGC' },
  { value: 'CBOB', label: 'CBOB' },
  { value: 'CBOB Chicago', label: 'CBOB Chicago' },
  { value: 'Premium USGC', label: 'Premium USGC' },
  { value: 'ULSD', label: 'ULSD' },
  { value: 'Ethanol', label: 'Ethanol' },
  { value: 'Jet Fuel', label: 'Jet Fuel' },
  { value: 'RBOB Futures', label: 'RBOB Futures' },
]

const TYPE_OPTIONS = [
  { value: 'Settle', label: 'Settle' },
  { value: 'Average', label: 'Average' },
  { value: 'Spot', label: 'Spot' },
  { value: 'Futures', label: 'Futures' },
  { value: 'Fixed', label: 'Fixed' },
]

const DATE_RULE_OPTIONS = [
  { value: 'Prior Day', label: 'Prior Day' },
  { value: 'Current', label: 'Current' },
  { value: 'Friday Close', label: 'Friday Close' },
  { value: 'Settlement', label: 'Settlement' },
]

// Helper: Create table columns with editable cells
function createTableColumns(
  onDeleteComponent: (id: number) => void,
  onCellChange: (componentId: number, field: string, value: string) => void
): ColumnsType<ScenarioFormulaComponent> {
  const placeholderStyle = { color: '#722ed1', fontStyle: 'italic' as const }

  return [
    {
      title: '%',
      dataIndex: 'percentage',
      key: 'percentage',
      width: 90,
      render: (value: string, record: ScenarioFormulaComponent) => (
        <Input
          value={isPlaceholder(value) ? '' : value}
          placeholder={isPlaceholder(value) ? 'Enter %' : undefined}
          onChange={(e) => onCellChange(record.id, 'percentage', e.target.value)}
          size='small'
          style={isPlaceholder(value) ? placeholderStyle : undefined}
        />
      ),
    },
    {
      title: 'PUBLISHER',
      dataIndex: 'source',
      key: 'source',
      width: 130,
      render: (value: string, record: ScenarioFormulaComponent) => (
        <Select
          value={isPlaceholder(value) ? undefined : value}
          placeholder='Select...'
          onChange={(newValue) => onCellChange(record.id, 'source', newValue)}
          options={PUBLISHER_OPTIONS}
          size='small'
          style={{ width: '100%', ...(isPlaceholder(value) ? placeholderStyle : {}) }}
        />
      ),
    },
    {
      title: 'INSTRUMENT',
      dataIndex: 'instrument',
      key: 'instrument',
      render: (value: string, record: ScenarioFormulaComponent) => (
        <Select
          value={isPlaceholder(value) ? undefined : value}
          placeholder='Select...'
          onChange={(newValue) => onCellChange(record.id, 'instrument', newValue)}
          options={INSTRUMENT_OPTIONS}
          size='small'
          style={{ width: '100%', ...(isPlaceholder(value) ? placeholderStyle : {}) }}
        />
      ),
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      width: 110,
      render: (value: string, record: ScenarioFormulaComponent) => (
        <Select
          value={isPlaceholder(value) ? undefined : value}
          placeholder='Select...'
          onChange={(newValue) => onCellChange(record.id, 'type', newValue)}
          options={TYPE_OPTIONS}
          size='small'
          style={{ width: '100%', ...(isPlaceholder(value) ? placeholderStyle : {}) }}
        />
      ),
    },
    {
      title: 'DATE RULE',
      dataIndex: 'dateRule',
      key: 'dateRule',
      width: 130,
      render: (value: string, record: ScenarioFormulaComponent) => (
        <Select
          value={isPlaceholder(value) ? undefined : value}
          placeholder='Select...'
          onChange={(newValue) => onCellChange(record.id, 'dateRule', newValue)}
          options={DATE_RULE_OPTIONS}
          size='small'
          style={{ width: '100%', ...(isPlaceholder(value) ? placeholderStyle : {}) }}
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 50,
      render: (_: unknown, record: ScenarioFormulaComponent) => (
        <Popconfirm
          title='Delete this component?'
          onConfirm={() => onDeleteComponent(record.id)}
          okText='Delete'
          cancelText='Cancel'
        >
          <GraviButton
            icon={<DeleteOutlined />}
            appearance='outlined'
            size='small'
            style={{ minWidth: 'auto', padding: '4px 8px' }}
          />
        </Popconfirm>
      ),
    },
  ]
}

// Helper: Calculate new status
function getNewStatus(currentStatus: string, hasComponents: boolean): 'empty' | 'in-progress' | 'confirmed' {
  if (!hasComponents) return 'empty'
  if (currentStatus === 'confirmed' || currentStatus === 'empty') return 'in-progress'
  return currentStatus as 'in-progress'
}

// Sub-component: Row Header
function RowHeader({
  detail,
  isSelected,
  onToggleExpand,
  onCheckboxClick,
}: {
  detail: DetailFormulaConfig
  isSelected: boolean
  onToggleExpand: () => void
  onCheckboxClick: (e: React.MouseEvent) => void
}) {
  return (
    <div className={styles.detailRowHeader} onClick={onToggleExpand}>
      <div className={styles.rowCheckbox} onClick={onCheckboxClick}>
        <Checkbox checked={isSelected} />
      </div>
      <RightOutlined className={styles.expandArrow} />
      <Texto className={styles.detailName}>{detail.name}</Texto>
      <div className={styles.rowStatus}>
        <span className={getStatusPillClass(detail.status)}>
          <span className={styles.statusDot} />
          {getStatusText(detail.status)}
        </span>
      </div>
    </div>
  )
}

// Sub-component: Context Menu
function ContextMenu({
  position,
  canCopy,
  canPaste,
  canApplyToSelected,
  selectedCount,
  onCopy,
  onPaste,
  onEdit,
  onApplyToSelected,
}: {
  position: { x: number; y: number }
  canCopy: boolean
  canPaste: boolean
  canApplyToSelected: boolean
  selectedCount: number
  onCopy: () => void
  onPaste: () => void
  onEdit: () => void
  onApplyToSelected: () => void
}) {
  return (
    <div className={styles.contextMenu} style={{ left: position.x, top: position.y }} onClick={(e) => e.stopPropagation()}>
      <div className={`${styles.contextMenuItem} ${!canCopy ? styles.disabled : ''}`} onClick={canCopy ? onCopy : undefined}>
        <CopyOutlined />
        <span>Copy Formula</span>
        <Horizontal flex="1" justifyContent="flex-end">
          <span style={{ color: '#8c8c8c', fontSize: '12px' }}>Ctrl+C</span>
        </Horizontal>
      </div>
      <div className={`${styles.contextMenuItem} ${!canPaste ? styles.disabled : ''}`} onClick={canPaste ? onPaste : undefined}>
        <SnippetsOutlined />
        <span>Paste Formula</span>
        <Horizontal flex="1" justifyContent="flex-end">
          <span style={{ color: '#8c8c8c', fontSize: '12px' }}>Ctrl+V</span>
        </Horizontal>
      </div>
      <div className={styles.contextMenuDivider} />
      <div className={styles.contextMenuItem} onClick={onEdit}>
        <span>Edit Detail</span>
      </div>
      {canApplyToSelected && (
        <>
          <div className={styles.contextMenuDivider} />
          <div className={styles.contextMenuItem} onClick={onApplyToSelected}>
            <span>Apply to Selected ({selectedCount})</span>
          </div>
        </>
      )}
    </div>
  )
}

export function DetailRow({
  detail,
  isExpanded,
  isSelected,
  clipboard,
  selectedCount,
  onToggleExpand,
  onToggleSelect,
  onUpdateDetail,
  onCopy,
  onPaste,
  onApplyToSelected,
}: DetailRowProps) {
  const { templates } = useFormulaTemplateContext()
  const [showTemplateChooser, setShowTemplateChooser] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contextMenu) return
    const close = () => setContextMenu(null)
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('click', close)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('click', close)
      document.removeEventListener('keydown', onEscape)
    }
  }, [contextMenu])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleCheckboxClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onToggleSelect()
    },
    [onToggleSelect]
  )

  const handleAddRow = useCallback(() => {
    const maxId = Math.max(0, ...detail.components.map((c) => c.id))
    const newComponent: ScenarioFormulaComponent = {
      id: maxId + 1,
      percentage: PLACEHOLDER_VALUES.PERCENTAGE,
      source: PLACEHOLDER_VALUES.SOURCE,
      instrument: PLACEHOLDER_VALUES.INSTRUMENT,
      type: PLACEHOLDER_VALUES.TYPE,
      dateRule: PLACEHOLDER_VALUES.DATE_RULE,
      required: false,
    }
    onUpdateDetail({
      ...detail,
      components: [...detail.components, newComponent],
      status: getNewStatus(detail.status, true),
    })
  }, [detail, onUpdateDetail])

  const handleTemplateSelect = useCallback(
    (template: FormulaTemplate) => {
      const maxId = Math.max(0, ...detail.components.map((c) => c.id))
      const newComponents: ScenarioFormulaComponent[] = template.components.map(
        (comp: TemplateComponent, index: number) => ({
          id: maxId + index + 1,
          percentage: comp.percentage,
          source: comp.source,
          instrument: comp.instrument,
          type: comp.type,
          dateRule: comp.dateRule,
          required: false,
        })
      )
      onUpdateDetail({
        ...detail,
        components: [...detail.components, ...newComponents],
        status: getNewStatus(detail.status, true),
        hasTemplate: true,
      })
      setShowTemplateChooser(false)
    },
    [detail, onUpdateDetail]
  )

  const handleDeleteComponent = useCallback(
    (componentId: number) => {
      const newComponents = detail.components.filter((c) => c.id !== componentId)
      onUpdateDetail({
        ...detail,
        components: newComponents,
        status: getNewStatus(detail.status, newComponents.length > 0),
      })
    },
    [detail, onUpdateDetail]
  )

  const handleConfirm = useCallback(() => {
    onUpdateDetail({ ...detail, status: 'confirmed' })
  }, [detail, onUpdateDetail])

  // Handle cell value changes - editing a confirmed row reverts it to in-progress
  const handleCellChange = useCallback(
    (componentId: number, field: string, value: string) => {
      const updatedComponents = detail.components.map((comp) =>
        comp.id === componentId ? { ...comp, [field]: value } : comp
      )
      const newStatus = detail.status === 'confirmed' ? 'in-progress' : detail.status
      onUpdateDetail({
        ...detail,
        components: updatedComponents,
        status: newStatus as 'empty' | 'in-progress' | 'confirmed',
      })
    },
    [detail, onUpdateDetail]
  )

  const canCopy = detail.components.length > 0
  const canPaste = clipboard.hasContent
  const canConfirm = detail.status === 'in-progress' && detail.components.length > 0
  const canApplyToSelected = canCopy && selectedCount > 0 && !isSelected
  const tableColumns = createTableColumns(handleDeleteComponent, handleCellChange)
  const rowClasses = [styles.detailRow, isSelected && styles.selected, isExpanded && styles.expanded].filter(Boolean).join(' ')

  if (showTemplateChooser) {
    return (
      <div className={rowClasses} ref={rowRef}>
        <RowHeader detail={detail} isSelected={isSelected} onToggleExpand={onToggleExpand} onCheckboxClick={handleCheckboxClick} />
        <div className={styles.expandedContent}>
          <TemplateChooser
            templates={templates}
            onTemplateSelect={handleTemplateSelect}
            showManageButton={false}
            onClose={() => setShowTemplateChooser(false)}
            showExternalName={false}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={rowClasses} ref={rowRef} onContextMenu={handleContextMenu}>
      <RowHeader detail={detail} isSelected={isSelected} onToggleExpand={onToggleExpand} onCheckboxClick={handleCheckboxClick} />

      {isExpanded && (
        <div className={styles.expandedContent}>
          <div className={styles.expandedSection}>
            <Texto className={styles.sectionLabel}>Formula Components</Texto>
            {detail.components.length > 0 ? (
              <Table dataSource={detail.components} columns={tableColumns} rowKey="id" pagination={false} size="small" className={styles.componentsTable} />
            ) : (
              <div className={styles.emptyComponents}>
                <Texto category="p2" appearance="medium">No formula components. Add a row or use a template.</Texto>
              </div>
            )}
          </div>

          <div className={styles.expandedActions}>
            <div className={styles.leftActions}>
              <GraviButton buttonText="Add Row" icon={<PlusOutlined />} appearance="outlined" size="small" onClick={handleAddRow} />
              <GraviButton buttonText="Add Template" icon={<PlusOutlined />} appearance="outlined" size="small" onClick={() => setShowTemplateChooser(true)} />
              {canCopy && <GraviButton buttonText="Copy" icon={<CopyOutlined />} appearance="outlined" size="small" onClick={onCopy} />}
              {canApplyToSelected && <GraviButton buttonText={`Apply to Selected (${selectedCount})`} appearance="outlined" size="small" onClick={onApplyToSelected} />}
            </div>
            <div className={styles.rightActions}>
              {canConfirm && <GraviButton buttonText="Confirm" icon={<CheckCircleOutlined />} success size="small" onClick={handleConfirm} />}
            </div>
          </div>
        </div>
      )}

      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          canCopy={canCopy}
          canPaste={canPaste}
          canApplyToSelected={canApplyToSelected}
          selectedCount={selectedCount}
          onCopy={() => { onCopy(); setContextMenu(null) }}
          onPaste={() => { onPaste(); setContextMenu(null) }}
          onEdit={() => { onToggleExpand(); setContextMenu(null) }}
          onApplyToSelected={() => { onApplyToSelected(); setContextMenu(null) }}
        />
      )}
    </div>
  )
}
