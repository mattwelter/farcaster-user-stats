"use client"

import React, { useState, useEffect } from 'react';
import style from './../styles/CastActivity.module.css';
import Tooltip from './../utils/Tooltip';

export default function CastActivity( fid: any ){
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const getDay = new Date().getDay();
        let day: any;
        switch (getDay) {
            case 0: day = 168; break; // Sunday
            case 1: day = 169; break; // Monday
            case 2: day = 170; break; // Tuesday
            case 3: day = 171; break; // Wednesday
            case 4: day = 172; break; // Thursday
            case 5: day = 173; break; // Friday
            case 6: day = 174; break; // Saturday
            default: day = 171; // Default to Wednesday
        }

        const getData = async () => {
            try {
                const response = await fetch(`https://api.farcasteruserstats.com/users/cast-activity?fid=${fid.fid}&day=${day}`);
                if (!response.ok) throw new Error('Failed to fetch daily stats');
                const jsonData = await response.json();
                setData(jsonData); // Set data
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        getData();
    }, [fid]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className={style['cast-activity-wrapper']}>
                <div className={style['cast-activity']}>
                    {data.length !== 0 ? data.map((event: any, index: number) => (
                        <Tooltip key={index} content={`${event.castamount} casts - ${new Date(event.date).getMonth() + 1}/${new Date(event.date).getDate()}/${new Date(event.date).getFullYear()}`}>
                            <a className={parseInt(event.castamount) === 0 ? style['cast-color-0'] : (parseInt(event.castamount) <= 4 ? style['cast-color-2'] : parseInt(event.castamount) <= 8 ? style['cast-color-4'] : parseInt(event.castamount) <= 12 ? style['cast-color-6'] : style['cast-color-8'])}></a>
                        </Tooltip>
                    )) : <a>Nothing here...</a>}
                </div>
            </div>
        </>
    );
};
