```typescript
/**
 * url-shortener.ts
 * 
 * A production-ready URL shortening service implementation.
 * Features:
 * - Base62 encoding for compact IDs
 * - Collision detection and resolution via retries
 * - URL validation and normalization
 * - Expiration support
 * - Analytics (click tracking)
 * - Thread-safe (in-memory simulation)
 */

import { createHash } from 'crypto';

