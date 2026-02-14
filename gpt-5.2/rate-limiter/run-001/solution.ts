```typescript
// FileName: TokenBucket.ts

/**
 * Class representing a token bucket for rate limiting.
 */
class TokenBucket {
    private capacity: number;
    private tokens: number;
    private fillRate: number; // tokens added per millisecond
    private lastTimestamp: number;

    /**
     * Initializes the token bucket.
     * @param capacity Maximum number of tokens in the bucket.
     * @param fillRate Tokens added to the bucket per second.
     */
    constructor(cap