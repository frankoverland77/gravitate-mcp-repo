import { Texto } from '@gravitate-js/excalibrr';

interface TakeawayCardProps {
  takeaway: string;
}

function TakeawayCard({ takeaway }: TakeawayCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e8e8e8',
        borderRadius: 8,
        padding: 16,
      }}
    >
      <Texto category="p1" weight="500">{takeaway}</Texto>
    </div>
  );
}

export default TakeawayCard;
