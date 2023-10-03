'use client';

import { useState } from 'react'

export default function Page(data: any) {

    const ITEMS_PER_PAGE = 10;

    const [currentPage, setCurrentPage] = useState(1);

    const loadMore = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const endIndex = currentPage * ITEMS_PER_PAGE;
    const startIndex = endIndex - ITEMS_PER_PAGE;
    const currentData = data.data.slice(startIndex, endIndex);


    return (
    <>
        <div>
            {currentData.length !== 0
            ? currentData.map((event: any) => (
                <div key={event.fid}>
                    {event.fid} - {event.total_casts} total casts - {event.reactions_received} reactions received - {event.reaction_cast_ratio} ratio
                </div>
                ))
            : <div>Nothing here...</div>
            }
        </div>
        {endIndex < data.length && (
            <button onClick={loadMore}>Load the next 10</button>
        )}
    </>
    )
}