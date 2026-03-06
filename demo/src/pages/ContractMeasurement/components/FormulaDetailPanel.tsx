import { useState, useCallback } from 'react'
import { Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Table, Popconfirm, Select, Input } from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  SnippetsOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type {
  DetailFormulaConfig,
  ScenarioFormulaComponent,
  FormulaClipboard,
  FormulaMode,
} from '../types/scenario.types'
import {
  PLACEHOLDER_VALUES,
  isPlaceholder,
  FormulaTemplate,
  TemplateComponent,
} from '../../demos/grids/FormulaTemplates.data'
import { TemplateChooser } from '../../../components/shared/TemplateChooser'
import { useFormulaTemplateContext } from '../../../contexts/FormulaTemplateContext'
import styles from './FormulaDetailPanel.module.css'

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

const MODE_OPTIONS = [
  { value: 'formula', label: 'Formula' },
  { value: 'lower-of-2', label: 'Lower of Two' },
  { value: 'lower-of-3', label: 'Lower of Three' },
]

// Build a human-readable expression string from components + mode
function buildComponentExpression(
  components: ScenarioFormulaComponent[],
  mode: FormulaMode
): string {
  const formatComp = (c: ScenarioFormulaComponent): string => {
    const label =
      !isPlaceholder(c.source) && !isPlaceholder(c.instrument)
        ? `${c.source} ${c.instrument}`
        : '[Unresolved]'
    const diff = (c.differential ?? 0) !== 0
      ? ` ${c.differential! > 0 ? '+' : '-'} $${Math.abs(c.differential!).toFixed(4)}`
      : ''
    return `${label}${diff}`
  }

  if (mode === 'lower-of-2' || mode === 'lower-of-3') {
    const count = mode === 'lower-of-2' ? 2 : 3
    const groups: Record<number, ScenarioFormulaComponent[]> = {}
    components.forEach((c) => {
      const g = c.group ?? 1
      if (!groups[g]) groups[g] = []
      groups[g].push(c)
    })
    const parts = Array.from({ length: count }, (_, i) => {
      const g = groups[i + 1] || []
      return g.length > 0 ? g.map(formatComp).join(' + ') : '...'
    })
    return `MIN(${parts.join(', ')})`
  }

  if (components.length === 0) return ''
  return components.map(formatComp).join(' + ')
}

// Helper: Create table columns with editable cells
function createTableColumns(
  onDeleteComponent: (id: number) => void,
  onCellChange: (componentId: number, field: string, value: string | number) => void
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
          size="small"
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
          placeholder="Select..."
          onChange={(newValue) => onCellChange(record.id, 'source', newValue)}
          options={PUBLISHER_OPTIONS}
          size="small"
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
          placeholder="Select..."
          onChange={(newValue) => onCellChange(record.id, 'instrument', newValue)}
          options={INSTRUMENT_OPTIONS}
          size="small"
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
          placeholder="Select..."
          onChange={(newValue) => onCellChange(record.id, 'type', newValue)}
          options={TYPE_OPTIONS}
          size="small"
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
          placeholder="Select..."
          onChange={(newValue) => onCellChange(record.id, 'dateRule', newValue)}
          options={DATE_RULE_OPTIONS}
          size="small"
          style={{ width: '100%', ...(isPlaceholder(value) ? placeholderStyle : {}) }}
        />
      ),
    },
    {
      title: 'DIFFERENTIAL',
      dataIndex: 'differential',
      key: 'differential',
      width: 120,
      render: (value: number | undefined, record: ScenarioFormulaComponent) => (
        <Input
          value={value ?? 0}
          type="number"
          prefix="$"
          onChange={(e) => onCellChange(record.id, 'differential', parseFloat(e.target.value) || 0)}
          size="small"
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 40,
      render: (_: unknown, record: ScenarioFormulaComponent) => (
        <Popconfirm
          title="Delete this component?"
          onConfirm={() => onDeleteComponent(record.id)}
          okText="Delete"
          cancelText="Cancel"
        >
          <DeleteOutlined className={styles.deleteIcon} />
        </Popconfirm>
      ),
    },
  ]
}

// Helper: Calculate new status
function getNewStatus(
  currentStatus: string,
  hasComponents: boolean
): 'empty' | 'in-progress' | 'confirmed' {
  if (!hasComponents) return 'empty'
  if (currentStatus === 'confirmed' || currentStatus === 'empty') return 'in-progress'
  return currentStatus as 'in-progress'
}

