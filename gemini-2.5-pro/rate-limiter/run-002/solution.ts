```typescript
/**
 * token-bucket.ts
 * 
 * A production-ready Token Bucket rate limiting implementation.
 * This algorithm allows for bursts of traffic while maintaining a steady 
 * average rate.
 */

export interface RateLimiterOptions {
  /** Maximum number of tokens the bucket can hold. */
  capacity: number;
  /** Number of tokens added to the bucket per second. */
  refillRate: number;