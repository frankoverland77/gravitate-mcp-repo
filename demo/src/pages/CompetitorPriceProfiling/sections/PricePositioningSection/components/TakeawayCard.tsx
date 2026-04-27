import { Texto } from '@gravitate-js/excalibrr';

interface TakeawayCardProps {
  takeaway: string;
}

// Chromeless takeaway — sits between the chart and the Fit & methodology
// collapse as a plain descriptive sentence (not a lead). Unbold so it reads as
// a caption-style summary rather than a headline.
function TakeawayCard({ takeaway }: TakeawayCardProps) {
  return (
    <Texto category="p2" appearance="medium">
      {takeaway}
    </Texto>
  );
}

export default TakeawayCard;
