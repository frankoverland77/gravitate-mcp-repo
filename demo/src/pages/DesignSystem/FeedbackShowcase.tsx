import React, { useState } from 'react'
import { LoadingAnimation, Overlay } from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

export function FeedbackShowcase() {
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <ShowcaseShell title="Feedback" subtitle="LoadingAnimation, Overlay" accentColor="#f5222d">
      <SectionDivider title="LoadingAnimation" />
      <SpecimenCard label="LoadingAnimation" props="(default spinner)">
        <div style={{ position: 'relative', height: '80px', width: '100%' }}>
          <LoadingAnimation />
        </div>
      </SpecimenCard>

      <SectionDivider title="Overlay" />
      <SpecimenCard label="Overlay (inline demo)" props='open={true}'>
        <div style={{ position: 'relative', height: '100px', width: '100%', background: '#fafafa', borderRadius: '4px' }}>
          <div style={{ padding: '16px', fontSize: '14px', color: '#595959' }}>Content underneath the overlay</div>
          <Overlay open={true} />
        </div>
      </SpecimenCard>

    </ShowcaseShell>
  )
}
