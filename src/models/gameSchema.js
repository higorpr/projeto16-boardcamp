import joi from "joi";
import { connection } from "../database/db.js";

const categoryArr = await connection.query(`SELECT * FROM categories`);

const categories = categoryArr.rows.map((cat) => number(cat.id));

export const gameSchema = joi.object({
	name: joi.string().min(3).required(),
	image: joi.uri().required(),
	stockTotal: joi.number().integer().min(1).required(),
	categoryId: joi
		.number()
		.integer()
		.required()
		.valid(...categories),
	pricePerDay: joi.number().integer().positive().required(),
});
