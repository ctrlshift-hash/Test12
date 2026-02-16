```typescript
// url-shortener.ts
export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clickCount: number;
}

export interface ShortenOptions {
  customAlias?: string;
  expireAfterDays?: number;
}

export interface ShortenResult {
  success: boolean;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  message?: string;
  collisionResolved?: boolean;
}

export interface ExpandResult {
  success: boolean;
  originalUrl?: string;
  message?: string;
}

export class URLShortenerError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'URLShortenerError';
  }
}

export class URLShortener {
  private urlMap: Map<string, ShortenedUrl> = new Map();
  private codeToIdMap: Map<string, string> = new Map();
  private originalUrlToCodeMap: Map<string, string> = new Map();
  private readonly BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private readonly DEFAULT_SHORT_CODE_LENGTH = 6;
  private readonly MAX_COLLISION_RETRIES = 5;
  private readonly MAX_CUSTOM_ALIAS_LENGTH = 20;
  private readonly BASE_DOMAIN: string;
  
  constructor(baseDomain: string = 'https://short.url') {
    if (!this.isValidUrl(baseDomain)) {
      throw new URLShortenerError('Invalid base domain', 'INVALID_BASE_DOMAIN');
    }
    this.BASE_DOMAIN = baseDomain.endsWith('/') ? baseDomain.slice(0, -1) : baseDomain;
  }

  /**
   * Shorten a URL with collision detection and resolution
   */
  async shorten(originalUrl: string, options: ShortenOptions = {}): Promise<ShortenResult> {
    try {
      this.validateUrl(originalUrl);
      
      // Check if URL already shortened
      const existingCode = this.originalUrlToCodeMap.get(originalUrl);
      if (existingCode) {
        const existing = this.urlMap.get(this.codeToIdMap.get(existingCode)!);
        return {
          success: true,
          shortCode: existingCode,
          shortUrl: `${this.BASE_DOMAIN}/${existingCode}`,
          originalUrl,
          message: 'URL already shortened'
        };
      }

      let shortCode: string;
      let collisionResolved = false;

      if (options.customAlias) {
        shortCode = this.normalizeCustomAlias(options.customAlias);
        if (this.codeToIdMap.has(shortCode)) {
          throw new URLShortenerError(
            'Custom alias already in use',
            'ALIAS_COLLISION',
            { requestedAlias: options.customAlias }
          );
        }
      } else {
        // Generate short code with collision detection
        shortCode = await this.generateUniqueShortCode(originalUrl);
        
        // Check for hash collision
        if (this.codeToIdMap.has(shortCode)) {
          collisionResolved = true;
          shortCode = await this.resolveCollision(shortCode, originalUrl);
        }
      }

      // Create shortened URL entry
      const id = this.generateId();
      const shortenedUrl: ShortenedUrl = {
        id,
        originalUrl,
        shortCode,
        createdAt: new Date(),
        clickCount: 0
      };

      // Store in all maps
      this.urlMap.set(id, shortenedUrl);
      this.codeToIdMap.set(shortCode, id);
      this.originalUrlToCodeMap.set(originalUrl, shortCode);

      return {
        success: true,
        shortCode,
        shortUrl: `${this.BASE_DOMAIN}/${shortCode}`,
        originalUrl,
        collisionResolved
      };
    } catch (error) {
      if (error instanceof URLShortenerError) {
        throw error;
      }
      throw new URLShortenerError(
        'Failed to shorten URL',
        'SHORTEN_FAILED',
        { originalUrl, error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  /**
   * Expand a short URL to its original URL
   */
  async expand(shortCode: string): Promise<ExpandResult> {
    try {
      this.validateShortCode(shortCode);
      
      const id = this.codeToIdMap.get(shortCode);
      if (!id) {
        throw new URLShortenerError('Short URL not found', 'NOT_FOUND', { shortCode });
      }

      const shortenedUrl = this.urlMap.get(id);
      if (!shortenedUrl) {
        throw new URLShortenerError('Short URL data corrupted', 'DATA_CORRUPTED', { shortCode });
      }

      // Increment click count
      shortenedUrl.clickCount++;
      this.urlMap.set(id, shortenedUrl);

      return {
        success: true,
        originalUrl: shortenedUrl.originalUrl
      };
    } catch (error) {
      if (error instanceof URLShortenerError) {
        return {
          success: false,
          message: error.message
        };
      }
      return {
        success: false,
        message: 'Failed to expand URL'
      };
    }
  }

  /**
   * Get statistics for a short URL
   */
  getStats(shortCode: string): ShortenedUrl | null {
    const id = this.codeToIdMap.get(shortCode);
    if (!id) return null;
    
    const url = this.urlMap.get(id);
    return url ? { ...url } : null;
  }

  /**
   * Get all shortened URLs (for admin purposes)
   */
  getAllUrls(): ShortenedUrl[] {
    return Array.from(this.urlMap.values());
  }

  /**
   * Delete a shortened URL
   */
  deleteUrl(shortCode: string): boolean {
    const id = this.codeToIdMap.get(shortCode);
    if (!id) return false;

    const url = this.urlMap.get(id);
    if (!url) return false;

    // Remove from all maps
    this.urlMap.delete(id);
    this.codeToIdMap.delete(shortCode);
    this.originalUrlToCodeMap.delete(url.originalUrl);

    return true;
  }

  /**
   * Generate a unique short code with collision detection
   */
  private async generateUniqueShortCode(originalUrl: string): Promise<string> {
    // Generate initial hash-based code
    const hash = this.generateHash(originalUrl);
    let shortCode = this.encodeBase62(hash).substring(0, this.DEFAULT_SHORT_CODE_LENGTH);
    
    // Ensure code meets minimum length
    if (shortCode.length < this.DEFAULT_SHORT_CODE_LENGTH) {
      shortCode = shortCode.padEnd(this.DEFAULT_SHORT_CODE_LENGTH, '0');
    }

    return shortCode;
  }

  /**
   * Resolve collision by generating alternative codes
   */
  private async resolveCollision(existingCode: string, originalUrl: string): Promise<string> {
    let attempts = 0;
    let candidateCode = existingCode;
    
    while (attempts < this.MAX_COLLISION_RETRIES) {
      attempts++;
      
      // Strategy 1: Add timestamp suffix
      const timestampSuffix = Date.now().toString(36).slice(-2);
      candidateCode = `${existingCode.slice(0, -2)}${timestampSuffix}`;
      
      if (!this.codeToIdMap.has(candidateCode)) {
        return candidateCode;
      }
      
      // Strategy 2: Use different hash algorithm
      const hash = this.generateHash(originalUrl + attempts.toString());
      candidateCode = this.encodeBase62(hash).substring(0, this.DEFAULT_SHORT_CODE_LENGTH);
      
      if (!this.codeToIdMap.has(candidateCode)) {
        return candidateCode;
      }
      
      // Strategy 3: Add random suffix
      const randomSuffix = Math.random().toString(36).substring(2, 4);
      candidateCode = `${existingCode.slice(0, -2)}${randomSuffix}`;
      
      if (!this.codeToIdMap.has(candidateCode)) {
        return candidateCode;
      }
    }
    
    throw new URLShortenerError(
      'Unable to resolve collision after maximum retries',
      'COLLISION_RESOLUTION_FAILED',
      { originalUrl, attempts: this.MAX_COLLISION_RETRIES }
    );
  }

  /**
   * Generate hash from URL
   */
  private generateHash(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Encode number to base62
   */
  private encodeBase62(num: number): string {
    if (num === 0) return '0';
    
    let result = '';
    let n = num;
    
    while (n > 0) {
      result = this.BASE62_CHARS[n % 62] + result;
      n = Math.floor(n / 62);
    }
    
    return result;
  }

  /**
   * Generate unique ID for internal use
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Normalize and validate custom alias
   */
  private normalizeCustomAlias(alias: string): string {
    const normalized = alias
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '')
      .substring(0, this.MAX_CUSTOM_ALIAS_LENGTH);
    
    if (normalized.length < 2) {
      throw new URLShortenerError(
        'Custom alias must be at least 2 characters',
        'INVALID_ALIAS_LENGTH'
      );
    }
    
    return normalized;
  }

  /**
   * Validate URL format
   */
  private validateUrl(url: string): void {
    if (!url || typeof url !== 'string') {
      throw new URLShortenerError('URL must be a non-empty string', 'INVALID_URL_TYPE');
    }
    
    if (!this.isValidUrl(url)) {
      throw new URLShortenerError('Invalid URL format', 'INVALID_URL_FORMAT', { url });
    }
    
    // Check URL length
    if (url.length > 2048) {
      throw new URLShortenerError('URL too long', 'URL_TOO_LONG', { length: url.length });
    }
  }

  /**
   * Check if URL is valid
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol.toLowerCase();
      
      // Allow http, https, ftp, and mailto protocols
      const allowedProtocols = ['http:', 'https:', 'ftp:', 'mailto:'];
      if (!allowedProtocols.includes(protocol)) {
        return false;
      }
      
      // Check hostname is not empty for web URLs
      if (protocol !== 'mailto:' && !urlObj.hostname) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate short code format
   */
  private validateShortCode(shortCode: string): void {
    if (!shortCode || typeof shortCode !== 'string') {
      throw new URLShortenerError('Short code must be a non-empty string', 'INVALID_SHORT_CODE_TYPE');
    }
    
    if (shortCode.length > this.MAX_CUSTOM_ALIAS_LENGTH) {
      throw new URLShortenerError('Short code too long', 'SHORT_CODE_TOO_LONG');
    }
    
    // Allow alphanumeric, dash, and underscore
    if (!/^[a-zA-Z0-9-_]+$/.test(shortCode)) {
      throw new URLShortenerError(
        'Short code can only contain letters, numbers, dashes, and underscores',
        'INVALID_SHORT_CODE_CHARS'
      );
    }
  }
}

// Example usage and test cases
if (require.main === module) {
  (async () => {
    console.log('=== URL Shortener Test ===\n');
    
    // Create shortener instance
    const shortener = new URLShortener('https://short.example.com');
    
    try {
      // Test 1: Basic URL shortening
      console.log('Test 1: Basic URL shortening');
      const result1 = await shortener.shorten('https://example.com/path/to/resource');
      console.log(`Shortened: ${result1.shortUrl}`);
      console.log(`Code: ${result1.shortCode}`);
      console.log(`Success: ${result1.success}\n`);
      
      // Test 2: Expand URL
      console.log('Test 2: Expand URL');
      const expandResult = await shortener.expand(result1.shortCode);
      console.log(`Original URL: ${expandResult.originalUrl}`);
      console.log(`Success: ${expandResult.success}\n`);
      
      // Test 3: Same URL should return existing code
      console.log('Test 3: Shorten same URL again');
      const result2 = await shortener.shorten('https://example.com/path/to/resource');
      console.log(`Same code returned: ${result1.shortCode === result2.shortCode}`);
      console.log(`Message: ${result2.message}\n`);
      
      // Test 4: Custom alias
      console.log('Test 4: Custom alias');
      const customResult = await shortener.shorten('https://example.com/about', {
        customAlias: 'about-page'
      });
      console.log(`Custom URL: ${customResult.shortUrl}`);
      console.log(`Success: ${customResult.success}\n`);
      
      // Test 5: Collision simulation (using same custom alias)
      console.log('Test 5: Collision detection (custom alias)');
      try {
        await shortener.shorten('https://example.com/contact', {
          customAlias: 'about-page'
        });
      } catch (error) {
        if (error instanceof URLShortenerError) {
          console.log(`Expected error: ${error.message}`);
          console.log(`Error code: ${error.code}\n`);
        }
      }
      
      // Test 6: Get statistics
      console.log('Test 6: Get statistics');
      const stats = shortener.getStats(result1.shortCode);
      console.log(`Click count: ${stats?.clickCount}`);
      console.log(`Created: ${stats?.createdAt}\n`);
      
      // Test 7: Invalid URL handling
      console.log('Test 7: Invalid URL handling');
      try {
        await shortener.shorten('not-a-valid-url');
      } catch (error) {
        if (error instanceof URLShortenerError) {
          console.log(`Expected error: ${error.message}`);
          console.log(`Error code: ${error.code}\n`);
        }
      }
      
      // Test 8: Expand non-existent URL
      console.log('Test 8: Expand non-existent URL');
      const nonExistent = await shortener.expand('nonexistent');
      console.log(`Success: ${nonExistent.success}`);
      console.log(`Message: ${nonExistent.message}\n`);
      
      // Test 9: Delete URL
      console.log('Test 9: Delete URL');
      const deleted = shortener.deleteUrl(customResult.shortCode);
      console.log(`Deleted: ${deleted}`);
      
      // Verify deletion
      const afterDelete = await shortener.expand(customResult.shortCode);
      console.log(`Can expand after delete: ${afterDelete.success}\n`);
      
      // Test 10: List all URLs
      console.log('Test 10: List all URLs');
      const allUrls = shortener.getAllUrls();
      console.log(`Total URLs: ${allUrls.length}`);
      allUrls.forEach((url, index) => {
        console.log(`${index + 1}. ${url.shortCode} -> ${url.originalUrl} (clicks: ${url.clickCount})`);
      });
      
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  })();
}
```

