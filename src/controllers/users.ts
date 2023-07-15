import express from "express";
import { HttpError } from "../utils/utils";
import findUser from "../utils/fetch/findUser";
import rateLimit from "../utils/ratelimit";
import renderSeo from "../utils/renderSeo";
const router = express.Router();

router.get(
  "/:username",
  /*rateLimit({
    windowMs: 1000,
    max: 5,
  }),*/
  async (req, res, next) => {
    try {
      if (!req.params.username)
        return next(new HttpError(400, "No post provided"));

      const user = await findUser({ username: req.params.username });
      if (!user || !user.title) {
        return next(new HttpError(404, "Post not found"));
      }

      return res.send(
        renderSeo({
          type: "post",
          content: user,
        })
      );
    } catch (e: any) {
      res.status(500).json({
        error: true,
        message: e.message,
      });
    }
  }
);

export default router;
