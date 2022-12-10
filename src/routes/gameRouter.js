import { Router } from "express";
import { getGames, postGame } from "../controllers/gameController.js";
import { gameValidation } from "../middlewares/gameValidation.js";

const gameRouter = Router();

gameRouter.get("/games", getGames);
gameRouter.post("/games", gameValidation, postGame);

export default gameRouter;