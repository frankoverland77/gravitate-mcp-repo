import type { IndexOfferFormulaComponent } from '../../../../../ManageOffers.types'

export const blankFormulaComponentRow = (id: number): IndexOfferFormulaComponent => ({
  Percentage: null,
  PricePublisherId: null,
  PriceInstrumentId: null,
  PriceValuationRuleId: null,
  PriceTypeCvId: null,
  DisplayName: '',
  Differential: null,
  IdForGrid: id,
  isDisplayNameCustomized: false,
})
