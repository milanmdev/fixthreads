import express from "express";
const router = express.Router();

import postsController from "./posts";
import usersController from "./users";
import metaController from "./meta";

router.use("/", metaController);
router.use("/", postsController);
router.use("/", usersController);

export default router;
