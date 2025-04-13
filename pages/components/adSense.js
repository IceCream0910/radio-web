import { useEffect } from 'react';

const AdSense = ({ adClient, adSlot, format = "auto", responsive = "true" }) => {
    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error", e);
        }
    }, []);

    return (
        <ins
            className="adsbygoogle"
            style={{ display: "block", width: '300px', height: '50px', borderRadius: '15px' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
        ></ins>
    );
};

export default AdSense;