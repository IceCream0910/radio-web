import { useEffect, useRef } from 'react';

const AdSense = ({ adClient, adSlot, format = "auto", responsive = "true" }) => {
    const adRef = useRef(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) {
            return;
        }

        if (adRef.current && !adRef.current.dataset.adStatus) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                isInitialized.current = true;
            } catch (e) {
                console.error("AdSense error", e);
            }
        }
    }, [adClient, adSlot]);

    return (
        <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: "block", width: '300px', maxHeight: '50px', borderRadius: '15px' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
        ></ins>
    );
};

export default AdSense;