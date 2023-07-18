import express from "express";
import { HttpError } from "../utils/utils";
import findPost from "../utils/fetch/findPost";
import renderSeo from "../utils/renderSeo";
const router = express.Router();

router.get("/t/:post", async (req, res, next) => {
  try {
    if (!req.params.post) return next(new HttpError(400, "No post provided"));

    const post = await findPost({
      post: req.params.post,
      userAgent: req.headers["user-agent"] || "",
    });
    if (!post || !post.title) {
      return next(new HttpError(404, "Post not found"));
    }

    return res.send(
      renderSeo({
        type: "post",
        content: post,
      })
    );
  } catch (e: any) {
    res.status(500).json({
      error: true,
      message: e.message,
    });
  }
});

router.get("/:username/post/:post", async (req, res, next) => {
  try {
    if (!req.params.post) return next(new HttpError(400, "No post provided"));

    const post = await findPost({
      post: req.params.post,
      userAgent: req.headers["user-agent"] || "",
    });
    if (!post || !post.title) {
      return next(new HttpError(404, "Post not found"));
    }

    const seo = renderSeo({
      type: "post",
      content: post,
    });

    return res.send(seo);
  } catch (e: any) {
    res.status(500).json({
      error: true,
      message: e.message,
    });
  }
});

export default router;
