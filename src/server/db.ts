import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const rawUrl = process.env.TURSO_DATABASE_URL || '';
const url = rawUrl.startsWith('turso://') 
  ? rawUrl.replace('turso://', 'libsql://') 
  : (rawUrl || 'file:local.db');

const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient({
  url,
  authToken
});
