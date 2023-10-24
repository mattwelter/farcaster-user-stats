'use client';

import { useState } from 'react'
import style from './PopularUsers.module.css'

export default function Page(data: any) {

    const ITEMS_PER_CLICK = 10;

    const [loadedItems, setLoadedItems] = useState(ITEMS_PER_CLICK);

    const loadMore = () => {
        setLoadedItems((prevItems) => prevItems + ITEMS_PER_CLICK);
    };

    const currentData = data.data.slice(0, loadedItems);


    return (
    <>
        <div className={style['popular-users']}>
            <div className={style['table-wrapper']}>
                <table>
                    <thead>
                        <tr>
                            <th>
                                User
                            </th>
                            <th>
                                Total Engagement
                            </th>
                            {/* <th>
                                Casts
                            </th> */}
                            <th>
                                Likes/Cast ratio
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length !== 0
                        ? currentData.map((event: any, index: any) => (
                            <tr key={event.fid} className={style['table-item']}>
                                <td>
                                    {index+1}. @<a href={`/users/${event.fid}`}>{ event.username }</a>
                                </td>
                                <td>
                                    { event.reactions_received }
                                </td>
                                {/* <td>
                                    { event.total_casts }
                                </td> */}
                                <td>
                                    { event.reaction_cast_ratio.toFixed(2) }
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