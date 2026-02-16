```typescript
// FileName: TokenBucket.ts

/**
 * Class representing a token bucket for rate limiting.
 */
class TokenBucket {
    private capacity: number;
    private tokens: number;
    private fillRate: number; // tokens per second
    private lastRefillTimestamp: number;

    /**
     * Create a token bucket.
     * @param capacity - The maximum number of tokens in the bucket.
     * @param fillRate - The rate at which the bucket refills in tokens