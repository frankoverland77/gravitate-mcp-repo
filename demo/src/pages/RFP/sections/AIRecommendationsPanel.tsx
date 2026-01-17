import { Vertical, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { BulbOutlined, StarFilled, TrophyOutlined } from '@ant-design/icons'
import type { AIRecommendation } from '../rfp.types'
import { AI_RECOMMENDATIONS, AI_INSIGHT_TEXT } from '../rfp.data'
import styles from './AIRecommendationsPanel.module.css'

interface AIRecommendationsPanelProps {
  recommendations?: AIRecommendation[]
  insightText?: string
}

export function AIRecommendationsPanel({
  recommendations = AI_RECOMMENDATIONS,
  insightText = AI_INSIGHT_TEXT,
}: AIRecommendationsPanelProps) {
  const topPick = recommendations[0]

  return (
    <div className={styles.gridContainer}>
      {/* Tile 1: Top Pick */}
      <div className={styles.tile}>
        <Horizontal alignItems="center" style={{ gap: '8px' }} className="mb-2">
          <StarFilled className={styles.tileIconStar} />
          <Texto category="p2" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Top Recommendation
          </Texto>
        </Horizontal>
        <Vertical style={{ gap: '8px' }}>
          <Texto category="h4" weight="600">
            {topPick.supplierName}
          </Texto>
          <Texto category="p1" appearance="medium">
            {topPick.price}
          </Texto>
          <Horizontal style={{ gap: '6px' }}>
            {topPick.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </Horizontal>
        </Vertical>
      </div>

      {/* Tile 2: Rankings */}
      <div className={styles.tile}>
        <Horizontal alignItems="center" style={{ gap: '8px' }} className="mb-2">
          <TrophyOutlined className={styles.tileIconTrophy} />
          <Texto category="p2" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Supplier Rankings
          </Texto>
        </Horizontal>
        <Vertical style={{ gap: '10px' }}>
          {recommendations.map((rec) => (
            <Horizontal key={rec.supplierId} alignItems="center" style={{ gap: '12px' }}>
              <div className={`${styles.rankBadge} ${rec.rank === 1 ? styles.rankBadgeFirst : ''}`}>
                #{rec.rank}
              </div>
              <Texto weight={rec.rank === 1 ? '600' : '400'}>{rec.supplierName}</Texto>
              <Texto category="p2" appearance="medium" style={{ marginLeft: 'auto' }}>
                {rec.price}
              </Texto>
            </Horizontal>
          ))}
        </Vertical>
      </div>

      {/* Tile 3: Key Insight */}
      <div className={styles.tile}>
        <Horizontal alignItems="center" style={{ gap: '8px' }} className="mb-2">
          <BulbOutlined className={styles.tileIconBulb} />
          <Texto category="p2" appearance="medium" weight="600" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Key Insight
          </Texto>
        </Horizontal>
        <Texto category="p1" style={{ lineHeight: '1.6' }}>
          {insightText}
        </Texto>
      </div>
    </div>
  )
}
