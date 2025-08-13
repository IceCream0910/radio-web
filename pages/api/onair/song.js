import cache from '../../../lib/cache.js';
import rateLimiter from '../../../lib/rateLimiter.js';

export default async function handler(req, res) {
    const { stn, ch, city } = req.query;
    
    // Rate limiting 체크
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!rateLimiter.isAllowed(clientIP, 80, 60000)) {
        return res.status(429).json({ 
            error: 'Too many requests',
            song: ''
        });
    }
    
    // Cache-Control 헤더 설정 (15초)
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    
    // 캐시 키 생성
    const cacheKey = `song_${stn}_${ch}_${city || 'default'}`;
    
    // 캐시에서 먼저 확인
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
        return res.status(200).json(cachedResult);
    }

    let song;
    
    try {

    if (stn == 'mbc') {
        const response = await fetch(`https://miniapi.imbc.com/music/somitem?rtype=jsonp&callback=__somitem`);
        const text = await response.text();
        const data = JSON.parse(text.replace('__somitem(', '').slice(0, -1));

        const matchingItem = data.find(item => item.Channel.toLowerCase() === ch.toLowerCase());
        if (matchingItem) {
            song = matchingItem.SomItem.replace('♬', '');
        }
        if (!song) {
            song = '';
        }
        const responseData = { song: song };
        // 캐시에 저장 (15초 TTL)
        cache.set(cacheKey, responseData, 15000);
        res.status(200).json(responseData);
    }
    } catch (error) {
        console.error('Error fetching song data:', error);
        const errorResponse = { song: '', error: 'Failed to fetch song data' };
        // 에러 결과도 짧게 캐시하여 반복 요청 방지
        cache.set(cacheKey, errorResponse, 5000);
        res.status(200).json(errorResponse);
    }
}