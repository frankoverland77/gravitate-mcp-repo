/**
 * Delivered Pricing Data
 *
 * Sample data for the Delivered Pricing quote book demo.
 * Modeled after the Pricing Engine's End of Day (EOD) quote book mode.
 */

import { generateDeliveredPricingData, type DeliveredPricingQuoteRow } from '../../shared/data'

export type { DeliveredPricingQuoteRow }

export const deliveredPricingData: DeliveredPricingQuoteRow[] = generateDeliveredPricingData(60)
