'use client';

import { useState, useEffect } from 'react'
import style from './../styles/PopularUsers.module.css'

export default function Page(data: any) {
    const [unfollows, setData] = useState();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUnfollows = async () => {
        try {
            const response = await fetch(`https://api.farcasteruserstats.com/leaderboards/100mostfollowed`);
            if (!response.ok) {
            throw new Error('Failed to fetch 100 Most Followed');
            }
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error("Error fetching unfollows:", error);
            // Optionally, handle the error state here
        } finally {
            setLoading(false);
        }
        };

        getUnfollows();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const ITEMS_PER_CLICK = 10;

    const [loadedItems, setLoadedItems] = useState(ITEMS_PER_CLICK);

    const loadMore = () => {
        setLoadedItems((prevItems) => prevItems + ITEMS_PER_CLICK);
    };

    const currentData = data.slice(0, loadedItems);


    return (
    <>
        <div className={style['popular-users']}>
            <div className={style['table-wrapper']}>
                <table>
                    <thead>
                        <tr>
                            <th>
                                Rank
                            </th>
                            <th>
                                Username
                            </th>
                            <th>
                                Follower Count
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length !== 0
                        ? currentData.map((event: any, index: any) => (
                            <tr key={event.fid} className={style['table-item']}>
                                <td>
                                    { event.rank }
                                </td>
                                <td>
                                    <a href={`/users/${event.fid}`}>@{ event.username }</a>
                                </td>
                                <td>
                                    { event.follower_count }
                                </td>
                            </tr>
                            ))
                        : <tr><td>Nothing here...</td></tr>
                        }
                    </tbody>
                </table>
                {loadedItems < data.data.length ? (
                    <button onClick={loadMore}>Load more users</button>
                ) : <a className={style['all-users-have-been-loaded-text']}>All 100 users have loaded</a>}
            </div>
        </div>
    </>
    )
}