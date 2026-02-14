// token-bucket.ts
/**
 * Token Bucket Rate Limiting System
 * 
 * This implementation provides a rate limiting mechanism using the token bucket algorithm.
 * Tokens are added to the bucket at a fixed rate, and each request consumes tokens.
 * If there aren't enough tokens, the request is rate-limited.
 */

interface TokenBucketConfig {
  /** Bucket capacity (maximum number of tokens) */
  capacity: number;
  /** Rate at which tokens are added per second */
  tokensPerSecond: number