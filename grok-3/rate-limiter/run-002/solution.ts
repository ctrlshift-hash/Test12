// token-bucket.ts
/**
 * Token Bucket Rate Limiting implementation.
 * This system manages rate limiting using the token bucket algorithm,
 * where tokens represent available requests and are replenished over time.
 */
class TokenBucket {
  private capacity: number; // Maximum number of tokens the bucket can hold
  private tokens: number; // Current number of tokens in the bucket
  private refillRate: number; // Tokens added per second
  private lastRefillTimestamp: number; // Last time