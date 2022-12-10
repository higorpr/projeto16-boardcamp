import { Router } from "express";
import categoryRouter from "./categoryRouter.js";
import gameRouter from "./gameRouter.js";

const router = Router();

router.use(gameRouter);
router.use(categoryRouter);

export default router;
