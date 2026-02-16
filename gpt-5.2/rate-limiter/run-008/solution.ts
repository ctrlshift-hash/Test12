```typescript
// FileName: TokenBucket.ts

class TokenBucket {
    private capacity: number;
    private tokens: number;
    private fillRate: number; // tokens added per second
    private lastChecked: number;

    /**
     * Initializes the token bucket rate limiter.
     * @param capacity Maximum number of tokens in the bucket.
     * @param fillRate Rate at which tokens are added to the bucket per second.
     */
    constructor(capacity: number, fillRate