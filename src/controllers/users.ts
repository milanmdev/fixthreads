import express from "express";
import { HttpError } from "../utils/utils";
import findUser from "../utils/fetch/findUser";
import renderSeo from "../utils/renderSeo";
const router = express.Router();

router.get("/@:username", async (req, res, next) => {
  try {
    if (!req.params.username)
      return next(new HttpError(400, "No user provided"));

    const user = await findUser({
      username: req.params.username,
      userAgent: req.headers["user-agent"] || "",
    });
    if (!user || !user.title) {
      return next(new HttpError(404, "User not found"));
    }

    return res.send(
      renderSeo({
        type: "user",
        content: user,
      })
    );
  } catch (e: any) {
    res.status(500).json({
      error: true,
      message: e.message,
    });
  }
});

export default router;
