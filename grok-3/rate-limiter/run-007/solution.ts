// token-bucket.ts
/**
 * Token Bucket Rate Limiting implementation.
 * class implements a token bucket algorithm for rate limiting requests.
 * Tokens are added to the bucket at a fixed rate, and each request consumes tokens.
 * If insufficient tokens are available, the request is rate limited.
 */

interface TokenBucketConfig {
  /** Maximum capacity of tokens in the bucket */
  capacity: number;
  /** Rate at which tokens are added per second */
  tokensPerSecond: number;
}

class Token