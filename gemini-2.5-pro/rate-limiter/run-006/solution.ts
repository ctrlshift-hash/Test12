```typescript
/**
 * token-bucket-rate-limiter.ts
 * 
 * A robust, production-ready implementation of the Token Bucket algorithm.
 * This implementation is thread-safe (within a single process) and uses 
 * lazy-refilling to ensure high performance without background timers.
 */

export interface RateLimiterOptions {
  /** Maximum number of tokens the bucket can hold. */
  capacity: number;
  