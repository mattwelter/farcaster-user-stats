import { Pool } from 'pg'

export const pool = new Pool({
    host: "viaduct.proxy.rlwy.net",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: 36327,
    max: 15, // Adjust based on your database's max_connections setting and application needs
    // idleTimeoutMillis: 30000, // close idle clients after 30 seconds
    // connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
})

// export default async function dbConnect(){
//     await pool.connect((err,client, release)=>{
//         if(err){
//             console.log("Error in connection", err.stack)
//             return err;
//         }
//         client.query("SELECT NOW()", (err, result)=>{
//             console.log({"DATABASE result": result})
//             release()
//             console.log("DB RELEASED")
//             if(err){
//                 return console.error("Error in query execution", err.stack)
//             }
//         });
//     })
// }
