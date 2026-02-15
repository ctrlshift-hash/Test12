```typescript
// tokenBucket.ts
interface TokenBucketOptions {
  rate: number; // tokens per second
  capacity: number; // maximum tokens in the bucket
}

/**
 * TokenBucket class implements a token bucket rate limiting system.
 */
class TokenBucket {
  private rate: number;
  private capacity: number;
  private tokens: number;
  private lastUpdate: number;

  /**
   * Creates a new TokenBucket instance.
   * @param options Configuration options for the token bucket