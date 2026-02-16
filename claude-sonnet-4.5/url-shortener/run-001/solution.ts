```typescript
// types.ts
export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt?: Date;
  clickCount: number;
  isActive: boolean;
}

export interface UrlShortenerConfig {
  baseUrl: string;
  shortCodeLength: number;
  defaultExpiration