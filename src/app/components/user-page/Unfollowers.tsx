"use client"

import React, { useState, useEffect } from 'react';
import style from './../styles/Unfollowers.module.css';

interface UnfollowEvent {
  local_date: string;
  fid: string;
  user1_username: string;
}

export default function Unfollowers( fid: any ){
  const [unfollows, setUnfollows] = useState<UnfollowEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUnfollows = async () => {
      try {
        const response = await fetch(`https://farcasteruserstats.com/api/users/unfollowers?fid=${fid.fid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch unfollowers');
        }
        const data: UnfollowEvent[] = await response.json();
        setUnfollows(data);
      } catch (error) {
        console.error("Error fetching unfollows:", error);
        // Optionally, handle the error state here
      } finally {
        setLoading(false);
      }
    };

    getUnfollows();
  }, [fid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={style['unfollows-wrapper']}>
        {unfollows.length !== 0 ? unfollows.map((event) => (
          <div key={event.fid} className={style['unfollowCard']}>
            <a>{event.local_date}</a>
            <h3>@<a href={`/users/${event.fid}`}>{event.user1_username}</a> unfollowed this user</h3>
          </div>
        )) : (
          <div className={style['unfollowCard']}>
            <a>Oops!</a>
            <h3>Looks like no one unfollowed you.</h3>
          </div>
        )}
      </div>
    </>
  );
};
