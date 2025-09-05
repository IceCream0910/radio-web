import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import RegionStationList from './components/regionStationList';
import FavoriteStationList from './components/favoriteStationList';
import dynamic from 'next/dynamic';

const AdSense = dynamic(() => import('./components/adSense'), { ssr: false });

const FavoritesPage = () => {
    useEffect(() => {
        if (!document.querySelector(".adfit")?.querySelector("ins")) {
            const ins = document.createElement("ins");
            const scr = document.createElement("script");
            ins.className = "kakao_ad_area";
            ins.style.display = "none";
            ins.style.width = "100%";
            scr.async = true;
            scr.type = "text/javascript";
            scr.src = "https://t1.daumcdn.net/kas/static/ba.min.js";
            ins.setAttribute("data-ad-width", "320");
            ins.setAttribute("data-ad-height", "50");
            ins.setAttribute("data-ad-unit", "DAN-obadITFjOoIwJTz4");
            document.querySelector(".adfit")?.appendChild(ins);
            document.querySelector(".adfit")?.appendChild(scr);
        }
    }, []);

    return (
        <div>
            <Head>
                <title>자주듣는 스테이션</title>
            </Head>

            <main>
                <header>
                    <h2 style={{ width: '100%', textAlign: 'left', marginTop: '30px', marginLeft: '13px' }}>자주 듣는</h2>                </header>

                <div style={{ height: 'var(--header-bottom-margin)' }} />
                <div style={{ width: '100%', height: '50px', maxHeight: '50px', display: 'flex', justifyContent: 'center' }}>
                    <AdSense adClient="ca-pub-7178712602934912" adSlot="8750400165" />
                </div>
                <FavoriteStationList />


            </main>
        </div>
    );
};

export default FavoritesPage;
