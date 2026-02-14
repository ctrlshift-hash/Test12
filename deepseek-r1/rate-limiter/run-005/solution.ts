```typescript
// token-bucket.ts
/**
 * Token Bucket Rate Limiter
 * 
 * A production-ready implementation of the token bucket algorithm for rate limiting.
 * Features:
 * - Thread-safe operations using atomic updates
 * - Configurable burst capacity and refill rate
 * - Support for multiple strategies (strict vs. greedy)
 * - Comprehensive error handling and validation
 * - Detailed usage statistics
 * - Time-based token refilling
 */

export interface TokenBucketConfig {
 