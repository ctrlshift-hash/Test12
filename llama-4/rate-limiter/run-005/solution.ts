```typescript
// tokenBucket.ts
interface TokenBucketOptions {
  /**
   * The maximum number of tokens in the bucket.
   */
  capacity: number;
  /**
   * The rate at which tokens are refilled (tokens per second).
   */
  refillRate: number;
  /**
   * The initial number of tokens in the bucket.
   */
  initialTokens?: number;
}

/**
 * A token bucket rate limiting system.
 */
class TokenBucket {
  private capacity: number;
 