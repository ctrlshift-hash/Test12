```typescript
// token-bucket-rate-limiter.ts

/**
 * Token Bucket Rate Limiter
 * 
 * A production-ready implementation of the token bucket algorithm for rate limiting.
 * This implementation supports multiple buckets (e.g., per user, per IP, per endpoint),
 * configurable refill strategies, and thread-safe operations.
 */

export interface TokenBucketConfig {
  /** Maximum tokens the bucket can hold */
  capacity: number;
  /** Tokens added per refill interval (