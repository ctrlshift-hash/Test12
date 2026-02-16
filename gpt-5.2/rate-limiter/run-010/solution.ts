```typescript
// file: TokenBucket.ts

/**
 * Class to implement a token bucket for rate limiting.
 */
class TokenBucket {
  private capacity: number;
  private tokens: number;
  private refillRate: number;
  private lastRefill: number;

  /**
   * Creates an instance of TokenBucket.
   * @param {number} capacity - The maximum number of tokens in the bucket.
   * @param {number} refillRate - The rate at which tokens are ref