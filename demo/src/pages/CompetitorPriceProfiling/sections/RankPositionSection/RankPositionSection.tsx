import { Texto } from '@gravitate-js/excalibrr';
import { Collapse } from 'antd';
import { RankPositionData } from '../../CompetitorPriceProfiling.types';
import { MOTIVA_RANK_POSITION } from './RankPositionSection.data';
import SectionHeader from '../PricePositioningSection/components/SectionHeader';
import TakeawayCard from '../PricePositioningSection/components/TakeawayCard';
import { MetricTileRow } from '../PricePositioningSection/components/MetricTileRow';
import { StatFitGrid } from '../PricePositioningSection/components/StatFitGrid';
import { RankOverTimeChart } from './components/RankOverTimeChart';
import { PopRank } from '../../components/popovers/popoverContent';

const { Panel } = Collapse;

interface RankPositionSectionProps {
  data?: RankPositionData;
}

const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e8e8e8',
  borderRadius: 8,
  padding: 16,
};

export function RankPositionSection({
  data = MOTIVA_RANK_POSITION,
}: RankPositionSectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SectionHeader
        title={data.title}
        description={data.description}
        confidence={data.confidence}
        cellId={data.cellId}
        infoTooltip={<PopRank />}
        rowCell="rank"
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
        }}
      >
        <MetricTileRow tiles={data.tiles} />
        <RankOverTimeChart
          data={data.chartSeries}
          avg90={data.avg90Rank}
          avg30={data.avg30Rank}
        />
        <TakeawayCard takeaway={data.takeaway} />
        <StatFitGrid rows={data.statFit} />
      </div>
      <Collapse ghost defaultActiveKey={[]}>
        <Panel
          key="learn-more"
          header={<Texto category="p2" weight="600">{data.learnMore.summary}</Texto>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.learnMore.cards.map((card) => (
              <div key={card.title} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Texto category="p1" weight="600">{card.title}</Texto>
                <Texto category="p2" appearance="medium">{card.body}</Texto>
              </div>
            ))}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
}
