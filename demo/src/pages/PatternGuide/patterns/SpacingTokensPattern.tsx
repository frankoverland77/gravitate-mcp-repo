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
  { id: 'status-colors', title: 'Status Color Tokens' },
  { id: 'neutrals', title: 'Neutral Surface Tokens' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

const STATUS_TONES: Array<{
  name: string
  solid: string
  text: string
  bg: string
  border: string
  when: string
}> = [
  { name: 'success', solid: '#52c41a', text: '#389e0d', bg: '#f6ffed', border: '#b7eb8f', when: 'Positive, committed, on-track' },
  { name: 'warning', solid: '#faad14', text: '#d48806', bg: '#fffbe6', border: '#ffe58f', when: 'Needs attention, at risk, behind' },
  { name: 'danger', solid: '#ff4d4f', text: '#cf1322', bg: '#fff2f0', border: '#ffa39e', when: 'Error, blocked, destructive' },
  { name: 'info', solid: '#1890ff', text: '#096dd9', bg: '#e6f7ff', border: '#91d5ff', when: 'Neutral notice, in-progress' },
  { name: 'neutral', solid: '#8c8c8c', text: '#595959', bg: '#fafafa', border: '#e8e8e8', when: 'Draft, archived, quiet state' },
]

const NEUTRAL_TOKENS = [
  { token: 'border-subtle', value: '#f0f0f0', usage: 'Low-contrast divider (inside cards)' },
  { token: 'border-default', value: '#e8e8e8', usage: 'Card edges, toolbar separators' },
  { token: 'surface-muted', value: '#fafafa', usage: 'Footer bars, striped rows, code blocks' },
  { token: 'surface-sunken', value: '#f5f5f5', usage: 'Inset wells, disabled fields' },
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
      title="Design Tokens"
      subtitle="Spacing, status colors, and neutral surfaces. These tokens replace the hundred-plus arbitrary values scattered across the codebase. If you find yourself typing a raw hex code or a pixel value, the right token probably exists — use it."
      accentColor="#0C5A58"
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

      <PatternSection
        id="status-colors"
        title="Status Color Tokens"
        description="Five semantic tones — success, warning, danger, info, neutral — each with four channels (solid, text, bg, border). Pages that need to indicate state should pull from these tokens instead of typing raw hex. The StatusBadge component consumes all four channels automatically."
      >
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 1fr 1fr 1fr 1.5fr',
              padding: '10px 16px',
              background: 'var(--surface-muted)',
              borderBottom: '1px solid var(--border-default)',
              fontSize: 12,
              fontWeight: 600,
              color: '#595959',
              gap: 12,
            }}
          >
            <div>Tone</div>
            <div>Solid</div>
            <div>Text</div>
            <div>Background</div>
            <div>Border</div>
            <div>When</div>
          </div>
          {STATUS_TONES.map((t, i) => (
            <div
              key={t.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 1fr 1fr 1fr 1.5fr',
                padding: '12px 16px',
                borderBottom: i < STATUS_TONES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                gap: 12,
                alignItems: 'center',
                fontSize: 13,
              }}
            >
              <code style={{ fontFamily: "'SF Mono', monospace", fontSize: 12 }}>--status-{t.name}-*</code>
              <SwatchCell color={t.solid} suffix='solid' />
              <SwatchCell color={t.text} suffix='text' />
              <SwatchCell color={t.bg} suffix='bg' />
              <SwatchCell color={t.border} suffix='border' />
              <Texto category='p2' appearance='medium'>{t.when}</Texto>
            </div>
          ))}
        </div>

        <PatternExample
          label='In CSS'
          caption='Use the four channels together. Background + border + text form a readable pill at any size. Solid is for dots, filled chips, and accents.'
          code={`.successChip {
  background: var(--status-success-bg);
  border: 1px solid var(--status-success-border);
  color: var(--status-success-text);
}

.successDot {
  background: var(--status-success-solid);
}`}
        >
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {STATUS_TONES.map((t) => (
              <span
                key={t.name}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: t.bg,
                  border: `1px solid ${t.border}`,
                  color: t.text,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: 'Lato, sans-serif',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.solid }} />
                {t.name}
              </span>
            ))}
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection
        id='neutrals'
        title='Neutral Surface Tokens'
        description="The greys that aren't owned by the Excalibrr theme. Use these for dividers, card edges, and muted backgrounds instead of typing #e8e8e8 or #fafafa."
      >
        <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '180px 80px 120px 1fr',
              padding: '10px 16px',
              background: 'var(--surface-muted)',
              borderBottom: '1px solid var(--border-default)',
              fontSize: 12,
              fontWeight: 600,
              color: '#595959',
              gap: 12,
            }}
          >
            <div>Token</div>
            <div>Swatch</div>
            <div>Value</div>
            <div>Where it lives</div>
          </div>
          {NEUTRAL_TOKENS.map((t, i) => (
            <div
              key={t.token}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 80px 120px 1fr',
                padding: '12px 16px',
                borderBottom: i < NEUTRAL_TOKENS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                gap: 12,
                alignItems: 'center',
                fontSize: 13,
              }}
            >
              <code style={{ fontFamily: "'SF Mono', monospace", fontSize: 12 }}>--{t.token}</code>
              <div style={{ width: 56, height: 20, background: t.value, border: '1px solid var(--border-default)', borderRadius: 3 }} />
              <code style={{ fontFamily: "'SF Mono', monospace", fontSize: 12, color: '#8c8c8c' }}>{t.value}</code>
              <Texto category='p2' appearance='medium'>{t.usage}</Texto>
            </div>
          ))}
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

        <DosDonts
          doExample={
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, color: '#262626' }}>
              <div>{'background: var(--status-success-bg);'}</div>
              <div>{'border: 1px solid var(--status-success-border);'}</div>
              <div>{'color: var(--status-success-text);'}</div>
            </div>
          }
          dontExample={
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 1.6, color: '#262626' }}>
              <div>{'background: #f6ffed;'}</div>
              <div>{'border: 1px solid #b7eb8f;'}</div>
              <div>{'color: #389e0d;'}</div>
            </div>
          }
          doCaption='Pull from the four-channel status tokens. When a designer tweaks the palette, every chip updates with it.'
          dontCaption='Raw hex codes. These exact values appear in 113 files today — each copy is a tiny fork of the design system.'
        />
      </PatternSection>
    </PatternShell>
  )
}

function SwatchCell({ color, suffix }: { color: string; suffix: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      <div
        style={{
          width: 20,
          height: 20,
          background: color,
          border: '1px solid var(--border-default)',
          borderRadius: 3,
          flexShrink: 0,
        }}
      />
      <code style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, color: '#8c8c8c', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        -{suffix}
      </code>
    </div>
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
