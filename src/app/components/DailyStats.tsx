import style from './styles/EverydayFollows.module.css'

export default async function HomeFeed(fid: any) {

    const getData = async function() {
        const response = await fetch(`https://farcasteruserstats.com/api/daily-stats?fid=${fid.fid}`);
        if (!response.ok) { throw new Error('Failed to fetch daily stats'); }
        let data = await response.json()
        return data
    };
    
    const data = await getData();

    return (
        <>
            <table className={`${style['table']}`}>
                <thead className={`${style['thead']}`}>
                    <tr>
                        <th>Date</th>
                        {/* @ts-ignore */}
                        <th colspan="2">Followers</th>
                        {/* @ts-ignore */}
                        <th colspan="2">Following</th>
                        {/* @ts-ignore */}
                        <th colspan="2">Casts</th>
                    </tr>
                </thead>
                <tbody className={`${style['tbody']}`}>
                    {data.length !== 0 ? (
                        data.map((event: any, index: any) => (
                            <tr key={index}> {/* Changed key to index to ensure uniqueness */}
                                <td>{ event.date }</td>
                                <td className={event.followers_count > 0 ? `${style['increase']}` : event.followers_count == 0 ? `${style['neutral']}` : `${style['decrease']}`}>{event.followers_count > 0 ? "+" : event.followers_count == 0 ? '' : "-"}{event.followers_count}</td>
                                <td>{event.followers_running_total}</td>
                                <td className={event.following_count > 0 ? `${style['increase']}` : event.following_count == 0 ? `${style['neutral']}` : `${style['decrease']}`}>{event.following_count > 0 ? "+" : event.following_count == 0 ? '' : "-"}{event.following_count}</td>
                                <td>{event.following_running_total}</td>
                                <td className={event.cast_count > 0 ? `${style['increase']}` : event.cast_count == 0 ? `${style['neutral']}` : `${style['decrease']}`}>{event.cast_count > 0 ? "+" : event.cast_count == 0 ? '' : "-"}{event.cast_count}</td>
                                <td>{event.casts_running_total}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>Nothing here...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}
