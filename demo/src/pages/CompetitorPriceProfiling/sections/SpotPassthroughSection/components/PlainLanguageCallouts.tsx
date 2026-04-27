import { Texto } from '@gravitate-js/excalibrr';
import { ArrowUpOutlined, ArrowDownOutlined, WarningOutlined } from '@ant-design/icons';

interface PlainLanguageCalloutsProps {
  upSlope: number;
  downSlope: number;
  upR2: number;
  downR2: number;
  orientation?: 'horizontal' | 'vertical';
}

function correlationLabel(r2: number): string {
  if (r2 >= 0.8) return 'High correlation';
  if (r2 >= 0.6) return 'Medium correlation';
  return 'Low correlation';
}

function formatDollars(slope: number): string {
  return `$${slope.toFixed(2)}`;
}

interface CalloutProps {
  icon: React.ReactNode;
  label: string;
  headline: string;
  sub: string;
}

function Callout({ icon, label, headline, sub }: CalloutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '14px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, color: '#595959', display: 'inline-flex' }}>{icon}</span>
        <Texto category="p2" appearance="medium">{label}</Texto>
      </div>
      <Texto category="p1" weight="600">{headline}</Texto>
      <Texto category="p2" appearance="medium">{sub}</Texto>
    </div>
  );
}

export function PlainLanguageCallouts({
  upSlope,
  downSlope,
  upR2,
  downR2,
  orientation = 'horizontal',
}: PlainLanguageCalloutsProps) {
  const asymmetryDollars = Math.abs(upSlope - downSlope);
  const leansUp = upSlope >= downSlope;
  const isVertical = orientation === 'vertical';

  const up = (
    <Callout
      icon={<ArrowUpOutlined />}
      label="Spot up"
      headline={`When spot rises $1.00, they typically raise price ${formatDollars(upSlope)}`}
      sub={correlationLabel(upR2)}
    />
  );
  const down = (
    <Callout
      icon={<ArrowDownOutlined />}
      label="Spot down"
      headline={`When spot drops $1.00, they typically lower price ${formatDollars(downSlope)}`}
      sub={correlationLabel(downR2)}
    />
  );
  const asym = (
    <Callout
      icon={<WarningOutlined />}
      label="Asymmetry"
      headline={
        leansUp
          ? `Responds ${formatDollars(asymmetryDollars)} more to rising markets than falling ones`
          : `Responds ${formatDollars(asymmetryDollars)} more to falling markets than rising ones`
      }
      sub="Raises faster than it lowers"
    />
  );

  if (isVertical) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ borderBottom: '1px solid #e8e8e8' }}>{up}</div>
        <div style={{ borderBottom: '1px solid #e8e8e8' }}>{down}</div>
        {asym}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <div style={{ borderRight: '1px solid #e8e8e8' }}>{up}</div>
      <div style={{ borderRight: '1px solid #e8e8e8' }}>{down}</div>
      {asym}
    </div>
  );
}
