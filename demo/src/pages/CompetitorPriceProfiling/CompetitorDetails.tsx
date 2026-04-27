import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { MOTIVA_PROFILE } from './CompetitorPriceProfiling.data';
import { CompetitorProfile } from './CompetitorPriceProfiling.types';
import { ProfileHeader } from './components/ProfileHeader';
import { PeriodSelector, PeriodDates } from './components/PeriodSelector';
import { KpiStrip } from './components/KpiStrip';
import { PricePositioningSection } from './sections/PricePositioningSection/PricePositioningSection';
import { SpotPassthroughSection } from './sections/SpotPassthroughSection/SpotPassthroughSection';
import { RankPositionSection } from './sections/RankPositionSection/RankPositionSection';

export function CompetitorDetails() {
  const location = useLocation();
  const profile: CompetitorProfile =
    (location.state as { profile?: CompetitorProfile } | null)?.profile ?? MOTIVA_PROFILE;

  const [dates, setDates] = useState<PeriodDates>([
    moment().subtract(90, 'days'),
    moment(),
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 32, minHeight: '100%' }}>
      <ProfileHeader profile={profile} />
      <PeriodSelector value={dates} onChange={setDates} />
      <KpiStrip profile={profile} />
      <PricePositioningSection />
      <SpotPassthroughSection />
      <RankPositionSection />
    </div>
  );
}
