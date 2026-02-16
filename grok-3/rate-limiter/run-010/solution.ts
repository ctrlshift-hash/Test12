// token-bucket.ts
/**
 * A token bucket rate limiting implementation.
 * This system allows for rate limiting based on a bucket of tokens that refill at a specified rate.
 * Useful for API rate limiting, throttling, or controlling resource usage.
 */
class TokenBucket {
  private capacity: number; // Maximum number of tokens the bucket can hold
  private tokens: number; // Current number of tokens in the bucket
  private refillRate: number; // Tokens added per second
  private