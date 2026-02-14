```typescript
/**
 * token-bucket.ts
 * 
 * A production-ready implementation of the Token Bucket algorithm.
 * This implementation supports multiple buckets (e.g., per user/IP),
 * automatic token replenishment based on time elapsed, and persistence-ready logic.
 */

export interface BucketOptions {
  /** Maximum number of tokens the bucket can hold. */
  capacity: number;
  /** How many tokens are added to