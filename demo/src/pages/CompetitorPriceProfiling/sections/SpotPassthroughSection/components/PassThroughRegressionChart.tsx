import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import type { PassthroughScatterSeries } from '../SpotPassthroughSection.data';

interface PassThroughRegressionChartProps {
  series: PassthroughScatterSeries[];
  upSlope: number;
  downSlope: number;
  upInterceptDollars: number;
  downInterceptDollars: number;
}

const UP_COLOR = '#52c41a';
const DOWN_COLOR = '#f5222d';

export function PassThroughRegressionChart({
  series,
  upSlope,
  downSlope,
  upInterceptDollars,
  downInterceptDollars,
}: PassThroughRegressionChartProps) {
  // Squared axes: one symmetric bound drives both X and Y so a unit of price
  // movement looks the same distance on both axes. Bound expands to the real
  // data range (with a sensible floor) so asymmetric behavior reads visually.
  const allX = series.flatMap((s) => s.data.map((p) => p.x));
  const allY = series.flatMap((s) => s.data.map((p) => p.y));
  // Floor at $0.06/gal — the default viewing window. Bound expands if real data exceeds.
  const dataMax = Math.max(...allX.map(Math.abs), ...allY.map(Math.abs), 0.06);
  // Round up to the next 0.01 so ticks land on clean decimal boundaries.
  const bound = Math.ceil(dataMax * 100) / 100;
  const xMin = -bound;
  const xMax = bound;
  const yMin = -bound;
  const yMax = bound;

  // Up-days live in x > 0; clip their line to that half-plane. Same for down.
  const upXStart = 0;
  const upXEnd = xMax;
  const downXStart = xMin;
  const downXEnd = 0;

  // Square canvas — width === height so the 1:1 price-unit ratio holds
  // physically, not just in scale domain. Capped to container width.
  return (
    <div style={{ padding: '8px 0', display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ width: '100%', maxWidth: 650, aspectRatio: '1 / 1' }}>
        <ResponsiveScatterPlot
        data={series}
        margin={{ top: 64, right: 32, bottom: 64, left: 96 }}
        xScale={{ type: 'linear', min: xMin, max: xMax }}
        yScale={{ type: 'linear', min: yMin, max: yMax }}
        colors={[UP_COLOR, DOWN_COLOR]}
        nodeSize={8}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Spot price change ($/gal)',
          legendPosition: 'middle',
          legendOffset: 46,
          format: (v: number) => `$${v.toFixed(4)}`,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Posted price change ($/gal)',
          legendPosition: 'middle',
          legendOffset: -80,
          format: (v: number) => `$${v.toFixed(4)}`,
        }}
        useMesh
        layers={[
          'grid',
          'axes',
          (props: any) => {
            const { xScale, yScale } = props;
            const upX1 = xScale(upXStart);
            const upY1 = yScale(upSlope * upXStart + upInterceptDollars);
            const upX2 = xScale(upXEnd);
            const upY2 = yScale(upSlope * upXEnd + upInterceptDollars);

            const dnX1 = xScale(downXStart);
            const dnY1 = yScale(downSlope * downXStart + downInterceptDollars);
            const dnX2 = xScale(downXEnd);
            const dnY2 = yScale(downSlope * downXEnd + downInterceptDollars);

            return (
              <g>
                <line
                  x1={upX1}
                  y1={upY1}
                  x2={upX2}
                  y2={upY2}
                  stroke={UP_COLOR}
                  strokeWidth={2}
                />
                <line
                  x1={dnX1}
                  y1={dnY1}
                  x2={dnX2}
                  y2={dnY2}
                  stroke={DOWN_COLOR}
                  strokeWidth={2}
                />
              </g>
            );
          },
          'nodes',
          'mesh',
        ]}
        />
      </div>
    </div>
  );
}
