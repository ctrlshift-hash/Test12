```typescript
// token-bucket.ts
/**
 * Token Bucket Rate Limiter Implementation
 * 
 * A production-ready token bucket rate limiter with support for:
 * - Burst handling
 * - Multiple buckets per key
 * - Thread-safe operations
 * - Configurable refill strategies
 * - Detailed usage statistics
 */

export interface TokenBucketConfig {
  /** Maximum tokens the bucket can hold */
  capacity: number;
  /** Tokens added per second */
  refill