import db from '../api/db';
import style from './styles/EverydayFollows.module.css'

// Function to format date objects to strings
const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString(); // Adjust the format as needed
};

export default async function HomeFeed(fid: any) {
    const getData = async function() {
        let data = await db(`
        SELECT 
        DATE(timestamp) AS date,
        COUNT(DISTINCT fid) AS count,
        SUM(COUNT(DISTINCT fid)) OVER (ORDER BY DATE(timestamp) ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
    FROM 
        links
    WHERE 
        target_fid = ${fid.fid}
        AND deleted_at IS NULL
    GROUP BY 
        date
    HAVING 
        COUNT(DISTINCT fid) > 0
    ORDER BY 
        date DESC
    LIMIT 28;
        
    
        `);
        
        // Formatting the date of each item in the data
        data = data.map((item: any) => ({
            ...item,
            date: formatDate(item.date), // Convert date to string
        }));

        return data;
    };
    
    const data = await getData();

    return (
        <>
            <table className={`${style['table']}`}>
                <thead className={`${style['thead']}`}>
                    <tr>
                        <th>Date</th>
                        <th>Difference</th>
                        <th>Followers</th>
                    </tr>
                </thead>
                <tbody className={`${style['tbody']}`}>
                    {data.length !== 0 ? (
                        data.map((event: any, index: any) => (
                            <tr key={index}> {/* Changed key to index to ensure uniqueness */}
                                <td>{event.date}</td>
                                <td className={event.count > 0 ? `${style['increase']}` : event.count == 0 ? `${style['neutral']}` : `${style['decrease']}`}>{event.count > 0 ? "+" : event.count == 0 ? '' : "-"}{event.count}</td>
                                <td>{event.running_total}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>Nothing here...</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}
