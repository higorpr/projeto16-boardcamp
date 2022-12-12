import { Router } from "express";
import categoryRouter from "./categoryRouter.js";
import customerRouter from "./customerRouter.js";
import gameRouter from "./gameRouter.js";

const router = Router();

router.use(gameRouter);
router.use(categoryRouter);
router.use(customerRouter);

export default router;
