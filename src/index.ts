import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
const cloudflare = require("cloudflare-express");

import { HttpError } from "./utils/utils";
import routes from "./controllers";
const app = express();

/* Launch */
app.listen(3000, () =>
  console.log(`[LAUNCHED] Webserver launched at http://localhost:3000`)
);

/* Middlewares */
app.set("trust proxy", "192.168.86.0/24, 192.168.86.42");
app.use(cloudflare.restore());
app.use(express.json());
app.use(cors());
app.use(routes);

app.use((err: any, _req: Request, res: Response, _next: Function) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: true,
      message: err.errMessage,
      code: err.statusCode,
    });
  } else {
    res.status(500).json({
      error: true,
      message: err.message || "5xx server error",
      code: 500,
    });
  }
});

app.get("/", async (_req: Request, res: Response, _next: Function) => {
  try {
    res.status(301).redirect("https://github.com/milanmdev/fixthreads");
  } catch (e: any) {
    res.status(500).json({
      error: true,
      message: e.message,
      code: 500,
    });
  }
});

// 404
app.all("*", async (_req: Request, res: Response, _next: Function) => {
  try {
    res.status(404).json({
      error: true,
      message: "Not Found",
      code: 404,
    });
  } catch (e: any) {
    res.status(500).json({
      error: true,
      message: e.message,
      code: 500,
    });
  }
});

export default app;
