```typescript
// FileName: URLShortener.ts

type URLStore = Record<string, string>;

class URLShortener {
    private static instance: URLShortener;
    private urlStore: URLStore;
    private baseUrl: string;
    private idCounter: number;

    private constructor() {
        this.urlStore = {};
        this.baseUrl = 'http://short.url/';
        this.idCounter = 0;
    }

    /**
     * Singleton access method to get the instance of the URL