import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("3000"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  ALLOWED_ORIGINS: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("wrong env variable :", _env.error());
  process.exit(1);
}

const env = {
  ..._env.data,
  ALLOWED_ORIGINS: _env.data.ALLOWED_ORIGINS.split(",").map((origin) =>
    origin.trim(),
  ),
};

export default env;
