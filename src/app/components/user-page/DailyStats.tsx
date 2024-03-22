"use client"

import React, { useState, useEffect, PureComponent } from 'react';
import style from './../styles/EverydayFollows.module.css';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatsItem {
    date: string; // Adjust types according to your actual data structure
    followers_count: number;
    followers_running_total: number;
    following_count: number;
    following_running_total: number;
}

// Assuming 'fid' is a prop for the HomeFeed component
export default function DailyStats(fid: any){
    const [stats, setStats] = useState<StatsItem[]>([]);
    const [rawData, setRawData] = useState<StatsItem[]>([]);
    const [loading, setLoading] = useState(true); // Initialize loading state to true
    const [currentTab, setCurrentTab] = useState('raw-data');

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`https://api.farcasteruserstats.com/users/dailystats?fid=${fid.fid}`);
                if (!response.ok) throw new Error('Failed to fetch daily stats');
                let jsonData = await response.json();

                // Set data for table
                const slicedArray = jsonData.slice(0, 28);
                setRawData(slicedArray)

                jsonData = jsonData.map((item: StatsItem) => ({
                    ...item,
                    followers_running_total: Number(item.followers_running_total),
                    following_running_total: Number(item.following_running_total)
                }));
    
                // Set data for visual
                jsonData = jsonData.reverse()
                setStats(jsonData);
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

    console.log({stats})
    return (
        <>
            <div className={'tab-list'}>
                <button className={currentTab === 'raw-data' ? 'tab-active' : ''} onClick={() => setCurrentTab('raw-data')}>Raw Data</button>
                <button className={currentTab === 'visual' ? 'tab-active' : ''} onClick={() => setCurrentTab('visual')}>Visual</button>
            </div>
            
            {currentTab === 'raw-data' ? (
                <table className={style['table']}>
                    <thead className={style['thead']}>
                        <tr>
                            <th>Date</th>
                            {/* @ts-ignore */}
                            <th colSpan="2">Followers</th>
                            {/* @ts-ignore */}
                            <th colSpan="2">Following</th>
                        </tr>
                    </thead>
                    <tbody className={style['tbody']}>
                        {rawData && rawData.length !== 0 ? (
                            rawData.map((event: any, index: number) => (
                                <tr key={index}>
                                    <td>{`${new Date(event.date).getMonth() + 1}/${new Date(event.date).getDate()}`}</td>
                                    <td className={event.followers_count > 0 ? style['increase'] : event.followers_count === 0 ? style['neutral'] : style['decrease']}>{event.followers_count > 0 ? "+" : event.followers_count === 0 ? '' : "-"}{event.followers_count}</td>
                                    <td>{event.followers_running_total}</td>
                                    <td className={event.following_count > 0 ? style['increase'] : event.following_count === 0 ? style['neutral'] : style['decrease']}>{event.following_count > 0 ? "+" : event.following_count === 0 ? '' : "-"}{event.following_count}</td>
                                    <td>{event.following_running_total}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7}>Nothing here...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="followers_running_total" name="Followers" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </>
    );
};