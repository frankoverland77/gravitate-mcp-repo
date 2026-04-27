import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { TokenTable } from '../components/TokenTable'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'

const SECTIONS = [
  { id: 'vertical-form', title: 'Vertical Form' },
  { id: 'horizontal-form', title: 'Horizontal Form' },
  { id: 'inline-form', title: 'Inline Form' },
  { id: 'field-anatomy', title: 'Form Field Anatomy' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

const FIELD_TOKENS = [
  { token: 'space-1', value: '4px', cssVar: '--space-1', usage: 'Label to input gap' },
  { token: 'space-4', value: '16px', cssVar: '--space-4', usage: 'Field to field gap' },
  { token: 'space-5', value: '24px', cssVar: '--space-5', usage: 'Section to section gap / form padding inside card' },
]

/* ---------- Shared styles ---------- */

const inputStyle = {
  height: 32,
  background: '#fafafa',
  border: '1px solid #d9d9d9',
  borderRadius: 6,
} as const

const labelStyle = {
  fontSize: 14,
}

/* ---------- Reusable pieces ---------- */

function FormLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <Texto category="p2" weight="500" style={labelStyle}>
      {children}
      {required && <span style={{ color: 'var(--status-danger-solid)', marginLeft: 2 }}>*</span>}
    </Texto>
  )
}

function FormField({ label, required, error }: { label: string; required?: boolean; error?: string }) {
  return (
    <Vertical gap={4}>
      <FormLabel required={required}>{label}</FormLabel>
      <div style={inputStyle} />
      {error && (
        <Texto category="p2" appearance="error">{error}</Texto>
      )}
    </Vertical>
  )
}

/* ---------- Component ---------- */

