import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CompetitorProfile } from '../CompetitorPriceProfiling.types';

interface ProfileHeaderProps {
  profile: CompetitorProfile;
  lastPricePosted?: string;
  analysisWindow?: string;
  profileUpdated?: string;
}

export function ProfileHeader({
  profile,
  lastPricePosted = 'Apr 21, 2026 · 2:14 PM CT',
  analysisWindow = 'Jan 21 – Apr 21, 2026',
  profileUpdated = '12 min ago',
}: ProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', color: '#0C5A58', width: 'fit-content' }}
        onClick={() => navigate('/CompetitorPriceProfiling/CompetitorPriceProfilingGrid')}
      >
        <LeftOutlined style={{ fontSize: 12 }} />
        <Texto category="p2" style={{ color: '#0C5A58' }}>
          Back to grid
        </Texto>
      </div>

      <div style={{ display: 'flex', gap: 24, justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Horizontal gap={12} style={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Texto category="h3" weight="600">
              {profile.competitor} · {profile.location} · {profile.product}
            </Texto>
            {profile.isLeader && (
              <BBDTag theme1 style={{ width: 'fit-content' }}>
                ★ LEADER
              </BBDTag>
            )}
            <BBDTag theme1 style={{ width: 'fit-content' }}>
              {profile.classification}
            </BBDTag>
          </Horizontal>
          <Horizontal gap={16} style={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Texto category="p2" appearance="medium">
              Counterparty group: {profile.counterpartyGroup}
            </Texto>
            <Texto category="p2" appearance="medium">·</Texto>
            <Texto category="p2" appearance="medium">
              Product group: {profile.productGroup}
            </Texto>
            <Texto category="p2" appearance="medium">·</Texto>
            <Texto category="p2" appearance="medium">
              Region: {profile.region}
            </Texto>
            <Texto category="p2" appearance="medium">·</Texto>
            <Texto category="p2" appearance="medium">
              Publisher: {profile.publisher}
            </Texto>
          </Horizontal>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end', minWidth: 280 }}>
          <span style={{ fontSize: 11, color: '#595959' }}>
            Last price posted: {lastPricePosted}
          </span>
          <span style={{ fontSize: 11, color: '#595959' }}>
            Analysis window: {analysisWindow}
          </span>
          <span style={{ fontSize: 11, color: '#595959' }}>
            Profile updated: {profileUpdated}
          </span>
        </div>
      </div>
    </div>
  );
}
