```typescript
/**
 * token-bucket-rate-limiter.ts
 * 
 * A production-ready Token Bucket rate limiting implementation.
 * This algorithm allows for bursts of traffic while maintaining a steady-state rate.
 * 
 * Features:
 * - High-precision timing using process.hrtime or Date.now
 * - Support for multiple independent buckets (e.g., per user, per IP)
 * - Automatic token replenishment