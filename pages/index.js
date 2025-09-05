import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import RegionStationList from './components/regionStationList';
import IonIcon from '@reacticons/ionicons';
import dynamic from 'next/dynamic';

const AdSense = dynamic(() => import('./components/adSense'), { ssr: false });

const IndexPage = () => {
  const [region, setRegion] = useState('seoul');
  const [isPCorSidebar, setIsPCorSidebar] = useState(false);

  useEffect(() => {
    if (!document.querySelector(".adfit1")?.querySelector("ins")) {
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
      document.querySelector(".adfit1")?.appendChild(ins);
      document.querySelector(".adfit1")?.appendChild(scr);
    }

    const userAgent = navigator.userAgent.toLowerCase();
    setIsPCorSidebar(/sidebar/.test(userAgent));
  }, []);

  const handleRegionChange = (event) => {
    setRegion(event.target.id);
    const regionSelect = document.querySelector('.region-select');
    const selectedButton = event.target;
    const scrollAmount = selectedButton.offsetLeft - (regionSelect.offsetWidth / 2) + (selectedButton.offsetWidth / 2) + 50;
    regionSelect.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  return (
    <div>
      <Head>
        <title>스테이션</title>
      </Head>

      <main>
        <header>
          <h2 style={{ width: '100%', textAlign: 'left', marginTop: '30px', marginLeft: '13px' }}>스테이션</h2>
          <div className="region-select">
            {isPCorSidebar && (<>
              <button className="scroll-button left" onClick={() => document.querySelector('.region-select').scrollBy({ left: -300, behavior: 'smooth' })}>
                <IonIcon name="chevron-back-outline" />
              </button>

              <button className="scroll-button right" onClick={() => document.querySelector('.region-select').scrollBy({ left: 300, behavior: 'smooth' })}>
                <IonIcon name="chevron-forward-outline" />
              </button></>
            )}
            <button id="seoul" onClick={handleRegionChange} style={{ marginRight: '10px' }} className={region === 'seoul' ? 'active' : ''}>수도권</button>
            <button id="busan" onClick={handleRegionChange} style={{ marginRight: '10px' }} className={region === 'busan' ? 'active' : ''}>부산·울산·경남</button>
            <button id="daegu" onClick={handleRegionChange} style={{ marginRight: '10px' }} className={region === 'daegu' ? 'active' : ''}>대구·경북</button>
            <button id="gwangju" onClick={handleRegionChange} style={{ marginRight: '10px' }} className={region === 'gwangju' ? 'active' : ''}>광주·전남</button>
            <button id="jeonbuk" onClick={handleRegionChange} style={{ marginRight: '10px' }} className={region === 'jeonbuk' ? 'active' : ''}>전북</button>
            <button id="daejeon" onClick={handleRegionChange} style={{ marginRight: '10px' }} className={region === 'daejeon' ? 'active' : ''}>대전·세종·충남</button>
            <button id="chungbuk" onClick={handleRegionChange} style={{ marginRight: '10px' }} className={region === 'chungbuk' ? 'active' : ''}>충북</button>
            <button id="gangwon" onClick={handleRegionChange} style={{ marginRight: '10px' }} className={region === 'gangwon' ? 'active' : ''}>강원</button>
            <button id="jeju" onClick={handleRegionChange} style={{ marginRight: '10px' }} className={region === 'jeju' ? 'active' : ''}>제주</button>
            <button>&nbsp;&nbsp;&nbsp;&nbsp;</button>
          </div>
        </header>


        <div style={{ height: '120px' }} />

        <div style={{ width: '100%', height: '50px', maxHeight: '50px', display: 'flex', justifyContent: 'center' }}>
          <AdSense adClient="ca-pub-7178712602934912" adSlot="8750400165" />
        </div>

        <RegionStationList region={region} />


      </main>
      <style jsx>{`
       .scroll-button {
          position: absolute;
          width: 30px;
          height: 30px;
          background-color: var(--background-color);
          z-index:5;
       }

       .scroll-button.left {
          left: 0;
          bottom: 15px;
       }

       .scroll-button.right {
        right: 0;
        bottom: 15px;
     }
      `}</style>
    </div>
  );
};

export default IndexPage;
