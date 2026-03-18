import { ShoppingOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';

import { OFFER_CATEGORIES } from '../ManageOffers.data';
import type { OfferTemplate } from '../ManageOffers.types';

interface SelectDealTypeProps {
  selectedCategory: string | undefined;
  onSelectCategory: (category: string) => void;
  selectedTemplateId: number | undefined;
  onSelectTemplate: (id: number) => void;
  templates: OfferTemplate[];
}

export function SelectDealType({
  selectedCategory,
  onSelectCategory,
  selectedTemplateId,
  onSelectTemplate,
  templates,
}: SelectDealTypeProps) {
  return (
    <Vertical className="p-4" justifyContent="space-between">
      <Vertical gap={10} flex="1">
        <Texto category="h4" className="text-18">
          What type of offer do you want to create?
        </Texto>
        <Texto className="text-14">Choose how you want to sell your fuel inventory</Texto>
      </Vertical>

      <Horizontal className="mt-1" flex="2" gap={16}>
        {OFFER_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className={`deal-type-card ${selectedCategory === cat.id ? 'selected' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <Vertical gap={8} horizontalCenter>
              {cat.id === 'auction' ? (
                <ThunderboltOutlined style={{ fontSize: '36px', color: selectedCategory === cat.id ? 'var(--theme-color-1)' : 'var(--gray-400)' }} />
              ) : (
                <ShoppingOutlined style={{ fontSize: '36px', color: selectedCategory === cat.id ? 'var(--theme-color-1)' : 'var(--gray-400)' }} />
              )}
              <Texto category="h4">{cat.label}</Texto>
              <Texto className="text-14" appearance="medium" align="center">
                {cat.description}
              </Texto>
            </Vertical>
          </div>
        ))}
      </Horizontal>

      <Vertical className="mt-4 mb-2">
        <Texto category="h4">Template</Texto>
      </Vertical>
      <Horizontal verticalCenter flex="1" gap={16} style={{ flexWrap: 'wrap' }}>
        {templates.map((t) => (
          <div
            key={t.SpecialOfferTemplateId}
            className={`template-card ${selectedTemplateId === t.SpecialOfferTemplateId ? 'selected' : ''}`}
            onClick={() => onSelectTemplate(t.SpecialOfferTemplateId)}
          >
            <Vertical gap={4}>
              <Texto weight="bold">{t.Name}</Texto>
              <Texto className="text-14" appearance="medium">
                {t.Description}
              </Texto>
            </Vertical>
          </div>
        ))}
      </Horizontal>
    </Vertical>
  );
}
