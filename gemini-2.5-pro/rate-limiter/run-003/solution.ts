```typescript
/**
 * token-bucket.ts
 * 
 * A production-ready Token Bucket rate limiting implementation.
 * This implementation supports multiple buckets (e.g., per IP or per API Key),
 * handles clock drift, and provides thread-safe-like atomic operations 
 * via state management.
 */

export interface RateLimitConfig {
  /** Maximum number of tokens the bucket can hold */
  capacity: number;
  