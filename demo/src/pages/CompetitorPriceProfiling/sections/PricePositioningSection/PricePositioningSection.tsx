import { Vertical } from '@gravitate-js/excalibrr';
import { PricePositioningData } from '../../CompetitorPriceProfiling.types';
import { MOTIVA_PRICE_POSITIONING } from './PricePositioningSection.data';
import SectionHeader from './components/SectionHeader';
import TakeawayCard from './components/TakeawayCard';
import { MetricTileRow } from './components/MetricTileRow';
import { ChartPlaceholder } from './components/ChartPlaceholder';
import { StatFitGrid } from './components/StatFitGrid';
import LearnMoreDisclosure from './components/LearnMoreDisclosure';

interface PricePositioningSectionProps {
  data?: PricePositioningData;
}

export function PricePositioningSection({
  data = MOTIVA_PRICE_POSITIONING,
}: PricePositioningSectionProps) {
  return (
    <Vertical gap={12}>
      <SectionHeader
        title={data.title}
        description={data.description}
        confidence={data.confidence}
        cellId={data.cellId}
      />
      {/* Single section card — wraps takeaway → metrics → chart → methodology. */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <MetricTileRow tiles={data.tiles} />
        <ChartPlaceholder
          heading={data.chartPlaceholder.heading}
          body={data.chartPlaceholder.body}
          sub={data.chartPlaceholder.sub}
        />
        <TakeawayCard takeaway={data.takeaway} />
        <StatFitGrid rows={data.statFit} />
      </div>
      <LearnMoreDisclosure summary={data.learnMore.summary} rules={data.learnMore.rules} />
    </Vertical>
  );
}
