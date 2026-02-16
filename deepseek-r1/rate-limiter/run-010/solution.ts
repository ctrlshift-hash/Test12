```typescript
// token-bucket.ts

/**
 * Token Bucket Rate Limiter
 * 
 * A classic rate limiting algorithm that allows bursts up to bucket capacity
 * while maintaining a steady average rate over time.
 */

export interface TokenBucketConfig {
  /** Maximum tokens the bucket can hold */
  capacity: number;
  /** Tokens added per second */
  refillRate: number;
  /** Optional unique identifier for the bucket */
  bucketId?: string;
}

export interface Token