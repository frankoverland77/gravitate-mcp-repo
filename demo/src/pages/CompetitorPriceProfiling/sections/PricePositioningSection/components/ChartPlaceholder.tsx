import { Empty } from 'antd';
import { Texto, Vertical } from '@gravitate-js/excalibrr';

interface ChartPlaceholderProps {
  heading: string;
  body: string;
  sub: string;
}

export const ChartPlaceholder = ({ heading, body, sub }: ChartPlaceholderProps) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        padding: 32,
        minHeight: 360,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* TODO (Phase 8): Price Positioning chart — replaces this placeholder once AG picks Option A or Option B */}
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Vertical gap={8} style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <Texto category="h5" weight="600">{heading}</Texto>
            <Texto category="p2" appearance="medium">{body}</Texto>
            <Texto category="p2" appearance="medium">{sub}</Texto>
          </Vertical>
        }
      />
    </div>
  );
};
