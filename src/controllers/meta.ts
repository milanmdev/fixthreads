import express from "express";
import { HttpError, GlobalVars } from "../utils/utils";
import packageFile from "../../package.json";
const router = express.Router();

router.get("/oembed", async (req, res, next) => {
  try {
    if (!req.query.url || !req.query.text)
      return next(new HttpError(400, "Not enough query parameters provided"));

    if (typeof req.query.url !== "string" || typeof req.query.text !== "string")
      return next(new HttpError(400, "Invalid query parameters provided"));

    let embed: OembedPostProps = {
      author_name: req.query.text as string,
      author_url: req.query.url as string,
      provider_name: req.query.videoText
        ? (req.query.videoText as string)
        : GlobalVars.name,
      provider_url: "https://github.com/milanmdev/fixthreads",
      title: "Threads",
      type: "link",
      version: "1.0",
    };

    return res.json(embed);
  } catch (e: any) {
    res.status(500).json({
      error: true,
      message: e.message,
    });
  }
});

router.get("/health", async (_req, res, _next) => {
  try {
    return res.json({
      status: "ok",
      version: packageFile.version,
    });
  } catch (e: any) {
    return res.status(500).json({
      error: true,
      message: e.message,
    });
  }
});

export default router;
