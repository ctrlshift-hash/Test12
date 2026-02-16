// token-bucket.ts
import { setInterval } from 'timers';

/**
 * Configuration options for the TokenBucket rate limiter
 */
interface TokenBucketConfig {
  /** Maximum number of tokens the bucket can hold */
  capacity: number;
  /** Number of tokens added per interval */
  tokensPerInterval: number;
  /** Interval in milliseconds for adding tokens */
  intervalMs: number;
}

/**
 * Represents the state of a token bucket for a specific key/client
 */
interface BucketState