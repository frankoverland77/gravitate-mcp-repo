import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr';
import { LeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { MOTIVA_PROFILE } from './CompetitorPriceProfiling.data';
import { CompetitorProfile } from './CompetitorPriceProfiling.types';
import { PricePositioningSection } from './sections/PricePositioningSection/PricePositioningSection';

export function CompetitorDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const profile: CompetitorProfile =
    (location.state as { profile?: CompetitorProfile } | null)?.profile ?? MOTIVA_PROFILE;

  return (
    <Vertical gap={24} style={{ padding: 32, minHeight: '100%' }}>
      <Horizontal
        gap={6}
        style={{ alignItems: 'center', cursor: 'pointer', color: '#1890ff', width: 'fit-content' }}
        onClick={() => navigate('/CompetitorPriceProfiling/CompetitorPriceProfilingGrid')}
      >
        <LeftOutlined style={{ fontSize: 12 }} />
        <Texto category="p2" style={{ color: '#1890ff' }}>
          Back to Competitor Price Profiling
        </Texto>
      </Horizontal>

      <Texto category="h3" weight="600">
        {profile.competitor} · {profile.location} · {profile.product}
      </Texto>

      <PricePositioningSection />
    </Vertical>
  );
}
