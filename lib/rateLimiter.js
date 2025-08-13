// Rate limiting 유틸리티
class RateLimiter {
    constructor() {
        this.requests = new Map();
    }

    isAllowed(ip, limit = 30, window = 60000) { // 기본: 1분에 30번
        const now = Date.now();
        const windowStart = now - window;
        
        if (!this.requests.has(ip)) {
            this.requests.set(ip, []);
        }
        
        const userRequests = this.requests.get(ip);
        
        // 윈도우 밖의 요청 제거
        const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
        this.requests.set(ip, validRequests);
        
        if (validRequests.length >= limit) {
            return false;
        }
        
        validRequests.push(now);
        return true;
    }

    cleanup() {
        const now = Date.now();
        for (const [ip, requests] of this.requests.entries()) {
            const validRequests = requests.filter(timestamp => timestamp > now - 60000);
            if (validRequests.length === 0) {
                this.requests.delete(ip);
            } else {
                this.requests.set(ip, validRequests);
            }
        }
    }
}

// 글로벌 rate limiter 인스턴스
let globalRateLimiter;

if (typeof global !== 'undefined') {
    if (!global.rateLimiter) {
        global.rateLimiter = new RateLimiter();
        // 5분마다 정리
        setInterval(() => {
            global.rateLimiter.cleanup();
        }, 5 * 60 * 1000);
    }
    globalRateLimiter = global.rateLimiter;
} else {
    globalRateLimiter = new RateLimiter();
}

export default globalRateLimiter;
