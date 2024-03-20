"use client"

import React, { useState, useEffect } from 'react';

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

    // Render your component's UI
    return (
        <>
            {data && data.length !== 0 ? (
                <>
                    <h2>{(data[0].total_points != null ? (data[0].total_points / 60 >= 1 ? "100%" : (data[0].total_points / 60).toFixed(2) + "%") : "0%")}</h2>   
                    <a>{(data[0].total_points != null ? (data[0].total_points / 60 >= 1 ? "Excellent Reputation" :
                        Number((data[0].total_points / 60).toFixed(2)) >= 75 ? "Great Reputation"
                        : Number((data[0].total_points / 60).toFixed(2)) >= 50 ? "Good Reputation"
                        : Number((data[0].total_points / 60).toFixed(2)) >= 25 ? "Neutral Reputation"
                        : Number((data[0].total_points / 60).toFixed(2)) >= 0 ? "Poor Reputation" : "No Reputation")
                        : "0%")}</a>
                </>
            ) : (
                <>
                    <h2>0%</h2>
                    <a>No Reputation</a>
                </>
            )}
        </>
    );
};