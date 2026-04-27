import { ResponsiveLine } from '@nivo/line';
import { Texto } from '@gravitate-js/excalibrr';
import { RankOverTimePoint } from '../../../CompetitorPriceProfiling.types';

interface RankOverTimeChartProps {
  data: RankOverTimePoint[];
  avg90: number;
  avg30: number;
}

const REF_90_COLOR = '#722ed1';
const REF_30_COLOR = '#f5222d';

export function RankOverTimeChart({ data, avg90, avg30 }: RankOverTimeChartProps) {
  const series = [
    {
      id: 'Motiva rank',
      data: data.map((d) => ({ x: d.date, y: d.rank })),
    },
  ];

  return (
    <div style={{ padding: '8px 0' }}>
      <div style={{ height: 320 }}>
        <ResponsiveLine
          data={series}
          margin={{ top: 24, right: 32, bottom: 56, left: 88 }}
          xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            precision: 'day',
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: 'linear',
            min: 1,
            max: 7,
            reverse: true,
          }}
          curve="stepAfter"
          axisBottom={{
            format: '%b %d',
            tickSize: 5,
            tickPadding: 6,
            tickRotation: -45,
            tickValues: 'every 14 days',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 6,
            tickValues: [1, 2, 3, 4, 5, 6, 7],
            format: (v: number) => {
              if (v === 1) return '1  cheapest';
              if (v === 7) return '7  priciest';
              return `${v}`;
            },
          }}
          colors={['#1890ff']}
          lineWidth={2}
          pointSize={8}
          pointColor="#1890ff"
          pointBorderWidth={2}
          pointBorderColor="#ffffff"
          enableGridX={false}
          enableGridY={true}
          gridYValues={[1, 2, 3, 4, 5, 6, 7]}
          useMesh={true}
          markers={[
            {
              axis: 'y',
              value: avg90,
              lineStyle: { stroke: REF_90_COLOR, strokeWidth: 1.5, strokeDasharray: '4 4' },
              legend: `90-day avg — rank ${avg90}`,
              legendPosition: 'top-right',
              legendOrientation: 'horizontal',
              textStyle: { fill: REF_90_COLOR, fontSize: 11, fontWeight: 600 },
            },
            {
              axis: 'y',
              value: avg30,
              lineStyle: { stroke: REF_30_COLOR, strokeWidth: 1.5, strokeDasharray: '4 4' },
              legend: `30-day avg — rank ${avg30}`,
              legendPosition: 'bottom-right',
              legendOrientation: 'horizontal',
              textStyle: { fill: REF_30_COLOR, fontSize: 11, fontWeight: 600 },
            },
          ]}
          tooltip={({ point }) => (
            <div
              style={{
                background: 'white',
                padding: '8px 12px',
                border: '1px solid #e8e8e8',
                borderRadius: 4,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <Texto category="p2" weight="600">
                Rank {point.data.y as number} of 7
              </Texto>
              <Texto category="p2" appearance="medium">
                {new Date(point.data.x as string).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Texto>
            </div>
          )}
        />
      </div>
    </div>
  );
}
