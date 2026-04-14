import { Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { useNavigate } from 'react-router-dom'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'

const EXAMPLES = [
  {
    title: 'Full-Width Page',
    path: '/PatternExamples/ExFullWidth',
    description: 'Header + scrollable content area with stat cards, section cards, forms, and activity log. The most common page layout.',
    layout: 'Full-Width',
    demonstrates: ['Stat cards', 'Section cards with headers', 'DataItemRow fields', 'Page header with back button + actions', 'Spacing hierarchy (48 > 24 > 16 > 4)'],
  },
  {
    title: 'Sidebar + Main',
    path: '/PatternExamples/ExSidebarMain',
    description: 'Left panel list navigation with a detail/edit panel on the right. Used for managing profiles, settings, or any list-to-detail pattern.',
    layout: 'Sidebar + Main',
    demonstrates: ['Split panel with list + detail', 'Active list item state', 'Form fields in detail panel', 'Button group (Cancel + Save)', 'Section card nesting'],
  },
  {
    title: 'Dashboard',
    path: '/PatternExamples/ExDashboard',
    description: 'Multi-counter card, stat cards with deltas, activity feed, and data visualization bars. A read-heavy overview page.',
    layout: 'Full-Width (Dashboard)',
    demonstrates: ['Multi-counter card (4 columns)', 'Stat cards with delta indicators', 'Section card: activity log', 'Section card: bar chart visualization', 'Two-column content layout'],
  },
  {
    title: 'Grid Page',
    path: '/PatternExamples/ExGridPage',
    description: 'Control bar with search/filters + full-height AG Grid. The standard data management page layout.',
    layout: 'Grid-First',
    demonstrates: ['Control bar with search + filters', 'GraviGrid with column defs', 'Action buttons in header', 'Filter controls inline', 'Flex grid filling remaining space'],
  },
]

export function ExamplesPattern() {
  const navigate = useNavigate()

  return (
    <PatternShell
      title="Examples"
      subtitle="Interactive full-page examples showing how the pattern standards come together in real layouts. Each example includes a fake navigation shell so you can see exactly how a production page should look."
      accentColor="#722ed1"
    >
      <PatternSection id="examples" title="Example Pages" description="Click 'View Full Page' to open each example as a standalone page in your browser.">
        <Vertical gap={24}>
          {EXAMPLES.map((ex) => (
            <div
              key={ex.path}
              style={{
                border: '1px solid #e8e8e8',
                borderRadius: 8,
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <div style={{
                padding: 'var(--space-4)',
                background: '#fafafa',
                borderBottom: '1px solid #e8e8e8',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <Texto category="h5" weight="600">{ex.title}</Texto>
                  <Texto category="p2" appearance="medium" style={{ marginTop: 2 }}>
                    Layout: {ex.layout}
                  </Texto>
                </div>
                <GraviButton
                  buttonText="View Full Page"
                  theme1
                  onClick={() => navigate(ex.path)}
                />
              </div>
              <div style={{ padding: 'var(--space-5)' }}>
                <Texto category="p2" style={{ marginBottom: 'var(--space-3)' }}>{ex.description}</Texto>
                <div>
                  <Texto category="p2" weight="500" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8c8c8c', marginBottom: 'var(--space-2)' }}>
                    What it demonstrates
                  </Texto>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {ex.demonstrates.map((d) => (
                      <span
                        key={d}
                        style={{
                          padding: '2px 10px',
                          background: '#f0f0f0',
                          borderRadius: 4,
                          fontSize: 12,
                          color: '#595959',
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Embedded preview */}
              <div style={{
                borderTop: '1px solid #e8e8e8',
                height: 300,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <iframe
                  src={ex.path}
                  style={{
                    width: '200%',
                    height: '200%',
                    border: 'none',
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                  }}
                  title={ex.title}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 48,
                    background: 'linear-gradient(transparent, rgba(255,255,255,0.95))',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: 8,
                  }}
                >
                  <button
                    onClick={() => navigate(ex.path)}
                    style={{
                      padding: '4px 16px',
                      fontSize: 12,
                      color: '#1890ff',
                      background: 'rgba(255,255,255,0.9)',
                      border: '1px solid #d9d9d9',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Open full page &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Vertical>
      </PatternSection>
    </PatternShell>
  )
}
