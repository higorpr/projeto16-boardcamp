import { Router } from "express";
import categoryRouter from "./categoryRouter.js";
import clientRouter from "./clientRouter.js";
import gameRouter from "./gameRouter.js";

const router = Router();

router.use(gameRouter);
router.use(categoryRouter);
router.use(clientRouter);

export default router;
