import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'lucas123',
  database: 'ordem-sheet',
});

export default pool;
