import React from 'react'
import { Texto } from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

const categories = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p1', 'p2', 'heading', 'heading-small'] as const

const appearances = ['primary', 'secondary', 'medium', 'light', 'error', 'success', 'warning'] as const

const weights = ['400', '500', '600', '700'] as const

export function TypographyShowcase() {
  return (
    <ShowcaseShell title="Typography" subtitle="Texto component — categories, appearances, and weights" accentColor="#722ed1">
      <SectionDivider title="Categories" />
      {categories.map((cat) => (
        <SpecimenCard key={cat} label={`Texto — ${cat}`} props={`category="${cat}"`}>
          <Texto category={cat as any}>The quick brown fox jumps</Texto>
        </SpecimenCard>
      ))}

      <SectionDivider title="Appearances" />
      {appearances.map((app) => (
        <SpecimenCard
          key={app}
          label={`appearance="${app}"${app === 'secondary' ? ' (BLUE!)' : app === 'medium' ? ' (gray)' : ''}`}
          props={`category="p1" appearance="${app}"`}
        >
          <Texto category="p1" appearance={app as any}>
            Sample text with {app} appearance
          </Texto>
        </SpecimenCard>
      ))}

      <SectionDivider title="Weights" />
      {weights.map((w) => (
        <SpecimenCard key={w} label={`weight="${w}"`} props={`category="p1" weight="${w}"`}>
          <Texto category="p1" weight={w as any}>
            Weight {w} — The quick brown fox
          </Texto>
        </SpecimenCard>
      ))}

      <SectionDivider title="Common Patterns" />
      <SpecimenCard label="Section Header (uppercase)" props='category="h6" appearance="medium" weight="600"'>
        <Texto
          category="h6"
          appearance="medium"
          weight="600"
          style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
        >
          Section Header
        </Texto>
      </SpecimenCard>
      <SpecimenCard label="Field Label" props='category="p2" appearance="medium"'>
        <Texto category="p2" appearance="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Field Label
        </Texto>
      </SpecimenCard>
      <SpecimenCard label="Field Value (bold)" props='category="p1" weight="600"'>
        <Texto category="p1" weight="600">
          $1,234.56
        </Texto>
      </SpecimenCard>
      <SpecimenCard label="Helper Text" props='category="p2" appearance="medium"'>
        <Texto category="p2" appearance="medium">
          This is helper or subdued content
        </Texto>
      </SpecimenCard>
    </ShowcaseShell>
  )
}
