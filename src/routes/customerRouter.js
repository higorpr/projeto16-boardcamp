import { Router } from "express";
import {
	getCustomers,
	getCustomersById,
	postCustomer,
} from "../controllers/customerController.js";
import { CheckExistingCustomer } from "../middlewares/checkExistingCustomer.js";
import { customerValidation } from "../middlewares/customerValidation.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", CheckExistingCustomer, getCustomersById);
customerRouter.post("/customers", customerValidation, postCustomer);

export default customerRouter;
