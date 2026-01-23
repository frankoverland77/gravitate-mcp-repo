import { Texto } from '@gravitate-js/excalibrr'
import { BulbOutlined } from '@ant-design/icons'
import { AI_INSIGHT_TEXT } from '../rfp.data'
import styles from './AIRecommendationsPanel.module.css'

interface AIRecommendationsPanelProps {
  insightText?: string
}

export function AIRecommendationsPanel({ insightText = AI_INSIGHT_TEXT }: AIRecommendationsPanelProps) {
  return (
    <div className={styles.banner}>
      <BulbOutlined className={styles.bannerIcon} />
      <div className={styles.bannerContent}>
        <Texto category="p2" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Key Insight
        </Texto>
        <Texto category="p1" style={{ lineHeight: '1.5' }}>
          {insightText}
        </Texto>
      </div>
    </div>
  )
}
