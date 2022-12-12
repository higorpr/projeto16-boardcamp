import { connection } from "../database/db.js";

export async function CheckExistingCustomer(req, res, next) {
	const { id } = req.params;
	let checkedId = "";

	if (id && Number(id)) {
		try {
			const customerArr = await connection.query(`
                SELECT
                    *
                FROM
                    customers
            `);

			const customerIds = customerArr.rows.map((c) => c.id);

			if (!customerIds.includes(Number(id))) {
				return res.sendStatus(404);
			}

			checkedId = id;
		} catch (err) {
			console.log(err);
			return res.sendStatus(500);
		}
	} else {
		return res.sendStatus(404);
	}

	res.locals.id = checkedId;
	next();
}
