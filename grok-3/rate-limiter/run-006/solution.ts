// token-bucket.ts
/**
 * A production-ready Token Bucket rate limiting implementation.
 * This system manages rate limiting using the token bucket algorithm,
 * where tokens are added at a fixed rate and consumed for each request.
 */
class TokenBucket {
  private capacity: number; // Maximum number of tokens the bucket can hold
  private tokens: number; // Current number of tokens in the bucket
  private rate: number; // Tokens added per second
  private lastRefillTimestamp: number