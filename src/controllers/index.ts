import express from "express";
const router = express.Router();

import postsController from "./posts";
import usersController from "./users";

router.use("/", postsController);
router.use("/", usersController);

export default router;
