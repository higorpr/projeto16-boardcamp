import { connection } from "../database/db.js";
import { customerSchema } from "../models/customerSchema.js";

export async function customerValidation(req, res, next) {
	const customerInfo = req.body;

	const validationErrors = customerSchema.validate(customerInfo, {
		abortEarly: false,
	}).error;

	if (validationErrors) {
		const errors = validationErrors.details.map((e) => e.message);
		return res.status(400).send(errors);
	}

	try {
		const customerCpfs = await connection.query(`
            SELECT
                cpf
            FROM
                customers
        `);

		const cpfs = customerCpfs.rows.map((c) => c.cpf);
		if (cpfs.includes(customerInfo.cpf)) {
			return res.sendStatus(409);
		}

		res.locals.customerInfo = customerInfo;
	} catch (err) {
		console.log(err);
		return res.sendStatus(500);
	}

	next();
}
