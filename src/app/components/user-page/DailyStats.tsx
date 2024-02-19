"use client"

import React, { useState, useEffect } from 'react';
import style from './../styles/EverydayFollows.module.css';

interface StatsItem {
    date: string; // Adjust types according to your actual data structure
    followers_count: number;
    followers_running_total: number;
    // Add other properties as needed
}

// Assuming 'fid' is a prop for the HomeFeed component
export default function DailyStats(fid: any){
    const [stats, setStats] = useState<StatsItem[] | null>(null);
    const [loading, setLoading] = useState(true); // Initialize loading state to true

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`https://farcasteruserstats.com/api/users/daily-stats?fid=${fid.fid}`);
                if (!response.ok) throw new Error('Failed to fetch daily stats');
                const jsonData = await response.json();
                setStats(jsonData); // Set the data from the API response
            } catch (error) {
                console.error("Error fetching data: ", error);
                setStats([]); // Assuming you want to set data to an empty array in case of an error
            } finally {
                setLoading(false); // Set loading to false once the data is fetched or an error occurs
            }
        };

        getData();
    }, [fid]); // Dependency array to re-run the effect if 'fid' changes

    if (loading) {
        return <div>Loading...</div>; // Display a loading message or spinner
    }

    // Render your component's UI
    return (
        <>
            <table className={style['table']}>
                <thead className={style['thead']}>
                    <tr>
                        <th>Date</th>
                        {/* @ts-ignore */}
                        <th colSpan="2">Followers</th>
                        {/* @ts-ignore */}
                        <th colSpan="2">Following</th>
                        {/* @ts-ignore */}
                        <th colSpan="2">Casts</th>
                    </tr>
                </thead>
                <tbody className={style['tbody']}>
                    {stats && stats.length !== 0 ? (
                        stats.map((event: any, index: number) => (
                            <tr key={index}>
                                <td>{`${new Date(event.date).getMonth() + 1}/${new Date(event.date).getDate()}`}</td>
                                <td className={event.followers_count > 0 ? style['increase'] : event.followers_count === 0 ? style['neutral'] : style['decrease']}>{event.followers_count > 0 ? "+" : event.followers_count === 0 ? '' : "-"}{event.followers_count}</td>
                                <td>{event.followers_running_total}</td>
                                <td className={event.following_count > 0 ? style['increase'] : event.following_count === 0 ? style['neutral'] : style['decrease']}>{event.following_count > 0 ? "+" : event.following_count === 0 ? '' : "-"}{event.following_count}</td>
                                <td>{event.following_running_total}</td>
                                <td className={event.cast_count > 0 ? style['increase'] : event.cast_count === 0 ? style['neutral'] : style['decrease']}>{event.cast_count > 0 ? "+" : event.cast_count === 0 ? '' : "-"}{event.cast_count}</td>
                                <td>{event.casts_running_total}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7}>Nothing here...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};