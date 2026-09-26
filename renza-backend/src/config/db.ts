import { Pool, QueryResult, QueryResultRow } from 'pg';
import { env } from './env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  const result = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  if (env.NODE_ENV === 'development') {
    console.log('Executed query:', { text, duration: `${duration}ms`, rows: result.rowCount });
  }
  return result;
};

export const getClient = () => pool.connect();

export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT NOW()');
      console.log('✅ PostgreSQL connected successfully');
      return true;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn('⚠️ Could not connect to PostgreSQL database:', err?.message || err);
    console.warn('   Ensure PostgreSQL service is running on 127.0.0.1:5432 to use database features.');
    return false;
  }
};

export const closePool = async (): Promise<void> => {
  await pool.end();
  console.log('PostgreSQL pool has ended');
};

export default pool;
