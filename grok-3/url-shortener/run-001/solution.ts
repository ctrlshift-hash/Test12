// url-shortener.ts
/**
 * A production-ready URL shortening service with collision detection.
 * Features:
 * - Shortens long URLs to unique short codes
 * - Expands short codes back to original URLs
 * - Handles collisions using a counter-based suffix
 * - Includes input validation and error handling
 * - Tracks usage statistics for analytics
 * - Implements expiration for short URLs (optional)
 */

interface UrlMapping {
  originalUrl: string;
  shortCode: string;
  createdAt