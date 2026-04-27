import SectionHeader from '../PricePositioningSection/components/SectionHeader';
import TakeawayCard from '../PricePositioningSection/components/TakeawayCard';
import { StatFitGrid } from '../PricePositioningSection/components/StatFitGrid';
import LearnMoreDisclosure from '../PricePositioningSection/components/LearnMoreDisclosure';
import { PassThroughRegressionChart } from './components/PassThroughRegressionChart';
import { PlainLanguageCallouts } from './components/PlainLanguageCallouts';
import { MOTIVA_SPOT_PASSTHROUGH, SpotPassthroughData } from './SpotPassthroughSection.data';
import { PopPassThrough } from '../../components/popovers/popoverContent';

interface SpotPassthroughSectionProps {
  data?: SpotPassthroughData;
}

// UpDownSummaryBlocks (the giant ▲92% / ▼78% hero cards) removed — those
// figures already appear in the top KpiStrip, and the β slopes below convey
// the same up/down relationship with more precision.
export function SpotPassthroughSection({
  data = MOTIVA_SPOT_PASSTHROUGH,
}: SpotPassthroughSectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader
        title={data.title}
        description={data.description}
        confidence={data.confidence}
        cellId={data.cellId}
        infoTooltip={<PopPassThrough />}
        rowCell="pass-through"
      />
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          width: 'fit-content',
          maxWidth: '100%',
          alignSelf: 'flex-start',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 650px',
            gap: 40,
            alignItems: 'start',
          }}
        >
          <div style={{ maxWidth: 320 }}>
            <PlainLanguageCallouts
              orientation="vertical"
              upSlope={data.upSlope}
              downSlope={data.downSlope}
              upR2={data.upR2}
              downR2={data.downR2}
            />
          </div>
          <PassThroughRegressionChart
            series={data.scatter}
            upSlope={data.upSlope}
            downSlope={data.downSlope}
            upInterceptDollars={data.upInterceptDollars}
            downInterceptDollars={data.downInterceptDollars}
          />
        </div>
        <TakeawayCard takeaway={data.takeaway} />
        <StatFitGrid rows={data.statFit} />
      </div>
      <LearnMoreDisclosure summary={data.learnMore.summary} rules={data.learnMore.rules} />
    </div>
  );
}
