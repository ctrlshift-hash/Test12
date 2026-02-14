```typescript
// tokenBucket.ts
interface TokenBucketOptions {
  /**
   * The maximum number of tokens in the bucket.
   */
  capacity: number;
  /**
   * The rate at which tokens are replenished per second.
   */
  refillRate: number;
}

/**
 * Represents a token bucket rate limiting system.
 */
class TokenBucket {
  private capacity: number;
  private refillRate: number;
  private tokens: number;
  private lastRefill: number;

  /**
