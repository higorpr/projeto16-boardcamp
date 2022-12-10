import { categorySchema } from "../models/categorySchema.js";

export function categoryValidation(req, res, next) {
	const {name} = req.body

	if (!name) {
		return res.sendStatus(400);
	}

	const validationErrors = categorySchema.validate(req.body, {
		abortEarly: false,
	}).error;
    
	if (validationErrors) {
		const errors = validationErrors.details.map((e) => e.message);
		return res.status(400).send(errors);
	}
	
	res.locals.name = name;
	next();
}
