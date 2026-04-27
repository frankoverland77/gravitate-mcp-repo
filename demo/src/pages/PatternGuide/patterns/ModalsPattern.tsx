import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { TokenTable } from '../components/TokenTable'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'

const SECTIONS = [
  { id: 'size-tiers', title: 'Size Tiers' },
  { id: 'internal-spacing', title: 'Internal Spacing' },
  { id: 'footer-patterns', title: 'Footer Patterns' },
  { id: 'modal-anatomy', title: 'Modal Anatomy' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

const SIZE_TOKENS = [
  { token: 'modal-sm', value: '480px', cssVar: '--modal-width-sm', usage: 'Confirmations, 1-3 field forms' },
  { token: 'modal-md', value: '640px', cssVar: '--modal-width-md', usage: 'Standard forms, file upload' },
  { token: 'modal-lg', value: '800px', cssVar: '--modal-width-lg', usage: 'Complex multi-section forms' },
  { token: 'modal-xl', value: '1080px', cssVar: '--modal-width-xl', usage: 'Data-heavy, grids inside modals' },
]

const SPACING_TOKENS = [
  { token: 'modal-body-padding', value: '24px', cssVar: '--modal-body-padding', usage: 'Body content area padding (all sides)' },
  { token: 'modal-field-gap', value: '16px', cssVar: '--modal-field-gap', usage: 'Gap between form fields within a section' },
  { token: 'modal-section-gap', value: '24px', cssVar: '--modal-section-gap', usage: 'Gap between logical sections in body' },
  { token: 'modal-footer-gap', value: '8px', cssVar: '--modal-footer-gap', usage: 'Gap between footer action buttons' },
]

const SIZE_TIERS: { label: string; width: number; maxBarWidth: number }[] = [
  { label: 'sm  480px', width: 480, maxBarWidth: 180 },
  { label: 'md  640px', width: 640, maxBarWidth: 240 },
  { label: 'lg  800px', width: 800, maxBarWidth: 300 },
  { label: 'xl  1080px', width: 1080, maxBarWidth: 400 },
]

const wireframeColors = {
  header: 'var(--status-info-bg)',
  headerBorder: 'var(--status-info-border)',
  body: '#ffffff',
  bodyBorder: 'var(--border-default)',
  field: 'var(--surface-muted)',
  fieldBorder: 'var(--border-default)',
  footer: 'var(--surface-muted)',
  footerBorder: 'var(--border-default)',
  btnPrimary: 'var(--theme-color-1)',
  btnSecondary: 'var(--border-subtle)',
  // Annotation swatch — intentionally off-brand to distinguish pattern-doc
  // callouts from product UI. Not a token.
  annotation: '#ff7a45',
  annotationBg: '#fff7e6',
}

export function ModalsPattern() {
  return (
    <PatternShell
      title="Modals"
      subtitle="Four width tiers, consistent internal spacing, and a standard footer layout. Every modal in the app maps to one of these patterns — no arbitrary sizing or ad-hoc button placement."
      accentColor="#722ed1"
      sections={SECTIONS}
    >
      {/* ── Section 1: Size Tiers ── */}
      <PatternSection
        id="size-tiers"
        title="Size Tiers"
        description="Pick the smallest tier that fits the content. Never use arbitrary widths like 500px or 520px."
      >
        <TokenTable tokens={SIZE_TOKENS} />

        <PatternExample
          label="Proportional Width Comparison"
          caption="Each tier shown at relative scale. The jump between tiers is deliberate — content either fits or it needs the next tier up."
        >
          <Vertical gap={12}>
            {SIZE_TIERS.map((tier) => (
              <div key={tier.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: 12,
                    color: '#595959',
                    width: 90,
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {tier.label}
                </div>
                <div
                  style={{
                    width: tier.maxBarWidth,
                    height: 36,
                    background: `linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)`,
                    border: '1px solid #d3adf7',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#722ed1',
                  }}
                >
                  {tier.width}px
                </div>
              </div>
            ))}
          </Vertical>
        </PatternExample>
      </PatternSection>

      {/* ── Section 2: Internal Spacing ── */}
      <PatternSection
        id="internal-spacing"
        title="Internal Spacing"
        description="Body padding is 24px. Fields within a section are spaced at 16px. Sections within the body are separated by 24px. Footer buttons use an 8px gap."
      >
        <TokenTable tokens={SPACING_TOKENS} />

        <PatternExample
          label="Spacing Zones"
          caption="Body padding (24px) contains fields at 16px gaps. Sections within the body get 24px between them. Footer buttons sit 8px apart."
        >
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            {/* Simulated modal body */}
            <div
              style={{
                border: `2px dashed ${wireframeColors.annotation}`,
                borderRadius: 8,
                padding: 24,
                background: wireframeColors.body,
                position: 'relative',
              }}
            >
              <SpacingLabel label="24px padding" position="top-right" />

              {/* Section 1 */}
              <Vertical gap={16}>
                <FieldPlaceholder label="Field A" />
                <FieldPlaceholder label="Field B" />
              </Vertical>

              {/* Section gap annotation */}
              <div
                style={{
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: wireframeColors.annotation,
                    background: wireframeColors.annotationBg,
                    padding: '2px 8px',
                    borderRadius: 3,
                  }}
                >
                  24px section gap
                </span>
              </div>

              {/* Section 2 */}
              <Vertical gap={16}>
                <FieldPlaceholder label="Field C" />
                <FieldPlaceholder label="Field D" />
              </Vertical>

              {/* Field gap annotation */}
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#1890ff',
                    background: '#e6f7ff',
                    padding: '2px 8px',
                    borderRadius: 3,
                  }}
                >
                  16px between fields
                </span>
              </div>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      {/* ── Section 3: Footer Patterns ── */}
      <PatternSection
        id="footer-patterns"
        title="Footer Patterns"
        description="Buttons right-aligned in a flex row. Secondary (no theme) on the left, primary (theme1) on the right. Always 8px gap between buttons."
      >
        <PatternExample
          label="Standard Footer"
          caption="Flex row, justify-content: flex-end, gap: 8px. Secondary button first in DOM, primary last."
          code={`<div style={{
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 'var(--modal-footer-gap)', /* 8px */
  padding: '12px 24px',
  borderTop: '1px solid var(--border-color)',
}}>
  <GraviButton>Cancel</GraviButton>
  <GraviButton theme1>Submit</GraviButton>
</div>`}
        >
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                padding: '12px 24px',
                borderTop: '1px solid #e8e8e8',
                background: wireframeColors.footer,
                borderRadius: '0 0 8px 8px',
              }}
            >
              <MockButton label="Cancel" variant="secondary" />
              <MockButton label="Submit" variant="primary" />
            </div>

            {/* Annotation */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, gap: 12, paddingRight: 24 }}>
              <span style={{ fontSize: 10, color: '#8c8c8c' }}>
                secondary (no theme)
              </span>
              <span style={{ fontSize: 10, color: wireframeColors.btnPrimary, fontWeight: 600 }}>
                primary (theme1)
              </span>
            </div>
            <div style={{ textAlign: 'right', paddingRight: 24, marginTop: 4 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: wireframeColors.annotation,
                  background: wireframeColors.annotationBg,
                  padding: '2px 8px',
                  borderRadius: 3,
                }}
              >
                8px gap
              </span>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      {/* ── Section 4: Modal Anatomy ── */}
      <PatternSection
        id="modal-anatomy"
        title="Modal Anatomy"
        description="Complete wireframe with all spacing labeled. Every modal follows this three-zone structure: header, body, footer."
      >
        <PatternExample
          label="Full Modal Wireframe"
          caption="Header (title bar) + Body (24px padding, 16px field gaps) + Footer (right-aligned buttons, 8px gap). This is the canonical layout."
        >
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            {/* Modal container */}
            <div
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                background: '#fff',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: `1px solid ${wireframeColors.headerBorder}`,
                  background: wireframeColors.header,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Texto category="p1" weight="600">Modal Title</Texto>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: '1px solid #bfbfbf',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: '#8c8c8c',
                    cursor: 'default',
                  }}
                >
                  x
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: 24, position: 'relative' }}>
                <AnatomyAnnotation label="24px body padding" side="left" />

                <Vertical gap={16}>
                  <FieldPlaceholder label="First Name" />
                  <FieldPlaceholder label="Last Name" />
                </Vertical>

                {/* Section separator */}
                <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: wireframeColors.annotation,
                      padding: '0 8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    24px section gap
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#f0f0f0' }} />
                </div>

                <Vertical gap={16}>
                  <FieldPlaceholder label="Email" />
                  <FieldPlaceholder label="Role" />
                </Vertical>

                {/* 16px gap annotation */}
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color: '#1890ff',
                      background: '#e6f7ff',
                      padding: '2px 6px',
                      borderRadius: 3,
                    }}
                  >
                    16px between fields
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                  padding: '12px 24px',
                  borderTop: '1px solid #e8e8e8',
                  background: wireframeColors.footer,
                }}
              >
                <MockButton label="Cancel" variant="secondary" />
                <MockButton label="Save" variant="primary" />
              </div>
            </div>

            {/* External annotations */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 12,
                padding: '0 4px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <AnnotationChip label="Header" color="#91d5ff" />
                <AnnotationChip label="Body (24px pad)" color="#b7eb8f" />
                <AnnotationChip label="Footer (8px btn gap)" color="#ffd591" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                <AnnotationChip label="16px field gap" color="#d6e4ff" />
                <AnnotationChip label="24px section gap" color="#ffe7ba" />
                <AnnotationChip label="Buttons right-aligned" color="#f4ffb8" />
              </div>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      {/* ── Section 5: Do's & Don'ts ── */}
      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <Vertical gap={12}>
              <Texto category="p2" weight="600">Consistent tier widths</Texto>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Confirm delete', width: 180, tier: '480px (sm)' },
                  { label: 'Edit user form', width: 240, tier: '640px (md)' },
                  { label: 'Multi-section', width: 300, tier: '800px (lg)' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: item.width,
                        height: 28,
                        border: '1px solid var(--status-success-border)',
                        background: 'var(--status-success-bg)',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 8,
                        fontSize: 11,
                        color: 'var(--status-success-text)',
                      }}
                    >
                      {item.label}
                    </div>
                    <span style={{ fontSize: 10, color: '#8c8c8c', fontFamily: 'monospace' }}>
                      {item.tier}
                    </span>
                  </div>
                ))}
              </div>
            </Vertical>
          }
          dontExample={
            <Vertical gap={12}>
              <Texto category="p2" weight="600">Arbitrary widths</Texto>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Confirm delete', width: 188, w: '480px' },
                  { label: 'Edit user form', width: 196, w: '500px' },
                  { label: 'Multi-section', width: 204, w: '520px' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: item.width,
                        height: 28,
                        border: '1px solid var(--status-danger-border)',
                        background: 'var(--status-danger-bg)',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 8,
                        fontSize: 11,
                        color: 'var(--status-danger-text)',
                      }}
                    >
                      {item.label}
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--status-danger-solid)', fontFamily: 'monospace', textDecoration: 'line-through' }}>
                      {item.w}
                    </span>
                  </div>
                ))}
              </div>
            </Vertical>
          }
          doCaption="Every modal maps to a named tier: sm (480), md (640), lg (800), xl (1080). Developers pick the smallest tier that fits."
          dontCaption="Widths like 480, 500, 520 differ by only 20-40px — visually indistinguishable but create inconsistency in the codebase."
        />

        <DosDonts
          doExample={
            <Vertical gap={8}>
              <Texto category="p2" weight="600">Standard footer</Texto>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                  padding: '12px 16px',
                  borderTop: '1px solid #e8e8e8',
                  background: '#fafafa',
                  borderRadius: '0 0 6px 6px',
                }}
              >
                <MockButton label="Cancel" variant="secondary" size="small" />
                <MockButton label="Submit" variant="primary" size="small" />
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#8c8c8c', lineHeight: 1.6 }}>
                justify-content: flex-end<br />
                gap: 8px<br />
                [Secondary] [Primary]
              </div>
            </Vertical>
          }
          dontExample={
            <Vertical gap={8}>
              <Texto category="p2" weight="600">Mixed footer patterns</Texto>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderTop: '1px solid #e8e8e8',
                  background: '#fafafa',
                  borderRadius: '0 0 6px 6px',
                }}
              >
                <MockButton label="Cancel" variant="secondary" size="small" />
                <div style={{ display: 'flex', gap: 16 }}>
                  <MockButton label="Save Draft" variant="secondary" size="small" />
                  <MockButton label="Submit" variant="primary" size="small" />
                </div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--status-danger-solid)', lineHeight: 1.6 }}>
                justify-content: space-between<br />
                gap: 16px (inconsistent!)<br />
                [Cancel] ..... [Draft] [Submit]
              </div>
            </Vertical>
          }
          doCaption="Right-aligned buttons, 8px gap, secondary then primary. Same layout in every modal — users build muscle memory."
          dontCaption="Space-between splits buttons to edges, 16px gap is inconsistent with system, and the asymmetric layout varies per modal."
        />
      </PatternSection>
    </PatternShell>
  )
}

