```typescript
// tokenBucket.ts
interface TokenBucketOptions {
  /**
   * The maximum number of tokens in the bucket.
   */
  capacity: number;
  /**
   * The rate at which tokens are added to the bucket per second.
   */
  rate: number;
}

/**
 * A token bucket rate limiting system.
 */
class TokenBucket {
  private capacity: number;
  private rate: number;
  private tokens: number;
  private lastUpdate: number;

  /**
   *