export function FormsPattern() {
  return (
    <PatternShell
      title="Forms"
      subtitle="Consistent form layouts across the app. Three patterns cover every use case: vertical (default), horizontal (two-column), and inline (filter bars). Spacing tokens enforce visual hierarchy from section to label."
      accentColor="#722ed1"
      sections={SECTIONS}
    >
      {/* ── Section 1: Vertical Form ── */}
      <PatternSection
        id="vertical-form"
        title="Vertical Form"
        description="The default layout. Labels sit above inputs. Use space-1 (4px) between label and input, space-4 (16px) between fields, and space-5 (24px) between form sections."
      >
        <PatternExample
          label="Vertical form with 3 fields"
          caption="Labels are title case Texto p2 at 14px with weight 500. Required fields show a red asterisk. Error messages appear directly below the input."
          code={`<Vertical gap={24} style={{ padding: 'var(--space-5)' }}>
  {/* Section: Personal Info */}
  <Vertical gap={16}>
    <Vertical gap={4}>
      <Texto category="p2" weight="500" style={{ fontSize: 14 }}>
        Full Name <span style={{ color: '#ff4d4f' }}>*</span>
      </Texto>
      <Input />
    </Vertical>

    <Vertical gap={4}>
      <Texto category="p2" weight="500" style={{ fontSize: 14 }}>
        Email Address <span style={{ color: '#ff4d4f' }}>*</span>
      </Texto>
      <Input />
      <Texto category="p2" appearance="error">
        Please enter a valid email
      </Texto>
    </Vertical>

    <Vertical gap={4}>
      <Texto category="p2" weight="500" style={{ fontSize: 14 }}>
        Phone Number
      </Texto>
      <Input />
    </Vertical>
  </Vertical>
</Vertical>`}
        >
          <div style={{
            padding: 'var(--space-5)',
            border: '1px solid #e8e8e8',
            borderRadius: 8,
            background: '#fff',
          }}>
            <Vertical gap={16}>
              <FormField label="Full Name" required />
              <FormField label="Email Address" required error="Please enter a valid email" />
              <FormField label="Phone Number" />
            </Vertical>
          </div>
        </PatternExample>

        <PatternExample
          label="Multi-section vertical form"
          caption="Sections are separated by space-5 (24px). Each section can have a heading. Fields within a section use space-4 (16px)."
        >
          <div style={{
            padding: 'var(--space-5)',
            border: '1px solid #e8e8e8',
            borderRadius: 8,
            background: '#fff',
          }}>
            <Vertical gap={24}>
              {/* Section 1 */}
              <Vertical gap={16}>
                <Texto category="h5" weight="600">Personal Information</Texto>
                <FormField label="First Name" required />
                <FormField label="Last Name" required />
              </Vertical>

              {/* Divider */}
              <div style={{ borderTop: '1px solid #f0f0f0' }} />

              {/* Section 2 */}
              <Vertical gap={16}>
                <Texto category="h5" weight="600">Contact Details</Texto>
                <FormField label="Email" required />
                <FormField label="Phone" />
              </Vertical>
            </Vertical>
          </div>
        </PatternExample>
      </PatternSection>

      {/* ── Section 2: Horizontal Form ── */}
      <PatternSection
        id="horizontal-form"
        title="Horizontal Form"
        description="Two-column layout for wider forms. Uses a flex row with two flex:1 children and a 16px gap between columns. All other spacing rules (label-to-input, field-to-field) remain the same."
      >
        <PatternExample
          label="Two-column horizontal form"
          caption="Each column is flex: 1 with a 16px gap between them. Fields within each column still use space-4 (16px) vertical gap."
          code={`<div style={{ display: 'flex', gap: 'var(--space-4)' }}>
  <Vertical style={{ flex: 1 }} gap={16}>
    <FormField label="First Name" required />
    <FormField label="Email" required />
  </Vertical>
  <Vertical style={{ flex: 1 }} gap={16}>
    <FormField label="Last Name" required />
    <FormField label="Phone" />
  </Vertical>
</div>`}
        >
          <div style={{
            padding: 'var(--space-5)',
            border: '1px solid #e8e8e8',
            borderRadius: 8,
            background: '#fff',
          }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <Vertical style={{ flex: 1 }} gap={16}>
                <FormField label="First Name" required />
                <FormField label="Email" required />
              </Vertical>
              <Vertical style={{ flex: 1 }} gap={16}>
                <FormField label="Last Name" required />
                <FormField label="Phone" />
              </Vertical>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      {/* ── Section 3: Inline Form ── */}
      <PatternSection
        id="inline-form"
        title="Inline Form"
        description="For filter bars and compact control rows. Fields sit horizontally with 8px gaps and vertically centered alignment. Labels remain above inputs."
      >
        <PatternExample
          label="Inline filter bar"
          caption="Horizontal layout with space-2 (8px) gap. All items vertically centered. Commonly used for search bars, table filters, and toolbar controls."
          code={`<div style={{
  display: 'flex',
  gap: 'var(--space-2)',
  alignItems: 'flex-end',
}}>
  <Vertical gap={4}>
    <Label>STATUS</Label>
    <Input style={{ width: 160 }} />
  </Vertical>
  <Vertical gap={4}>
    <Label>SEARCH</Label>
    <Input style={{ width: 200 }} />
  </Vertical>
  <Button style={{ height: 32 }}>Filter</Button>
</div>`}
        >
          <div style={{
            padding: 'var(--space-5)',
            border: '1px solid #e8e8e8',
            borderRadius: 8,
            background: '#fff',
          }}>
            <div style={{
              display: 'flex',
              gap: 'var(--space-2)',
              alignItems: 'flex-end',
            }}>
              <Vertical gap={4}>
                <FormLabel>Status</FormLabel>
                <div style={{ ...inputStyle, width: 160 }} />
              </Vertical>
              <Vertical gap={4}>
                <FormLabel>Search</FormLabel>
                <div style={{ ...inputStyle, width: 200 }} />
              </Vertical>
              <Vertical gap={4}>
                <FormLabel>Date Range</FormLabel>
                <div style={{ ...inputStyle, width: 180 }} />
              </Vertical>
              <div style={{
                height: 32,
                padding: '0 16px',
                background: 'var(--theme-color-1)',
                color: '#fff',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}>
                Apply Filters
              </div>
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      {/* ── Section 4: Form Field Anatomy ── */}
      <PatternSection
        id="field-anatomy"
        title="Form Field Anatomy"
        description="Every form in the app uses the same spacing tokens. This table is the single source of truth for form spacing."
      >
        <TokenTable tokens={FIELD_TOKENS} />

        <PatternExample
          label="Annotated spacing breakdown"
          caption="Visualizing the three spacing tiers: label-to-input (4px), field-to-field (16px), and section-to-section (24px)."
        >
          <div style={{
            padding: 'var(--space-5)',
            border: '1px solid #e8e8e8',
            borderRadius: 8,
            background: '#fff',
          }}>
            <Vertical gap={24}>
              {/* Section A */}
              <Vertical gap={16}>
                <div style={{ position: 'relative' }}>
                  <Vertical gap={4}>
                    <FormLabel required>Field A</FormLabel>
                    <div style={inputStyle} />
                  </Vertical>
                  <div style={{
                    position: 'absolute',
                    right: -110,
                    top: 8,
                    fontSize: 11,
                    fontFamily: "'SF Mono', monospace",
                    color: '#722ed1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <div style={{ width: 20, borderTop: '1px dashed #722ed1' }} />
                    4px (space-1)
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <Vertical gap={4}>
                    <FormLabel>Field B</FormLabel>
                    <div style={inputStyle} />
                  </Vertical>
                  <div style={{
                    position: 'absolute',
                    right: -110,
                    top: -10,
                    fontSize: 11,
                    fontFamily: "'SF Mono', monospace",
                    color: '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <div style={{ width: 20, borderTop: '1px dashed #1890ff' }} />
                    16px (space-4)
                  </div>
                </div>
              </Vertical>

              {/* Section separator annotation */}
              <div style={{ position: 'relative' }}>
                <div style={{ borderTop: '1px solid #f0f0f0' }} />
                <div style={{
                  position: 'absolute',
                  right: -110,
                  top: -8,
                  fontSize: 11,
                  fontFamily: "'SF Mono', monospace",
                  color: '#52c41a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <div style={{ width: 20, borderTop: '1px dashed #52c41a' }} />
                  24px (space-5)
                </div>
              </div>

              {/* Section B */}
              <Vertical gap={16}>
                <FormField label="Field C" required />
              </Vertical>
            </Vertical>
          </div>
        </PatternExample>
      </PatternSection>

      {/* ── Section 5: Do's & Don'ts ── */}
      <PatternSection id="dos-donts" title="Do's & Don'ts">
        {/* Comparison 1: Consistent label styling */}
        <DosDonts
          doExample={
            <div style={{ padding: 16 }}>
              <Vertical gap={16}>
                <Vertical gap={4}>
                  <Texto category="p2" weight="500" style={labelStyle}>
                    First Name <span style={{ color: 'var(--status-danger-solid)' }}>*</span>
                  </Texto>
                  <div style={inputStyle} />
                </Vertical>
                <Vertical gap={4}>
                  <Texto category="p2" weight="500" style={labelStyle}>
                    Email Address <span style={{ color: 'var(--status-danger-solid)' }}>*</span>
                  </Texto>
                  <div style={inputStyle} />
                </Vertical>
                <Vertical gap={4}>
                  <Texto category="p2" weight="500" style={labelStyle}>
                    Phone Number
                  </Texto>
                  <div style={inputStyle} />
                </Vertical>
              </Vertical>
            </div>
          }
          dontExample={
            <div style={{ padding: 16 }}>
              <Vertical gap={16}>
                <Vertical gap={4}>
                  <Texto category="p2" weight="600" style={{ fontSize: 14 }}>
                    First Name *
                  </Texto>
                  <div style={inputStyle} />
                </Vertical>
                <Vertical gap={8}>
                  <Texto category="h4" appearance="medium" style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    email address *
                  </Texto>
                  <div style={inputStyle} />
                </Vertical>
                <Vertical gap={2}>
                  <span style={{ fontSize: 13, color: '#8c8c8c' }}>Phone Number</span>
                  <div style={inputStyle} />
                </Vertical>
              </Vertical>
            </div>
          }
          doCaption="Every label uses the same Texto category, weight, and font size (14px title case). Asterisks are red and positioned consistently."
          dontCaption="Mixed label styles: different categories, font sizes, weights, casing, and label-to-input gaps. The form looks disjointed."
        />

        {/* Comparison 2: Proper spacing hierarchy */}
        <DosDonts
          doExample={
            <div style={{ padding: 24, border: '1px solid #e8e8e8', borderRadius: 8 }}>
              <Vertical gap={24}>
                <Vertical gap={16}>
                  <Texto category="h5" weight="600">Section A</Texto>
                  <Vertical gap={4}>
                    <FormLabel>Name</FormLabel>
                    <div style={inputStyle} />
                  </Vertical>
                  <Vertical gap={4}>
                    <FormLabel>Email</FormLabel>
                    <div style={inputStyle} />
                  </Vertical>
                </Vertical>
                <div style={{ borderTop: '1px solid #f0f0f0' }} />
                <Vertical gap={16}>
                  <Texto category="h5" weight="600">Section B</Texto>
                  <Vertical gap={4}>
                    <FormLabel>Address</FormLabel>
                    <div style={inputStyle} />
                  </Vertical>
                </Vertical>
              </Vertical>
            </div>
          }
          dontExample={
            <div style={{ padding: 10, border: '1px solid #e8e8e8', borderRadius: 8 }}>
              <Vertical gap={10}>
                <Vertical gap={10}>
                  <Texto category="h5" weight="600">Section A</Texto>
                  <Vertical gap={4}>
                    <FormLabel>Name</FormLabel>
                    <div style={inputStyle} />
                  </Vertical>
                  <Vertical gap={4}>
                    <FormLabel>Email</FormLabel>
                    <div style={inputStyle} />
                  </Vertical>
                </Vertical>
                <Vertical gap={10}>
                  <Texto category="h5" weight="600">Section B</Texto>
                  <Vertical gap={4}>
                    <FormLabel>Address</FormLabel>
                    <div style={inputStyle} />
                  </Vertical>
                </Vertical>
              </Vertical>
            </div>
          }
          doCaption="Clear spacing hierarchy: card padding (24px) > section gap (24px) > field gap (16px) > label gap (4px). Each level is visually distinct."
          dontCaption="Flat 10px everywhere: padding, section gaps, and field gaps are all the same. No visual hierarchy — sections blur into fields."
        />
      </PatternSection>
    </PatternShell>
  )
}
