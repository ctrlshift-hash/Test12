```typescript
// tokenBucket.ts

/**
 * Configuration options for the TokenBucket
 */
export interface TokenBucketConfig {
  /** Maximum number of tokens the bucket can hold */
  capacity: number;
  /** Number of tokens added per refill interval */
  refillRate: number;
  /** Interval in milliseconds between token refills */
  refillInterval: number;
  /** Initial number of tokens in