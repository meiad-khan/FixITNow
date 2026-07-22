import dotenv from "dotenv";
import path from "node:path";
import { env } from "node:process";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  port: env.PORT,
  database_url: env.DATABASE_URL,
  app_url: env.APP_URL,
  bcrypt_salt_round: env.BCRYPT_SALT_ROUNDS!,
};