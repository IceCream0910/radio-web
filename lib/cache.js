// 메모리 캐싱 유틸리티
class MemoryCache {
    constructor() {
        this.cache = new Map();
    }

    set(key, value, ttl = 60000) { // 기본 1분 TTL
        const expireTime = Date.now() + ttl;
        this.cache.set(key, {
            value,
            expireTime
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expireTime) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    delete(key) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    // 만료된 캐시 정리
    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now > item.expireTime) {
                this.cache.delete(key);
            }
        }
    }
}

// 글로벌 캐시 인스턴스
let globalCache;

if (typeof global !== 'undefined') {
    if (!global.memoryCache) {
        global.memoryCache = new MemoryCache();
        // 5분마다 만료된 캐시 정리
        setInterval(() => {
            global.memoryCache.cleanup();
        }, 5 * 60 * 1000);
    }
    globalCache = global.memoryCache;
} else {
    globalCache = new MemoryCache();
}

export default globalCache;
