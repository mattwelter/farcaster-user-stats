import { Pool } from 'pg'

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: 5432,
    max: 20,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    // allowExitOnIdle: true
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

export default async function db(query: any) {
    const client = await pool.connect();
    
    try {
        const data = await client.query(query);
        return data.rows;
    } catch (error) {
        console.error('There was an error processing the requests:', error);
    } finally {
        client.release();
    }
}

