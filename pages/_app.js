import '../styles/globals.css'
import { AppStateProvider } from '../states/appState';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import dynamic from 'next/dynamic';

// Load player only on client to avoid SSR mismatch and allow URL-based toggling
const HlsPlayer = dynamic(() => import('./components/player'), { ssr: false });
const AdSense = dynamic(() => import('./components/adSense'), { ssr: false });
const ClientToaster = dynamic(
  () => import('react-hot-toast').then((mod) => mod.Toaster),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [currentPlayerData, setCurrentPlayerData] = useState(null);
  const playerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState(typeof window !== 'undefined' && window.localStorage.getItem('theme') ? window.localStorage.getItem('theme') : 'system'); // ['system', 'light', 'dark'
  const [fontSize, setFontSize] = useState(typeof window !== 'undefined' && window.localStorage.getItem('fontSize') ? parseInt(window.localStorage.getItem('fontSize')) : 0); // [0, 1, 2, 3]
  const [hidePlayerUi, setHidePlayerUi] = useState(false); // hide player UI when showUi=0

  function test() {
    console.log('test');
  }

  useEffect(() => {
    window.playerRef = playerRef;
    window.test = test;

    const initialPage = localStorage.getItem('initialPage') || 'station';
    if (router.pathname === '/' && initialPage === 'favorites') {
      router.push('/favorites');
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const showUiParam = params.get('showUi');
      if (showUiParam === '0') {
        setHidePlayerUi(true);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    if (theme == 'light') {
      const root = document.documentElement;
      root.style.setProperty('--background-color', '#eee');
      root.style.setProperty('--foreground-color', '#000');
      root.style.setProperty('--button-background-color', '#0000001f');
      root.style.setProperty('--button-foreground-color', '#000');
      root.style.setProperty('--nav-background-color', '#fff');
      root.style.setProperty('--nav-foreground-color', '#000');
      root.style.setProperty('--accent-color', '#2ad795');
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    switch (fontSize) {
      case 0:
        root.style.setProperty('--title-font-size', '1.6rem');
        root.style.setProperty('--subtitle-font-size', '1.2rem');
        root.style.setProperty('--button-font-size', '1.3rem');
        root.style.setProperty('--content-font-size', '1rem');
        root.style.setProperty('--main-header-bottom-margin', '100px');
        root.style.setProperty('--header-bottom-margin', '60px');
        break;
      case 1:
        root.style.setProperty('--title-font-size', '1.8rem');
        root.style.setProperty('--subtitle-font-size', '1.5rem');
        root.style.setProperty('--button-font-size', '1.5rem');
        root.style.setProperty('--content-font-size', '1.3rem');
        root.style.setProperty('--main-header-bottom-margin', '110px');
        root.style.setProperty('--header-bottom-margin', '70px');
        break;
      case 2:
        root.style.setProperty('--title-font-size', '2.2rem');
        root.style.setProperty('--subtitle-font-size', '1.9rem');
        root.style.setProperty('--button-font-size', '1.9rem');
        root.style.setProperty('--content-font-size', '1.7rem');
        root.style.setProperty('--main-header-bottom-margin', '120px');
        root.style.setProperty('--header-bottom-margin', '80px');
        break;
    }
  }, [fontSize]);


  return (
    <AppStateProvider>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-GXVJBMKYYZ`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GXVJBMKYYZ', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Component {...pageProps} />
      {router.pathname === '/' || router.pathname === '/favorites' ? 
      <div style={{ position: 'fixed', top: `${router.pathname === '/' ? '130px' : '80px'}`, width: '100%', height: '60px', maxHeight: '70px', display: 'flex', justifyContent: 'center' }}>
        <AdSense adClient="ca-pub-7178712602934912" adSlot="8750400165" />
      </div>
       :
        null
      }
      
      {!hidePlayerUi && <HlsPlayer ref={playerRef} />}
      <ClientToaster />
    </AppStateProvider>
  )
}
