import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 4000,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  base_url: process.env.BASE_URL,
};