/* ─── Helper Components ─── */

function FieldPlaceholder({ label }: { label: string }) {
  return (
    <div>
      <Texto category="p2" weight="500" style={{ fontSize: 14 }}>
        {label}
      </Texto>
      <div
        style={{
          marginTop: 4,
          height: 32,
          background: '#fafafa',
          border: '1px solid #d9d9d9',
          borderRadius: 6,
        }}
      />
    </div>
  )
}

function MockButton({
  label,
  variant,
  size,
}: {
  label: string
  variant: 'primary' | 'secondary'
  size?: 'small'
}) {
  const isPrimary = variant === 'primary'
  const paddingY = size === 'small' ? 4 : 6
  const paddingX = size === 'small' ? 12 : 16

  return (
    <div
      style={{
        padding: `${paddingY}px ${paddingX}px`,
        borderRadius: 6,
        fontSize: size === 'small' ? 12 : 13,
        fontWeight: 500,
        cursor: 'default',
        border: isPrimary ? '1px solid var(--theme-color-1)' : '1px solid var(--border-default)',
        background: isPrimary ? 'var(--theme-color-1)' : '#fff',
        color: isPrimary ? '#fff' : '#595959',
      }}
    >
      {label}
    </div>
  )
}

function SpacingLabel({ label, position }: { label: string; position: 'top-right' | 'top-left' }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 4,
        ...(position === 'top-right' ? { right: 4 } : { left: 4 }),
        fontSize: 9,
        fontWeight: 600,
        color: wireframeColors.annotation,
        background: wireframeColors.annotationBg,
        padding: '2px 6px',
        borderRadius: 3,
      }}
    >
      {label}
    </div>
  )
}

function AnatomyAnnotation({ label, side }: { label: string; side: 'left' | 'right' }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 4,
        ...(side === 'right' ? { right: 4 } : { left: 4 }),
        fontSize: 9,
        fontWeight: 600,
        color: wireframeColors.annotation,
        background: wireframeColors.annotationBg,
        padding: '2px 6px',
        borderRadius: 3,
        zIndex: 1,
      }}
    >
      {label}
    </div>
  )
}

function AnnotationChip({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 500,
        color: '#595959',
        background: color,
        padding: '3px 8px',
        borderRadius: 4,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  )
}
