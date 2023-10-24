import { Pool } from 'pg'

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: 5432,
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
})

export default async function db(query: any) {    
    try {
        const data = await pool.query(query);
        return data.rows;
    } catch (error) {
        console.error('There was an error processing the requests:', error);
    }
}

