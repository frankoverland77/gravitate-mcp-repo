/**
 * Eval case definitions for grading demo quality.
 *
 * Each case points at an existing demo page (Phase 1) or defines a prompt
 * for generation testing (Phase 3).
 */

export interface EvalCase {
  /** Unique identifier for the case */
  id: string
  /** 1 = smoke, 2 = real-world, 3 = edge */
  tier: 1 | 2 | 3
  /** Human-readable name */
  name: string
  /** What this case tests */
  description: string
  /** Relative path(s) to the demo page files to grade (from demo/src/) */
  targetFiles: string[]
  /** The page directory name in demo/src/pages/ */
  pageDir: string
  /** The navigation key in pageConfig.tsx if different from pageDir (e.g., 'ContractFormulas' for ContractManagement) */
  navKey?: string
  /** URL path for Playwright navigation (e.g., '/DeliveredPricing/QuoteBook') */
  routePath?: string
  /** Expected theme key (e.g., 'PE_LIGHT', 'OSP') */
  theme?: string
  /** Expected demo type */
  expectedType: 'grid' | 'form' | 'dashboard' | 'full-feature' | 'design-system'
  /** Code quality expectations */
  expectations: CaseExpectations
  /** Tags for filtering */
  tags?: string[]
}

export interface CaseExpectations {
  /** Components that must be imported/used */
  mustContainComponents?: string[]
  /** Strings that must NOT appear in the code */
  mustNotContain?: string[]
  /** Must pass page registration check */
  mustBeRegistered?: boolean
  /** Must build without TypeScript errors */
  mustBuildClean?: boolean
  /** Must have zero critical anti-pattern violations */
  zeroCriticalAntiPatterns?: boolean
}
