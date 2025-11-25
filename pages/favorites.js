import Head from 'next/head';
import FavoriteStationList from './components/favoriteStationList';

const FavoritesPage = () => {
    return (
        <div>
            <Head>
                <title>자주듣는 스테이션</title>
            </Head>

            <main>
                <header>
                    <h2 style={{ width: '100%', textAlign: 'left', marginTop: '20px', marginLeft: '13px' }}>자주 듣는</h2>                </header>

                <div style={{ height: '120px' }} />
                <FavoriteStationList />


            </main>
        </div>
    );
};

export default FavoritesPage;
