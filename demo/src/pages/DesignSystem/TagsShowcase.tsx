import React from 'react'
import { BBDTag, DeltaTag, ManyTag } from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

const bbdThemes = ['default', 'success', 'warning', 'error', 'info', 'theme1'] as const

export function TagsShowcase() {
  return (
    <ShowcaseShell title="Tags" subtitle="BBDTag, DeltaTag, ManyTag" accentColor="#52c41a">
      <SectionDivider title="BBDTag — Theme Variants" />
      {bbdThemes.map((theme) => (
        <SpecimenCard key={theme} label={`BBDTag — ${theme}`} props={`theme="${theme}" text="${theme}"`}>
          <BBDTag theme={theme as any} text={theme.charAt(0).toUpperCase() + theme.slice(1)} />
        </SpecimenCard>
      ))}

      <SectionDivider title="DeltaTag" />
      <SpecimenCard label="Positive" props="value={12.5} positive">
        <DeltaTag value={12.5} positive />
      </SpecimenCard>
      <SpecimenCard label="Negative" props="value={-8.3} positive={false}">
        <DeltaTag value={-8.3} positive={false} />
      </SpecimenCard>
      <SpecimenCard label="Inverted Positive" props="value={12.5} positive inverted">
        <DeltaTag value={12.5} positive inverted />
      </SpecimenCard>
      <SpecimenCard label="Inverted Negative" props="value={-8.3} positive={false} inverted">
        <DeltaTag value={-8.3} positive={false} inverted />
      </SpecimenCard>

      <SectionDivider title="ManyTag" />
      <SpecimenCard label="Within Limit" props="items={['A','B','C']} limit={5}">
        <ManyTag items={['Alpha', 'Beta', 'Gamma']} limit={5} />
      </SpecimenCard>
      <SpecimenCard label="Exceeding Limit" props="items={[...6 items]} limit={3}">
        <ManyTag items={['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta']} limit={3} />
      </SpecimenCard>
    </ShowcaseShell>
  )
}
