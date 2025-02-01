import * as process from 'node:process';

export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'student',
    password: process.env.DB_PASSWORD || 'student',
    name: process.env.DB_NAME || 'kupipodariday',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    ttl: process.env.JWT_TTL || '30000s',
  },
});
