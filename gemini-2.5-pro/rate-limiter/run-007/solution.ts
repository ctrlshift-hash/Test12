```typescript
/**
 * token-bucket.ts
 * 
 * A production-ready implementation of the Token Bucket algorithm for rate limiting.
 * This implementation is designed to be thread-safe (in a single-event-loop environment)
 * and handles clock drift and precision issues.
 */

export interface RateLimiterOptions {
  /** Maximum number of tokens the bucket can hold */
  capacity: number;
  /** How many tokens are