```typescript
// tokenBucket.ts
interface TokenBucketOptions {
  /**
   * The maximum number of tokens in the bucket.
   */
  capacity: number;
  /**
   * The rate at which to refill the bucket (tokens per second).
   */
  refillRate: number;
}

/**
 * TokenBucket is a rate limiting system that uses the token bucket algorithm.
 */
class TokenBucket {
  private capacity: number;
  private refillRate: number;
  private tokens: number;
  private