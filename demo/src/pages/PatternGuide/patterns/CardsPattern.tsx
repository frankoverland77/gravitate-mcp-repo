import { Vertical, Texto } from '@gravitate-js/excalibrr'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'

const SECTIONS = [
  { id: 'types', title: 'Card Types' },
  { id: 'section-card', title: 'Section Card' },
  { id: 'stat-card', title: 'Stat / Metric Card' },
  { id: 'multi-counter', title: 'Multi-Counter Card' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

const cardBorder = '1px solid #e8e8e8'

export function CardsPattern() {
  return (
    <PatternShell
      title="Cards"
      subtitle="Two standard card types replace the three ad-hoc implementations (Ant Card, styled divs, custom wrappers). Every card uses the same border, radius, and spacing tokens."
      accentColor="#722ed1"
      sections={SECTIONS}
    >
      <PatternSection id="types" title="Card Types" description="Choose the card type based on content purpose, not visual preference.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
          <TypeCard
            title="Section Card"
            desc="Grouped content with a header bar. Use for forms, detail panels, and settings groups."
            when="Content has a clear title and belongs to a named group."
          />
          <TypeCard
            title="Stat / Metric Card"
            desc="Single value display with label and optional delta. Use for KPIs and counters."
            when="Displaying 1 key number or metric prominently."
          />
          <TypeCard
            title="Multi-Counter Card"
            desc="Multiple metrics in columns with vertical dividers. Use for dashboards and summaries."
            when="Showing 2-4 related metrics side by side."
          />
        </div>
      </PatternSection>

      <PatternSection id="section-card" title="Section Card" description="Grouped content with a header. border-radius: 8px, border: 1px solid #e8e8e8.">
        <PatternExample
          label="Section Card Anatomy"
          caption="Header: #fafafa background, 16px padding. Body: 24px padding, 16px gap between children."
          code={`<Vertical style={{ borderRadius: 8, border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
  <div style={{ padding: 'var(--space-4)', background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
    <Texto category="h5" weight="600">Section Title</Texto>
  </div>
  <Vertical style={{ padding: 'var(--space-5)' }} gap={16}>
    {children}
  </Vertical>
</Vertical>`}
        >
          <div style={{ borderRadius: 8, border: cardBorder, overflow: 'hidden' }}>
            <div style={{ padding: 'var(--space-4)', background: '#fafafa', borderBottom: cardBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Texto category="h5" weight="600">Contract Details</Texto>
              <Texto category="p2" appearance="medium">3 fields</Texto>
            </div>
            <Vertical style={{ padding: 'var(--space-5)' }} gap={16}>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <FieldPlaceholder label="Contract ID" value="CTR-2024-001" />
                <FieldPlaceholder label="Status" value="Active" />
              </div>
              <FieldPlaceholder label="Description" value="Annual supply agreement for commodity XYZ" />
            </Vertical>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="stat-card" title="Stat / Metric Card" description="Single prominent value with label. 24px padding, no header bar.">
        <PatternExample
          label="Stat Card Anatomy"
          caption="Padding: 24px (space-5). Label: p2 medium. Value: h2 weight 700. Optional delta below."
        >
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <StatCardExample label="Total Volume" value="12,450" unit="MT" />
            <StatCardExample label="Avg Price" value="$84.20" delta="+2.3%" deltaUp />
            <StatCardExample label="Open Contracts" value="37" />
            <StatCardExample label="Exceptions" value="5" delta="-3" deltaUp={false} />
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="multi-counter" title="Multi-Counter Card" description="2-4 metrics in columns with vertical dividers. Single border, shared padding.">
        <PatternExample
          label="Multi-Counter Card"
          caption="Columns: flex children with vertical 1px dividers. No gap between columns — divider provides visual separation."
        >
          <div style={{ borderRadius: 8, border: cardBorder, display: 'flex', overflow: 'hidden' }}>
            <CounterColumn label="Quotes" value="142" />
            <div style={{ width: 1, background: '#e8e8e8' }} />
            <CounterColumn label="Awarded" value="89" />
            <div style={{ width: 1, background: '#e8e8e8' }} />
            <CounterColumn label="Pending" value="38" />
            <div style={{ width: 1, background: '#e8e8e8' }} />
            <CounterColumn label="Rejected" value="15" />
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <Vertical gap={12}>
              <div style={{ borderRadius: 8, border: cardBorder, overflow: 'hidden' }}>
                <div style={{ padding: 16, background: '#fafafa', borderBottom: cardBorder }}>
                  <Texto category="h5" weight="600">Settings</Texto>
                </div>
                <div style={{ padding: 24 }}>
                  <Texto category="p2" appearance="medium">Content area</Texto>
                </div>
              </div>
            </Vertical>
          }
          dontExample={
            <Vertical gap={12}>
              <div style={{ padding: 12, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: 4 }}>
                <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Settings</div>
                <div style={{ color: '#999' }}>Content area</div>
              </div>
            </Vertical>
          }
          doCaption="Use the standard Section Card: consistent border, radius, header with background, token-based padding."
          dontCaption="Don't build cards with inline styles, arbitrary shadows, hard-coded font sizes, and non-token spacing."
        />

        <DosDonts
          doExample={
            <div style={{ display: 'flex', gap: 16 }}>
              <StatCardExample label="Total" value="250" />
              <StatCardExample label="Active" value="180" />
            </div>
          }
          dontExample={
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ padding: '20px 15px', border: '1px solid #ddd', borderRadius: 3 }}>
                <div style={{ fontSize: 11, color: '#aaa' }}>Total</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>250</div>
              </div>
              <div style={{ padding: '18px 12px', border: '2px solid #ccc', borderRadius: 6 }}>
                <div style={{ fontSize: 13, color: '#888' }}>Active</div>
                <div style={{ fontSize: 22, fontWeight: 600 }}>180</div>
              </div>
            </div>
          }
          doCaption="Stat cards use identical structure: same padding (24px), same label style (p2 medium), same value style (h2 700)."
          dontCaption="Different padding (20px vs 18px), different borders, different label sizes, different value weights — every card looks different."
        />
      </PatternSection>
    </PatternShell>
  )
}

function TypeCard({ title, desc, when }: { title: string; desc: string; when: string }) {
  return (
    <div style={{ border: cardBorder, borderRadius: 8, padding: 'var(--space-4)', background: '#fafafa' }}>
      <Texto category="h5" weight="600">{title}</Texto>
      <Texto category="p2" appearance="medium" style={{ marginTop: 'var(--space-1)' }}>{desc}</Texto>
      <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-2)', borderTop: '1px solid #e8e8e8' }}>
        <Texto category="p2" weight="500" style={{ fontSize: 12, color: '#8c8c8c' }}>When to use</Texto>
        <Texto category="p2" style={{ marginTop: 2 }}>{when}</Texto>
      </div>
    </div>
  )
}

