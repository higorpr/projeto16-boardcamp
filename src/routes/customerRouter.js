import { Router } from "express";
import {
	getCustomers,
	getCustomersById,
	postCustomer,
	updateCustomer,
} from "../controllers/customerController.js";
import { CheckExistingCustomer } from "../middlewares/checkExistingCustomer.js";
import { customerValidation } from "../middlewares/customerValidation.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", CheckExistingCustomer, getCustomersById);
customerRouter.use(customerValidation)
customerRouter.post("/customers", postCustomer);
customerRouter.put("/customers/:id", updateCustomer);

export default customerRouter;
