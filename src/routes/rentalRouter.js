import { Router } from "express";
import {
	deleteRental,
	finishRental,
	getRentals,
	postRental,
} from "../controllers/rentalController.js";
import { rentalValidation } from "../middlewares/rentalValidation.js";
import { returnValidation } from "../middlewares/returnValidation.js";

const rentalRouter = Router();


rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals",rentalValidation, postRental);
rentalRouter.post("/rentals/:id/return", returnValidation, finishRental);
rentalRouter.delete("/rentals/:id", deleteRental);

export default rentalRouter;
