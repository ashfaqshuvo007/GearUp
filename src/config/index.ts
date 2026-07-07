import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 4000,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  base_url: process.env.BASE_URL,
  hash_salt: process.env.HASH_SALT,
  jwt_secret: process.env.JWT_SECRET,
  refresh_secret: process.env.REFRESH_SECRET,
};