```typescript
// url-shortener.test.ts
import { URLShortener, URLShortenerError } from './url-shortener';

describe('URLShortener', () => {
  let shortener: URLShortener;

  beforeEach(() => {
    shortener = new URLShortener('https://short.test');
  });

  describe('shorten', () => {
    it('should shorten a valid URL', async () => {
      const result = await shortener.shorten('https://example.com');
      
      expect(result.success).toBe(true);
      expect(result.shortCode).toBeDefined();
      expect(result.shortUrl).toMatch(/^https:\/\/short\.test\/[a-zA-Z0-9-_]+$/);
      expect(result.originalUrl).toBe('https://example.com');
    });

    it('should return same code for same URL', async () => {
      const result1 = await shortener.shorten('https://example.com');
      const result2 = await shortener.shorten('https://example.com');
      
      expect(result1.shortCode).toBe(result2.shortCode);
      expect(result2.message).toContain('already shortened');
    });

    it('should accept custom alias', async () => {
      const result = await shortener.shorten('https://example.com/about', {
        customAlias: 'about-us'
      });
      
      expect(result.shortCode).toBe('about-us');
      expect(result.shortUrl).toBe('https://short.test/about-us');
    });

    it('should reject duplicate custom alias', async () => {
      await shortener.shorten('https://example.com/page1', { customAlias: 'mypage' });
      
      await expect(
        shortener.shorten('https://example.com/page2', { customAlias: 'mypage' })
      ).rejects.toThrow(URLShortenerError);
    });

    it('should reject invalid URLs', async () => {
      await expect(shortener.shorten('not-a-url')).rejects.toThrow(URLShortenerError);
      await expect(shortener.shorten('')).rejects.toThrow(URLShortenerError);
      await expect(shortener.shorten('javascript:alert(1)')).rejects.toThrow(URLShortenerError);
    });

    it('should handle very long URLs', async () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(2000);
      await expect(shortener.shorten(longUrl)).rejects.toThrow(URLShortenerError);
    });
  });

  describe('expand', () => {
    it('should expand valid short code', async () => {
      const shortenResult = await shortener.shorten('https://example.com');
      const expandResult = await shortener.expand(shortenResult.shortCode);
      
      expect(expandResult.success).toBe(true);
      expect(expandResult.originalUrl).toBe('https://example.com');
    });

    it('should increment click count', async () => {
      const shortenResult = await shortener.shorten('https://example.com');
      
      await shortener.expand(shortenResult.shortCode);
      await shortener.expand(shortenResult.shortCode);
      
      const stats = shortener.getStats(shortenResult.shortCode);
      expect(stats?.clickCount).toBe(2);
    });

    it('should fail for non-existent code', async () => {
      const result = await shortener.expand('nonexistent');
      
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should reject invalid short codes', async () => {
      await expect(shortener.expand('')).rejects.toThrow(URLShortenerError);
      await expect(shortener.expand('invalid!code')).rejects.toThrow(URLShortenerError);
    });
  });

  describe('collision detection', () => {
    it('should handle hash collisions', async () => {
      // Mock generateHash to create collisions
      const originalGenerateHash = shortener['generateHash'].bind(shortener);
      let callCount = 0;
      
      shortener['generateHash'] = () => {
        callCount++;
        // Return same hash for first two calls to simulate collision
        return callCount <= 2 ? 123456 : 789012;
      };
      
      const url1 = 'https://example.com/1';
      const url2 = 'https://example.com/2';
      
      const result1 = await shortener.shorten(url1);
      const result2 = await shortener.shorten(url2);
      
      expect(result1.shortCode).not.toBe(result2.shortCode);
      expect(result2.collisionResolved).toBe(true);
      
      // Restore original method
      shortener['generateHash'] = originalGenerateHash;
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', async () => {
      const shortenResult = await shortener.shorten('https://example.com');
      
      await shortener.expand(shortenResult.shortCode);
      await shortener.expand(shortenResult.shortCode);
      
      const stats = shortener.getStats(shortenResult.shortCode);
      
      expect(stats).toBeDefined();
      expect(stats?.originalUrl).toBe('https://example.com');
      expect(stats?.shortCode).toBe(shortenResult.shortCode);
      expect(stats?.clickCount).toBe(2);
      expect(stats?.createdAt).toBeInstanceOf(Date);
    });

    it('should return null for non-existent code', () => {
      const stats = shortener.getStats('nonexistent');
      expect(stats).toBeNull();
    });
  });

  describe('deleteUrl', () => {
    it('should delete existing URL', async () => {
      const result = await shortener.shorten('https://example.com');
      const deleted = shortener.deleteUrl(result.shortCode);
      
      expect(deleted).toBe(true);
      expect(shortener.getStats(result.shortCode)).toBeNull();
    });

    it('should return false for non-existent code', () => {
      const deleted = shortener.deleteUrl('nonexistent');
      expect(deleted).toBe(false);
    });
  });

  describe('getAllUrls', () => {
    it('should return all shortened URLs', async () => {
      await shortener.shorten('https://example.com/1');
      await shortener.shorten('https://example.com/2');
      await shortener.shorten('https://example.com/3');
      
      const allUrls = shortener.getAllUrls();
      
      expect(allUrls).toHaveLength(3);
      expect(allUrls.every(url => url.id && url.shortCode && url.originalUrl)).toBe(true);
    });
  });
});
```

