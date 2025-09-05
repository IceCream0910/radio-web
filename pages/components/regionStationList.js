import IonIcon from '@reacticons/ionicons';
import { useRecoilState } from 'recoil';
import { playerData, favoritesData, stationListContext } from '../../states/states';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function RegionStationList({ region, playFunc }) {
    const radioData = require('/public/radioStations.json');
    const [player, setPlayer] = useRecoilState(playerData);
    const [favorites, setFavorites] = useRecoilState(favoritesData);
    const [listContext, setListContext] = useRecoilState(stationListContext);
    const [actualFavorites, setActualFavorites] = useState([])

    const regionStations = radioData.filter(radio => radio.city === region);

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
                    textAlign: 'left',
                    marginBottom: '120px'
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
                    textAlign: 'left',
                    marginBottom: '120px'
                }
            });
        }
    }

    useEffect(() => {
        console.log("fav:", favorites);
        setActualFavorites(favorites);
    }, [favorites]);

    const handleStationClick = (radio, index) => {
        setPlayer(radio);
        setListContext({
            type: 'region',
            region: region,
            currentIndex: index,
            stations: regionStations
        });
    };

    return (<>
        {regionStations.map((radio, index) => (
            <div className={`station-item ${player.title === radio.title ? 'active' : ''}`} key={index}>
                <span onClick={() => handleStationClick(radio, index)}>{radio.title}&nbsp;
                    {player.title === radio.title ? <span className='badge'>재생중</span> : ''}</span>
                <button onClick={() => toggleFavorites(radio.title)}>
                    {actualFavorites.includes(radio.title) ? <IonIcon name='heart' /> : <IonIcon name='heart-outline' />}
                </button>
            </div>
        ))}

    </>)
}