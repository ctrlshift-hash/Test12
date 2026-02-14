```typescript
// token-bucket.ts

/**
 * Token Bucket Rate Limiter
 * 
 * A classic rate limiting algorithm that allows bursts up to bucket capacity
 * while maintaining a steady average rate over time.
 */

export interface TokenBucketConfig {
  /** Maximum number of tokens the bucket can hold */
  capacity: number;
  /** Number of tokens added per second */
  refillRate: number;
  /** Unique identifier for the bucket (e.g., user ID, IP address