import { Router } from "express";
import {
	getCategories,
	postCategory,
} from "../controllers/categoryController.js";
import { categoryValidation } from "../middlewares/categoryValidation.js";

const categoryRouter = Router();

categoryRouter.get("/categories", getCategories);
categoryRouter.post("/categories", categoryValidation, postCategory);

export default categoryRouter;
