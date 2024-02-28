import style from '../styles/PopularUsers.module.css'

export default async function HomeFeed() {
  
    const currentData = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
    ]
  return (
    <>
        <div className={style['popular-users-wrapper']}>
            <section>
                <h2>Trending Users</h2>
                <a className={style['header-subtitle']}>Users with the most engagement in the past 7 days. Engagement includes likes, replies, and recasts combined. <i>Updated seconds ago.</i></a>
            </section>
            <div className={style['popular-users']}>
                <div className={style['table-wrapper']}>
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    #
                                </th>
                                <th>
                                    Username
                                </th>
                                <th>
                                    Engagement
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
                </div>
            </div>
        </div>
    </>
    )
}