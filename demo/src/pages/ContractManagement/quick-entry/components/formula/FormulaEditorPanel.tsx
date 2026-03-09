/**
 * Formula Editor Panel
 *
 * Right panel for configuring the formula.
 * - "Generated Formula" display with stacked label
 * - Advanced checkbox to toggle expression editability
 * - Select dropdown for Formula / Lower of Two / Lower of Three
 * - Grouped variable sections for Lower of modes
 * - Use Template button with placeholder
 */

import { useMemo } from 'react'
import { Vertical, Horizontal, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { Input, Select, Checkbox } from 'antd'
import { PlusOutlined, CheckCircleFilled, CloseCircleFilled, FileTextOutlined } from '@ant-design/icons'

import { VariablesTable } from './VariablesTable'
import { OperatorToolbar } from './OperatorToolbar'
import { getVariablesByGroup, buildExpression } from './formulaUtils'
import { isPlaceholder } from '../../../../demos/grids/FormulaTemplates.data'
import type { Formula, FormulaVariable, FormulaMode } from '../../../../../shared/types/formula.types'
import styles from './FormulaEditorPanel.module.css'

interface FormulaEditorPanelProps {
  formula: Formula
  mode: FormulaMode
  onModeChange: (mode: FormulaMode) => void
  onVariableUpdate: (variableId: string, updates: Partial<FormulaVariable>) => void
  onAddVariable: (groupNumber?: number) => void
  onRemoveVariable: (variableId: string) => void
  isAdvanced: boolean
  onAdvancedChange: (checked: boolean) => void
  advancedExpression: string
  onExpressionChange: (expr: string) => void
  onUseTemplate: () => void
}

/**
 * Validate formula — checks for missing instruments and unresolved placeholders
 */
function validateFormula(formula: Formula): { valid: boolean; message?: string } {
  if (formula.variables.length === 0) {
    return { valid: false, message: 'At least one variable is required' }
  }

  for (const v of formula.variables) {
    if (!v.priceInstrument) {
      return { valid: false, message: 'All variables must have an instrument selected' }
    }
    if (
      isPlaceholder(v.pricePublisher) ||
      isPlaceholder(v.priceInstrument) ||
      isPlaceholder(v.priceType) ||
      isPlaceholder(v.dateRule) ||
      isPlaceholder(v.percentage)
    ) {
      return { valid: false, message: 'Fill all placeholder fields (shown in purple)' }
    }
  }

  return { valid: true }
}

const MODE_OPTIONS = [
  { value: 'formula' as const, label: 'Formula' },
  { value: 'lower-of-2' as const, label: 'Lower of Two' },
  { value: 'lower-of-3' as const, label: 'Lower of Three' },
]

export function FormulaEditorPanel({
  formula,
  mode,
  onModeChange,
  onVariableUpdate,
  onAddVariable,
  onRemoveVariable,
  isAdvanced,
  onAdvancedChange,
  advancedExpression,
  onExpressionChange,
  onUseTemplate,
}: FormulaEditorPanelProps) {
  // Auto-build expression from variables
  const expression = useMemo(() => {
    if (isAdvanced) return advancedExpression
    return buildExpression(formula.variables, mode)
  }, [formula.variables, mode, isAdvanced, advancedExpression])

  // Group variables for Lower of modes
  const variablesByGroup = useMemo(() => getVariablesByGroup(formula.variables), [formula.variables])

  // Validation
  const validation = useMemo(() => validateFormula(formula), [formula])

  // Handle operator insert (advanced mode)
  const handleOperatorInsert = (operator: string) => {
    onExpressionChange(`${advancedExpression} ${operator} `)
  }

  return (
    <Vertical height='100%'>
      {/* Formula Section — fixed size, not flexed */}
      <Vertical className={styles.formulaSection} flex='none' height='auto'>
        <Texto
          category='p2'
          appearance='medium'
          weight='600'
          style={{ textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px' }}
        >
          Generated Formula
        </Texto>
        <Horizontal gap={12} alignItems='center'>
          <div className={styles.formulaDisplay}>
            {isAdvanced ? (
              <Input.TextArea
                value={advancedExpression}
                onChange={(e) => onExpressionChange(e.target.value)}
                placeholder='Enter formula expression...'
                rows={2}
                className={styles.formulaTextarea}
              />
            ) : (
              <div className={`${styles.formulaDisplayContent} ${!expression ? styles.empty : ''}`}>
                {expression || 'Add variables below to build formula'}
              </div>
            )}
          </div>

          {/* Validation badge - shown in advanced mode or when placeholders exist */}
          {(isAdvanced || !validation.valid) && (
            <div className={`${styles.statusBadge} ${validation.valid ? styles.valid : styles.invalid}`}>
              {validation.valid ? (
                <>
                  <CheckCircleFilled /> Valid
                </>
              ) : (
                <>
                  <CloseCircleFilled /> {validation.message}
                </>
              )}
            </div>
          )}
        </Horizontal>

        {/* Advanced checkbox */}
        <div className={styles.advancedCheckbox}>
          <Checkbox checked={isAdvanced} onChange={(e) => onAdvancedChange(e.target.checked)}>
            <Texto category='p2'>Advanced — edit formula expression directly</Texto>
          </Checkbox>
        </div>

        {/* Operator toolbar - only in advanced mode */}
        {isAdvanced && (
          <Horizontal gap={16} alignItems='center'>
            <OperatorToolbar onInsert={handleOperatorInsert} />
          </Horizontal>
        )}

        {/* Quick help - only in advanced mode */}
        {isAdvanced && (
          <div className={styles.quickHelp}>
            <strong>Functions:</strong> MIN(), MAX(), IF(), ABS() &nbsp;|&nbsp;
            <strong>Example:</strong> <code>MIN(OPIS_Rack + 0.05, Platts)</code>
          </div>
        )}

        {/* Mode dropdown */}
        <div className={styles.modeDropdown}>
          <Texto category='p2' appearance='medium' weight='600' style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>
            Formula Type
          </Texto>
          <Select
            value={mode}
            onChange={(value: FormulaMode) => onModeChange(value)}
            options={MODE_OPTIONS}
            style={{ width: 200 }}
            size='small'
          />
        </div>
      </Vertical>

      {/* Variables Section — fills remaining space */}
      <Vertical className={styles.variablesSection} flex='1' height='auto'>
        {mode === 'lower-of-2' || mode === 'lower-of-3' ? (
          // Grouped variable sections
          <>
            {(mode === 'lower-of-2' ? [1, 2] : [1, 2, 3]).map((groupNum) => {
              const groupVars = variablesByGroup[groupNum] || []
              return (
                <Vertical key={groupNum} className={styles.groupSection}>
                  <Horizontal justifyContent='space-between' alignItems='center'>
                    <Texto category='p1' weight='600' style={{ fontSize: '13px' }}>
                      Formula {groupNum}
                    </Texto>
                    <Horizontal gap={8}>
                      <GraviButton
                        buttonText='Add Variable'
                        icon={<PlusOutlined />}
                        onClick={() => onAddVariable(groupNum)}
                      />
                    </Horizontal>
                  </Horizontal>
                  <VariablesTable
                    variables={groupVars}
                    onVariableUpdate={onVariableUpdate}
                    onRemoveVariable={onRemoveVariable}
                  />
                </Vertical>
              )
            })}
          </>
        ) : (
          // Standard single-table view (formula mode)
          <>
            <Horizontal justifyContent='space-between' alignItems='center'>
              <Texto category='p1' weight='600' style={{ fontSize: '13px' }}>
                Formula Variables
              </Texto>
              <Horizontal gap={8}>
                <GraviButton buttonText='Add Variable' icon={<PlusOutlined />} onClick={() => onAddVariable()} />
                <GraviButton buttonText='Use Template' icon={<FileTextOutlined />} onClick={onUseTemplate} />
              </Horizontal>
            </Horizontal>
            <VariablesTable
              variables={formula.variables}
              onVariableUpdate={onVariableUpdate}
              onRemoveVariable={onRemoveVariable}
            />
          </>
        )}
      </Vertical>
    </Vertical>
  )
}
