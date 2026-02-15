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
 * - Automatic token refilling based on elapsed time
 * - Comprehensive error handling and validation
 * - Type-safe implementation with TypeScript
 */

export interface Token