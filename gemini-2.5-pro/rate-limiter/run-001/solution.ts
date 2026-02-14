```typescript
/**
 * token-bucket-rate-limiter.ts
 * 
 * A production-ready Token Bucket algorithm implementation for rate limiting.
 * This implementation supports multiple buckets (e.g., per-IP or per-User),
 * automatic token replenishment based on time elapsed, and persistence-ready logic.
 */

/**
 * Configuration for a specific rate limit rule.
 */
export interface RateLimitConfig {
  capacity: