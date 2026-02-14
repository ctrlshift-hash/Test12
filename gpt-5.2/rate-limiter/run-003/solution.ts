```typescript
// Filename: TokenBucket.ts

/**
 * TokenBucket class to manage rate limiting using a token bucket algorithm.
 */
class TokenBucket {
    private capacity: number;
    private tokens: number;
    private fillRate: number; // Tokens added per second
    private lastTimestamp: number;

    /**
     * Initializes the token bucket.
     * @param capacity Maximum number of tokens in the bucket.
     * @param fillRate Rate at which tokens are added to the bucket per