import { Vertical, Texto, GraviButton } from '@gravitate-js/excalibrr'
import { PatternShell } from '../PatternShell'
import { PatternSection } from '../components/PatternSection'
import { DosDonts } from '../components/DosDonts'
import { PatternExample } from '../components/PatternExample'
import { TokenTable } from '../components/TokenTable'

const SECTIONS = [
  { id: 'gap', title: 'Standard Gap' },
  { id: 'semantics', title: 'Semantic Usage' },
  { id: 'ordering', title: 'Button Ordering' },
  { id: 'footer-pattern', title: 'Footer Pattern' },
  { id: 'dos-donts', title: "Do's & Don'ts" },
]

export function ButtonGroupsPattern() {
  return (
    <PatternShell
      title="Button Groups"
      subtitle="One gap value (8px), clear semantic rules, and consistent ordering. Consolidates the 4+ different spacing values (8/10/12/20px) found across the codebase."
      accentColor="#fa541c"
      sections={SECTIONS}
    >
      <PatternSection id="gap" title="Standard Gap" description="All button groups use space-2 (8px) gap. No exceptions.">
        <TokenTable tokens={[
          { token: 'Button group gap', value: '8px', cssVar: '--space-2', usage: 'Between all adjacent buttons — footers, toolbars, action bars' },
          { token: 'Button to text gap', value: '8px', cssVar: '--space-2', usage: 'Between a button and adjacent text label' },
          { token: 'Icon to text (inside button)', value: '4px', cssVar: '--space-1', usage: 'Ant Design handles this automatically' },
        ]} />
      </PatternSection>

      <PatternSection id="semantics" title="Semantic Usage" description="Each button prop has a specific meaning. Using the wrong prop creates confusion.">
        <PatternExample label="Button Semantics">
          <Vertical gap={16}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: 120 }}>
                <GraviButton buttonText="Submit" theme1 />
              </div>
              <div>
                <Texto category="p2" weight="600">theme1</Texto>
                <Texto category="p2" appearance="medium">Primary action — save, submit, create, confirm</Texto>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: 120 }}>
                <GraviButton buttonText="Approve" success />
              </div>
              <div>
                <Texto category="p2" weight="600">success</Texto>
                <Texto category="p2" appearance="medium">Positive completion only — approve, mark complete, publish</Texto>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: 120 }}>
                <GraviButton buttonText="Delete" error />
              </div>
              <div>
                <Texto category="p2" weight="600">error</Texto>
                <Texto category="p2" appearance="medium">Destructive action — delete, remove, discard</Texto>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ width: 120 }}>
                <GraviButton buttonText="Cancel" />
              </div>
              <div>
                <Texto category="p2" weight="600">(default)</Texto>
                <Texto category="p2" appearance="medium">Secondary action — cancel, close, go back</Texto>
              </div>
            </div>
          </Vertical>
        </PatternExample>
      </PatternSection>

      <PatternSection id="ordering" title="Button Ordering" description="Reading left to right = escalation of commitment. Secondary first, primary last.">
        <PatternExample
          label="Standard Button Order"
          caption="Cancel (secondary, left) → Save (primary, right). The user reads past the escape hatch before reaching the commitment."
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <GraviButton buttonText="Cancel" />
            <GraviButton buttonText="Save Changes" theme1 />
          </div>
        </PatternExample>

        <PatternExample
          label="Three-Button Pattern"
          caption="Destructive (left, isolated) | Cancel + Primary (right, grouped). Destructive is visually separated."
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <GraviButton buttonText="Delete" error />
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <GraviButton buttonText="Cancel" />
              <GraviButton buttonText="Save" theme1 />
            </div>
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="footer-pattern" title="Footer Pattern" description="The standard footer for modals, drawers, and panel footers.">
        <PatternExample
          label="Standard Footer"
          caption="Horizontal flex, justify-content: flex-end, gap: 8px. Secondary before primary."
          code={`<Horizontal gap={8} justifyContent="flex-end">
  <GraviButton buttonText="Cancel" />
  <GraviButton buttonText="Save" theme1 />
</Horizontal>`}
        >
          <div style={{ padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid #e8e8e8', background: '#fafafa', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', borderRadius: '0 0 8px 8px' }}>
            <GraviButton buttonText="Cancel" />
            <GraviButton buttonText="Save" theme1 />
          </div>
        </PatternExample>
      </PatternSection>

      <PatternSection id="dos-donts" title="Do's & Don'ts">
        <DosDonts
          doExample={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <GraviButton buttonText="Cancel" />
              <GraviButton buttonText="Create Contract" theme1 />
            </div>
          }
          dontExample={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <GraviButton buttonText="Cancel" />
              <GraviButton buttonText="Create Contract" success />
            </div>
          }
          doCaption="Use theme1 for primary actions. Gap: 8px."
          dontCaption="Don't use success for primary actions — success means 'approve' or 'complete', not 'submit'. Don't use 12px gap."
        />

        <DosDonts
          doExample={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <GraviButton buttonText="Delete Draft" error />
              <div style={{ display: 'flex', gap: 8 }}>
                <GraviButton buttonText="Cancel" />
                <GraviButton buttonText="Save" theme1 />
              </div>
            </div>
          }
          dontExample={
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
              <GraviButton buttonText="Save" theme1 />
              <GraviButton buttonText="Cancel" />
              <GraviButton buttonText="Delete Draft" error />
            </div>
          }
          doCaption="Destructive action isolated left. Cancel + primary grouped right. Consistent 8px gap."
          dontCaption="Centered layout, primary before cancel (reversed), destructive mixed in, 20px gap."
        />
      </PatternSection>
    </PatternShell>
  )
}
