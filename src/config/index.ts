import dotenv from "dotenv";
import path from "node:path";
import { env } from "node:process";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  port: env.PORT,
  database_url: env.DATABASE_URL,
  app_url: env.APP_URL,
  bcrypt_salt_round: env.BCRYPT_SALT_ROUNDS!,
  jwt_access_secret: env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret: env.JWT_REFRESH_SECRET!,
  jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN!,
  jwt_refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN!,
};