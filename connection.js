import mysql from 'mysql2/promise';
import url from 'url';

const databaseUrl = process.env.DATABASE_URL;
const parsedDatabaseUrl = url.parse(databaseUrl);

const pool = mysql.createPool({
  host: parsedDatabaseUrl.hostname,
  user: parsedDatabaseUrl.auth.split(':')[0],
  password: parsedDatabaseUrl.auth.split(':')[1],
  database: parsedDatabaseUrl.pathname.substr(1),
  port: parsedDatabaseUrl.port,
});

export default pool;
