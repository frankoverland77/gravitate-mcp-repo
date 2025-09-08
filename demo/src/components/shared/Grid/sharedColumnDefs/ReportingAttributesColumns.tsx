import { comparator } from '@components/shared/Grid/columnDefComparator'
import { ColDef } from 'ag-grid-community'

export function getReportingAttributesColumns(data) {
  const attributeNames = new Set<string>()
  data?.forEach((item) => {
    const productAttributes = item.ProductReportingAttributes ?? []
    const locationAttributes = item.LocationReportingAttributes ?? []

    const attributeList = productAttributes?.concat(locationAttributes)
    attributeList?.forEach((attr) => {
      attributeNames.add(attr.Name)
    })
  })

  const sortedAttributeNames = Array.from(attributeNames).sort()

  const columns: ColDef[] = []

  sortedAttributeNames?.forEach((attributeName) => {
    columns.push({
      headerName: attributeName,
      field: `ReportingAttributes.${attributeName}`,
      flex: 1,
      hide: true,
      editable: false,
      comparator,
      valueGetter: (params) => {
        const productAttribute = params?.data?.ProductReportingAttributes?.find((attr) => attr.Name === attributeName)
        const locationAttribute = params?.data?.LocationReportingAttributes?.find((attr) => attr.Name === attributeName)
        const attribute = productAttribute ?? locationAttribute
        return attribute && attribute?.Value ? attribute?.Value : ''
      },
    })
  })

  return columns
}
