import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOfferMetadataResponseData } from '../../../../../ManageOffers.types'
import { useMemo } from 'react'

interface ReferenceDataProps {
  metadata: SpecialOfferMetadataResponseData | undefined
  selectedProductLocation: number
}

export function ReferenceData({ metadata, selectedProductLocation }: ReferenceDataProps) {
  const { productName, locationName } = useMemo(() => {
    const selection = metadata?.ProductLocationSelections?.find((s) => s.TradeEntrySetupId === selectedProductLocation)
    return {
      productName: selection?.ProductName ?? '',
      locationName: selection?.LocationName ?? '',
    }
  }, [metadata, selectedProductLocation])

  return (
    <Vertical>
      <Texto weight='bold' textTransform='uppercase' className='mb-2'>Reference Data</Texto>
      <Horizontal className={'gap-16'}>
        <Vertical flex="1">
          <Texto category={'h5'}>Product</Texto>
          <Texto category={'p1'}>{productName}</Texto>
        </Vertical>
        <Vertical flex="1">
          <Texto category={'h5'}>Location</Texto>
          <Texto category={'p1'}>{locationName}</Texto>
        </Vertical>
        <Vertical flex="1" />
      </Horizontal>
    </Vertical>
  )
}
