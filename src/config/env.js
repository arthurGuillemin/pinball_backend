import dotenv from 'dotenv';
import { z } from 'zod';
import logger from '../utils/logger.js';
import AppError from '../utils/appError.js';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().transform(Number).default('3000'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  ALLOWED_ORIGINS: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  logger.error({ err: _env.error.format() }, 'invalid env variables');
  if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
  } else {
    throw new AppError('Invalid env variables');
  }
}

const env = {
  ..._env.data,
  ALLOWED_ORIGINS: _env.data.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
};

export default env;
