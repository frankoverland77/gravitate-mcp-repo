import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { StatusBadge } from '../../../components/shared/StatusBadge'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'
import { NestingDiagram } from '../components/SpacingDiagram'

const SECTIONS = [
  { id: 'nesting-hierarchy', title: 'Nesting Hierarchy' },
  { id: 'section-headers', title: 'Section Headers' },
  { id: 'section-card', title: 'Section Card' },
  { id: 'nested-sections', title: 'Nested Sections' },
  { id: 'dividers', title: 'Dividers' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

const NESTING_LEVELS = [
  { label: 'Page canvas', token: 'space-8', value: '48px', color: '#003a8c' },
  { label: 'Section gap', token: 'space-6', value: '32px', color: '#096dd9' },
  { label: 'Card / panel padding', token: 'space-5', value: '24px', color: '#1890ff' },
  { label: 'Subsection padding', token: 'space-4', value: '16px', color: '#40a9ff' },
  { label: 'Field gap', token: 'space-4', value: '16px', color: '#69c0ff' },
  { label: 'Label-input', token: 'space-1', value: '4px', color: '#bae7ff' },
]

// ---------- shared inline styles ----------

const cardBorder = '1px solid #e8e8e8'
const monoFont = {
  fontFamily: "'SF Mono', monospace",
  fontSize: 12,
  lineHeight: 1.6,
  color: '#595959',
} as const

const annotationBadge = (_text: string, color = '#1890ff') => ({
  position: 'absolute' as const,
  fontSize: 10,
  fontWeight: 600,
  color,
  whiteSpace: 'nowrap' as const,
})

// ---------- component ----------

export function SectionsPattern() {
  return (
    <PatternShell
      title="Sections & Content Areas"
      subtitle="Patterns for organising page content into hierarchical sections, cards, and panels. A consistent nesting hierarchy ensures visual containment and scannable layouts."
      accentColor="#722ed1"
      sections={SECTIONS}
    >
      {/* ====== 1. Nesting Hierarchy ====== */}
      <PatternSection
        id="nesting-hierarchy"
        title="Nesting Hierarchy"
        description="Every container's padding is at least one step larger than its children's gaps. This 48 / 32 / 24 / 16 / 4 hierarchy is the foundation of every page layout."
      >
        <NestingDiagram levels={NESTING_LEVELS} label="Page > Section > Card > Subsection > Fields > Label" />

        <PatternExample
          label="Token quick-reference"
          caption="Memorise the step-down: 48 > 32 > 24 > 16 > 4. Each level is visually contained within its parent."
          code={`/* Page canvas  */ padding: var(--space-8);   /* 48px */
/* Section gap  */ gap: var(--space-6);       /* 32px */
/* Card padding */ padding: var(--space-5);   /* 24px */
/* Sub padding  */ padding: var(--space-4);   /* 16px */
/* Field gap    */ gap: var(--space-4);       /* 16px */
/* Label-input  */ gap: var(--space-1);       /*  4px */`}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { label: 'Page canvas', token: 'space-8', px: '48px' },
              { label: 'Section gap', token: 'space-6', px: '32px' },
              { label: 'Card padding', token: 'space-5', px: '24px' },
              { label: 'Subsection', token: 'space-4', px: '16px' },
              { label: 'Field gap', token: 'space-4', px: '16px' },
              { label: 'Label-input', token: 'space-1', px: '4px' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    width: parseInt(item.px),
                    height: 20,
                    background: '#722ed1',
                    borderRadius: 3,
                    opacity: 0.2 + parseInt(item.px) / 60,
                    minWidth: 4,
                  }}
                />
                <span style={{ color: '#595959' }}>
                  {item.label} <code style={{ color: '#722ed1', fontSize: 11 }}>{item.token}</code>
                </span>
              </div>
            ))}
          </div>
        </PatternExample>
      </PatternSection>

      {/* ====== 2. Section Headers ====== */}
      <PatternSection
        id="section-headers"
        title="Section Headers"
        description="Standard section headers use a title + optional subtitle + bottom divider. This pattern creates clear visual breaks between major content areas."
      >
        <PatternExample
          label="Standard section header"
          caption="Title: h4 / 600 weight. Subtitle: p2 / medium appearance. Divider: 1px solid #e8e8e8 with 24px margin-bottom."
          code={`<Vertical gap={4}>
  <Texto category="h4" weight="600">Section Title</Texto>
  <Texto category="p2" appearance="medium">
    Brief description of what this section contains.
  </Texto>
</Vertical>
<div style={{
  borderBottom: '1px solid #e8e8e8',
  marginBottom: 24,
}} />`}
        >
          <Vertical gap={32}>
            {/* Example 1 */}
            <div>
              <Vertical gap={4}>
                <Texto category="h4" weight="600">General Information</Texto>
                <Texto category="p2" appearance="medium">
                  Basic details about the entity including name, identifier, and status.
                </Texto>
              </Vertical>
              <div style={{ borderBottom: '1px solid #e8e8e8', marginTop: 12, marginBottom: 24 }} />
              <div style={{ padding: '12px 16px', background: '#fafafa', borderRadius: 6, fontSize: 13, color: '#8c8c8c' }}>
                Section content goes here...
              </div>
            </div>

            {/* Example 2 - title only */}
            <div>
              <Vertical gap={4}>
                <Texto category="h4" weight="600">Pricing Details</Texto>
              </Vertical>
              <div style={{ borderBottom: '1px solid #e8e8e8', marginTop: 12, marginBottom: 24 }} />
              <div style={{ padding: '12px 16px', background: '#fafafa', borderRadius: 6, fontSize: 13, color: '#8c8c8c' }}>
                Section content goes here...
              </div>
            </div>
          </Vertical>
        </PatternExample>
      </PatternSection>

      {/* ====== 3. Section Card ====== */}
      <PatternSection
        id="section-card"
        title="Section Card"
        description="A bordered card that groups related content under a header bar. Header has a shaded background; body has comfortable padding."
      >
        <PatternExample
          label="Section card anatomy"
          caption="Header: #fafafa background, 16px padding, border-bottom. Body: 24px padding, 16px gaps. Border: 1px solid #e8e8e8, 8px radius."
          code={`<div style={{
  border: '1px solid #e8e8e8',
  borderRadius: 8,
  overflow: 'hidden',
}}>
  {/* Header */}
  <div style={{
    padding: 16,
    background: '#fafafa',
    borderBottom: '1px solid #e8e8e8',
  }}>
    <Texto category="p1" weight="600">Card Title</Texto>
  </div>
  {/* Body */}
  <div style={{ padding: 24 }}>
    <Vertical gap={16}>
      {/* content */}
    </Vertical>
  </div>
</div>`}
        >
          <div
            style={{
              border: cardBorder,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: 16,
                background: '#fafafa',
                borderBottom: cardBorder,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Texto category="p1" weight="600">Contract Details</Texto>
              <span style={{ fontSize: 12, color: '#8c8c8c' }}>3 fields</span>
            </div>
            {/* Body */}
            <div style={{ padding: 24, position: 'relative' }}>
              <Vertical gap={16}>
                <FieldMock label="Contract Name" value="2026 Base Agreement" />
                <FieldMock label="Effective Date" value="2026-01-15" />
                <FieldMock label="Status" value="Active" tag />
              </Vertical>
              {/* Padding annotation */}
              <div style={{ ...annotationBadge('', '#722ed1'), top: 4, right: 8 }}>
                24px padding
              </div>
            </div>
          </div>
        </PatternExample>

        <PatternExample
          label="Card spacing breakdown"
          caption="The outer border creates containment. The header's tighter padding (16px) contrasts with the body's comfortable padding (24px), guiding the eye from label to content."
        >
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <Texto category="p2" weight="600" style={{ marginBottom: 8 }}>Structure</Texto>
              <div style={{ ...monoFont }}>
                <div>border: 1px solid #e8e8e8</div>
                <div>border-radius: 8px</div>
                <div>overflow: hidden</div>
                <div style={{ marginTop: 8, color: '#722ed1' }}>Header:</div>
                <div>&nbsp;&nbsp;background: #fafafa</div>
                <div>&nbsp;&nbsp;padding: 16px</div>
                <div>&nbsp;&nbsp;border-bottom: 1px solid #e8e8e8</div>
                <div style={{ marginTop: 8, color: '#722ed1' }}>Body:</div>
                <div>&nbsp;&nbsp;padding: 24px</div>
                <div>&nbsp;&nbsp;children gap: 16px</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <Texto category="p2" weight="600" style={{ marginBottom: 8 }}>Token mapping</Texto>
              <div style={{ ...monoFont }}>
                <div>Header padding &rarr; <code style={{ color: '#722ed1' }}>space-4</code> (16px)</div>
                <div>Body padding &rarr; <code style={{ color: '#722ed1' }}>space-5</code> (24px)</div>
                <div>Field gaps &rarr; <code style={{ color: '#722ed1' }}>space-4</code> (16px)</div>
                <div>Label-input &rarr; <code style={{ color: '#722ed1' }}>space-1</code> (4px)</div>
              </div>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      {/* ====== 4. Nested Sections ====== */}
      <PatternSection
        id="nested-sections"
        title="Nested Sections"
        description="When a section card contains sub-sections, padding steps down by one token level. Parent card uses space-5 (24px); child sub-sections use space-4 (16px)."
      >
        <PatternExample
          label="Parent card with nested sub-sections"
          caption="Parent card body: 24px padding. Each child sub-section: 16px padding with its own border. The step-down creates clear visual nesting."
          code={`{/* Parent card */}
<div style={{ border: '1px solid #e8e8e8', borderRadius: 8 }}>
  <div style={{ padding: 16, background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
    Parent Section
  </div>
  <div style={{ padding: 24 }}>
    <Vertical gap={16}>
      {/* Child sub-section */}
      <div style={{ padding: 16, border: '1px solid #f0f0f0', borderRadius: 6 }}>
        Child content...
      </div>
    </Vertical>
  </div>
</div>`}
        >
          <div style={{ border: cardBorder, borderRadius: 8, overflow: 'hidden' }}>
            {/* Parent header */}
            <div style={{ padding: 16, background: '#fafafa', borderBottom: cardBorder }}>
              <Texto category="p1" weight="600">Pricing Configuration</Texto>
            </div>
            {/* Parent body - 24px padding */}
            <div style={{ padding: 24, position: 'relative' }}>
              <div style={{ ...annotationBadge('', '#722ed1'), top: 4, right: 8 }}>
                parent: 24px
              </div>
              <Vertical gap={16}>
                {/* Child sub-section 1 */}
                <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ padding: '10px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                    <Texto category="p2" weight="600">Base Rates</Texto>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ ...annotationBadge('', '#40a9ff'), top: 2, right: 8 }}>
                      child: 16px
                    </div>
                    <Vertical gap={16}>
                      <FieldMock label="Rate Type" value="Fixed" />
                      <FieldMock label="Base Value" value="$125.00" />
                    </Vertical>
                  </div>
                </div>

                {/* Child sub-section 2 */}
                <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ padding: '10px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                    <Texto category="p2" weight="600">Adjustments</Texto>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ ...annotationBadge('', '#40a9ff'), top: 2, right: 8 }}>
                      child: 16px
                    </div>
                    <Vertical gap={16}>
                      <FieldMock label="Discount" value="5%" />
                      <FieldMock label="Surcharge" value="None" />
                    </Vertical>
                  </div>
                </div>
              </Vertical>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      {/* ====== 5. Dividers ====== */}
      <PatternSection
        id="dividers"
        title="Dividers"
        description="Use border dividers between major sections to reinforce visual breaks. Between fields in a group, spacing alone is sufficient."
      >
        <PatternExample
          label="Between major sections: spacing + divider"
          caption="A 1px #e8e8e8 border separates major content blocks. Combined with a 32px section gap, this creates a strong visual break."
        >
          <Vertical gap={0}>
            <div style={{ padding: 16, background: '#fafafa', borderRadius: '6px 6px 0 0' }}>
              <Texto category="p2" weight="600">Section A - Account Overview</Texto>
              <div style={{ marginTop: 8, fontSize: 13, color: '#8c8c8c' }}>Content for the first section...</div>
            </div>
            <div style={{ borderBottom: '1px solid #e8e8e8' }} />
            <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, color: '#bfbfbf', fontStyle: 'italic' }}>32px gap + 1px divider</span>
            </div>
            <div style={{ borderBottom: '1px solid #e8e8e8' }} />
            <div style={{ padding: 16, background: '#fafafa', borderRadius: '0 0 6px 6px' }}>
              <Texto category="p2" weight="600">Section B - Billing Details</Texto>
              <div style={{ marginTop: 8, fontSize: 13, color: '#8c8c8c' }}>Content for the second section...</div>
            </div>
          </Vertical>
        </PatternExample>

        <PatternExample
          label="Between fields in a group: spacing only"
          caption="Fields within a single form group are separated by 16px vertical gap only. No divider needed - the spacing and label structure provide enough separation."
        >
          <div style={{ border: cardBorder, borderRadius: 8, padding: 24 }}>
            <Vertical gap={16}>
              <FieldMock label="First Name" value="Jane" />
              <FieldMock label="Last Name" value="Smith" />
              <FieldMock label="Email" value="jane.smith@example.com" />
            </Vertical>
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#bfbfbf', fontStyle: 'italic' }}>16px gap between fields, no divider lines</span>
            </div>
          </div>
        </PatternExample>

        <PatternExample
          label="When to use which"
          caption="Rule of thumb: dividers separate sections; spacing separates items within a section."
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', background: '#f6ffed', borderBottom: '1px solid #b7eb8f', fontSize: 12, fontWeight: 600, color: '#52c41a' }}>
                Use divider
              </div>
              <div style={{ padding: 12, ...monoFont }}>
                <div>Between page sections</div>
                <div>Between card groups</div>
                <div>Below section headers</div>
                <div>Between tab content areas</div>
              </div>
            </div>
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', background: '#f0f0f0', borderBottom: '1px solid #e8e8e8', fontSize: 12, fontWeight: 600, color: '#595959' }}>
                Spacing only
              </div>
              <div style={{ padding: 12, ...monoFont }}>
                <div>Between form fields</div>
                <div>Between list items</div>
                <div>Between paragraphs</div>
                <div>Between inline elements</div>
              </div>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      {/* ====== 6. Do's & Don'ts ====== */}
      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <div style={{ border: cardBorder, borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: 16, background: '#fafafa', borderBottom: cardBorder }}>
                <Texto category="p2" weight="600">Settings</Texto>
              </div>
              <div style={{ padding: 24 }}>
                <Vertical gap={16}>
                  <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 16 }}>
                    <Vertical gap={16}>
                      <FieldMock label="Theme" value="Light" compact />
                      <FieldMock label="Language" value="English" compact />
                    </Vertical>
                  </div>
                  <div style={{ border: '1px solid #f0f0f0', borderRadius: 6, padding: 16 }}>
                    <Vertical gap={16}>
                      <FieldMock label="Timezone" value="UTC+10" compact />
                    </Vertical>
                  </div>
                </Vertical>
              </div>
            </div>
          }
          dontExample={
            <div style={{ border: cardBorder, borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: 12, background: '#fafafa', borderBottom: cardBorder }}>
                <Texto category="p2" weight="600">Settings</Texto>
              </div>
              <div style={{ padding: 12 }}>
                <Vertical gap={12}>
                  <div style={{ padding: 12 }}>
                    <Vertical gap={12}>
                      <FieldMock label="Theme" value="Light" compact />
                      <FieldMock label="Language" value="English" compact />
                    </Vertical>
                  </div>
                  <div style={{ padding: 12 }}>
                    <Vertical gap={12}>
                      <FieldMock label="Timezone" value="UTC+10" compact />
                    </Vertical>
                  </div>
                </Vertical>
              </div>
            </div>
          }
          doCaption="Proper nesting hierarchy: card header 16px, card body 24px, child sub-sections 16px, field gaps 16px. Padding decreases inward, creating visual containment."
          dontCaption="Flat padding: everything at 12px. Header, body, sub-sections, and field gaps all the same. No visual hierarchy -- content feels uncontained and hard to scan."
        />

        <DosDonts
          doExample={
            <Vertical gap={32}>
              <div>
                <Vertical gap={4}>
                  <Texto category="h4" weight="600">Account Info</Texto>
                  <Texto category="p2" appearance="medium">Primary account details</Texto>
                </Vertical>
                <div style={{ borderBottom: '1px solid #e8e8e8', marginTop: 12, marginBottom: 24 }} />
                <div style={{ padding: '12px 16px', background: '#fafafa', borderRadius: 6, fontSize: 13, color: '#8c8c8c' }}>
                  Content...
                </div>
              </div>
              <div>
                <Vertical gap={4}>
                  <Texto category="h4" weight="600">Preferences</Texto>
                  <Texto category="p2" appearance="medium">User preferences</Texto>
                </Vertical>
                <div style={{ borderBottom: '1px solid #e8e8e8', marginTop: 12, marginBottom: 24 }} />
                <div style={{ padding: '12px 16px', background: '#fafafa', borderRadius: 6, fontSize: 13, color: '#8c8c8c' }}>
                  Content...
                </div>
              </div>
            </Vertical>
          }
          dontExample={
            <Vertical gap={16}>
              <div>
                <Texto category="h4" weight="600">Account Info</Texto>
                <div style={{ marginTop: 8, padding: '12px 16px', background: '#fafafa', borderRadius: 6, fontSize: 13, color: '#8c8c8c' }}>
                  Content...
                </div>
              </div>
              <div>
                <Texto category="p1" weight="600" style={{ fontSize: 18 }}>Preferences</Texto>
                <div style={{ marginTop: 8, padding: '12px 16px', background: '#fafafa', borderRadius: 6, fontSize: 13, color: '#8c8c8c' }}>
                  Content...
                </div>
              </div>
              <div>
                <Texto category="p2" weight="600">Other Settings</Texto>
                <div style={{ marginTop: 8, padding: '12px 16px', background: '#fafafa', borderRadius: 6, fontSize: 13, color: '#8c8c8c' }}>
                  Content...
                </div>
              </div>
            </Vertical>
          }
          doCaption="Consistent section headers: every section uses h4/600 title + p2/medium subtitle + divider. Uniform 32px gaps between sections. Predictable rhythm."
          dontCaption="Mixed heading levels and styles: h4, then oversized p1, then small p2. No subtitles, no dividers, inconsistent gaps. The page feels unstructured."
        />
      </PatternSection>
    </PatternShell>
  )
}

// ---------- helper components ----------

function FieldMock({
  label,
  value,
  tag,
  compact,
}: {
  label: string
  value: string
  tag?: boolean
  compact?: boolean
}) {
  return (
    <div>
      <Texto
        category="p2"
        appearance="medium"
        weight="500"
        style={{
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          fontSize: compact ? 11 : 12,
        }}
      >
        {label}
      </Texto>
      <div style={{ marginTop: 4 }}>
        {tag ? (
          <StatusBadge tone="success" label={value} />
        ) : (
          <div
            style={{
              height: 32,
              background: '#fafafa',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              fontSize: 13,
              color: '#262626',
            }}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  )
}
