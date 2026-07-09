import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { categoryRouter } from "./modules/category/category.route";
import { gearRouter } from "./modules/gear/gear.route";
import { providerRouter } from "./modules/provider/provider.route";
import { adminRouter } from "./modules/admin/admin.route";
import { rentalRouter } from "./modules/rental/rental.route";
import { paymentRouter } from "./modules/payment/payment.route";
import { webhookController } from "./modules/webhook/webhook.controller";
import { notFoundHandler } from "./middleware/notFound";

const app: Application = express();
const BASE_URL = config.base_url;

// Middlewares
app.use(
  cors({
    origin: config.app_url,
  }),
);

// MUST be mounted BEFORE express.json(), and needs raw body for signature verification
app.post(
  "/" + BASE_URL + "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  webhookController.handleStripeWebhook,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/" + BASE_URL, async (req: Request, res: Response) => {
  res.send("Gear Up api is live!");
});

// Routes
app.use("/" + BASE_URL + "/auth", authRouter);
app.use("/" + BASE_URL + "/categories", categoryRouter);
app.use("/" + BASE_URL + "/gears", gearRouter);
app.use("/" + BASE_URL + "/providers", providerRouter);
app.use("/" + BASE_URL + "/rentals", rentalRouter);
app.use("/" + BASE_URL + "/payments", paymentRouter);
app.use("/" + BASE_URL + "/admin", adminRouter);

app.use(notFoundHandler);

app.use(globalErrorHandler);
export default app;
