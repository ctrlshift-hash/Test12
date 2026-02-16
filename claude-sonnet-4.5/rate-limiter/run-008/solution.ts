```typescript
// tokenBucket.ts

/**
 * Configuration options for the TokenBucket rate limiter
 */
export interface TokenBucketConfig {
  /** Maximum number of tokens the bucket can hold */
  capacity: number;
  /** Number of tokens to refill per interval */
  refillRate: number;
  /** Refill interval in milliseconds */
  refillInterval: number;
  /** Initial number of tokens