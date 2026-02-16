```typescript
// url-shortener.ts
interface UrlRecord {
  originalUrl: string;
  shortenedUrl: string;
}

class UrlShortener {
  private urlMap: Map<string, UrlRecord>;
  private reverseMap: Map<string, string>;
  private baseUrl: string;
  private counter: number;

  /**
   * Initializes the URL shortener with a base URL.
   * @param baseUrl The base URL for shortened URLs.
   */
  constructor(baseUrl: string)