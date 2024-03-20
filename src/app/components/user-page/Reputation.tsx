"use client"

import React, { useState, useEffect } from 'react';
import style from './../styles/Reputation.module.css'

interface ReputationItem {
    target_fid: number;
    total_points: number;
}

export default function DailyStats(fid: any){
    const [data, setData] = useState<ReputationItem[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`https://api.farcasteruserstats.com/users/reputation?fid=${fid.fid}`);
                if (!response.ok) throw new Error('Failed to fetch daily stats');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setData([]); 
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [fid]); // Dependency array to re-run the effect if 'fid' changes

    if (loading) {
        return <div>Loading...</div>; // Display a loading message or spinner
    }

    const points = data ? (data[0].total_points != null ? Number((data[0].total_points / 60).toFixed(2)) * 100 : 0) : 0
    console.log({points})
    return (
        <>
            {data && data.length !== 0 ? (
                <div>
                    <h2>{(data[0].total_points != null ? (data[0].total_points / 60 >= 1 ? "100%" : (Number((data[0].total_points / 60).toFixed(2)) * 100) + "%") : "0%")}</h2>   
                    <a>{(data[0].total_points != null ? (data[0].total_points / 60 >= 1 ? "Excellent Reputation" :
                        (Number((data[0].total_points / 60).toFixed(2)) * 100) >= 75 ? "Great Reputation"
                        : (Number((data[0].total_points / 60).toFixed(2)) * 100) >= 50 ? "Good Reputation"
                        : (Number((data[0].total_points / 60).toFixed(2)) * 100) >= 25 ? "Neutral Reputation"
                        : (Number((data[0].total_points / 60).toFixed(2)) * 100) >= 0 ? "Poor Reputation" : "No Reputation")
                        : "0%")}</a>
                </div>
            ) : (
                <div className={`${style['container']}`}>
                    <h2 className={`${style['score']}`}>0%</h2>
                    <a>No Reputation</a>
                </div>
            )}
        </>
    );
};