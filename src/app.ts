import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import config from "./config";
import { prisma } from "./lib/prisma";

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: config.app_url,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Gear Up api is live!");
});

export default app;
