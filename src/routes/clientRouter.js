import { Router } from "express";
import { getCustomers, getCustomersById } from "../controllers/clientController.js";
import { CheckExistingClient } from "../middlewares/checkExistingClient.js";

const clientRouter = Router();

clientRouter.get("/customers", getCustomers);
clientRouter.get('/customers/:id', CheckExistingClient, getCustomersById)

export default clientRouter;
