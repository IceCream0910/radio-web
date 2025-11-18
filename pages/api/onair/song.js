import cache from '../../../lib/cache.js';
import rateLimiter from '../../../lib/rateLimiter.js';

export default async function handler(req, res) {
    const { stn, ch, city } = req.query;

    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!rateLimiter.isAllowed(clientIP, 160, 60000)) {
        return res.status(429).json({
            error: 'Too many requests',
            song: ''
        });
    }

    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30');

    const cacheKey = `song_${stn}_${ch}_${city || 'default'}`;

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
            cache.set(cacheKey, responseData, 15000);
            res.status(200).json(responseData);
        }
    } catch (error) {
        console.error('Error fetching song data:', error);
        const errorResponse = { song: '', error: 'Failed to fetch song data' };
        cache.set(cacheKey, errorResponse, 5000);
        res.status(200).json(errorResponse);
    }
}