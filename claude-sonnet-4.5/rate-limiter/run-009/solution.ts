```typescript
// tokenBucket.ts

/**
 * Configuration options for the TokenBucket rate limiter
 */
export interface TokenBucketConfig {
  /** Maximum number of tokens the bucket can hold */
  capacity: number;
  /** Number of tokens added to the bucket per refill interval */
  tokensPerInterval: number;
  /** Refill interval in milliseconds */
  intervalMs: number;
  /** Initial