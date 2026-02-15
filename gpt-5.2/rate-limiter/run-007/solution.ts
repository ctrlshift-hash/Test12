```typescript
// tokenBucketRateLimiter.ts

class TokenBucketRateLimiter {
    private capacity: number;
    private tokens: number;
    private refillRate: number;
    private lastRefillTimestamp: number;

    /**
     * Creates an instance of TokenBucketRateLimiter.
     * @param {number} capacity - Maximum number of tokens in the bucket.
     * @param {number} refillRate - Number of tokens added per second.
     */
    constructor(capacity