function FieldPlaceholder({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1 }}>
      <Texto category="p2" weight="500" style={{ fontSize: 14 }}>{label}</Texto>
      <Texto category="p2" style={{ marginTop: 'var(--space-1)' }}>{value}</Texto>
    </div>
  )
}

function StatCardExample({ label, value, unit, delta, deltaUp }: { label: string; value: string; unit?: string; delta?: string; deltaUp?: boolean }) {
  return (
    <div style={{ flex: 1, borderRadius: 8, border: cardBorder, padding: 'var(--space-5)' }}>
      <Texto category="p2" weight="500" style={{ fontSize: 14 }}>{label}</Texto>
      <div style={{ marginTop: 'var(--space-1)', display: 'flex', alignItems: 'baseline', gap: 'var(--space-1)' }}>
        <Texto category="h2" weight="700">{value}</Texto>
        {unit && <Texto category="p2" appearance="medium">{unit}</Texto>}
      </div>
      {delta && (
        <Texto category="p2" appearance={deltaUp ? 'success' : 'error'} style={{ marginTop: 'var(--space-1)' }}>
          {delta}
        </Texto>
      )}
    </div>
  )
}

function CounterColumn({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, padding: 'var(--space-5)', textAlign: 'center' }}>
      <Texto category="p2" weight="500" style={{ fontSize: 14 }}>{label}</Texto>
      <Texto category="h2" weight="700" style={{ marginTop: 'var(--space-1)' }}>{value}</Texto>
    </div>
  )
}