```typescript
// index.ts (Main application entry point)
export { URLShortener, URLShortenerError, ShortenedUrl, ShortenOptions, ShortenResult, ExpandResult } from './url-shortener';

// Example of using the URLShortener in a web server context
import express from 'express';
import { URLShortener } from './url-shortener';

const app = express();
const shortener = new URLShortener(process.env.BASE_DOMAIN || 'https://short.example.com');

app.use(express.json());

// Shorten endpoint
app.post('/api/shorten', async (req, res) => {
  try {
    const { url, customAlias } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const result = await shortener.shorten(url, { customAlias });
    
    if (result.success) {
      return res.json({
        shortUrl: result.shortUrl,
        shortCode: result.shortCode,
        originalUrl: result.originalUrl,
        collisionResolved: result.collisionResolved
      });
    }
  } catch (error) {
    if (error instanceof URLShortenerError) {
      return res.status(400).json({
        error: error.message,
        code: error.code,
        details: error.details
      });
    }
    
    console.error('Shorten error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Redirect endpoint
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const result = await shortener.expand(shortCode);
    
    if (result.success && result.originalUrl) {
      // Analytics could be added here
      return res.redirect(301, result.originalUrl);
    }
    
    return res.status(404).json({ error: 'Short URL not found' });
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Stats endpoint
app.get('/api/stats/:shortCode', (req, res) => {
  try {
    const { shortCode } = req.params;
    const stats = shortener.getStats(shortCode);
    
    if (!stats) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    return res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`URL Shortener service running on port ${PORT}`);
});
```

