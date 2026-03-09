/**
 * Formula Editor Drawer
 *
 * Bottom slide-up drawer for configuring formulas on contract details.
 * Two-panel layout: Context Summary (left) + Formula Editor (right).
 * Restyled to match wireframe prototype v4.
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Drawer } from 'antd'
import { Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { CloseOutlined, CaretDownOutlined, CopyOutlined, SnippetsOutlined } from '@ant-design/icons'

import { ContextSummaryPanel } from './formula/ContextSummaryPanel'
import { FormulaEditorPanel } from './formula/FormulaEditorPanel'
import { buildExpression } from './formula/formulaUtils'
import { TemplateChooser } from '../../../../components/shared/TemplateChooser'
import { useFormulaTemplateContext } from '../../../../contexts/FormulaTemplateContext'
import { buildFormulaPreview, isPlaceholder } from '../../../demos/grids/FormulaTemplates.data'
import type { TemplateComponent } from '../../../demos/grids/FormulaTemplates.data'
import type { ContractDetail } from '../../types/contract.types'
import type { Formula, FormulaVariable, FormulaMode, ProvisionType } from '../../../../shared/types/formula.types'
import styles from './FormulaEditorDrawer.module.css'

interface FormulaEditorDrawerProps {
  open: boolean
  detail: ContractDetail | null
  onClose: () => void
  onSave: (detail: ContractDetail) => void
}

// Default empty formula
const createEmptyFormula = (): Formula => ({
  id: `formula-${Date.now()}`,
  name: '',
  expression: '',
  variables: [],
})

function provisionTypeToMode(pt: ProvisionType): FormulaMode {
  if (pt === 'Lesser Of 2') return 'lower-of-2'
  if (pt === 'Lesser Of 3') return 'lower-of-3'
  return 'formula'
}

function modeToProvisionType(mode: FormulaMode): ProvisionType {
  if (mode === 'lower-of-2') return 'Lesser Of 2'
  if (mode === 'lower-of-3') return 'Lesser Of 3'
  return 'Formula'
}

export function FormulaEditorDrawer({ open, detail, onClose, onSave }: FormulaEditorDrawerProps) {
  // Local state for editing
  const [formula, setFormula] = useState<Formula>(createEmptyFormula())
  const [mode, setMode] = useState<FormulaMode>('formula')
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [advancedExpression, setAdvancedExpression] = useState('')
  const [showTemplateChooser, setShowTemplateChooser] = useState(false)

  // Template context
  const { templates } = useFormulaTemplateContext()

  // Initialize state when detail changes
  useEffect(() => {
    if (detail) {
      setFormula(detail.formula || createEmptyFormula())
      setMode(provisionTypeToMode(detail.provisionType))
      setIsAdvanced(false)
      setAdvancedExpression('')
      setShowTemplateChooser(false)
    }
  }, [detail])

  // Handle advanced toggle
  const handleAdvancedChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        setAdvancedExpression(buildExpression(formula.variables, mode))
      }
      setIsAdvanced(checked)
    },
    [formula.variables, mode]
  )

  // Handle variable update
  const handleVariableUpdate = useCallback((variableId: string, updates: Partial<FormulaVariable>) => {
    setFormula((prev) => ({
      ...prev,
      variables: prev.variables.map((v) => (v.id === variableId ? { ...v, ...updates } : v)),
    }))
  }, [])

  // Handle mode change
  const handleModeChange = useCallback(
    (newMode: FormulaMode) => {
      setMode(newMode)
      setFormula((prev) => {
        let updatedVars = [...prev.variables]
        if (newMode === 'formula') {
          // Collapse all variables to group_1
          updatedVars = updatedVars.map((v) => ({
            ...v,
            variableName: v.variableName.replace(/group_\d+/, 'group_1'),
          }))
        } else if (newMode === 'lower-of-2') {
          // Move group_3 variables to group_1
          updatedVars = updatedVars.map((v) =>
            v.variableName.includes('group_3')
              ? { ...v, variableName: v.variableName.replace('group_3', 'group_1') }
              : v
          )
        }
        const newFormula = { ...prev, variables: updatedVars }
        // Regenerate advanced expression when mode changes while advanced is on
        if (isAdvanced) {
          setAdvancedExpression(buildExpression(updatedVars, newMode))
        }
        return newFormula
      })
    },
    [isAdvanced]
  )

  // Handle add variable with group number
  const handleAddVariable = useCallback(
    (groupNumber: number = 1) => {
      const nextIndex = formula.variables.length + 1
      const newVariable: FormulaVariable = {
        id: `var-${Date.now()}`,
        variableName: `var_${nextIndex}_group_${groupNumber}`,
        displayName: null,
        pricePublisher: 'OPIS',
        priceInstrument: 'CBOB USGC',
        priceType: 'Average',
        dateRule: 'Prior Day',
        percentage: 100,
        differential: 0,
      }

      setFormula((prev) => ({
        ...prev,
        variables: [...prev.variables, newVariable],
      }))
    },
    [formula.variables.length]
  )

  // Handle remove variable
  const handleRemoveVariable = useCallback((variableId: string) => {
    setFormula((prev) => ({
      ...prev,
      variables: prev.variables.filter((v) => v.id !== variableId),
    }))
  }, [])

  // Handle template selection from TemplateChooser
  const handleTemplateSelect = useCallback(
    (template: { components: TemplateComponent[] }) => {
      const variables: FormulaVariable[] = template.components.map((comp, index) => {
        // Parse percentage: preserve placeholder, otherwise parse to number
        const pctStr = String(comp.percentage).replace('%', '').trim()
        const percentage = isPlaceholder(comp.percentage) ? comp.percentage : (parseFloat(pctStr) || 100)

        return {
          id: `var-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
          variableName: `var_${index + 1}_group_1`,
          displayName:
            isPlaceholder(comp.source) || isPlaceholder(comp.instrument)
              ? null
              : `${comp.source} ${comp.instrument}`,
          pricePublisher: comp.source,
          priceInstrument: comp.instrument,
          priceType: comp.type,
          dateRule: comp.dateRule,
          percentage,
          differential: 0,
        }
      })

      const newFormula: Formula = {
        id: `formula-${Date.now()}`,
        name: '',
        expression: buildExpression(variables, mode),
        variables,
      }

      setFormula(newFormula)
      setShowTemplateChooser(false)
    },
    [mode]
  )

  // Check if any variables still have unresolved placeholders
  const hasPlaceholders = useMemo(() => {
    return formula.variables.some(
      (v) =>
        isPlaceholder(v.pricePublisher) ||
        isPlaceholder(v.priceInstrument) ||
        isPlaceholder(v.priceType) ||
        isPlaceholder(v.dateRule) ||
        isPlaceholder(v.percentage)
    )
  }, [formula.variables])

  // Handle apply (save)
  const handleApply = useCallback(() => {
    if (!detail) return

    const expression = isAdvanced ? advancedExpression : buildExpression(formula.variables, mode)

    const updatedDetail: ContractDetail = {
      ...detail,
      provisionType: modeToProvisionType(mode),
      formula: { ...formula, expression },
    }

    onSave(updatedDetail)
  }, [detail, formula, mode, isAdvanced, advancedExpression, onSave])

  // Handle copy formula (placeholder)
  const handleCopyFormula = useCallback(() => {
    // Placeholder - would copy formula to clipboard
    console.log('Copy formula:', formula)
  }, [formula])

  // Handle paste formula (placeholder)
  const handlePasteFormula = useCallback(() => {
    // Placeholder - would paste formula from clipboard
    console.log('Paste formula')
  }, [])

  if (!detail) return null

  // Build row badge text (product + location)
  const rowBadgeText = [detail.product, detail.location].filter(Boolean).join(' - ')

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement='bottom'
      height={820}
      title={null}
      closable={false}
      className={styles.drawer}
      styles={{ body: {
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      } }}
    >
      {/* Header - matches wireframe */}
      <Horizontal className={styles.header} justifyContent='space-between' alignItems='center'>
        <Horizontal gap={16} alignItems='center'>
          <button className={styles.collapseToggle} onClick={onClose} title='Close drawer'>
            <CaretDownOutlined />
          </button>
          <Texto category='p1' weight='600'>
            Formula Editor
          </Texto>
          {rowBadgeText && <div className={styles.rowBadge}>{rowBadgeText}</div>}
        </Horizontal>
        <button className={styles.closeBtn} onClick={onClose} title='Close'>
          <CloseOutlined />
        </button>
      </Horizontal>

      {/* Body - Template Chooser or Two column layout */}
      {showTemplateChooser ? (
        <div className={styles.body} style={{ flexDirection: 'column' }}>
          <TemplateChooser
            templates={templates}
            onTemplateSelect={handleTemplateSelect}
            buildFormulaPreview={buildFormulaPreview}
            showManageButton={false}
            title='Formula Template Chooser'
            subtitle='Select a pre-built formula template to apply to this contract detail.'
            onClose={() => setShowTemplateChooser(false)}
            showExternalName={false}
          />
        </div>
      ) : (
        <div className={styles.body}>
          {/* Left Panel - Context Summary */}
          <div className={styles.leftPanel}>
            <ContextSummaryPanel detail={detail} />
          </div>

          {/* Right Panel - Formula Editor */}
          <div className={styles.rightPanel}>
            <FormulaEditorPanel
              formula={formula}
              mode={mode}
              onModeChange={handleModeChange}
              onVariableUpdate={handleVariableUpdate}
              onAddVariable={handleAddVariable}
              onRemoveVariable={handleRemoveVariable}
              isAdvanced={isAdvanced}
              onAdvancedChange={handleAdvancedChange}
              advancedExpression={advancedExpression}
              onExpressionChange={setAdvancedExpression}
              onUseTemplate={() => setShowTemplateChooser(true)}
            />
          </div>
        </div>
      )}

      {/* Sticky Footer */}
      <Horizontal className={styles.footer} justifyContent='space-between' alignItems='center'>
        <Horizontal gap={8}>
          <GraviButton buttonText='Copy' icon={<CopyOutlined />} onClick={handleCopyFormula} />
          <GraviButton buttonText='Paste' icon={<SnippetsOutlined />} onClick={handlePasteFormula} />
        </Horizontal>
        <Horizontal gap={12} alignItems='center'>
          {hasPlaceholders && (
            <Texto category='p2' style={{ color: '#722ed1', fontSize: '12px' }}>
              Fill all placeholder fields before applying
            </Texto>
          )}
          <GraviButton buttonText='Apply' theme1 onClick={handleApply} disabled={hasPlaceholders} />
        </Horizontal>
      </Horizontal>
    </Drawer>
  )
}
