import mysql, { Connection, MysqlError } from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const db: Connection = mysql.createConnection({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE as string,
  port: 3306,
});

db.connect((err: MysqlError | null) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

export default db;
