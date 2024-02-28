'use client';

import { useState, useEffect } from 'react'
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
                                Username
                            </th>
                            <th>
                                Followers
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
            </div>
        </div>
    </>
    )
}