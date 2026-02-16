```typescript
/**
 * token-bucket-rate-limiter.ts
 * 
 * A production-ready Token Bucket algorithm implementation for rate limiting.
 * This implementation is memory-efficient, supports multiple buckets (e.g., per-IP or per-User),
 * and uses a "lazy refill" strategy to avoid background timers.
 */

/**
 * Configuration for a specific Rate Limiter instance.
 */
export interface RateLimiter