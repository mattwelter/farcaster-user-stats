"use client"

import React, { useState, useEffect } from 'react';
import style from './../styles/Followers.module.css';
import TinyChart from './../utils/TinyChart';

interface CastSummary {
    total_this_week: number;
    percent_change: number;
    daily_counts: any[];
}

export default function CastSummary(fid: any ) {
    const [data, setData] = useState<CastSummary[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`https://api.farcasteruserstats.com/users/cast-summary?fid=${fid.fid}`);
                if (!response.ok) throw new Error('Failed to fetch 7 day cast summary');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [fid]); // Dependency array to re-run the effect if 'fid' changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    return (
        <>
            <h3 className={style['sub-heading']}>
                {data[0].total_this_week} new casts
                <a className={`${style['sub-heading-percentage']} ${data[0].percent_change < 0 ? style['negative-change'] : style['positive-change']}`}>
                    {data[0].percent_change ? data[0].percent_change.toFixed(2) : 0}% since last week
                </a>
            </h3>
            <TinyChart fid={data[0].daily_counts} />
        </>
    );
};
