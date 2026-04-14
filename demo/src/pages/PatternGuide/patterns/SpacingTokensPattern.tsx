import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { TokenTable } from '../components/TokenTable'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'
import { SpacingSwatches, NestingDiagram } from '../components/SpacingDiagram'

const SECTIONS = [
  { id: 'scale', title: 'The Scale' },
  { id: 'swatches', title: 'Visual Reference' },
  { id: 'nesting', title: 'Nesting Hierarchy' },
  { id: 'usage', title: 'Where Each Token Lives' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

const TOKENS = [
  { token: 'space-0', value: '0px', cssVar: '--space-0', usage: 'Flush / zero spacing' },
  { token: 'space-1', value: '4px', cssVar: '--space-1', usage: 'Tight: icon-to-text, label-to-input' },
  { token: 'space-2', value: '8px', cssVar: '--space-2', usage: 'Compact: button group gaps, inline pairs' },
  { token: 'space-3', value: '12px', cssVar: '--space-3', usage: 'Snug: card inner padding, footer bars' },
  { token: 'space-4', value: '16px', cssVar: '--space-4', usage: 'Default: form field gaps, section inner padding' },
  { token: 'space-5', value: '24px', cssVar: '--space-5', usage: 'Comfortable: section gaps, card padding, page content' },
  { token: 'space-6', value: '32px', cssVar: '--space-6', usage: 'Spacious: major section breaks, page dividers' },
  { token: 'space-7', value: '40px', cssVar: '--space-7', usage: 'Page: top-level padding, hero spacing' },
  { token: 'space-8', value: '48px', cssVar: '--space-8', usage: 'Canvas: showcase-level page wrapper' },
]

const SWATCH_TOKENS = [
  { name: 'space-1', value: '4px', color: '#bae7ff' },
  { name: 'space-2', value: '8px', color: '#91d5ff' },
  { name: 'space-3', value: '12px', color: '#69c0ff' },
  { name: 'space-4', value: '16px', color: '#40a9ff' },
  { name: 'space-5', value: '24px', color: '#1890ff' },
  { name: 'space-6', value: '32px', color: '#096dd9' },
  { name: 'space-7', value: '40px', color: '#0050b3' },
  { name: 'space-8', value: '48px', color: '#003a8c' },
]

const NESTING_LEVELS = [
  { label: 'Page', token: 'space-8', value: '48px', color: '#003a8c' },
  { label: 'Section gap', token: 'space-6', value: '32px', color: '#096dd9' },
  { label: 'Card padding', token: 'space-5', value: '24px', color: '#1890ff' },
  { label: 'Field gap', token: 'space-4', value: '16px', color: '#40a9ff' },
  { label: 'Label-input', token: 'space-1', value: '4px', color: '#bae7ff' },
]

export function SpacingTokensPattern() {
  return (
    <PatternShell
      title="Spacing & Tokens"
      subtitle="A single spacing scale used everywhere. 9 tokens replace the 15+ arbitrary pixel values scattered across the codebase. Parent container padding is always at least one step larger than child gaps."
      accentColor="#1890ff"
      sections={SECTIONS}
    >
      <PatternSection id="scale" title="The Scale" description="8-based scale with 4px and 12px half-steps. Every spacing value in the app maps to one of these tokens.">
        <TokenTable tokens={TOKENS} />
      </PatternSection>

      <PatternSection id="swatches" title="Visual Reference" description="Relative sizes of each token at actual pixel width.">
        <SpacingSwatches tokens={SWATCH_TOKENS} label="Token widths at 1:1 scale" />
      </PatternSection>

      <PatternSection id="nesting" title="Nesting Hierarchy" description="Parent padding is always >= 1 step above child gaps. This creates visual hierarchy — content feels contained, not crowded.">
        <NestingDiagram levels={NESTING_LEVELS} label="Page > Section > Card > Fields > Label" />

        <PatternExample
          label="The Rule"
          caption="If a card has space-5 (24px) padding, its children should be spaced at space-4 (16px) or smaller. Never equal to or larger than the parent."
        >
          <Vertical gap={16}>
            <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
              <div style={{ flex: 1 }}>
                <Texto category="p2" weight="600">Correct hierarchy:</Texto>
                <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#595959' }}>
                  Page padding: 48px (space-8)<br />
                  &nbsp;&nbsp;Section gap: 32px (space-6)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;Card padding: 24px (space-5)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Field gap: 16px (space-4)<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Label-input: 4px (space-1)
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <Texto category="p2" weight="600">Anti-pattern:</Texto>
                <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#ff4d4f' }}>
                  Page padding: 20px<br />
                  &nbsp;&nbsp;Section gap: 20px <span style={{ color: '#ff4d4f' }}>(= parent!)</span><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;Card padding: 12px<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Field gap: 16px <span style={{ color: '#ff4d4f' }}>({">"} parent!)</span><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Label-input: 8px
                </div>
              </div>
            </div>
          </Vertical>
        </PatternExample>
      </PatternSection>

      <PatternSection id="usage" title="Where Each Token Lives" description="Quick reference for which token to use in common situations.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <UsageCard title="Layout" items={[
            ['Page wrapper padding', 'space-8 (48px)'],
            ['Between major sections', 'space-6 (32px)'],
            ['Page content area', 'space-5 (24px)'],
          ]} />
          <UsageCard title="Cards & Panels" items={[
            ['Card body padding', 'space-5 (24px)'],
            ['Card header padding', 'space-4 (16px)'],
            ['Footer bar padding', 'space-3 (12px)'],
          ]} />
          <UsageCard title="Forms" items={[
            ['Between form sections', 'space-5 (24px)'],
            ['Between form fields', 'space-4 (16px)'],
            ['Label to input', 'space-1 (4px)'],
          ]} />
          <UsageCard title="Buttons & Inline" items={[
            ['Button group gap', 'space-2 (8px)'],
            ['Icon to text', 'space-1 (4px)'],
            ['Inline element pairs', 'space-2 (8px)'],
          ]} />
        </div>
      </PatternSection>

      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <Vertical gap={16}>
              <div style={{ padding: 24, border: '1px solid #e8e8e8', borderRadius: 8 }}>
                <Vertical gap={16}>
                  <div style={{ padding: '4px 0' }}>
                    <Texto category="p2" weight="500" style={{ fontSize: 14 }}>First Name</Texto>
                    <div style={{ marginTop: 4, height: 32, background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: 6 }} />
                  </div>
                  <div style={{ padding: '4px 0' }}>
                    <Texto category="p2" weight="500" style={{ fontSize: 14 }}>Email</Texto>
                    <div style={{ marginTop: 4, height: 32, background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: 6 }} />
                  </div>
                </Vertical>
              </div>
            </Vertical>
          }
          dontExample={
            <Vertical gap={16}>
              <div style={{ padding: 10, border: '1px solid #e8e8e8', borderRadius: 8 }}>
                <Vertical gap={20}>
                  <div>
                    <Texto category="p2" style={{ marginBottom: 8, fontSize: 14 }}>First Name</Texto>
                    <div style={{ height: 32, background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: 6 }} />
                  </div>
                  <div>
                    <Texto category="p2" style={{ marginBottom: 6, fontSize: 12 }}>Email</Texto>
                    <div style={{ height: 32, background: '#fafafa', border: '1px solid #d9d9d9', borderRadius: 6 }} />
                  </div>
                </Vertical>
              </div>
            </Vertical>
          }
          doCaption="Use token-based spacing: card padding (24px) > field gap (16px) > label gap (4px). Consistent label styling."
          dontCaption="Arbitrary values (10px padding, 20px gap, mixed label margins of 6px and 8px). Field gap exceeds card padding — hierarchy collapses."
        />

        <DosDonts
          doExample={
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, color: '#262626' }}>
              <div>{'gap: var(--space-4)'}</div>
              <div>{'padding: var(--space-5)'}</div>
              <div>{'margin-bottom: var(--space-2)'}</div>
            </div>
          }
          dontExample={
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, color: '#262626' }}>
              <div>{'gap: 20px'}</div>
              <div>{'padding: 18px'}</div>
              <div>{'margin-bottom: 6px'}</div>
            </div>
          }
          doCaption="Use CSS variables from tokens.css. Values are meaningful and maintainable."
          dontCaption="Hardcoded pixel values that don't align to any scale. 20px and 18px aren't in the token system."
        />
      </PatternSection>
    </PatternShell>
  )
}

function UsageCard({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px', background: '#f0f0f0', borderBottom: '1px solid #e8e8e8', fontSize: 12, fontWeight: 600, color: '#595959' }}>
        {title}
      </div>
      <div style={{ padding: 12 }}>
        {items.map(([label, value], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < items.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
            <span style={{ fontSize: 13, color: '#595959' }}>{label}</span>
            <code style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: '#1890ff' }}>{value}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
