import { Horizontal, Vertical, Texto, BBDTag } from '@gravitate-js/excalibrr';
import { Collapse } from 'antd';
import { ClassificationRule } from '../../../CompetitorPriceProfiling.types';

const { Panel } = Collapse;

interface LearnMoreDisclosureProps {
  summary: string;
  rules: ClassificationRule[];
}

const ruleCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: 8,
  padding: 16,
};

function LearnMoreDisclosure({ summary, rules }: LearnMoreDisclosureProps) {
  return (
    <Collapse ghost defaultActiveKey={[]}>
      <Panel
        key="learn-more"
        header={<Texto category="p2" weight="600">{summary}</Texto>}
      >
        <Vertical gap={12}>
          {rules.map((rule) => (
            <Vertical key={rule.name} gap={4} style={ruleCardStyle}>
              <Horizontal gap={8} alignItems="center">
                <Texto category="p1" weight="600">{rule.name}</Texto>
                {rule.isCurrent && (
                  <BBDTag success style={{ width: 'fit-content' }}>← this profile</BBDTag>
                )}
              </Horizontal>
              <Texto category="p2" appearance="medium">{rule.description}</Texto>
            </Vertical>
          ))}
        </Vertical>
      </Panel>
    </Collapse>
  );
}

export default LearnMoreDisclosure;
