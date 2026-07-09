import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT || 4000,
  database_url: process.env.DATABASE_URL!,
  app_url: process.env.APP_URL!,
  base_url: process.env.BASE_URL!,
  hash_salt: process.env.HASH_SALT!,
  jwt_secret: process.env.JWT_SECRET!,
  refresh_secret: process.env.REFRESH_SECRET!,
  stripe_product_id: process.env.STRIPE_PRODUCT_ID!,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
};
