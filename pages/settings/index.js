"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router';
import Head from 'next/head';
import toast from 'react-hot-toast';
import '@material/web/switch/switch.js';
import IonIcon from '@reacticons/ionicons';
import Link from 'next/link';

const Settings = () => {
    const router = useRouter();
    const [isNative, setIsNative] = useState(false);
    const [isSidebar, setIsSidebar] = useState(false);
    const [isOpenQRModal, setisOpenQRModal] = useState(false);
    let installPrompt = null;

    const [theme, setTheme] = useState('dark'); // ['light', 'dark']
    const [preventScreenOff, setPreventScreenOff] = useState(false);
    const [isPlayerAnimation, setIsPlayerAnimation] = useState(true);
    const [fontSize, setFontSize] = useState(0); // [0, 1, 2]
    const [initialPage, setInitialPage] = useState('station');

    useEffect(() => {
        const useragent = navigator.userAgent;
        setIsNative(useragent.indexOf('AndroidNative') > -1)
        setIsSidebar(useragent.indexOf('sidebar') > -1);

        setTimeout(() => {
            if (typeof window !== 'undefined' && window.localStorage.getItem('theme')) {
                setTheme(window.localStorage.getItem('theme'));
            } else {
                setTheme('dark');
            }

            if (typeof window !== 'undefined' && window.localStorage.getItem('fontSize')) {
                setFontSize(parseInt(window.localStorage.getItem('fontSize')));
            } else {
                setFontSize(0);
            }

            if (typeof window !== 'undefined' && window.localStorage.getItem('initialPage')) {
                setInitialPage(window.localStorage.getItem('initialPage'));
            } else {
                setInitialPage('station');
            }
        }, 100);
    }, []);

    const handleInitialPageChange = (page) => {
        setInitialPage(page);
        localStorage.setItem('initialPage', page);
        toast.success('초기 페이지가 변경되었습니다.', {
            duration: 2000,
            position: 'bottom-center',
        });
    };


    useEffect(() => {
        const storedPreventScreenOff = typeof window !== 'undefined' && window.localStorage.getItem('preventScreenOff') ? window.localStorage.getItem('preventScreenOff') === 'true' : false;
        setPreventScreenOff(storedPreventScreenOff);
        if (isNative) {
            Native.updateSetting('settings_prevent_screen_off', storedPreventScreenOff);
        }
    }, []);

    useEffect(() => {
        const storedIsPlayerAnimation = typeof window !== 'undefined' && window.localStorage.getItem('isPlayerAnimation') ? window.localStorage.getItem('isPlayerAnimation') === 'true' : true;
        setIsPlayerAnimation(storedIsPlayerAnimation);
    }, []);

    useEffect(() => {
        console.log('theme', theme)
    }, [theme]);

    const togglePreventScreenOff = () => {
        const newPreventScreenOff = !preventScreenOff;
        setPreventScreenOff(newPreventScreenOff);
        toast.dismiss()
        toast('앱을 재시작하면 설정이 적용됩니다', {
            duration: 2000,
            position: 'bottom-center',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                width: '100%',
                textAlign: 'left',
                marginBottom: '120px'
            }
        });
        localStorage.setItem('preventScreenOff', newPreventScreenOff);
        if (isNative) {
            Native.updateSetting('settings_prevent_screen_off', newPreventScreenOff);
        }
    }

    const toggleIsPlayerAnimation = () => {
        const newIsPlayerAnimation = !isPlayerAnimation;
        setIsPlayerAnimation(newIsPlayerAnimation);
        localStorage.setItem('isPlayerAnimation', newIsPlayerAnimation);
    }

    return (
        <>
            <Head>
                <title>설정</title>
            </Head>
            <main className='settings'>
                <header>
                    <h2 style={{ width: '100%', textAlign: 'left', marginTop: '30px', marginLeft: '13px' }}>설정</h2>
                </header>

                <div style={{ height: '80px' }} />

                <section style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                    {theme && <>
                        <h3>테마</h3>
                        <div />
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', gap: '10px' }}>
                            <button className={theme == 'dark' ? 'active' : ''} onClick={() => { setTheme('dark'); localStorage.setItem('theme', 'dark'); router.reload(); }}>어두운</button>
                            <button className={theme == 'light' ? 'active' : ''} onClick={() => { setTheme('light'); localStorage.setItem('theme', 'light'); router.reload(); }}>밝은</button>
                        </div>
                        <br />
                    </>}

                    <h3>시작 페이지</h3>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', gap: '10px' }}>
                        <button className={initialPage === 'station' ? 'active' : ''} onClick={() => handleInitialPageChange('station')}>스테이션</button>
                        <button className={initialPage === 'favorites' ? 'active' : ''} onClick={() => handleInitialPageChange('favorites')}>자주 듣는</button>
                    </div>
                    <br />

                    <h3>글자 크기</h3>
                    <div />
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', gap: '10px' }}>
                        <button className={fontSize == 0 ? 'active' : ''} onClick={() => { setFontSize(0); localStorage.setItem('fontSize', 0); router.reload(); }}>보통</button>
                        <button className={fontSize == 1 ? 'active' : ''} onClick={() => { setFontSize(1); localStorage.setItem('fontSize', 1); router.reload(); }}>크게</button>
                        <button className={fontSize == 2 ? 'active' : ''} onClick={() => { setFontSize(2); localStorage.setItem('fontSize', 2); router.reload(); }}>매우 크게</button>
                    </div>
                    <br />


                    {isNative && <>
                        <label style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                            앱 실행 중 화면 꺼짐 방지
                            <md-switch {...(preventScreenOff == true ? { selected: true } : {})} onClick={togglePreventScreenOff}></md-switch>
                        </label>
                        <br /></>}

                    <br /><br />
                    {!isNative && !isSidebar && <>
                        <h3>앱 설치</h3>
                        <a href="https://play.google.com/store/apps/details?id=com.icecream.simplemediaplayer" target='_blank'><div className='station-item'>안드로이드 앱 설치<IonIcon name='arrow-forward-outline' /></div></a>
                        <Link href={'/settings/webapp'}><div className='station-item'>웹 앱으로 설치<IonIcon name='arrow-forward-outline' /></div></Link>
                        <br /></>}

                    {isSidebar && <>
                        <h3>앱 설치</h3>
                        <div className='station-item' onClick={() => setisOpenQRModal(true)}>안드로이드 앱 설치<IonIcon name='arrow-forward-outline' /></div>
                        <br /></>}

                    <h3>링크</h3>
                    <a href='mailto:hey@yuntae.in?subject=[라디오 앱 문의] '><div className='station-item'>문의/스테이션 추가 요청<IonIcon name='arrow-forward-outline' /></div></a>
                    <Link href={'/settings/faq'}><div className='station-item'>자주하는 질문<IonIcon name='arrow-forward-outline' /></div></Link>
                    <Link href={'/settings/notice'}><div className='station-item'>공지사항<IonIcon name='arrow-forward-outline' /></div></Link>
                    <Link href={'/settings/privacy'}><div className='station-item'>개인정보 처리방침<IonIcon name='arrow-forward-outline' /></div></Link>

                    <br />
                    <h3 >정보</h3>
                    <h5>1.0.3 ver.</h5>
                    <h5>© Yun Tae In</h5>
                </section>
                <br /><br /><br /><br /><br /><br /><br /><br />
            </main>

            {isOpenQRModal && <>
                <div className='timer-modal-backdrop' onClick={() => setisOpenQRModal(false)} />
                <div className='timer-modal'>
                    <div />
                    <h2>안드로이드 앱 설치
                        <span onClick={() => setisOpenQRModal(false)} style={{ float: 'right' }}>
                            <IonIcon name="close-outline" />
                        </span>
                    </h2>


                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '10px',
                        }}
                    ><img src='/qr.png' style={{ width: '250px', height: '250px' }} />
                        <p>QR코드를 스캔하면 플레이 스토어 링크로 이동합니다</p>
                    </div>


                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '10px',
                        }}
                    >
                        <button onClick={() => setisOpenQRModal(false)}>닫기</button>
                    </div>
                </div>
            </>}

            <style jsx>{`
        main {
            height: 100vh;
            flex-direction: column;
            gap: 15px;
            padding: 20px;
        }
        `}</style>

        </>
    )
};

export default Settings;
