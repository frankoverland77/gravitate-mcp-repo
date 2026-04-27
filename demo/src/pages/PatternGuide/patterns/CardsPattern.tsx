import { Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { ArrowUpOutlined, ArrowDownOutlined, FileTextOutlined } from '@ant-design/icons'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'
import { MetricCard } from '@components/shared/MetricCard'
import { StatusBadge } from '@components/shared/StatusBadge'
import { Section } from '@components/shared/Section'

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

      <PatternSection
        id='section-card'
        title='Section Card'
        description="Grouped content with a header. Use the Section component instead of hand-rolling the border + header + body structure — before it existed, ContractHeaderSidebar, ExampleDashboard, and a few others each shipped their own near-identical CSS module for the same shape."
      >
        <PatternExample
          label='Default — title + subtitle + actions'
          caption='Title on the left, optional subtitle next to it, optional action slot on the right. Body default padding is 16/20px.'
          code={`import { Section } from '@components/shared/Section'

<Section title='Contract Details' subtitle='3 fields' actions={<GraviButton buttonText='Edit' />}>
  <FieldRow label='Contract ID' value='CTR-2024-001' />
  <FieldRow label='Status' value='Active' />
  <FieldRow label='Description' value='Annual supply agreement for commodity XYZ' />
</Section>`}
        >
          <Section
            title='Contract Details'
            subtitle='3 fields'
            actions={<GraviButton buttonText='Edit' appearance='outlined' />}
          >
            <Vertical gap={12}>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <FieldPlaceholder label='Contract ID' value='CTR-2024-001' />
                <FieldPlaceholder label='Status' value='Active' />
              </div>
              <FieldPlaceholder label='Description' value='Annual supply agreement for commodity XYZ' />
            </Vertical>
          </Section>
        </PatternExample>

        <PatternExample
          label='With icon + status actions'
          caption="The icon uses --theme-color-1 (brand teal) so it matches ActionFooter's accent. Put a StatusBadge in the actions slot to surface section state without a banner."
          code={`<Section
  icon={<FileTextOutlined />}
  title='Pricing Terms'
  actions={<StatusBadge tone='success' label='Complete' />}
>
  ...
</Section>`}
        >
          <Section
            icon={<FileTextOutlined />}
            title='Pricing Terms'
            actions={<StatusBadge tone='success' label='Complete' />}
          >
            <Vertical gap={12}>
              <FieldPlaceholder label='Base Price' value='$3.42 / gal' />
              <FieldPlaceholder label='Differential' value='+0.15 / gal' />
            </Vertical>
          </Section>
        </PatternExample>

        <PatternExample
          label='Compact density — sidebars & drawers'
          caption='Tighter header padding (8/12px) and a body that auto-stacks its children with an 8px gap. Matches the ContractHeaderSidebar pattern used throughout quick-entry flows.'
          code={`<Section title='Quick Info' density='compact' bodyPadding='compact'>
  <FieldRow label='Customer' value='Acme Fuel Co.' />
  <FieldRow label='Region' value='Midwest' />
</Section>`}
        >
          <div style={{ maxWidth: 320 }}>
            <Section title='Quick Info' density='compact' bodyPadding='compact'>
              <FieldPlaceholder label='Customer' value='Acme Fuel Co.' />
              <FieldPlaceholder label='Region' value='Midwest' />
              <FieldPlaceholder label='Contract' value='CTR-2024-001' />
            </Section>
          </div>
        </PatternExample>

        <PatternExample
          label='No title — bordered container'
          caption='Omit the title to get a bordered, rounded container with no header bar. Use to wrap a grid, chart, or embedded widget without a redundant title.'
          code={`<Section bodyPadding='flush'>
  <GraviGrid {...} />
</Section>`}
        >
          <Section bodyPadding='flush'>
            <div style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--gray-600)' }}>
              <Texto category='p2' appearance='medium'>Grid, chart, or embedded widget sits here</Texto>
            </div>
          </Section>
        </PatternExample>

        <PatternExample
          label="flush body — when the child owns its own padding"
          caption="bodyPadding='flush' removes body padding entirely. Use when the child is a GraviGrid, a table, or a nested Section."
        >
          <Section title='Recent Activity' subtitle='last 7 days' bodyPadding='flush'>
            <div style={{ background: 'var(--surface-muted)' }}>
              {['Price updated by Analyst A', 'Publish queued', 'Publish completed'].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
                    background: 'var(--bg-1)',
                    fontSize: 13,
                  }}
                >
                  <span>{row}</span>
                  <span style={{ color: 'var(--gray-600)' }}>{i + 2}h ago</span>
                </div>
              ))}
            </div>
          </Section>
        </PatternExample>
      </PatternSection>

      <PatternSection
        id='stat-card'
        title='Stat / Metric Card'
        description="One primary number with a short label. Use MetricCard for pipeline stats, dashboard KPIs, summary headers — anywhere a single value needs to read at a glance. Before this component existed, SellerRFP and SummaryExportTab had their own near-identical CSS modules for the same pattern."
      >
        <PatternExample
          label='Default — valueFirst, left-aligned'
          caption="The dashboard default. Big number on top, muted label below, left-aligned for scannable rows. Tabular-numeric digits keep values vertically aligned when stacked side by side."
          code={`import { MetricCard } from '@components/shared/MetricCard'

<MetricCard label='Active Deals' value='142' />
<MetricCard label='Won This Q' value='$2.4M' />
<MetricCard label='Avg Cycle' value='11d' />`}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
            <MetricCard label='Active Deals' value='142' />
            <MetricCard label='Won This Quarter' value='$2.4M' />
            <MetricCard label='Avg Cycle' value='11d' />
            <MetricCard label='Pipeline Value' value='$8.1M' />
          </div>
        </PatternExample>

        <PatternExample
          label='With sub and trend slots'
          caption='Add a sub line for denominator context and a trend slot for a StatusBadge or delta chip. Keep these quiet — a metric card that tries to say four things well says none of them.'
          code={`<MetricCard
  label='On-Track Deliveries'
  value='238'
  sub='of 254 scheduled this week'
  trend={<StatusBadge tone='success' variant='quiet' label='+4 vs last week' />}
/>`}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
            <MetricCard
              label='On-Track Deliveries'
              value='238'
              sub='of 254 scheduled'
              trend={<StatusBadge tone='success' variant='quiet' label='+4 vs last week' />}
            />
            <MetricCard
              label='Behind Schedule'
              value='12'
              sub='routes needing action'
              trend={<StatusBadge tone='warning' variant='quiet' label='+3 vs last week' />}
            />
            <MetricCard
              label='Avg Fill Rate'
              value='94.2%'
              sub='last 30 days'
              trend={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--status-success-text)' }}>
                  <ArrowUpOutlined style={{ fontSize: 11 }} /> 1.1pp
                </span>
              }
            />
          </div>
        </PatternExample>

        <PatternExample
          label='Highlight — currently filtered or primary metric'
          caption="Gives a card a teal border to mark the currently selected filter state or the metric the page is about. Use at most one per row — highlight loses meaning when every card wears it."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
            <MetricCard label='All Deals' value='248' />
            <MetricCard label='In Progress' value='94' highlight />
            <MetricCard label='Won' value='42' />
            <MetricCard label='Lost' value='18' />
          </div>
        </PatternExample>

        <PatternExample
          label='Interactive — drill-through'
          caption="Pass onClick to make a card clickable. It renders as a button with keyboard focus, hover accent, and screen-reader affordance. Pair with ariaLabel when the visible copy alone isn't enough."
          code={`<MetricCard
  label='At Risk'
  value='7'
  highlight
  onClick={() => navigate('/deliveries?status=at-risk')}
/>`}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
            <MetricCard
              label='At Risk'
              value='7'
              highlight
              onClick={() => undefined}
              trend={<StatusBadge tone='danger' variant='quiet' label='Needs review' />}
              ariaLabel='At risk — click to view 7 at-risk deliveries'
            />
            <MetricCard label='On Hold' value='3' onClick={() => undefined} />
            <MetricCard label='Completed' value='189' onClick={() => undefined} />
          </div>
        </PatternExample>

        <PatternExample
          label='Alignment variants'
          caption="Left (default) for dense dashboards and summary rows. Center when a single metric is the hero of a section — sparingly; the left-aligned version scans better next to others."
        >
          <Vertical gap={16}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
              <MetricCard label='Left' value='$12,450' />
              <MetricCard label='Center' value='$12,450' align='center' />
              <MetricCard label='Label first' value='$12,450' order='labelFirst' />
            </div>
          </Vertical>
        </PatternExample>

        <PatternExample
          label='Size — sm / md / lg'
          caption="Value scales with size; label stays constant. sm for inline summary strips, md (default) for page dashboards, lg when a single metric is the headline of the view."
        >
          <Vertical gap={12}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
              <MetricCard label='Small' value='$1,240' size='sm' />
              <MetricCard label='Medium (default)' value='$1,240' size='md' />
              <MetricCard label='Large' value='$1,240' size='lg' />
            </div>
          </Vertical>
        </PatternExample>

        <PatternExample
          label='Negative trend — compose with tokens'
          caption="There's no built-in 'negative' style. Compose with --status-* tokens or StatusBadge to keep the decision at the call site."
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
            <MetricCard
              label='Exceptions'
              value='5'
              trend={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--status-danger-text)' }}>
                  <ArrowDownOutlined style={{ fontSize: 11 }} /> 3 resolved
                </span>
              }
            />
            <MetricCard
              label='Overdue'
              value='2'
              sub='>24h past SLA'
              trend={<StatusBadge tone='danger' variant='quiet' label='Action required' />}
            />
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
