import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import Hls from 'hls.js';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
import IonIcon from '@reacticons/ionicons'
import BottomNav from './bottomNav';
import { useRecoilState } from 'recoil';
import { playerData, favoritesData } from '../../states/states';
import toast from 'react-hot-toast';
import '@material/web/ripple/ripple.js';
import TimerModal from './timerModal';

const HlsPlayer = forwardRef((props, ref) => {
    const [player, setPlayer] = useRecoilState(playerData);
    const [favorites, setFavorites] = useRecoilState(favoritesData);
    const [actualFavorites, setActualFavorites] = useState([])

    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const isNative = useRef(null);
    const isSidebar = useRef(null);

    const [currentProgram, setCurrentProgram] = useState('');
    const [currentSong, setCurrentSong] = useState('');
    const intervalSongFetch = useRef(null);
    const intervalProgramFetch = useRef(null);

    const [songFetchInterval, setSongFetchInterval] = useState(15000);
    const [programFetchInterval, setProgramFetchInterval] = useState(60000);
    const lastSongData = useRef('');
    const lastProgramData = useRef('');
    const consecutiveNoChangeCount = useRef({ song: 0, program: 0 });
    const previousPlayerUrl = useRef(''); // 이전 플레이어 URL 추적

    const [isOpenTimerModal, setIsOpenTimerModal] = useState(false);

    const [isMobile, setIsMobile] = useState(true);
    const [isFocusing, setIsFocusing] = useState(true);

    const [isPlayerAnimation, setIsPlayerAnimation] = useState(true);


    useEffect(() => {
        setActualFavorites(favorites);
    }, [favorites]);

    const handleNativePlayerState = (state) => {
        console.log("native state:", state)
        if (state == 'playing') {
            setIsPlaying(true);
            setIsBuffering(false);
        } else if (state == 'paused') {
            setIsPlaying(false);
            setIsBuffering(false);
        } else if (state == 'buffer') {
            setIsPlaying(false);
            setIsBuffering(true);
        }
    };

    const handleNativeBack = () => {
        if (isOpenTimerModal) {
            setIsOpenTimerModal(false);
        }
        else if (isOpen) {
            setIsOpen(false);
        } else {
            if (window.history.state.url != '/') {
                window.history.back();
            } else {
                isNative.current && Native.backHandlerApp();
            }
        }
    };

    useImperativeHandle(ref, () => ({
        nativePlayerState: handleNativePlayerState,
        nativeBackHandler: handleNativeBack
    }));

    useEffect(() => {
        setIsReady(true);
        const useragent = navigator.userAgent;
        isNative.current = useragent.indexOf('AndroidNative') > -1;
        isSidebar.current = useragent.indexOf('sidebar') > -1;

        window.addEventListener("blur", () => {
            setIsFocusing(false);
            // 포커스를 잃으면 폴링 중단하여 리소스 절약
            if (intervalSongFetch.current) {
                clearInterval(intervalSongFetch.current);
            }
            if (intervalProgramFetch.current) {
                clearInterval(intervalProgramFetch.current);
            }
        });
        window.addEventListener("focus", () => {
            setIsFocusing(true);
            // 포커스 복귀시 기존 데이터를 유지하면서 새로운 데이터 즉시 fetch
            if (player.song) {
                const fetchSongData = async () => {
                    try {
                        const response = await fetch(player.song, {
                            headers: {
                                'Cache-Control': 'no-cache'
                            }
                        });
                        const data = await response.json();
                        const newSong = data.song ? '♬ ' + data.song : '';

                        if (newSong !== lastSongData.current) {
                            lastSongData.current = newSong;
                            setCurrentSong(newSong);
                            randomBackground();
                        }
                    } catch (error) {
                        console.error('Error fetching song data on focus:', error);
                    }
                };
                fetchSongData();

                // 폴링 재시작
                intervalSongFetch.current = setInterval(fetchSongData, songFetchInterval);
            }

            if (player.program) {
                const fetchProgramData = async () => {
                    try {
                        const response = await fetch(player.program, {
                            headers: {
                                'Cache-Control': 'no-cache'
                            }
                        });
                        const data = await response.json();

                        if (data.title && data.title !== lastProgramData.current) {
                            lastProgramData.current = data.title;
                            setCurrentProgram(data.title);
                            randomBackground();

                            if ('mediaSession' in navigator) {
                                navigator.mediaSession.metadata = new MediaMetadata({
                                    title: data.title || '제목없음',
                                    artist: player.title || '제목없음',
                                    artwork: [{
                                        src: "/albumart.png",
                                        sizes: "500x500",
                                        type: "image/png",
                                    }]
                                });
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching program data on focus:', error);
                    }
                };
                fetchProgramData();

                // 폴링 재시작
                intervalProgramFetch.current = setInterval(fetchProgramData, programFetchInterval);
            }
        });

        const mediaQuery = window.matchMedia('(max-width: 952px)');
        if (mediaQuery.matches) {
            setIsMobile(true);
        } else {
            setIsMobile(false);
        }

        mediaQuery.addEventListener('change', () => {
            if (mediaQuery.matches) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        });

        setTimeout(() => {
            if (typeof window !== 'undefined' && window.localStorage.getItem('isPlayerAnimation')) {
                setIsPlayerAnimation(window.localStorage.getItem('isPlayerAnimation'));
            } else {
                setIsPlayerAnimation(true);
            }
        }, 100);

        return () => {
            mediaQuery.removeEventListener('change', () => {
                if (mediaQuery.matches) {
                    setIsMobile(true);
                } else {
                    setIsMobile(false);
                }
            });
            window.removeEventListener("blur", () => {
                setIsFocusing(false);
                if (intervalSongFetch.current) {
                    clearInterval(intervalSongFetch.current);
                }
                if (intervalProgramFetch.current) {
                    clearInterval(intervalProgramFetch.current);
                }
            });
            window.removeEventListener("focus", () => {
                setIsFocusing(true);
                // 포커스 복귀시 기존 데이터를 유지하면서 새로운 데이터 즉시 fetch
                if (player.song) {
                    const fetchSongData = async () => {
                        try {
                            const response = await fetch(player.song, {
                                headers: {
                                    'Cache-Control': 'no-cache'
                                }
                            });
                            const data = await response.json();
                            const newSong = data.song ? '♬ ' + data.song : '';

                            if (newSong !== lastSongData.current) {
                                lastSongData.current = newSong;
                                setCurrentSong(newSong);
                                randomBackground();
                            }
                        } catch (error) {
                            console.error('Error fetching song data on focus:', error);
                        }
                    };
                    fetchSongData();
                    intervalSongFetch.current = setInterval(fetchSongData, songFetchInterval);
                }

                if (player.program) {
                    const fetchProgramData = async () => {
                        try {
                            const response = await fetch(player.program, {
                                headers: {
                                    'Cache-Control': 'no-cache'
                                }
                            });
                            const data = await response.json();

                            if (data.title && data.title !== lastProgramData.current) {
                                lastProgramData.current = data.title;
                                setCurrentProgram(data.title);
                                randomBackground();

                                if ('mediaSession' in navigator) {
                                    navigator.mediaSession.metadata = new MediaMetadata({
                                        title: data.title || '제목없음',
                                        artist: player.title || '제목없음',
                                        artwork: [{
                                            src: "/albumart.png",
                                            sizes: "500x500",
                                            type: "image/png",
                                        }]
                                    });
                                }
                            }
                        } catch (error) {
                            console.error('Error fetching program data on focus:', error);
                        }
                    };
                    fetchProgramData();
                    intervalProgramFetch.current = setInterval(fetchProgramData, programFetchInterval);
                }
            });
        }

    }, []);

    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
            const css = `
            header {
                z-index: 0;
            }
        `;
            const styleElement = document.createElement('style');
            styleElement.innerHTML = css;
            document.head.appendChild(styleElement);
        } else {
            document.body.style.overflow = 'auto';
            const css = `
            header {
                z-index: 1;
            }
        `;
            const styleElement = document.createElement('style');
            styleElement.innerHTML = css;
            document.head.appendChild(styleElement);
        }
    }, [isOpen]);


    useEffect(() => {
        if (intervalSongFetch.current) {
            clearInterval(intervalSongFetch.current);
            intervalSongFetch.current = null;
        }
        if (intervalProgramFetch.current) {
            clearInterval(intervalProgramFetch.current);
            intervalProgramFetch.current = null;
        }

        // 실제로 플레이어 URL이 변경된 경우에만 배경 업데이트 및 데이터 초기화
        const playerUrlChanged = player.url !== previousPlayerUrl.current;
        if (player.url && playerUrlChanged) {
            randomBackground();
            setCurrentProgram('');
            setCurrentSong('');

            // 스마트 폴링 초기화
            consecutiveNoChangeCount.current = { song: 0, program: 0 };
            setSongFetchInterval(15000);
            setProgramFetchInterval(60000);

            // 이전 URL 업데이트
            previousPlayerUrl.current = player.url;
        }

        // 포커스가 없으면 폴링하지 않음
        if (!isFocusing) {
            return;
        }

        if (player.song) {
            const fetchSongData = async () => {
                try {
                    const response = await fetch(player.song, {
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    });
                    const data = await response.json();
                    const newSong = data.song ? '♬ ' + data.song : '';

                    // 데이터 변경 감지 및 스마트 폴링 조정
                    if (newSong === lastSongData.current) {
                        consecutiveNoChangeCount.current.song++;
                        // 연속으로 변화가 없으면 폴링 간격을 점진적으로 늘림 (최대 45초)
                        if (consecutiveNoChangeCount.current.song >= 3) {
                            setSongFetchInterval(prev => Math.min(prev + 10000, 45000));
                        }
                    } else {
                        consecutiveNoChangeCount.current.song = 0;
                        setSongFetchInterval(15000); // 변화가 있으면 다시 기본 간격으로
                        randomBackground(); // 곡이 변경될 때만 배경 업데이트
                    }

                    lastSongData.current = newSong;
                    setCurrentSong(newSong);
                } catch (error) {
                    console.error('Error fetching song data:', error);
                    // 네트워크 에러인 경우 기존 데이터 유지, 폴링 간격만 조정
                    setSongFetchInterval(prev => Math.min(prev + 5000, 30000));
                }
            };

            fetchSongData();

            intervalSongFetch.current = setInterval(fetchSongData, songFetchInterval);
        } else {
            setCurrentSong('');
        }

        if (player.program) {
            const fetchProgramData = async () => {
                try {
                    const response = await fetch(player.program, {
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    });
                    const data = await response.json();

                    if (data.title) {
                        // 데이터 변경 감지 및 스마트 폴링 조정
                        if (data.title === lastProgramData.current) {
                            consecutiveNoChangeCount.current.program++;
                            // 프로그램은 변화가 적으므로 더 보수적으로 간격 조정 (최대 5분)
                            if (consecutiveNoChangeCount.current.program >= 2) {
                                setProgramFetchInterval(prev => Math.min(prev + 30000, 300000));
                            }
                        } else {
                            consecutiveNoChangeCount.current.program = 0;
                            setProgramFetchInterval(60000); // 변화가 있으면 다시 기본 간격으로
                            randomBackground(); // 프로그램이 변경될 때만 배경 업데이트
                        }

                        lastProgramData.current = data.title;
                        setCurrentProgram(data.title);

                        if ('mediaSession' in navigator) {
                            navigator.mediaSession.metadata = new MediaMetadata({
                                title: data.title || '제목없음',
                                artist: player.title || '제목없음',
                                artwork: [{
                                    src: "/albumart.png",
                                    sizes: "500x500",
                                    type: "image/png",
                                }]
                            });
                        }
                    } else {
                        setCurrentProgram('');
                    }
                } catch (error) {
                    console.error('Error fetching program data:', error);
                    // 네트워크 에러인 경우 기존 데이터 유지, 폴링 간격만 조정
                    setProgramFetchInterval(prev => Math.min(prev + 15000, 180000));
                }
            };

            fetchProgramData();

            intervalProgramFetch.current = setInterval(fetchProgramData, programFetchInterval);
        } else {
            setCurrentProgram('');
        }


        if (isNative.current && player.url) {
            try {
                Native.play(player.url, player.title || "제목없음");
                setIsPlaying(true);
            } catch (error) {
                console.log("native error:", error)
            }
        } else {
            if (Hls.isSupported() && player.url) {


                console.log(player.url.toLowerCase())
                if (player.url.toLowerCase().endsWith(".acc")) {
                    audioRef.current.src = player.url;
                    audioRef.current.play();
                    console.log(audioRef.current);

                    if ('mediaSession' in navigator) {
                        navigator.mediaSession.metadata = new MediaMetadata({
                            title: player.title || '제목없음',
                            artist: '라디오 스트리밍 중',
                            artwork: [{
                                src: "/albumart.png",
                                sizes: "500x500",
                                type: "image/png",
                            }]
                        });
                    }
                } else {
                    const video = videoRef.current;
                    const hls = new Hls();

                    if (player && player.url) {
                        hls.loadSource(player.url.trim());
                        hls.attachMedia(video);
                    }

                    video.addEventListener('canplaythrough', () => {
                        video.play();
                        setIsPlaying(true);
                    });

                    if ('mediaSession' in navigator) {
                        navigator.mediaSession.metadata = new MediaMetadata({
                            title: player.title || '제목없음',
                            artist: '라디오 스트리밍 중',
                            artwork: [{
                                src: "/albumart.png",
                                sizes: "500x500",
                                type: "image/png",
                            }]
                        });
                    }

                    return () => {
                        hls.destroy();
                    };
                }
            }
        }


        return () => {
            if (intervalSongFetch.current) {
                clearInterval(intervalSongFetch.current);
            }
            if (intervalProgramFetch.current) {
                clearInterval(intervalProgramFetch.current);
            }
        };
    }, [player.url, player.song, player.program, isFocusing]); // interval 상태 제거

    // songFetchInterval이 변경될 때만 song interval 재설정
    useEffect(() => {
        if (player.song && isFocusing && intervalSongFetch.current) {
            clearInterval(intervalSongFetch.current);

            const fetchSongData = async () => {
                try {
                    const response = await fetch(player.song, {
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    });
                    const data = await response.json();
                    const newSong = data.song ? '♬ ' + data.song : '';

                    if (newSong === lastSongData.current) {
                        consecutiveNoChangeCount.current.song++;
                        if (consecutiveNoChangeCount.current.song >= 3) {
                            setSongFetchInterval(prev => Math.min(prev + 10000, 45000));
                        }
                    } else {
                        consecutiveNoChangeCount.current.song = 0;
                        setSongFetchInterval(15000);
                        randomBackground();
                    }

                    lastSongData.current = newSong;
                    setCurrentSong(newSong);
                } catch (error) {
                    console.error('Error fetching song data:', error);
                    setSongFetchInterval(prev => Math.min(prev + 5000, 30000));
                }
            };

            intervalSongFetch.current = setInterval(fetchSongData, songFetchInterval);
        }
    }, [songFetchInterval]);

    // programFetchInterval이 변경될 때만 program interval 재설정
    useEffect(() => {
        if (player.program && isFocusing && intervalProgramFetch.current) {
            clearInterval(intervalProgramFetch.current);

            const fetchProgramData = async () => {
                try {
                    const response = await fetch(player.program, {
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    });
                    const data = await response.json();

                    if (data.title) {
                        if (data.title === lastProgramData.current) {
                            consecutiveNoChangeCount.current.program++;
                            if (consecutiveNoChangeCount.current.program >= 2) {
                                setProgramFetchInterval(prev => Math.min(prev + 30000, 300000));
                            }
                        } else {
                            consecutiveNoChangeCount.current.program = 0;
                            setProgramFetchInterval(60000);
                            randomBackground();
                        }

                        lastProgramData.current = data.title;
                        setCurrentProgram(data.title);

                        if ('mediaSession' in navigator) {
                            navigator.mediaSession.metadata = new MediaMetadata({
                                title: data.title || '제목없음',
                                artist: player.title || '제목없음',
                                artwork: [{
                                    src: "/albumart.png",
                                    sizes: "500x500",
                                    type: "image/png",
                                }]
                            });
                        }
                    } else {
                        setCurrentProgram('');
                    }
                } catch (error) {
                    console.error('Error fetching program data:', error);
                    setProgramFetchInterval(prev => Math.min(prev + 15000, 180000));
                }
            };

            intervalProgramFetch.current = setInterval(fetchProgramData, programFetchInterval);
        }
    }, [programFetchInterval]);


    function randomBackground() {
        const colors = [
            { design: '#ff9a9e', research: '#fad0c4' },
            { design: '#a18cd1', research: '#fbc2eb' },
            { design: '#ffecd2', research: '#fcb69f' },
            { design: '#fbc2eb', research: '#a6c1ee' },
            { design: '#84fab0', research: '#8fd3f4' },
            { design: '#a1c4fd', research: '#c2e9fb' },
            { design: '#30cfd0', research: '#330867' },
            { design: '#9890e3', research: '#b1f4cf' },
        ];
        const randomIndex = Math.floor(Math.random() * colors.length);
        const selectedColor = colors[randomIndex];

        document.documentElement.style.setProperty('--color-design', selectedColor.design);
        document.documentElement.style.setProperty('--color-research', selectedColor.research);
    }

    useEffect(() => {
        if (videoRef.current && audioRef.current && !isNative.current) {
            if (isPlaying) {
                replay();
            } else {
                videoRef.current.pause();
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    function replay() {
        if (Hls.isSupported() && player) {
            const video = videoRef.current;
            const hls = new Hls();

            if (player && player.url) {
                hls.loadSource(player.url.trim());
                hls.attachMedia(video);

                video.addEventListener('canplaythrough', () => {
                    video.play();
                    setIsPlaying(true);
                });

                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: player.title || '제목없음',
                        artist: '라디오 스트리밍 중',
                        artwork: [{
                            src: "/albumart.png",
                            sizes: "500x500",
                            type: "image/png",
                        }]
                    });
                }
            }

            return () => {
                hls.destroy();
            };
        }
    }

    function setNativePlayerPlaying(is) {
        if (isNative.current) {
            if (is) {
                Native.pause();
            } else {
                Native.pause();
            }
        }
    }

    const toggleFavorites = (title) => {
        if (favorites.includes(title)) {
            setFavorites(favorites.filter(favorite => favorite !== title));
            toast.dismiss();
            toast('자주 듣는 목록에서 제거했어요.', {
                icon: '🗑️',
                duration: 2000,
                position: 'bottom-center',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    width: '100%',
                    textAlign: 'left'
                }
            });
        } else {
            setFavorites([...favorites, title]);
            toast.dismiss();
            toast('자주 듣는 목록에 추가했어요.', {
                icon: '❤️', duration: 2000,
                position: 'bottom-center',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    width: '100%',
                    textAlign: 'left'
                }
            });
        }
    }

    function copyToClipboard(text) {
        window.navigator.clipboard.writeText(text).then(() => {
            toast.dismiss();
            toast('현재 곡 정보를 클립보드에 복사했어요', {
                duration: 2000,
                position: 'bottom-center',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    width: '100%',
                    textAlign: 'left'
                }
            });
        });
    }

    return (<>
        {isReady && player.title && <SwipeableBottomSheet
            open={isOpen}
            onChange={(e) => setIsOpen(e)}
            topShadow={true}
            shadowTip={false}
            bodyStyle={{ backgroundColor: 'var(--nav-background-color)', borderRadius: '20px 20px 0 0' }}
            style={!isMobile ? ({ backgroundColor: 'var(--nav-background-color)', borderRadius: '20px', bottom: '0', left: '74dvw', width: '25dvw', boxShadow: 'none' }) : (isOpen ? { backgroundColor: 'var(--nav-background-color)', borderRadius: '20px', bottom: '0', boxShadow: 'none' }
                : { backgroundColor: 'var(--nav-background-color)', borderRadius: '20px', bottom: '60px', boxShadow: 'none' })
            }
            overlay={isMobile}
            overflowHeight={isOpen ? 0 : 60}>

            <md-ripple></md-ripple>
            <div style={{ height: '95dvh' }}>
                {isOpen && !isSidebar.current &&
                    <div className='bottom-sheet-handle'></div>}

                {isOpen && isSidebar.current && <div className='sidebar-player-handle' onClick={() => setIsOpen(false)}>
                    <IonIcon name='chevron-down' />
                </div>}
                <div className={isOpen ? 'player-header open' : 'player-header'}>
                    <div className={isOpen ? 'player-header-title open' : 'player-header-title'} onClick={() => setIsOpen(true)}>
                        {player && (!isOpen ? player.title : '지금 재생 중')}
                        {player == [] && '재생 중인 스테이션 없음'}
                    </div>
                    {/* userCnt 및 supabase 관련 UI 제거 */}
                    {/* {!isOpen && player && ...existing code... */}
                    {!isOpen && player &&
                        <div className='player-header-close' onClick={() => [setNativePlayerPlaying(isPlaying ? false : true), setIsPlaying(!isPlaying)]}>
                            {isBuffering ? <div className='loader' />
                                : isPlaying ? <IonIcon name='pause' /> : <IonIcon name='play' />}
                        </div>
                    }
                </div>

                {player &&
                    <div className='player-body'>
                        <div className='player-body-title'>
                            {player && player.title}
                        </div>

                        <span>{currentProgram}</span><br />
                        <span style={{ opacity: 0.7 }} onClick={() => copyToClipboard(currentSong.replace('♬ ', ''))}>{currentSong}</span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between', marginTop: `${currentProgram ? '20px' : '0'}` }}>
                            <div className='player-playpause-btn' onClick={() => [setNativePlayerPlaying(isPlaying ? false : true), setIsPlaying(!isPlaying)]}>
                                {isBuffering ? <div className='loader' />
                                    : isPlaying ? <IonIcon name='pause' /> : <IonIcon name='play' />}
                            </div>


                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className={actualFavorites.includes(player.title) ? 'player-heart-btn active' : 'player-heart-btn'} onClick={() => toggleFavorites(player.title)}>
                                    {actualFavorites.includes(player.title) ? <IonIcon name='heart' /> : <IonIcon name='heart-outline' />}
                                </div>
                                {isNative.current && <div className={'player-heart-btn'} onClick={() => setIsOpenTimerModal(true)}>
                                    <IonIcon name='moon-outline' />
                                </div>}

                            </div>

                        </div>

                    </div>
                }

                {isOpen && isPlaying && <div className='circles active'>
                    <div className="circle research"></div>
                    <div className="circle design"></div>
                </div>}

                <video autoPlay style={{ display: 'none' }}
                    ref={videoRef} />
                <audio autoPlay style={{ display: 'none' }} ref={audioRef} crossOrigin="anonymous"
                    playsInline></audio>
            </div>

        </SwipeableBottomSheet>}



        {isOpenTimerModal &&
            <>
                <div className='timer-modal-backdrop' onClick={() => setIsOpenTimerModal(false)} />
                <TimerModal closeModal={() => setIsOpenTimerModal(false)} />
            </>
        }


        {!isOpen && <BottomNav />}
        {!isMobile && <BottomNav />}

    </>
    );
});

export default HlsPlayer;