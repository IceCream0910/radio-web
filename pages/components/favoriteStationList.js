import IonIcon from '@reacticons/ionicons';
import { useRecoilState } from 'recoil';
import { playerData, favoritesData, stationListContext } from '../../states/states';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

const allRadioStations = require('/public/radioStations.json');
const uniqueRadioStations = Array.from(new Map(allRadioStations.map(station => [station.title, station])).values());

export default function FavoriteStationList() {
    const [player, setPlayer] = useRecoilState(playerData);
    const [favorites, setFavorites] = useRecoilState(favoritesData);
    const [listContext, setListContext] = useRecoilState(stationListContext);

    const toggleFavorites = (stationTitle) => {
        toast.dismiss();

        if (favorites.includes(stationTitle)) {
            setFavorites(favorites.filter(title => title !== stationTitle));
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
            setFavorites(prevFavorites => [...prevFavorites, stationTitle]);
        }
    }; const favoriteStationsToDisplay = useMemo(() => {
        return uniqueRadioStations.filter(station => favorites.includes(station.title));
    }, [favorites]);

    const handleStationClick = (station, index) => {
        setPlayer(station);
        setListContext({
            type: 'favorites',
            region: null,
            currentIndex: index,
            stations: favoriteStationsToDisplay
        });
    };

    if (favoriteStationsToDisplay.length === 0) {
        return (
            <p style={{ opacity: .8, textAlign: 'center', marginTop: '5em', fontSize: 'var(--content-font-size)' }}>
                자주 듣는 스테이션이 하나도 없네요.<br />
                스테이션 옆 <IonIcon name='heart-outline' /> 버튼을 눌러 추가해보세요.
            </p>
        );
    } return (
        <>
            {favoriteStationsToDisplay.map((station, index) => (
                <div className={`station-item ${player.title === station.title ? 'active' : ''}`} key={station.title}>
                    <span style={{ width: '90%' }} onClick={() => handleStationClick(station, index)}>
                        {station.title}&nbsp;
                        {player.title === station.title ? <span className='badge'>재생중</span> : ''}
                    </span>
                    <button onClick={() => toggleFavorites(station.title)}>
                        {favorites.includes(station.title) ? <IonIcon name='heart' /> : <IonIcon name='heart-outline' />}
                    </button>
                </div>
            ))}
        </>
    );
}