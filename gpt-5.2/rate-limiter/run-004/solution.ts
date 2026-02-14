```typescript
// tokenBucket.ts

class TokenBucket {
    private capacity: number;
    private tokens: number;
    private refillRate: number; // tokens added per second
    private lastRefillTimestamp: number;

    /**
     * Initializes the token bucket rate limiter.
     * 
     * @param capacity Maximum number of tokens in the bucket.
     * @param refillRate Rate at which tokens are added to the bucket per second.
     */
    constructor(capacity: number