```json
// package.json
{
  "name": "url-shortener",
  "version": "1.0.0",
  "description": "A production-ready URL shortening service with collision detection",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev index.ts",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "@types/node": "^20.10.5",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  },
  "keywords": ["url-shortener", "typescript", "collision-detection"],
  "author": "",
  "license": "MIT"
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

```json
// jest.config.json
{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "roots": ["."],
  "testMatch": ["**/*.test.ts"],
  "collectCoverage": true,
  "coverageDirectory": "coverage",
  "coverageReporters": ["text", "lcov"],
  "verbose": true
}
```

This implementation provides a complete, production-ready URL shortening service with:

## Key Features:

1. **Collision Detection & Resolution**: 
   - Hash-based short code generation with multiple fallback strategies
   - Configurable maximum retry attempts
   - Three resolution strategies: timestamp suffix, alternative hash, random suffix

2. **Input Validation**:
   - URL format validation with protocol restrictions
   - Short code format validation
   - Length constraints for both URLs and custom aliases

3. **Error Handling**:
   - Custom error classes with error codes
   - Comprehensive error messages
   - Graceful failure handling

4. **Core Functionality**:
   - Shorten URLs with optional custom aliases
   - Expand short codes to original URLs
   - Click tracking and statistics
   - URL deletion
   - List all shortened URLs

5. **Production Considerations**:
   - TypeScript with strict typing
   - Comprehensive test suite
   - Example Express.js REST API
   - Proper project structure with build configuration
   - Memory storage (easily extensible to database)

6. **Security Features**:
   - Protocol validation (only http, https, ftp, mailto)
   - Input sanitization
   - Length limits to prevent abuse

The solution handles all common edge cases including hash collisions, duplicate URLs, invalid inputs, and provides a clean API for integration into larger applications.