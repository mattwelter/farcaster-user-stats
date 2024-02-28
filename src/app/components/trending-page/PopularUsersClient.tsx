'use client';

import { useState } from 'react'
import style from './../styles/PopularUsers.module.css'

export default function Page(data: any) {

    const currentData = data.data


    return (
    <>
        <div className={style['popular-users']}>
            <div className={style['table-wrapper']}>
                <table>
                    <thead>
                        <tr>
                            <th>
                                #
                            </th>
                            <th>
                                User
                            </th>
                            <th>
                                Engagement
                            </th>
                            {/* <th>
                                Casts
                            </th> */}
                            {/* <th>
                                Likes/Cast ratio
                            </th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length !== 0
                        ? currentData.map((event: any, index: any) => (
                            <tr key={event.fid} className={style['table-item']}>
                                <td>
                                    {index+1}
                                </td>
                                <td>
                                    @<a href={`/users/${event.fid}`}>{ event.username }</a>
                                </td>
                                <td>
                                    { Number(event.reactions_received).toLocaleString() }
                                </td>
                                {/* <td>
                                    { event.total_casts }
                                </td> */}
                                {/* <td>
                                    { event.reaction_cast_ratio.toFixed(2) }
                                </td> */}
                            </tr>
                            ))
                        : <tr><td>Nothing here...</td></tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </>
    )
}