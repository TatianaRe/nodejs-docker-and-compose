import * as process from 'node:process';

export default () => ({
  server: {
    port: 3005,
  },
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    user: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB || 'kupipodariday',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL || '50000s',
  },
});
