import { Router } from "express";
import { getCustomers } from "../controllers/clientController.js";

const clientRouter = Router();

clientRouter.get("/customers", getCustomers);

export default clientRouter;
