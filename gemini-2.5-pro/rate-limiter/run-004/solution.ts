```typescript
/**
 * token-bucket.ts
 * 
 * A production-ready Token Bucket rate limiting implementation.
 * This implementation is designed for high performance and precision, 
 * using a "lazy refill" strategy to avoid background timers.
 */

export interface RateLimiterOptions {
  /** Maximum number of tokens the bucket can hold */
  capacity: number;
  /** How many tokens are added per second */
  refill