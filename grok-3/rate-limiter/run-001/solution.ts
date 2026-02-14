// token-bucket.ts
/**
 * Token Bucket Rate Limiting System
 * 
 * This implements a token bucket algorithm for rate limiting. The bucket has a fixed capacity
 * and refills at a constant rate. Requests consume tokens, and if insufficient tokens are available,
 * the request is rate limited.
 */

interface TokenBucketConfig {
  /** Maximum number of tokens the bucket can hold */
  capacity: number;
  /** Rate at which tokens are added per second */
  refillRate: number;
