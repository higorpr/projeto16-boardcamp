import { connection } from "../database/db.js";
import joi from "joi";

const games = await connection.query(`SELECT id FROM games`);
const customers = await connection.query(`SELECT id FROM customers`);

const gamesIds = games.rows.map((g) => Number(g.id));
const customerIds = customers.rows.map((c) => Number(c.id));

export const rentalSchema = joi.object({
	customerId: joi
		.number()
		.required()
		.valid(...customerIds),
	gameId: joi
		.number()
		.required()
		.valid(...gamesIds),
	daysRented: joi.number().greater(0).required(),
});