interface FormulaDetailPanelProps {
  data: DetailFormulaConfig
  clipboard: FormulaClipboard
  selectedCount: number
  onUpdateDetail: (updated: DetailFormulaConfig) => void
  onCopy: () => void
  onPaste: () => void
  onApplyToSelected: () => void
}

export function FormulaDetailPanel({
  data,
  clipboard,
  selectedCount,
  onUpdateDetail,
  onCopy,
  onPaste,
  onApplyToSelected,
}: FormulaDetailPanelProps) {
  const { templates } = useFormulaTemplateContext()
  const [showTemplateChooser, setShowTemplateChooser] = useState(false)

  const [formulaMode, setFormulaMode] = useState<FormulaMode>(data.formulaMode ?? 'formula')

  const canCopy = data.components.length > 0
  const canPaste = clipboard.hasContent && clipboard.sourceId !== data.detailId
  const canApplyToSelected = selectedCount > 1 && data.components.length > 0
  const canConfirm = data.status === 'in-progress' && data.components.length > 0

  const expression = buildComponentExpression(data.components, formulaMode)

  const handleAddRow = useCallback(
    (groupNumber = 1) => {
      const maxId = Math.max(0, ...data.components.map((c) => c.id))
      const newComponent: ScenarioFormulaComponent = {
        id: maxId + 1,
        percentage: PLACEHOLDER_VALUES.PERCENTAGE,
        source: PLACEHOLDER_VALUES.SOURCE,
        instrument: PLACEHOLDER_VALUES.INSTRUMENT,
        type: PLACEHOLDER_VALUES.TYPE,
        dateRule: PLACEHOLDER_VALUES.DATE_RULE,
        required: false,
        differential: 0,
        group: groupNumber,
      }
      onUpdateDetail({
        ...data,
        components: [...data.components, newComponent],
        status: getNewStatus(data.status, true),
      })
    },
    [data, onUpdateDetail]
  )

  const handleTemplateSelect = useCallback(
    (template: FormulaTemplate) => {
      const maxId = Math.max(0, ...data.components.map((c) => c.id))
      const newComponents: ScenarioFormulaComponent[] = template.components.map(
        (comp: TemplateComponent, index: number) => ({
          id: maxId + index + 1,
          percentage: comp.percentage,
          source: comp.source,
          instrument: comp.instrument,
          type: comp.type,
          dateRule: comp.dateRule,
          required: false,
          differential: 0,
          group: 1,
        })
      )
      onUpdateDetail({
        ...data,
        components: [...data.components, ...newComponents],
        status: getNewStatus(data.status, true),
        hasTemplate: true,
      })
      setShowTemplateChooser(false)
    },
    [data, onUpdateDetail]
  )

  const handleDeleteComponent = useCallback(
    (componentId: number) => {
      const newComponents = data.components.filter((c) => c.id !== componentId)
      onUpdateDetail({
        ...data,
        components: newComponents,
        status: getNewStatus(data.status, newComponents.length > 0),
      })
    },
    [data, onUpdateDetail]
  )

  const handleCellChange = useCallback(
    (componentId: number, field: string, value: string | number) => {
      const updatedComponents = data.components.map((comp) =>
        comp.id === componentId ? { ...comp, [field]: value } : comp
      )
      const newStatus = data.status === 'confirmed' ? 'in-progress' : data.status
      onUpdateDetail({
        ...data,
        components: updatedComponents,
        status: newStatus as 'empty' | 'in-progress' | 'confirmed',
      })
    },
    [data, onUpdateDetail]
  )

  const handleModeChange = useCallback(
    (newMode: FormulaMode) => {
      setFormulaMode(newMode)
      // Reassign all existing components to group 1 when switching mode
      const reassigned = data.components.map((c) => ({ ...c, group: 1 }))
      onUpdateDetail({
        ...data,
        formulaMode: newMode,
        components: reassigned,
      })
    },
    [data, onUpdateDetail]
  )

  const handleConfirm = useCallback(() => {
    if (canConfirm) {
      onUpdateDetail({ ...data, status: 'confirmed' })
    }
  }, [canConfirm, data, onUpdateDetail])

  const tableColumns = createTableColumns(handleDeleteComponent, handleCellChange)

  // Show Template Chooser mode
  if (showTemplateChooser) {
    return (
      <div className={styles.detailPanel}>
        <TemplateChooser
          templates={templates}
          onTemplateSelect={handleTemplateSelect}
          buildFormulaPreview={(template: FormulaTemplate) =>
            template.components
              .map((c: TemplateComponent) => `${c.source} ${c.instrument}`)
              .join(' + ')
          }
          showManageButton={false}
          onClose={() => setShowTemplateChooser(false)}
          showExternalName={false}
        />
      </div>
    )
  }

  const groupComponents = (groupNum: number) =>
    data.components.filter((c) => (c.group ?? 1) === groupNum)

  const groupCount = formulaMode === 'lower-of-3' ? 3 : formulaMode === 'lower-of-2' ? 2 : 1

  return (
    <div className={styles.detailPanel}>
      {/* Formula Type + Generated Formula header */}
      <div className={styles.formulaHeader}>
        <div className={styles.formulaTypeRow}>
          <Texto category="p2" weight="700" style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Formula Type
          </Texto>
          <Select
            value={formulaMode}
            onChange={handleModeChange}
            options={MODE_OPTIONS}
            size="small"
            style={{ width: 160 }}
            getPopupContainer={() => document.body}
          />
        </div>
        <div className={styles.formulaPreview}>
          <Texto category="p2" weight="700" style={{ fontSize: '11px', color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', display: 'block' }}>
            Generated Formula
          </Texto>
          <div className={`${styles.formulaExpression} ${!expression ? styles.formulaExpressionEmpty : ''}`}>
            <Texto
              category="p2"
              style={{ fontFamily: `'Menlo', 'Monaco', 'Courier New', monospace`, color: expression ? '#595959' : '#722ed1', fontStyle: expression ? 'normal' : 'italic' }}
            >
              {expression || 'Add components below to build formula'}
            </Texto>
          </div>
        </div>
      </div>

      {/* Formula Components Section */}
      <div className={styles.section}>
        <Texto
          category="p2"
          weight="700"
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#8c8c8c',
            marginBottom: '16px',
            display: 'block',
          }}
        >
          Formula Components
        </Texto>

        {formulaMode === 'formula' ? (
          // Single flat table
          data.components.length > 0 ? (
            <Table
              dataSource={data.components}
              columns={tableColumns}
              rowKey="id"
              pagination={false}
              size="small"
              className={styles.componentsTable}
            />
          ) : (
            <div className={styles.emptyState}>
              <Texto category="p2" appearance="medium">
                No formula components. Add a row or use a template.
              </Texto>
            </div>
          )
        ) : (
          // Grouped sections for lower-of modes
          Array.from({ length: groupCount }, (_, i) => i + 1).map((groupNum) => {
            const groupRows = groupComponents(groupNum)
            return (
              <div key={groupNum} className={styles.groupSection}>
                <div className={styles.groupHeader}>
                  <Texto category="p2" weight="600" style={{ fontSize: '12px' }}>
                    Formula {groupNum}
                  </Texto>
                  <GraviButton
                    buttonText="Add Row"
                    icon={<PlusOutlined />}
                    appearance="outlined"
                    size="small"
                    onClick={() => handleAddRow(groupNum)}
                  />
                </div>
                {groupRows.length > 0 ? (
                  <Table
                    dataSource={groupRows}
                    columns={tableColumns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    className={styles.componentsTable}
                  />
                ) : (
                  <div className={styles.emptyState}>
                    <Texto category="p2" appearance="medium">
                      No components. Add a row to this formula group.
                    </Texto>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <div className={styles.leftActions}>
          {canPaste && (
            <GraviButton
              buttonText="Paste"
              icon={<SnippetsOutlined />}
              appearance="outlined"
              size="small"
              onClick={onPaste}
            />
          )}
          {canApplyToSelected && (
            <GraviButton
              buttonText={`Apply to Selected (${selectedCount})`}
              appearance="outlined"
              size="small"
              onClick={onApplyToSelected}
            />
          )}
        </div>
        <div className={styles.rightActions}>
          {formulaMode === 'formula' && (
            <GraviButton
              buttonText="Add Row"
              icon={<PlusOutlined />}
              appearance="outlined"
              size="small"
              onClick={() => handleAddRow(1)}
            />
          )}
          <GraviButton
            buttonText="Add Template"
            icon={<PlusOutlined />}
            appearance="outlined"
            size="small"
            onClick={() => setShowTemplateChooser(true)}
          />
          {canCopy && (
            <GraviButton
              buttonText="Copy"
              icon={<CopyOutlined />}
              appearance="outlined"
              size="small"
              onClick={onCopy}
            />
          )}
          {canConfirm && (
            <GraviButton
              buttonText="Confirm"
              icon={<CheckCircleOutlined />}
              success
              size="small"
              onClick={handleConfirm}
            />
          )}
        </div>
      </div>
    </div>
  )
}
