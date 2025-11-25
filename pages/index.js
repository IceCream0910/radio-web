import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import RegionStationList from './components/regionStationList';
import IonIcon from '@reacticons/ionicons';

const IndexPage = () => {
  const [region, setRegion] = useState('seoul');
  const [isPCorSidebar, setIsPCorSidebar] = useState(false);
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    setIsPCorSidebar(/sidebar/.test(userAgent));
    setIsApp(userAgent.indexOf('androidnative') > -1);
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
          <h2 style={{ width: '100%', textAlign: 'left', marginTop: '20px', marginLeft: '13px' }}>스테이션</h2>
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


        <div style={{ height: '180px' }} />

        <RegionStationList region={region} />

        {isApp && (<div style={{ position: 'fixed', bottom: '80px', width: 'calc(100% - 30px)', boxSizing: 'border-box', background: "var(--nav-background-color)", padding: '10px 15px', fontSize: '14px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
          <span>새로운 버전으로 업데이트해주세요.</span>
          <Link href="https://play.google.com/store/apps/details?id=com.icecream.simplemediaplayer" passHref>
            <button style={{ float: 'right', backgroundColor: 'var(--button-background-color)', color: 'var(--button-text-color)', border: 'none', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }}>
              업데이트
            </button>
          </Link>
        </div>
        )
        }

      </main >
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
    </div >
  );
};

export default IndexPage;
