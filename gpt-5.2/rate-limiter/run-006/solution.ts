```typescript
// tokenBucket.ts

class TokenBucket {
    private capacity: number;
    private tokens: number;
    private fillRate: number; // tokens added per second
    private lastTimestamp: number;

    /**
     * Creates an instance of a TokenBucket for rate limiting purposes.
     * @param capacity Maximum number of tokens in the bucket.
     * @param fillRate Rate at which tokens are added to the bucket per second.
     */
    constructor(capacity: number,