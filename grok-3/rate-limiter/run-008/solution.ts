// token-bucket.ts
import { setInterval } from 'timers';

/**
 * Configuration options for the Token Bucket rate limiter
 */
interface TokenBucketConfig {
  /** Maximum number of tokens the bucket can hold */
  capacity: number;
  /** Number of tokens added per interval */
  tokensPerInterval: number;
  /** Time interval in milliseconds for adding tokens */
  intervalMs: number;
}

/**
 * Class implementing a Token Bucket rate limiting algorithm
 * Tokens are consumed for each request