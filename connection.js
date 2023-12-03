import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'luczzzz.duckdns.org',
  user: 'root',
  password: 'lucas123',
  database: 'ordem-sheet',
});

export default pool;
