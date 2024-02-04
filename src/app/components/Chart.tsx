import db from '../api/db';

// Function to format date objects to strings
const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString(); // Adjust the format as needed
};

export default async function HomeFeed(fid: any) {
    const getData = async function() {
        let data = await db(`
            WITH date_series AS (
                SELECT generate_series(
                    current_date - INTERVAL '13 days', 
                    current_date, 
                    '1 day'::interval
                )::date AS date
            ),
            followers AS (
                SELECT 
                    date,
                    SUM(followers_count) OVER (ORDER BY date) AS cumulative_followers
                FROM (
                    SELECT 
                        date(created_at) AS date, 
                        COUNT(*) AS followers_count
                    FROM links
                    WHERE target_fid = ${fid.fid} -- Replace with your method of parameterization
                    AND created_at <= current_date
                    GROUP BY date(created_at)
                    
                    UNION ALL
                    
                    SELECT 
                        date(deleted_at) AS date, 
                        -COUNT(*) AS followers_count
                    FROM links
                    WHERE target_fid = ${fid.fid} -- Replace with your method of parameterization
                    AND deleted_at IS NOT NULL
                    AND deleted_at <= current_date
                    GROUP BY date(deleted_at)
                ) AS daily_counts
            ),
            daily_difference AS (
                SELECT 
                    date,
                    COALESCE(cumulative_followers - LAG(cumulative_followers) OVER (ORDER BY date), 0) AS daily_difference,
                    cumulative_followers
                FROM followers
            )
            SELECT 
                ds.date,
                dd.daily_difference,
                MAX(dd.cumulative_followers) OVER (ORDER BY ds.date) AS total_followers
            FROM date_series ds
            LEFT JOIN daily_difference dd ON ds.date = dd.date
            ORDER BY ds.date;
        
        `);
        
        // Formatting the date of each item in the data
        data = data.map((item: any) => ({
            ...item,
            date: formatDate(item.date), // Convert date to string
        }));

        let arr = []
        for(let i=0; i<data.length; i++){
            if(i%2 == 0){
                arr.push(data[i])
            }
        }

        return arr;
    };
    
    const data = await getData();

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Difference</th>
                        <th>Followers</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length !== 0 ? (
                        data.map((event: any, index: any) => (
                            <tr key={index}> {/* Changed key to index to ensure uniqueness */}
                                <td>{event.date}</td>
                                <td>{event.daily_difference}</td>
                                <td>{event.total_followers}</td>
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
