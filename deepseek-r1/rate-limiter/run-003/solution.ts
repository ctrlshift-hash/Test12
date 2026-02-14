```typescript
// token-bucket.ts
/**
 * Token Bucket Rate Limiter
 * 
 * A production-ready implementation of the token bucket algorithm for rate limiting.
 * Supports multiple buckets, configurable refill rates, and burst handling.
 */

export interface TokenBucketConfig {
  /** Maximum tokens the bucket can hold */
  capacity: number;
  /** Tokens added per second */
  refillRate: number;
  /** Unique identifier for the bucket */
  bucketId: string;
