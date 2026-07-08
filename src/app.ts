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

const app: Application = express();
const BASE_URL = config.base_url;

// Middlewares
app.use(
  cors({
    origin: config.app_url,
  }),
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

app.use(globalErrorHandler);
export default app;
