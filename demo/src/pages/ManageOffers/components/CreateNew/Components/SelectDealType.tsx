import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import type { SpecialOfferTemplate } from '../../../ManageOffers.types'
import { DealSelectionButtons } from './DealSelectionButtons'
import { BoxTagIcon } from './icons/BoxTagIcon'
import { GavelIcon } from './icons/GavelIcon'
import { useMemo } from 'react'

interface SelectDealTypeProps {
  handleSelectCategory: (category: string) => void
  selectedCategory: string | undefined
  handleSelectTemplate: (id: number) => void
  selectedTemplateId: number | undefined
  categories: { id: string; label: string; description: string }[]
  templates: SpecialOfferTemplate[]
}

export function SelectDealType({
  handleSelectCategory,
  selectedCategory,
  handleSelectTemplate,
  selectedTemplateId,
  categories,
  templates,
}: SelectDealTypeProps) {
  const categoryItems = useMemo(
    () =>
      categories.map((cat) => {
        const isAuction = cat.id === 'auction'
        return {
          id: cat.id,
          label: cat.label,
          description: cat.description,
          renderIcon: (selected: boolean) =>
            isAuction ? (
              <GavelIcon
                color={selected ? 'var(--theme-color-1)' : 'var(--gray-600)'}
                style={{ fontSize: '36px' }}
              />
            ) : (
              <BoxTagIcon
                color={selected ? 'var(--theme-color-1)' : 'var(--gray-600)'}
                style={{ fontSize: '36px' }}
              />
            ),
        }
      }),
    [categories]
  )

  const templateItems = useMemo(
    () =>
      templates.map((t) => ({
        id: t.SpecialOfferTemplateId,
        label: t.Name,
        description: t.Description,
      })),
    [templates]
  )

  return (
    <Vertical className={'p-4'} justifyContent='space-between' style={{ overflow: 'visible' }}>
      <Vertical className={'gap-10'} flex={1} style={{ overflow: 'visible' }}>
        <Texto category={'h4'} className={'text-18'}>
          What type of offer do you want to create?
        </Texto>
        <Texto className={'text-14'}>Choose how you want to sell your fuel inventory</Texto>
      </Vertical>

      <Horizontal className={'mt-1'} flex={2} gap="16px" style={{ overflow: 'visible' }}>
        {categoryItems.map((item) => (
          <DealSelectionButtons
            key={item.id}
            selectedId={selectedCategory}
            onSelect={(id) => handleSelectCategory(id as string)}
            item={item}
            variant='deal'
          />
        ))}
      </Horizontal>

      <Vertical className={'mt-4 mb-2'} style={{ overflow: 'visible' }}>
        <Texto category={'h4'}>Template</Texto>
      </Vertical>
      <Horizontal flex={1} gap="16px" style={{ flexWrap: 'wrap', overflow: 'visible', alignItems: 'flex-start' }}>
        {templateItems.map((item) => (
          <DealSelectionButtons
            key={item.id}
            selectedId={selectedTemplateId}
            onSelect={(id) => handleSelectTemplate(id as number)}
            item={item}
            variant='subtype'
          />
        ))}
      </Horizontal>
    </Vertical>
  )
}
