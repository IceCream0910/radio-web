import cache from '../../../lib/cache.js';
import rateLimiter from '../../../lib/rateLimiter.js';

export default async function handler(req, res) {
    const { stn, ch, city } = req.query;
    
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!rateLimiter.isAllowed(clientIP, 60, 60000)) {
        return res.status(429).json({ 
            error: 'Too many requests',
            title: ''
        });
    }
    
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    
    const cacheKey = `program_${stn}_${ch}_${city || 'default'}`;
    
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
        return res.status(200).json(cachedResult);
    }

    let result;
    
    try {

    if (stn == 'mbc') {
        const response = await fetch(`https://miniapi.imbc.com/Schedule/schedulelist`);
        const data = await response.json();

        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
        const koreaTimeDiff = 9 * 60 * 60 * 1000;
        const currentDate = new Date(utc + koreaTimeDiff);
        const currentDayIndex = currentDate.getDay();
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const currentTime = `${currentHours < 10 ? '0' : ''}${currentHours}${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;

        // 요일을 문자열로 변환하는 함수
        function getDayString(dayIndex) {
            const dayStrings = ['일', '월', '화', '수', '목', '금', '토'];
            return dayStrings[dayIndex];
        }

        const currentDay = getDayString(currentDayIndex);

        result = data.filter(item => {
            const chMatch = item.Channel.toLowerCase() === ch;
            const dayMatch = item.LiveDays.includes(currentDay); // 현재 요일이 방송 요일에 포함되는지 확인
            const startTime = parseInt(item.StartTime, 10);
            const endTime = item.EndTime === "0000" ? 2400 : parseInt(item.EndTime, 10); // "0000"을 "2400"으로 처리
            const startBeforeOrAtCurrent = startTime <= parseInt(currentTime, 10);
            const endAfterCurrent = endTime > parseInt(currentTime, 10); // 자정은 특별한 케이스로, "2400"이 되어야 함
            return chMatch && dayMatch && startBeforeOrAtCurrent && endAfterCurrent;
        });

        if (result.length > 0) {
            const title = result[0].ProgramTitle;
            const responseData = { title: title };
            // 캐시에 저장 (30초 TTL)
            cache.set(cacheKey, responseData, 30000);
            res.status(200).json(responseData);
        } else {
            const responseData = { title: '' };
            // 빈 결과도 짧게 캐시 (10초 TTL)
            cache.set(cacheKey, responseData, 10000);
            res.status(200).json(responseData);
        }
    }

    if (stn == 'sbs') {
        const response = await fetch(`https://static.apis.sbs.co.kr/radio-api/gorealra/1.0/main/section/common`);
        const json = await response.json();
        const data = json.schedule[ch];
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
        const koreaTimeDiff = 9 * 60 * 60 * 1000;
        const currentDate = new Date(utc + koreaTimeDiff);
        const currentDayIndex = currentDate.getDay();
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const currentTime = `${currentHours < 10 ? '0' : ''}${currentHours}${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;


        result = data.filter(item => {
            const startTime = parseInt(item.start_time.replace(':', ''), 10);
            const endTime = item.end_time === "0:00" ? 2400 : parseInt(item.end_time.replace(':', ''), 10); // "0000"을 "2400"으로 처리
            const startBeforeOrAtCurrent = startTime <= parseInt(currentTime, 10);
            const endAfterCurrent = endTime > parseInt(currentTime, 10); // 자정은 특별한 케이스로, "2400"이 되어야 함
            return startBeforeOrAtCurrent && endAfterCurrent;
        });

        const title = result[0].title;
        const responseData = { title: title };
        // 캐시에 저장 (30초 TTL)
        cache.set(cacheKey, responseData, 30000);
        res.status(200).json(responseData);

    }

    if (stn == 'kbs') {
        if (stn == 'kbs') {
            let localCode;
            let channelCode;
            switch (city) {
                case 'busan':
                    localCode = '10';
                    break;
                case 'changwon':
                    localCode = '20';
                    break;
                case 'jinju':
                    localCode = '21';
                    break;
                case 'daegu':
                    localCode = '30';
                    break;
                case 'andong':
                    localCode = '31';
                    break;
                case 'pohang':
                    localCode = '32';
                    break;
                case 'gwangju':
                    localCode = '40';
                    break;
                case 'mokpo':
                    localCode = '41';
                    break;
                case 'suncheon':
                    localCode = '43';
                    break;
                case 'jeonju':
                    localCode = '50';
                    break;
                case 'daejeon':
                    localCode = '60';
                    break;
                case 'cheongju':
                    localCode = '70';
                    break;
                case 'chuncheon':
                    localCode = '80';
                    break;
                case 'gangneung':
                    localCode = '81';
                    break;
                case 'wonju':
                    localCode = '82';
                    break;
                case 'jeju':
                    localCode = '90';
                    break;
                default:
                    localCode = '00';
                    break;
            }

            switch (ch) {
                case '1radio':
                    channelCode = '21';
                    break;
                case '2radio':
                    channelCode = '22';
                    break;
                case '3radio':
                    channelCode = '23';
                    break;
                case '1fm':
                    channelCode = '24';
                    break;
                case '2fm':
                    channelCode = '25';
                    break;
                case 'hanminjok':
                    channelCode = '26';
                    break;
            }

            const response = await fetch(`https://static.api.kbs.co.kr/mediafactory/v1/schedule/onair_now?rtype=jsonp&local_station_code=${localCode}&channel_code=${channelCode}&callback=mf_global_now_schedule`);
            const text = await response.text();
            const data = JSON.parse(text.replace(`/**/ typeof mf_global_now_schedule === 'function' && mf_global_now_schedule(`, '').slice(0, -2));

            const title = data[0].schedules[0].program_title;
            const responseData = { title: title };
            // 캐시에 저장 (30초 TTL)
            cache.set(cacheKey, responseData, 30000);
            res.status(200).json(responseData);
        }
    }
    } catch (error) {
        console.error('Error fetching program data:', error);
        const errorResponse = { title: '', error: 'Failed to fetch program data' };
        // 에러 결과도 짧게 캐시하여 반복 요청 방지
        cache.set(cacheKey, errorResponse, 5000);
        res.status(200).json(errorResponse);
    }
}