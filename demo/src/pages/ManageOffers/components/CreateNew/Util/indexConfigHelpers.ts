import type { IndexPricingFormData } from '../../../ManageOffers.types'
import { fmt } from '../../../utils/formatters'

const isDefinedAndNotNull = (val: any): boolean => val !== null && val !== undefined

export function convertComponentsToFormula(indexPricingData: IndexPricingFormData) {
  const components = indexPricingData.formulaComponents
  const formulaVariables = components.map((component, index) => ({
    VariableName: `var_${index + 1}`,
    DisplayName: component.DisplayName || '',
    Percentage: component.Percentage ?? 100,
    PricePublisherId: component.PricePublisherId,
    PriceInstrumentId: component.PriceInstrumentId,
    PriceValuationRuleId: component.PriceValuationRuleId,
    PriceTypeCvId: component.PriceTypeCvId,
    Differential: component.Differential,
  }))

  const formulaString = formulaVariables.map((v) => v.VariableName).join(' + ')

  return {
    FormulaVariables: formulaVariables,
    Formula: formulaString,
  }
}

export function getPriceAdjustValue(savedIndexData: any, isAuction: boolean): string | undefined {
  if (!savedIndexData) return ''
  if (isAuction) {
    return isDefinedAndNotNull(savedIndexData.ReservePrice) ? fmt.currency(savedIndexData.ReservePrice) : ''
  }
  return isDefinedAndNotNull(savedIndexData.FormulaDifferential)
    ? `${fmt.currency(savedIndexData.FormulaDifferential)}`
    : ''
}
