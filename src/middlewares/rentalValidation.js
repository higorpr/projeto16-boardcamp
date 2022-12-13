import { rentalSchema } from "../models/rentalSchema.js";

export function rentalValidation(req, res, next) {
	const rentalInfo = req.body;

	const validationErrors = rentalSchema.validate(rentalInfo, {
		abortEarly: false,
	}).error;

	if (validationErrors) {
		const errors = validationErrors.details.map((e) => e.message);
		return res.status(400).send(errors);
	}

	res.locals.rentalInfo = rentalInfo;
	next();
}
