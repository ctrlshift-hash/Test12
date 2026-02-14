```typescript
// FileName: TokenBucket.ts

/**
 * TokenBucket class to manage rate limiting using the token bucket algorithm.
 */
export class TokenBucket {
    private capacity: number;
    private tokens: number;
    private refillRate: number;
    private lastRefillTimestamp: number;

    /**
     * Constructs a token bucket.
     * @param capacity Maximum number of tokens in the bucket.
     * @param refillRate Rate at which tokens are added per second.
     */
    constructor