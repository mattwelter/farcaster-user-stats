"use client"

import React, { useState, useEffect } from 'react';
import style from './../styles/EverydayFollows.module.css';

interface StatsItem {
    day: string; // Adjust types according to your actual data structure
    likes: number;
}

// Assuming 'fid' is a prop for the HomeFeed component
export default function DailyLikes(fid: any){
    const [stats, setStats] = useState<StatsItem[] | null>(null);
    const [loading, setLoading] = useState(true); // Initialize loading state to true

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`https://api.farcasteruserstats.com/users/dailylikes?fid=${fid.fid}`);
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
                        <th>Likes</th>
                    </tr>
                </thead>
                <tbody className={style['tbody']}>
                    {stats && stats.length !== 0 ? (
                        stats.map((event: any, index: number) => (
                            <tr key={index}>
                                <td>{`${new Date(event.day).getMonth() + 1}/${new Date(event.day).getDate()}`}</td>
                                <td>{event.likes}</td>
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