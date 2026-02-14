```typescript
// token-bucket.ts
/**
 * Token Bucket Rate Limiter
 * 
 * A production-ready implementation of the token bucket algorithm for rate limiting.
 * Features:
 * - Thread-safe operations using atomic operations
 * - Configurable burst capacity and refill rate
 * - Support for multiple buckets (different keys)
 * - Token reservation system
 * - Comprehensive metrics and monitoring
 * - Graceful handling of edge cases
 */

export interface TokenBucketConfig {
  /** Maximum