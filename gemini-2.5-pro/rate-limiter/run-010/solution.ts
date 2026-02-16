```typescript
/**
 * token-bucket.ts
 * 
 * A production-ready Token Bucket rate limiting implementation.
 * This implementation supports multiple buckets (e.g., per user/IP),
 * lazy token refilling (efficient O(1) checks), and persistence-ready state.
 */

export interface BucketOptions {
  /** Maximum number of tokens the bucket can hold. */
  capacity: number;
  /** How many tokens