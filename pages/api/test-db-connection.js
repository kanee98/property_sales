import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    await connection.connect();

    // Simple query to test
    const [rows] = await connection.query('SELECT 1 + 1 AS result');

    await connection.end();

    res.status(200).json({
      message: 'Database connection successful!',
      testQueryResult: rows[0].result,
    });
  } catch (error) {
    console.error('DB connection error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
}